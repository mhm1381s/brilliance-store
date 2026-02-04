import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/hooks/useStore';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, ShoppingCart, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';

const Wishlist = () => {
  const navigate = useNavigate();
  const {
    user,
    products,
    cart,
    isDark,
    logout,
    toggleDark,
    addToCart,
    cartTotal,
    cartCount,
    updateCartQuantity,
    removeFromCart,
    wishlist,
    toggleWishlist,
  } = useStore();

  const [cartOpen, setCartOpen] = useState(false);

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      <Header
        user={user}
        cartCount={cartCount}
        isDark={isDark}
        onToggleDark={toggleDark}
        onOpenCart={() => setCartOpen(true)}
        onOpenAuth={() => navigate('/login')}
        onLogout={logout}
        onOpenDashboard={() => {}}
        onOpenProfile={() => user ? navigate('/profile') : navigate('/login')}
        searchQuery=""
        onSearchChange={() => {}}
      />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <Heart className="h-8 w-8 text-red-500 fill-red-500" />
            <h1 className="text-3xl font-bold">لیست علاقه‌مندی‌ها</h1>
            <span className="text-muted-foreground">({wishlistProducts.length} محصول)</span>
          </div>

          {wishlistProducts.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-24 w-24 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">لیست علاقه‌مندی‌های شما خالی است</h2>
              <p className="text-muted-foreground mb-6">
                محصولات مورد علاقه خود را با کلیک روی آیکون قلب ذخیره کنید
              </p>
              <Button onClick={() => navigate('/')} className="bg-gradient-primary">
                مشاهده محصولات
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {wishlistProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Card className="overflow-hidden group">
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover cursor-pointer transition-transform group-hover:scale-105"
                          onClick={() => navigate(`/product/${product.id}`)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background"
                          onClick={() => {
                            toggleWishlist(product.id);
                            toast.success('از علاقه‌مندی‌ها حذف شد');
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="p-4 space-y-3">
                        <h3 
                          className="font-medium line-clamp-1 cursor-pointer hover:text-primary"
                          onClick={() => navigate(`/product/${product.id}`)}
                        >
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{product.rating}</span>
                          <span className="text-muted-foreground">({product.reviews})</span>
                        </div>
                        <p className="text-lg font-bold text-primary">
                          {formatPrice(product.price)} تومان
                        </p>
                        <Button
                          className="w-full bg-gradient-primary"
                          onClick={() => {
                            addToCart(product);
                            toast.success('به سبد خرید اضافه شد');
                          }}
                        >
                          <ShoppingCart className="h-4 w-4 ml-2" />
                          افزودن به سبد
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        cartTotal={cartTotal}
        onUpdateQuantity={updateCartQuantity}
        onRemove={removeFromCart}
      />
    </div>
  );
};

export default Wishlist;
