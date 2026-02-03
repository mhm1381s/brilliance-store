import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingCart, Truck, Shield, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  if (!product) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-card border border-border shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute left-4 top-4 z-10 rounded-full bg-background/80 p-2 hover:bg-secondary transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid md:grid-cols-2">
              <div className="relative aspect-square bg-secondary/30">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-6 flex flex-col">
                <Badge variant="secondary" className="w-fit mb-2">
                  {product.category}
                </Badge>

                <h2 className="text-2xl font-bold mb-2">{product.name}</h2>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-warning text-warning" />
                    <span className="font-medium">{product.rating}</span>
                  </div>
                  <span className="text-muted-foreground">({product.reviews} نظر)</span>
                  <span className="text-muted-foreground">|</span>
                  <span className="text-muted-foreground">{product.sellerName}</span>
                </div>

                <p className="text-muted-foreground mb-6">{product.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <Truck className="h-5 w-5 text-success" />
                    <span>ارسال رایگان به سراسر کشور</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Shield className="h-5 w-5 text-primary" />
                    <span>گارانتی اصالت و سلامت فیزیکی</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <RefreshCcw className="h-5 w-5 text-warning" />
                    <span>۷ روز ضمانت بازگشت کالا</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">
                      موجودی: {product.stock > 0 ? `${product.stock} عدد` : 'ناموجود'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-sm text-muted-foreground mr-1">تومان</span>
                    </div>
                    <Button
                      className="flex-1 bg-gradient-primary hover:opacity-90 gap-2"
                      size="lg"
                      onClick={() => {
                        onAddToCart(product);
                        onClose();
                      }}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="h-5 w-5" />
                      افزودن به سبد خرید
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
