import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Store, Mail, Lock, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStore } from '@/hooks/useStore';
import { motion } from 'framer-motion';
import { UserRole } from '@/types';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password && name) {
      login(email, password, role, name);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl"
      >
        <div className="flex items-center justify-center mb-6">
            <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
                <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold">ورود به الکترو شاپ</h2>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
            <button
            onClick={() => setRole('buyer')}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl py-3 transition-all ${
                role === 'buyer'
                ? 'bg-gradient-primary text-primary-foreground'
                : 'bg-secondary text-foreground hover:bg-secondary/80'
            }`}
            >
            <User className="h-5 w-5" />
            <span className="text-sm">خریدار</span>
            </button>
            <button
            onClick={() => setRole('seller')}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl py-3 transition-all ${
                role === 'seller'
                ? 'bg-gradient-primary text-primary-foreground'
                : 'bg-secondary text-foreground hover:bg-secondary/80'
            }`}
            >
            <Store className="h-5 w-5" />
            <span className="text-sm">فروشنده</span>
            </button>
            <button
            onClick={() => setRole('admin')}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl py-3 transition-all ${
                role === 'admin'
                ? 'bg-gradient-primary text-primary-foreground'
                : 'bg-secondary text-foreground hover:bg-secondary/80'
            }`}
            >
            <Shield className="h-5 w-5" />
            <span className="text-sm">مدیر</span>
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
            <Label htmlFor="name">نام کاربری</Label>
            <div className="relative">
                <User className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                id="name"
                type="text"
                placeholder="نام و نام خانوادگی"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pr-10"
                required
                />
            </div>
            </div>

            <div className="space-y-2">
            <Label htmlFor="email">ایمیل</Label>
            <div className="relative">
                <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pr-10"
                required
                />
            </div>
            </div>

            <div className="space-y-2">
            <Label htmlFor="password">رمز عبور</Label>
            <div className="relative">
                <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
                required
                />
            </div>
            </div>

            <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90" size="lg">
            ورود
            </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-4">
            با ورود به سایت، شرایط و قوانین را می‌پذیرید
        </p>
      </motion.div>
    </div>
  );
}
