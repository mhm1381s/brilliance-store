import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/hooks/useStore';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Package, User as UserIcon, MapPin, Settings, LogOut, Heart, ShoppingBag } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const {
    user,
    cart,
    orders,
    isDark,
    logout,
    toggleDark,
    cartTotal,
    cartCount,
    updateCartQuantity,
    removeFromCart,
  } = useStore();

  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // User's orders
  const userOrders = orders.filter((o) => o.userId === user?.id);

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center flex-col gap-4" dir="rtl">
        <h1 className="text-2xl font-bold">لطفا وارد حساب کاربری خود شوید</h1>
        <Button onClick={() => navigate('/login')}>ورود به حساب کاربری</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      <Header
        user={user}
        cartCount={cartCount}
        isDark={isDark}
        onToggleDark={toggleDark}
        onOpenCart={() => setCartOpen(true)}
        onOpenAuth={() => navigate('/login')}
        onLogout={() => {
          logout();
          navigate('/');
        }}
        onOpenDashboard={() => {}}
        onOpenProfile={() => user ? navigate('/profile') : navigate('/login')}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-8">
            <Avatar className="h-20 w-20 border-2 border-primary">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              <Badge variant={user.role === 'seller' ? 'default' : 'secondary'} className="mt-2">
                {user.role === 'seller' ? 'فروشنده' : 'خریدار'}
              </Badge>
            </div>
            <Button onClick={() => navigate('/')} variant="outline">
              بازگشت به صفحه اصلی
            </Button>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="profile">
                <UserIcon className="h-4 w-4 ml-2" />
                مشخصات
              </TabsTrigger>
              <TabsTrigger value="orders">
                <Package className="h-4 w-4 ml-2" />
                سفارش‌ها ({userOrders.length})
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="h-4 w-4 ml-2" />
                تنظیمات
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => navigate('/wishlist')}>
                <Heart className="h-4 w-4 ml-2" />
                علاقه‌مندی‌ها
              </Button>
              {(user.role === 'seller' || user.role === 'admin') && (
                <Button variant="outline" size="sm" onClick={() => navigate('/admin')}>
                  <ShoppingBag className="h-4 w-4 ml-2" />
                  پنل مدیریت
                </Button>
              )}
            </div>

            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>اطلاعات شخصی</CardTitle>
                  <CardDescription>مشخصات حساب کاربری خود را مشاهده و ویرایش کنید</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>نام و نام خانوادگی</Label>
                      <Input defaultValue={user.name} />
                    </div>
                    <div className="space-y-2">
                      <Label>ایمیل</Label>
                      <Input defaultValue={user.email} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>شماره موبایل</Label>
                      <Input placeholder="0912..." />
                    </div>
                    <div className="space-y-2">
                      <Label>کد ملی</Label>
                      <Input placeholder="1234567890" />
                    </div>
                  </div>
                  <Button className="mt-4">ذخیره تغییرات</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>سفارش‌های من</CardTitle>
                  <CardDescription>تاریخچه سفارش‌های خود را مشاهده کنید</CardDescription>
                </CardHeader>
                <CardContent>
                  {userOrders.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Package className="h-16 w-16 mx-auto mb-4 opacity-30" />
                      <p>هنوز سفارشی ثبت نکرده‌اید</p>
                      <Button variant="outline" className="mt-4" onClick={() => navigate('/')}>
                        مشاهده محصولات
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{order.id}</span>
                              <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                                {order.status === 'delivered' ? 'تحویل شده' : 
                                 order.status === 'shipped' ? 'ارسال شده' :
                                 order.status === 'processing' ? 'در حال پردازش' : 'در انتظار'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {order.items.map(item => item.product.name).join('، ')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                            </p>
                          </div>
                          <div className="text-left">
                            <p className="font-bold">{order.total.toLocaleString()} تومان</p>
                            <Button variant="ghost" size="sm" className="mt-1">مشاهده جزئیات</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>تنظیمات و آدرس‌ها</CardTitle>
                  <CardDescription>مدیریت آدرس‌ها و تنظیمات امنیتی</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      آدرس‌های من
                    </h3>
                    <div className="p-4 border rounded-lg border-dashed flex items-center justify-center text-muted-foreground cursor-pointer hover:bg-secondary/50 transition-colors">
                      + افزودن آدرس جدید
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button variant="destructive" className="w-full sm:w-auto" onClick={() => {
                      logout();
                      navigate('/');
                    }}>
                      <LogOut className="h-4 w-4 ml-2" />
                      خروج از حساب کاربری
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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

export default Profile;
