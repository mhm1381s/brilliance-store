import { motion } from 'framer-motion';
import { 
  Refrigerator, 
  Tv, 
  Headphones, 
  Coffee, 
  Wind,
  Zap,
  WashingMachine,
  Sparkles
} from 'lucide-react';

const categories = [
  { id: 'all', name: 'همه', icon: Sparkles },
  { id: 'یخچال و فریزر', name: 'یخچال', icon: Refrigerator },
  { id: 'تلویزیون و صوتی', name: 'تلویزیون', icon: Tv },
  { id: 'لوازم جانبی', name: 'لوازم جانبی', icon: Headphones },
  { id: 'لوازم آشپزخانه', name: 'آشپزخانه', icon: Coffee },
  { id: 'سرمایش و گرمایش', name: 'سرمایش', icon: Wind },
  { id: 'لوازم شستشو', name: 'شستشو', icon: WashingMachine },
  { id: 'لوازم نظافتی', name: 'نظافتی', icon: Zap },
];

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="py-6">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category, index) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectCategory(category.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                isSelected
                  ? 'bg-gradient-primary text-primary-foreground shadow-soft'
                  : 'bg-secondary hover:bg-secondary/80 text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {category.name}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
