import { useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/hooks/useStore';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ProductCard } from '@/components/ProductCard';
import { CartDrawer } from '@/components/CartDrawer';
import { SellerDashboard } from '@/components/SellerDashboard';
import { ProductModal } from '@/components/ProductModal';
import { Footer } from '@/components/Footer';
import { Product } from '@/types';

const Index = () => {
  const navigate = useNavigate();
  const {
    user,
    products,
    cart,
    isDark,
    logout,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleDark,
    cartTotal,
    cartCount,
  } = useStore();

  const [cartOpen, setCartOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const productsRef = useRef<HTMLDivElement>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
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
        onOpenDashboard={() => setDashboardOpen(true)}
        onOpenProfile={() => {}}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main>
        <Hero onShopNow={scrollToProducts} />

        <section ref={productsRef} className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold mb-2">محصولات پرفروش</h2>
            <p className="text-muted-foreground">بهترین محصولات با بهترین قیمت</p>
          </motion.div>

          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 text-muted-foreground"
            >
              <p className="text-lg">محصولی یافت نشد</p>
            </motion.div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  onView={setSelectedProduct}
                  index={index}
                />
              ))}
            </div>
          )}
        </section>
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

      {user && user.role === 'seller' && (
        <SellerDashboard
          isOpen={dashboardOpen}
          onClose={() => setDashboardOpen(false)}
          user={user}
          products={products}
          onAddProduct={addProduct}
          onUpdateProduct={updateProduct}
          onDeleteProduct={deleteProduct}
        />
      )}

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
      />
    </div>
  );
};

export default Index;
