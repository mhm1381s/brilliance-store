import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '@/hooks/useStore';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw,
  ChevronLeft,
  Minus,
  Plus,
  Store
} from 'lucide-react';
import { toast } from 'sonner';

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
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
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === id);
  const isInWishlist = wishlist.includes(id || '');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">محصول یافت نشد</h1>
          <Button onClick={() => navigate('/')}>بازگشت به فروشگاه</Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`${quantity} عدد ${product.name} به سبد اضافه شد`);
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

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
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <span className="hover:text-primary cursor-pointer" onClick={() => navigate('/')}>خانه</span>
          <ChevronLeft className="h-4 w-4" />
          <span className="hover:text-primary cursor-pointer">{product.category}</span>
          <ChevronLeft className="h-4 w-4" />
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl overflow-hidden bg-secondary/30">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.discount && (
              <Badge className="absolute top-4 right-4 bg-red-500 text-white">
                {product.discount}% تخفیف
              </Badge>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-muted-foreground">({product.reviews} نظر)</span>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Store className="h-3 w-3" />
                  {product.sellerName}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              {product.originalPrice && (
                <p className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)} تومان
                </p>
              )}
              <p className="text-4xl font-bold text-primary">
                {formatPrice(product.price)} <span className="text-lg">تومان</span>
              </p>
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-green-600">موجود در انبار ({product.stock} عدد)</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-red-600">ناموجود</span>
                </>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">تعداد:</span>
              <div className="flex items-center gap-2 bg-secondary rounded-full p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 rounded-full hover:bg-background transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 rounded-full hover:bg-background transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-primary hover:opacity-90"
                size="lg"
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-5 w-5 ml-2" />
                افزودن به سبد خرید
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  toggleWishlist(product.id);
                  toast.success(isInWishlist ? 'از علاقه‌مندی‌ها حذف شد' : 'به علاقه‌مندی‌ها اضافه شد');
                }}
                className={isInWishlist ? 'text-red-500 border-red-500' : ''}
              >
                <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-red-500' : ''}`} />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm">ارسال رایگان</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm">ضمانت اصالت</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <RotateCcw className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm">۷ روز مرجوعی</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="specs" className="mb-12">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="specs">مشخصات</TabsTrigger>
            <TabsTrigger value="reviews">نظرات ({product.reviews})</TabsTrigger>
            <TabsTrigger value="questions">پرسش و پاسخ</TabsTrigger>
          </TabsList>
          <TabsContent value="specs" className="mt-6">
            <div className="bg-card rounded-xl p-6 border">
              <h3 className="font-bold mb-4">مشخصات فنی</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">دسته‌بندی</span>
                  <span>{product.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">فروشنده</span>
                  <span>{product.sellerName}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">امتیاز</span>
                  <span className="flex items-center gap-1">
                    {product.rating} <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">موجودی</span>
                  <span>{product.stock} عدد</span>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <div className="bg-card rounded-xl p-6 border text-center text-muted-foreground">
              <p>هنوز نظری ثبت نشده است.</p>
              <Button variant="outline" className="mt-4">ثبت اولین نظر</Button>
            </div>
          </TabsContent>
          <TabsContent value="questions" className="mt-6">
            <div className="bg-card rounded-xl p-6 border text-center text-muted-foreground">
              <p>پرسشی ثبت نشده است.</p>
              <Button variant="outline" className="mt-4">ثبت پرسش</Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">محصولات مرتبط</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <motion.div
                  key={p.id}
                  whileHover={{ y: -5 }}
                  className="bg-card rounded-xl border overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                  <img src={p.image} alt={p.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-medium line-clamp-1">{p.name}</h3>
                    <p className="text-primary font-bold mt-2">{formatPrice(p.price)} تومان</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
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

export default ProductDetail;
