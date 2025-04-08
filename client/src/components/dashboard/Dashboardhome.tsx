import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import AuthService from "@/services/authService";

// Define types for our data
interface Category {
  id: number;
  name: string;
  order: number;
}

interface Link {
  id: number;
  title: string;
  url: string;
  image_url: string;
  price: number;
  price_str: string;
  is_active: boolean;
  category_id: number;
  category?: Category;
}

// Komponen Halaman Dashboard Utama
const DashboardHome: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = AuthService.getToken();
        if (!token) {
          throw new Error("No authentication token");
        }

        // Fetch categories
        const categoriesResponse = await fetch(
          "https://api.sekawan-grup.com/api/categories",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories");
        }

        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Fetch links
        const linksResponse = await fetch(
          "https://api.sekawan-grup.com/api/links/all",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!linksResponse.ok) {
          throw new Error("Failed to fetch links");
        }

        const linksData = await linksResponse.json();
        setLinks(linksData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to get marketplace names (we'll use the categories now)
  const marketplaceNames = categories.map(category => category.name);

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-400 py-6">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-luxury-50 border-gold/20 shadow-lg overflow-hidden">
              <CardHeader className="pb-2 border-b border-gold/10">
                <CardTitle className="text-lg text-gold">Total Produk</CardTitle>
                <CardDescription className="text-luxury-700">Semua produk di semua marketplace</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-3xl font-bold text-white">{links.length}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-luxury-50 border-gold/20 shadow-lg overflow-hidden">
              <CardHeader className="pb-2 border-b border-gold/10">
                <CardTitle className="text-lg text-gold">Marketplace</CardTitle>
                <CardDescription className="text-luxury-700">Jumlah marketplace</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-3xl font-bold text-white">{categories.length}</p>
                <p className="text-sm text-luxury-700 mt-2">{marketplaceNames.join(", ")}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-luxury-50 border-gold/20 shadow-lg overflow-hidden">
              <CardHeader className="pb-2 border-b border-gold/10">
                <CardTitle className="text-lg text-gold">Produk Aktif</CardTitle>
                <CardDescription className="text-luxury-700">Jumlah produk yang aktif</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-3xl font-bold text-white">
                  {links.filter(link => link.is_active).length}
                </p>
                <p className="text-sm text-luxury-700 mt-2">
                  {((links.filter(link => link.is_active).length / links.length) * 100).toFixed(0)}% dari total produk
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-luxury-50 border-gold/20 shadow-lg overflow-hidden">
            <CardHeader className="border-b border-gold/10">
              <CardTitle className="text-gold">Produk Terbaru</CardTitle>
              <CardDescription className="text-luxury-700">Daftar produk yang baru ditambahkan</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {links.slice(0, 5).map(link => {
                  // Find category name using category_id
                  const categoryName = categories.find(cat => cat.id === link.category_id)?.name || "Unknown";
                  
                  return (
                    <div key={link.id} className="flex items-center border-b border-gold/10 pb-4">
                      <div className="w-12 h-12 rounded bg-luxury-100 overflow-hidden flex-shrink-0">
                        <img
                          src={link.image_url}
                          alt={link.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/150/D4AF37/000000?text=GOLD";
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-white">{link.title}</p>
                        <p className="text-sm text-luxury-700">
                          {categoryName} · {link.price_str}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter className="border-t border-gold/10 bg-luxury-100/20">
              <RouterLink to="/admin/links">
                <Button className="bg-gold hover:bg-gold-dark text-luxury-200">
                  Lihat Semua Produk
                </Button>
              </RouterLink>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
};

export default DashboardHome;