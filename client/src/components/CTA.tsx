
// import { Button } from "@/components/ui/button";
// import { ArrowRight, Phone, Mail, MapPin } from "lucide-react";
// import AnimatedSection from "./AnimatedSection";

// const CTA = () => {
//   return (
//     <section className="py-24 relative overflow-hidden">
//       {/* Background Elements */}
//       <div className="absolute inset-0 bg-gradient-to-br from-luxury-100 to-luxury z-0"></div>
//       <div className="absolute top-0 left-0 w-full h-full">
//         <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-gold/5 filter blur-3xl"></div>
//         <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-gold/5 filter blur-3xl"></div>
//       </div>
      
//       <div className="content-section relative z-10">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
//           <AnimatedSection>
//             <div className="text-white">
//               <h2 className="mb-6">Siap Wujudkan <span className="text-shine">Masa Depan Finansial</span> yang Lebih Baik?</h2>
//               <p className="text-luxury-700 text-lg mb-8">
//                 Tim kami siap membantu Anda menemukan solusi keuangan terbaik 
//                 yang sesuai dengan kebutuhan. Hubungi kami sekarang atau kunjungi kantor 
//                 cabang DanaSejahtera terdekat.
//               </p>
              
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
//                 <div className="glass-card-dark p-4">
//                   <Phone className="w-6 h-6 text-gold mb-3" />
//                   <h4 className="font-medium mb-1">Hubungi Kami</h4>
//                   <p className="text-luxury-700 text-sm">0800-1234-5678</p>
//                 </div>
                
//                 <div className="glass-card-dark p-4">
//                   <Mail className="w-6 h-6 text-gold mb-3" />
//                   <h4 className="font-medium mb-1">Email</h4>
//                   <p className="text-luxury-700 text-sm">info@danasejahtera.id</p>
//                 </div>
                
//                 <div className="glass-card-dark p-4">
//                   <MapPin className="w-6 h-6 text-gold mb-3" />
//                   <h4 className="font-medium mb-1">Jam Operasional</h4>
//                   <p className="text-luxury-700 text-sm">Senin - Jumat, 08:00 - 16:00</p>
//                 </div>
//               </div>
              
//               <Button size="lg" className="bg-gold hover:bg-gold-dark text-luxury button-shine">
//                 Temukan Cabang Terdekat
//                 <ArrowRight className="ml-2 w-4 h-4" />
//               </Button>
//             </div>
//           </AnimatedSection>
          
//           <AnimatedSection delay={200}>
//             <div className="glass-card-dark p-8 shadow-xl">
//               <h3 className="text-2xl font-bold text-white mb-6">Ajukan Pinjaman</h3>
//               <form className="space-y-5">
//                 <div>
//                   <label className="block mb-2 text-sm font-medium text-luxury-700">Nama Lengkap</label>
//                   <input 
//                     type="text" 
//                     className="w-full px-4 py-3 rounded-lg bg-luxury-200/50 border border-luxury-300/50 focus:ring-2 focus:ring-gold/50 focus:border-gold/50 outline-none transition-all text-white placeholder:text-luxury-500"
//                     placeholder="Masukkan nama lengkap"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block mb-2 text-sm font-medium text-luxury-700">Nomor Telepon</label>
//                   <input 
//                     type="tel" 
//                     className="w-full px-4 py-3 rounded-lg bg-luxury-200/50 border border-luxury-300/50 focus:ring-2 focus:ring-gold/50 focus:border-gold/50 outline-none transition-all text-white placeholder:text-luxury-500"
//                     placeholder="Masukkan nomor telepon"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block mb-2 text-sm font-medium text-luxury-700">Jenis Layanan</label>
//                   <select 
//                     className="w-full px-4 py-3 rounded-lg bg-luxury-200/50 border border-luxury-300/50 focus:ring-2 focus:ring-gold/50 focus:border-gold/50 outline-none transition-all text-white"
//                   >
//                     <option value="" disabled selected className="bg-luxury-200">Pilih jenis layanan</option>
//                     <option value="gadai" className="bg-luxury-200">Gadai Barang</option>
//                     <option value="kredit-mikro" className="bg-luxury-200">Kredit Mikro</option>
//                     <option value="pembiayaan" className="bg-luxury-200">Pembiayaan Usaha</option>
//                     <option value="multiguna" className="bg-luxury-200">Kredit Multiguna</option>
//                     <option value="investasi" className="bg-luxury-200">Investasi Emas</option>
//                   </select>
//                 </div>
                
//                 <div>
//                   <label className="block mb-2 text-sm font-medium text-luxury-700">Pesan</label>
//                   <textarea 
//                     className="w-full px-4 py-3 rounded-lg bg-luxury-200/50 border border-luxury-300/50 focus:ring-2 focus:ring-gold/50 focus:border-gold/50 outline-none transition-all resize-none h-24 text-white placeholder:text-luxury-500"
//                     placeholder="Jelaskan kebutuhan Anda"
//                   ></textarea>
//                 </div>
                
//                 <Button type="submit" className="w-full bg-gold hover:bg-gold-dark text-luxury button-shine py-4">
//                   Kirim Pengajuan
//                 </Button>
                
//                 <p className="text-xs text-luxury-600 text-center mt-3">
//                   Dengan mengirimkan formulir ini, Anda menyetujui{" "}
//                   <a href="#" className="text-gold hover:underline">Syarat & Ketentuan</a>{" "}
//                   dan <a href="#" className="text-gold hover:underline">Kebijakan Privasi</a> kami.
//                 </p>
//               </form>
//             </div>
//           </AnimatedSection>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default CTA;
