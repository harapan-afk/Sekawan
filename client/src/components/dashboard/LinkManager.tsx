import React, { useState, useEffect } from "react";
import { Edit, Plus, Store, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import AuthService from "@/services/authService";

// Tipe data untuk kategori
interface Category {
  id: number;
  name: string;
  order: number;
}

// Tipe data untuk link
interface Link {
  id: number;
  title: string;
  url: string;
  image_url: string;
  price: number;
  price_str: string;
  is_active: boolean;
  category_id: number;
  order?: number;
}

// Komponen untuk Mengelola Link Produk
const LinkManager: React.FC = () => {
  // State untuk menyimpan kategori
  const [categories, setCategories] = useState<Category[]>([]);

  // State untuk menyimpan links per kategori
  const [linksByCategory, setLinksByCategory] = useState<
    Record<number, Link[]>
  >({});

  // State untuk active kategori
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  // State untuk form tambah/edit link
  const [newLink, setNewLink] = useState<Partial<Link>>({
    title: "",
    url: "",
    image_url: "",
    price: 0,
    price_str: "",
    is_active: true,
  });

  // State untuk validation
  const [validationErrors, setValidationErrors] = useState<{
    title?: string;
    url?: string;
    image_url?: string;
  }>({});

  // State untuk editing link
  const [editingLink, setEditingLink] = useState<Link | null>(null);

  // State untuk loading dan error
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories
  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error("No authentication token");
      }

      const response = await fetch(
        "https://api.sekawan-grup.com/api/categories",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setCategories(data);

      // If we have categories, set the first one as active
      if (data.length > 0) {
        setActiveCategory(data[0]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all links for a specific category
  const fetchLinksByCategory = async (categoryId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error("No authentication token");
      }

      // Using the getAllLinks endpoint and filter by category
      const response = await fetch(
        "https://api.sekawan-grup.com/api/links/all",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch links");
      }

      const allLinks = await response.json();
      
      // Filter links by category_id
      const categoryLinks = allLinks.filter(
        (link: Link) => link.category_id === categoryId
      );
      
      // Sort by order
      categoryLinks.sort((a: Link, b: Link) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        return 0;
      });

      setLinksByCategory((prev) => ({
        ...prev,
        [categoryId]: categoryLinks,
      }));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );

      // Fallback to the original endpoint if the all links endpoint fails
      try {
        const token = AuthService.getToken();
        if (!token) {
          throw new Error("No authentication token");
        }

        const response = await fetch(
          `https://api.sekawan-grup.com/api/categories/${categoryId}/links`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch links");
        }

        const data = await response.json();
        setLinksByCategory((prev) => ({
          ...prev,
          [categoryId]: data,
        }));
      } catch (fallbackErr) {
        // Keep the original error
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Validate form fields
  const validateLinkForm = (link: Partial<Link>) => {
    const errors: {
      title?: string;
      url?: string;
      image_url?: string;
    } = {};

    if (!link.title || link.title.trim() === "") {
      errors.title = "Judul link wajib diisi";
    }

    if (!link.url || link.url.trim() === "") {
      errors.url = "URL wajib diisi";
    }

    if (!link.image_url || link.image_url.trim() === "") {
      errors.image_url = "URL gambar wajib diisi";
    }

    return errors;
  };

  // Create a new link
  const handleCreateLink = async () => {
    if (!activeCategory) {
      setError("Pilih kategori terlebih dahulu");
      return;
    }

    // Validate form fields
    const errors = validateLinkForm(newLink);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setIsLoading(true);
    setError(null);

    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error("No authentication token");
      }

      const response = await fetch(
        `https://api.sekawan-grup.com/api/categories/${activeCategory.id}/links`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...newLink,
            category_id: activeCategory.id,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal membuat link");
      }

      // Refresh links for the current category
      fetchLinksByCategory(activeCategory.id);

      // Reset form
      setNewLink({
        title: "",
        url: "",
        image_url: "",
        price: 0,
        price_str: "",
        is_active: true,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat link");
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing link
  const handleUpdateLink = async () => {
    if (!editingLink || !activeCategory) return;

    // Validate form fields
    const errors = validateLinkForm(editingLink);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setIsLoading(true);
    setError(null);

    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error("No authentication token");
      }

      const response = await fetch(
        `https://api.sekawan-grup.com/api/categories/${activeCategory.id}/links/${editingLink.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...editingLink,
            category_id: activeCategory.id,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal memperbarui link");
      }

      // Update the link in the local state
      setLinksByCategory((prev) => {
        const updatedLinks = prev[activeCategory.id].map((link) => 
          link.id === editingLink.id ? { ...editingLink } : link
        );
        return {
          ...prev,
          [activeCategory.id]: updatedLinks
        };
      });

      // Refresh links for the current category to ensure consistency
      setTimeout(() => {
        fetchLinksByCategory(activeCategory.id);
      }, 500);

      // Reset editing state
      setEditingLink(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memperbarui link");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a link
  const handleDeleteLink = async (link: Link) => {
    if (!activeCategory) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error("No authentication token");
      }

      const response = await fetch(
        `https://api.sekawan-grup.com/api/categories/${activeCategory.id}/links/${link.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menghapus link");
      }

      // Remove the link from the local state
      setLinksByCategory((prev) => {
        const updatedLinks = prev[activeCategory.id].filter(
          (item) => item.id !== link.id
        );
        return {
          ...prev,
          [activeCategory.id]: updatedLinks,
        };
      });

      // Refresh links for the current category to ensure consistency
      setTimeout(() => {
        fetchLinksByCategory(activeCategory.id);
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus link");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch links when active category changes
  useEffect(() => {
    if (activeCategory) {
      fetchLinksByCategory(activeCategory.id);
    }
  }, [activeCategory]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gold">Edit Link Produk</h2>
        <div className="flex space-x-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gold hover:bg-gold-dark text-luxury-200">
                <Plus size={16} className="mr-2" />
                Tambah Link
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-luxury-50 border-gold/20">
              <DialogHeader>
                <DialogTitle className="text-gold">
                  Tambah Link Baru
                </DialogTitle>
                <DialogDescription className="text-luxury-700">
                  Masukkan detail link baru di bawah ini.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="link-title" className="text-white">
                    Judul Link
                  </Label>
                  <Input
                    id="link-title"
                    placeholder="Masukkan judul link"
                    value={newLink.title || ""}
                    onChange={(e) =>
                      setNewLink({ ...newLink, title: e.target.value })
                    }
                    className="bg-luxury-100 border-gold/20 text-white placeholder:text-luxury-700"
                  />
                  {validationErrors.title && (
                    <p className="text-red-400 text-sm mt-1">{validationErrors.title}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link-url" className="text-white">
                    URL
                  </Label>
                  <Input
                    id="link-url"
                    placeholder="https://marketplace.com/product"
                    value={newLink.url || ""}
                    onChange={(e) =>
                      setNewLink({ ...newLink, url: e.target.value })
                    }
                    className="bg-luxury-100 border-gold/20 text-white placeholder:text-luxury-700"
                  />
                  {validationErrors.url && (
                    <p className="text-red-400 text-sm mt-1">{validationErrors.url}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link-image-url" className="text-white">
                    URL Gambar
                  </Label>
                  <Input
                    id="link-image-url"
                    placeholder="https://example.com/image.jpg"
                    value={newLink.image_url || ""}
                    onChange={(e) =>
                      setNewLink({ ...newLink, image_url: e.target.value })
                    }
                    className="bg-luxury-100 border-gold/20 text-white placeholder:text-luxury-700"
                  />
                  {validationErrors.image_url && (
                    <p className="text-red-400 text-sm mt-1">{validationErrors.image_url}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link-price" className="text-white">
                    Harga
                  </Label>
                  <Input
                    id="link-price"
                    type="number"
                    placeholder="Masukkan harga"
                    value={newLink.price || ""}
                    onChange={(e) =>
                      setNewLink({
                        ...newLink,
                        price: parseFloat(e.target.value),
                        price_str: `Rp ${parseInt(e.target.value).toLocaleString('id-ID')}`,
                      })
                    }
                    className="bg-luxury-100 border-gold/20 text-white placeholder:text-luxury-700"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="link-active"
                    checked={newLink.is_active}
                    onCheckedChange={(checked) =>
                      setNewLink({ ...newLink, is_active: checked })
                    }
                    className="data-[state=checked]:bg-gold"
                  />
                  <Label htmlFor="link-active" className="text-white">
                    {newLink.is_active ? "Aktif" : "Tidak Aktif"}
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewLink({
                      title: "",
                      url: "",
                      image_url: "",
                      price: 0,
                      price_str: "",
                      is_active: true,
                    });
                    setValidationErrors({});
                  }}
                  className="border-gold/20 text-luxury-700 hover:text-white">
                  Batal
                </Button>
                <Button
                  onClick={handleCreateLink}
                  disabled={isLoading}
                  className="bg-gold hover:bg-gold-dark text-luxury-200">
                  {isLoading ? "Menyimpan..." : "Simpan"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs untuk kategori */}
      <Tabs
        defaultValue={categories[0]?.id.toString()}
        onValueChange={(value) => {
          const category = categories.find((c) => c.id.toString() === value);
          setActiveCategory(category || null);
        }}
        className="w-full">
        <TabsList className="grid grid-cols-3 bg-luxury-50 border border-gold/20 mb-6">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id.toString()}
              className="flex items-center space-x-2 data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
              <Store size={16} />
              <span>{category.name}</span>
              <Badge
                variant="outline"
                className="ml-2 bg-luxury-100/50 text-luxury-300 border-gold/10">
                {linksByCategory[category.id]?.length || 0}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent
            key={category.id}
            value={category.id.toString()}
            className="mt-0">
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center items-center py-6">
                  <div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
                </div>
              ) : linksByCategory[category.id]?.length === 0 ? (
                <div className="bg-luxury-50 border border-gold/20 rounded-md p-8 text-center">
                  <p className="text-luxury-700">
                    Tidak ada link dalam kategori ini
                  </p>
                </div>
              ) : (
                linksByCategory[category.id]?.map((link) => (
                  <Card
                    key={link.id}
                    className="bg-luxury-50 border-gold/20 shadow-lg overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-16 h-16 rounded bg-luxury-100 overflow-hidden flex-shrink-0">
                            <img
                              src={link.image_url}
                              alt={link.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <h3 className="font-medium text-white">
                              {link.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <p className="text-sm text-luxury-700">
                                {link.price_str}
                              </p>
                              <Badge
                                variant={link.is_active ? "default" : "outline"}
                                className={
                                  link.is_active
                                    ? "bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/30"
                                    : "bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/30"
                                }>
                                {link.is_active ? "Aktif" : "Tidak Aktif"}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 md:mt-0 flex flex-col md:items-end">
                          <div className="mb-3">
                            <div className="text-sm font-medium mb-1 text-white">
                              Link Produk:
                            </div>
                            <div className="flex items-center">
                              {link.url ? (
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-gold hover:underline flex items-center">
                                  <span className="line-clamp-1 max-w-xs">
                                    {link.url}
                                  </span>
                                  <ExternalLink
                                    size={14}
                                    className="ml-1 flex-shrink-0"
                                  />
                                </a>
                              ) : (
                                <span className="text-sm text-luxury-700 italic">
                                  Belum ada link
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  className="bg-gold hover:bg-gold-dark text-luxury-200"
                                  size="sm"
                                  onClick={() => {
                                    setEditingLink(link);
                                    setValidationErrors({});
                                  }}>
                                  <Edit size={16} className="mr-2" />
                                  Edit Link
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-luxury-50 border-gold/20">
                                <DialogHeader>
                                  <DialogTitle className="text-gold">
                                    Update Link
                                  </DialogTitle>
                                  <DialogDescription className="text-luxury-700">
                                    Update detail link untuk "{link.title}"
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor="edit-title"
                                      className="text-white">
                                      Judul Link
                                    </Label>
                                    <Input
                                      id="edit-title"
                                      placeholder="Masukkan judul link"
                                      value={editingLink?.title || ""}
                                      onChange={(e) =>
                                        setEditingLink((prev) =>
                                          prev
                                            ? { ...prev, title: e.target.value }
                                            : null
                                        )
                                      }
                                      className="bg-luxury-100 border-gold/20 text-white placeholder:text-luxury-700"
                                    />
                                    {validationErrors.title && (
                                      <p className="text-red-400 text-sm mt-1">{validationErrors.title}</p>
                                    )}
                                  </div>
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor="edit-url"
                                      className="text-white">
                                      URL
                                    </Label>
                                    <Input
                                      id="edit-url"
                                      placeholder="https://marketplace.com/product"
                                      value={editingLink?.url || ""}
                                      onChange={(e) =>
                                        setEditingLink((prev) =>
                                          prev
                                            ? { ...prev, url: e.target.value }
                                            : null
                                        )
                                      }
                                      className="bg-luxury-100 border-gold/20 text-white placeholder:text-luxury-700"
                                    />
                                    {validationErrors.url && (
                                      <p className="text-red-400 text-sm mt-1">{validationErrors.url}</p>
                                    )}
                                  </div>
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor="edit-image-url"
                                      className="text-white">
                                      URL Gambar
                                    </Label>
                                    <Input
                                      id="edit-image-url"
                                      placeholder="https://example.com/image.jpg"
                                      value={editingLink?.image_url || ""}
                                      onChange={(e) =>
                                        setEditingLink((prev) =>
                                          prev
                                            ? { ...prev, image_url: e.target.value }
                                            : null
                                        )
                                      }
                                      className="bg-luxury-100 border-gold/20 text-white placeholder:text-luxury-700"
                                    />
                                    {validationErrors.image_url && (
                                      <p className="text-red-400 text-sm mt-1">{validationErrors.image_url}</p>
                                    )}
                                  </div>
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor="edit-price"
                                      className="text-white">
                                      Harga
                                    </Label>
                                    <Input
                                      id="edit-price"
                                      type="number"
                                      placeholder="Masukkan harga"
                                      value={editingLink?.price || ""}
                                      onChange={(e) =>
                                        setEditingLink((prev) =>
                                          prev
                                            ? {
                                                ...prev,
                                                price: parseFloat(
                                                  e.target.value
                                                ),
                                                price_str: `Rp ${parseInt(e.target.value).toLocaleString('id-ID')}`,
                                              }
                                            : null
                                        )
                                      }
                                      className="bg-luxury-100 border-gold/20 text-white placeholder:text-luxury-700"
                                    />
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      id="edit-active"
                                      checked={editingLink?.is_active}
                                      onCheckedChange={(checked) =>
                                        setEditingLink((prev) =>
                                          prev
                                            ? { ...prev, is_active: checked }
                                            : null
                                        )
                                      }
                                      className="data-[state=checked]:bg-gold"
                                    />
                                    <Label htmlFor="edit-active" className="text-white">
                                      {editingLink?.is_active ? "Aktif" : "Tidak Aktif"}
                                    </Label>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setEditingLink(null);
                                      setValidationErrors({});
                                    }}
                                    className="border-gold/20 text-luxury-700 hover:text-white">
                                    Batal
                                  </Button>
                                  <Button
                                    onClick={handleUpdateLink}
                                    disabled={isLoading}
                                    className="bg-gold hover:bg-gold-dark text-luxury-200">
                                    {isLoading ? "Menyimpan..." : "Simpan"}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-red-400/30 text-red-400 hover:text-red-500 hover:border-red-500/30">
                                  Hapus
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-luxury-50 border-gold/20">
                                <DialogHeader>
                                  <DialogTitle className="text-gold">
                                    Hapus Link
                                  </DialogTitle>
                                  <DialogDescription className="text-luxury-700">
                                    Apakah Anda yakin ingin menghapus link "
                                    {link.title}"? Tindakan ini tidak dapat
                                    dibatalkan.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button
                                      variant="outline"
                                      className="border-gold/20 text-luxury-700 hover:text-white">
                                      Batal
                                    </Button>
                                  </DialogClose>
                                  <DialogClose asChild>
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleDeleteLink(link)}
                                      disabled={isLoading}
                                      className="bg-red-500 hover:bg-red-600 text-white">
                                      {isLoading ? "Menghapus..." : "Hapus"}
                                    </Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Error Handling */}
      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-200 p-4 rounded-md mb-4">
          {error}
        </div>
      )}
    </div>
  );
};

export default LinkManager;