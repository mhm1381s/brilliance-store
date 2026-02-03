import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Package, Edit, Trash2, Upload, DollarSign, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Product, User } from '@/types';

interface SellerDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id' | 'sellerId' | 'sellerName'>) => void;
  onUpdateProduct: (productId: string, updates: Partial<Product>) => void;
  onDeleteProduct: (productId: string) => void;
}

export function SellerDashboard({
  isOpen,
  onClose,
  user,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}: SellerDashboardProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: '',
  });

  const myProducts = products.filter((p) => p.sellerId === user.id);
  const totalSales = myProducts.reduce((sum, p) => sum + (100 - p.stock) * p.price, 0);
  const totalStock = myProducts.reduce((sum, p) => sum + p.stock, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      category: formData.category,
      image: formData.image || '/placeholder.svg',
      stock: Number(formData.stock),
      rating: 4.5,
      reviews: 0,
    };

    if (editingProduct) {
      onUpdateProduct(editingProduct.id, productData);
      setEditingProduct(null);
    } else {
      onAddProduct(productData);
    }

    setFormData({ name: '', description: '', price: '', category: '', image: '', stock: '' });
    setShowAddForm(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      stock: product.stock.toString(),
    });
    setShowAddForm(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-4 md:inset-8 z-50 overflow-hidden rounded-2xl bg-card border border-border shadow-2xl"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-border p-4 md:p-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold">پنل مدیریت فروشنده</h2>
                  <p className="text-sm text-muted-foreground">مدیریت محصولات و فروش شما</p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 hover:bg-secondary transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                  <div className="rounded-xl bg-gradient-primary p-4 text-primary-foreground">
                    <div className="flex items-center gap-3">
                      <Package className="h-8 w-8 opacity-80" />
                      <div>
                        <p className="text-sm opacity-80">تعداد محصولات</p>
                        <p className="text-2xl font-bold">{myProducts.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl bg-secondary p-4">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-8 w-8 text-success" />
                      <div>
                        <p className="text-sm text-muted-foreground">فروش کل</p>
                        <p className="text-2xl font-bold">{formatPrice(totalSales)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl bg-secondary p-4">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-8 w-8 text-warning" />
                      <div>
                        <p className="text-sm text-muted-foreground">موجودی انبار</p>
                        <p className="text-2xl font-bold">{totalStock}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {showAddForm ? (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleSubmit}
                    className="rounded-xl bg-secondary/30 p-4 md:p-6 mb-6"
                  >
                    <h3 className="text-lg font-semibold mb-4">
                      {editingProduct ? 'ویرایش محصول' : 'افزودن محصول جدید'}
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">نام محصول</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">دسته‌بندی</Label>
                        <Input
                          id="category"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">قیمت (تومان)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stock">موجودی</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="description">توضیحات</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="image">لینک تصویر</Label>
                        <Input
                          id="image"
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button type="submit" className="bg-gradient-primary hover:opacity-90">
                        {editingProduct ? 'ذخیره تغییرات' : 'افزودن محصول'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowAddForm(false);
                          setEditingProduct(null);
                          setFormData({ name: '', description: '', price: '', category: '', image: '', stock: '' });
                        }}
                      >
                        انصراف
                      </Button>
                    </div>
                  </motion.form>
                ) : (
                  <Button
                    onClick={() => setShowAddForm(true)}
                    className="mb-6 bg-gradient-primary hover:opacity-90 gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    افزودن محصول جدید
                  </Button>
                )}

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">محصولات من</h3>
                  {myProducts.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
                      <p>هنوز محصولی اضافه نکرده‌اید</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {myProducts.map((product) => (
                        <motion.div
                          key={product.id}
                          layout
                          className="rounded-xl bg-secondary/30 p-4 border border-border"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-32 w-full object-cover rounded-lg mb-3"
                          />
                          <h4 className="font-semibold line-clamp-1">{product.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-primary font-semibold">
                              {formatPrice(product.price)} تومان
                            </span>
                            <span className="text-sm text-muted-foreground">
                              موجودی: {product.stock}
                            </span>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleEdit(product)}
                              className="flex-1 gap-1"
                            >
                              <Edit className="h-3 w-3" />
                              ویرایش
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => onDeleteProduct(product.id)}
                              className="gap-1"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
