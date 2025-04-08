import React, { useState, useEffect } from "react";
import { Plus, Grid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AuthService from "@/services/authService";

// Interface untuk kategori dari backend
interface Category {
  id: number;
  name: string;
  order: number;
  links: Link[];
}

// Interface untuk link
interface Link {
  id: number;
  title: string;
  url: string;
  image_url?: string;
  price: number;
  price_str: string;
  is_active: boolean;
}

const CategoryManager: React.FC = () => {
  // State untuk menyimpan kategori
  const [categories, setCategories] = useState<Category[]>([]);
  
  // State untuk mode tampilan
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // State untuk form tambah kategori
  const [newCategory, setNewCategory] = useState({
    name: '',
    order: 0
  });

  // State untuk kategori yang sedang diedit
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // State untuk loading dan error
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk fetch kategori
  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch('https://api.sekawan-grup.com/api/categories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk menambah kategori
  const handleAddCategory = async () => {
    if (!newCategory.name) {
      setError('Nama kategori harus diisi');
      return;
    }

    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch('https://api.sekawan-grup.com/api/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newCategory)
      });

      if (!response.ok) {
        throw new Error('Gagal menambah kategori');
      }

      // Refresh daftar kategori
      fetchCategories();

      // Reset form
      setNewCategory({ name: '', order: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menambah kategori');
    }
  };

  // Fungsi untuk mengedit kategori
  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`https://api.sekawan-grup.com/api/category/${editingCategory.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editingCategory.name,
          order: editingCategory.order
        })
      });

      if (!response.ok) {
        throw new Error('Gagal memperbarui kategori');
      }

      // Refresh daftar kategori
      fetchCategories();

      // Reset editing state
      setEditingCategory(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memperbarui kategori');
    }
  };

  // Fungsi untuk menghapus kategori
  const handleDeleteCategory = async (categoryId: number) => {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`https://api.sekawan-grup.com/api/category/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus kategori');
      }

      // Refresh daftar kategori
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus kategori');
    }
  };

  // Fetch kategori saat komponen dimuat
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gold">Kategori E-Commerce</h2>

        <div className="flex flex-wrap gap-2 sm:space-x-4">
          <div className="flex items-center space-x-2 bg-luxury-50 border border-gold/20 rounded-md p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-1 rounded",
                viewMode === "grid" ? "bg-gold/20 text-gold" : "text-luxury-700 hover:text-gold"
              )}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-1 rounded",
                viewMode === "list" ? "bg-gold/20 text-gold" : "text-luxury-700 hover:text-gold"
              )}
            >
              <List size={20} />
            </button>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gold hover:bg-gold-dark text-luxury-200 text-sm sm:text-base">
                <Plus size={16} className="mr-2" />
                Tambah Kategori
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-luxury-50 border-gold/20 w-full max-w-sm sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-gold">Tambah Kategori Baru</DialogTitle>
                <DialogDescription className="text-luxury-700">
                  Masukkan detail kategori baru di bawah ini.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Nama Kategori</Label>
                  <Input
                    id="name"
                    placeholder="Masukkan nama kategori"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    className="bg-luxury-100 border-gold/20 text-white placeholder:text-luxury-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order" className="text-white">Urutan</Label>
                  <Input
                    id="order"
                    type="number"
                    placeholder="Masukkan urutan (opsional)"
                    value={newCategory.order}
                    onChange={(e) => setNewCategory({...newCategory, order: parseInt(e.target.value) || 0})}
                    className="bg-luxury-100 border-gold/20 text-white placeholder:text-luxury-700"
                  />
                </div>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <DialogClose asChild>
                  <Button variant="outline" className="border-gold/20 text-luxury-700 hover:text-white w-full sm:w-auto">
                    Batal
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button 
                    onClick={handleAddCategory} 
                    className="bg-gold hover:bg-gold-dark text-luxury-200 w-full sm:w-auto"
                  >
                    Simpan
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tampilan error */}
      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-200 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-6">
          <div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
        </div>
      )}

      {/* Tampilan kategori */}
      {!isLoading && (
        <div className={cn(
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
        )}>
          {categories.map(category => (
            <Card 
              key={category.id} 
              className="bg-luxury-50 border-gold/20 shadow-lg overflow-hidden"
            >
              <CardHeader className="pb-2 border-b border-gold/10">
                <CardTitle className="text-gold flex justify-between items-center">
                  {category.name}
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setEditingCategory(category)}
                      className="text-luxury-700 hover:text-gold"
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Hapus
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <p className="text-sm text-luxury-700">
                    Jumlah Link: {category.links?.length || 0}
                  </p>
                  <p className="text-xs text-luxury-500">
                    Urutan: {category.order}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog Edit Kategori */}
      {editingCategory && (
        <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
          <DialogContent className="bg-luxury-50 border-gold/20 w-full max-w-sm sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-gold">Edit Kategori</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-white">Nama Kategori</Label>
                <Input
                  id="edit-name"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({
                    ...editingCategory,
                    name: e.target.value
                  })}
                  className="bg-luxury-100 border-gold/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-order" className="text-white">Urutan</Label>
                <Input
                  id="edit-order"
                  type="number"
                  value={editingCategory.order}
                  onChange={(e) => setEditingCategory({
                    ...editingCategory,
                    order: parseInt(e.target.value) || 0
                  })}
                  className="bg-luxury-100 border-gold/20 text-white"
                />
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                onClick={() => setEditingCategory(null)}
                className="border-gold/20 text-luxury-700 hover:text-white w-full sm:w-auto"
              >
                Batal
              </Button>
              <Button 
                onClick={handleUpdateCategory} 
                className="bg-gold hover:bg-gold-dark text-luxury-200 w-full sm:w-auto"
              >
                Simpan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CategoryManager;