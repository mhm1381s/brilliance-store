import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  cartTotal: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  cart,
  cartTotal,
  onUpdateQuantity,
  onRemove,
}: CartDrawerProps) {
  const navigate = useNavigate();
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 z-50 h-full w-full max-w-md bg-card border-r border-border shadow-2xl"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-border p-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  سبد خرید
                </h2>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 hover:bg-secondary transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">سبد خرید شما خالی است</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="flex gap-4 rounded-xl bg-secondary/30 p-3"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-20 w-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium line-clamp-1">{item.product.name}</h3>
                          <p className="text-sm text-primary font-semibold mt-1">
                            {formatPrice(item.product.price)} تومان
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="rounded-full p-1 bg-secondary hover:bg-secondary/80 transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="rounded-full p-1 bg-secondary hover:bg-secondary/80 transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => onRemove(item.product.id)}
                              className="mr-auto rounded-full p-1 text-destructive hover:bg-destructive/10 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t border-border p-4 space-y-4">
                  <div className="flex items-center justify-between text-lg">
                    <span className="text-muted-foreground">جمع کل:</span>
                    <span className="font-bold text-primary">
                      {formatPrice(cartTotal)} تومان
                    </span>
                  </div>
                  <Button 
                    className="w-full bg-gradient-primary hover:opacity-90" 
                    size="lg"
                    onClick={handleCheckout}
                  >
                    تکمیل خرید
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
