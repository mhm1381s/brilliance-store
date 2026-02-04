import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Eye, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { useStore } from '@/hooks/useStore';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onView: (product: Product) => void;
  index?: number;
}

export function ProductCard({ product, onAddToCart, onView, index = 0 }: ProductCardProps) {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist } = useStore();
  const isInWishlist = wishlist.includes(product.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="group relative rounded-2xl bg-card border border-border overflow-hidden shadow-card hover:shadow-hover transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary/30">
        <motion.img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
          onClick={() => navigate(`/product/${product.id}`)}
        />
        
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
            toast.success(isInWishlist ? 'از علاقه‌مندی‌ها حذف شد' : 'به علاقه‌مندی‌ها اضافه شد');
          }}
          className="absolute top-3 left-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors z-10"
        >
          <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
        </button>
        
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <Button
            size="sm"
            onClick={() => onAddToCart(product)}
            className="flex-1 bg-gradient-primary hover:opacity-90 gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            افزودن
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </motion.div>

        {product.discount && (
          <Badge className="absolute top-3 right-3 bg-red-500 text-white">
            {product.discount}% تخفیف
          </Badge>
        )}
        
        {!product.discount && product.stock < 10 && (
          <Badge className="absolute top-3 right-3 bg-destructive">
            تنها {product.stock} عدد
          </Badge>
        )}
      </div>

      <div className="p-4 cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
        <Badge variant="secondary" className="mb-2 text-xs">
          {product.category}
        </Badge>
        
        <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
          {product.name}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-1 mb-3">
          <Star className="h-4 w-4 fill-warning text-warning" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-sm text-muted-foreground">({product.reviews} نظر)</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through ml-2">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            <span className="text-sm text-muted-foreground mr-1">تومان</span>
          </div>
          <span className="text-xs text-muted-foreground">{product.sellerName}</span>
        </div>
      </div>
    </motion.div>
  );
}
