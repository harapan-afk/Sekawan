import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, increment, Unsubscribe } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCNcBKnV-qgpcgDXyvdGvq2Gk9gdIK6A_E",
    authDomain: "raya-81dd0.firebaseapp.com",
    databaseURL: "https://raya-81dd0-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "raya-81dd0",
    storageBucket: "raya-81dd0.firebasestorage.app",
    messagingSenderId: "75946174816",
    appId: "1:75946174816:web:83cd0e791c80b7af3cd605",
    measurementId: "G-35Q0FM1JQ6"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const getCurrentPageKey = (): string => {
    let path = window.location.pathname;
    // Remove leading slash
    if (path.startsWith('/')) {
        path = path.substring(1);
    }
    // Replace slashes with dashes for Firebase path safety
    return path.replace(/\//g, '-') || 'home';
};

// Get references to the appropriate database paths
const getPageKey = (): string => {
    const pageKey = getCurrentPageKey();
    return pageKey === 'services-raya-gold-trader' ? pageKey : 'home';
};

// Counter references
const globalVisitorCountRef = ref(database, 'global/visitorCount');
const globalLastVisitRef = ref(database, 'global/lastVisit');
const pageKey = getPageKey();
const pageVisitorCountRef = ref(database, `pages/${pageKey}/visitorCount`);
const pageLastVisitRef = ref(database, `pages/${pageKey}/lastVisit`);

/**
 * Increment visitor count on every page view - no checks for returning visitors
 */
export const incrementVisitorCount = async (): Promise<void> => {
    try {
        // Generate a unique visit ID for this page view
        const visitId = Date.now().toString(36) + Math.random().toString(36).substring(2);

        // Increment the global counter by 1
        await set(globalVisitorCountRef, increment(1));
        // Update global last visit timestamp
        await set(globalLastVisitRef, Date.now());

        // Increment the page-specific counter by 1
        await set(pageVisitorCountRef, increment(1));
        // Update page-specific last visit timestamp
        await set(pageLastVisitRef, Date.now());

        // Also log this visit in a visits collection if you want historical data
        await set(ref(database, `visits/${visitId}`), {
            timestamp: Date.now(),
            page: pageKey,
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'direct'
        });

        console.log(`Incremented visitor count for ${pageKey}`);
    } catch (error) {
        console.error("Error incrementing visitor count:", error);
        throw error;
    }
};

/**
 * Get and listen to visitor count for the current page
 * @param callback Function to call when count changes
 * @returns Unsubscribe function or void
 */
export const getVisitorCount = (callback: (count: number) => void): Unsubscribe | void => {
    try {
        // Use page-specific counter when on a specific page, otherwise use global
        return onValue(pageVisitorCountRef, (snapshot) => {
            const count = snapshot.val() || 0;
            callback(count);
        });
    } catch (error) {
        console.error("Error getting visitor count:", error);
    }
};

/**
 * Get and listen to last visit timestamp for the current page
 * @param callback Function to call when timestamp changes
 * @returns Unsubscribe function or void
 */
export const getLastVisitTimestamp = (callback: (timestamp: number) => void): Unsubscribe | void => {
    try {
        // Use page-specific timestamp when on a specific page, otherwise use global
        return onValue(pageLastVisitRef, (snapshot) => {
            const timestamp = snapshot.val() || Date.now();
            callback(timestamp);
        });
    } catch (error) {
        console.error("Error getting last visit timestamp:", error);
    }
};