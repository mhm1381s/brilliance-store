import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/hooks/useStore';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Shield
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const AdminPanel = () => {
  const navigate = useNavigate();
  const {
    user,
    products,
    orders,
    allUsers,
    isDark,
    logout,
    toggleDark,
    cartCount,
    deleteProduct,
    updateUserRole,
    deleteUser,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [userSearch, setUserSearch] = useState('');

  // Only admin and seller can access
  if (!user || (user.role !== 'admin' && user.role !== 'seller')) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center flex-col gap-4" dir="rtl">
        <Shield className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold">دسترسی غیرمجاز</h1>
        <p className="text-muted-foreground">شما به این صفحه دسترسی ندارید</p>
        <Button onClick={() => navigate('/')}>بازگشت به صفحه اصلی</Button>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = allUsers.filter((u) =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const stats = {
    totalUsers: allUsers.length,
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500 text-white';
      case 'seller':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-secondary';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'مدیر';
      case 'seller':
        return 'فروشنده';
      default:
        return 'خریدار';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      <Header
        user={user}
        cartCount={cartCount}
        isDark={isDark}
        onToggleDark={toggleDark}
        onOpenCart={() => {}}
        onOpenAuth={() => navigate('/login')}
        onLogout={() => {
          logout();
          navigate('/');
        }}
        onOpenDashboard={() => {}}
        onOpenProfile={() => navigate('/profile')}
        searchQuery=""
        onSearchChange={() => {}}
      />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">پنل مدیریت</h1>
              <p className="text-muted-foreground">مدیریت کاربران، محصولات و سفارشات</p>
            </div>
            <Badge className={getRoleBadgeColor(user.role)}>
              {getRoleLabel(user.role)}
            </Badge>
          </div>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">کاربران</p>
                    <p className="text-3xl font-bold">{stats.totalUsers}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">محصولات</p>
                    <p className="text-3xl font-bold">{stats.totalProducts}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Package className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">سفارشات</p>
                    <p className="text-3xl font-bold">{stats.totalOrders}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">درآمد کل</p>
                    <p className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="users" className="w-full">
            <TabsList>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                کاربران
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                محصولات
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                سفارشات
              </TabsTrigger>
            </TabsList>

            {/* Users Tab */}
            <TabsContent value="users" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>لیست کاربران</CardTitle>
                    <div className="relative w-64">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="جستجوی کاربر..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="pr-10"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredUsers.map((u) => (
                      <motion.div
                        key={u.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/30 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{u.name}</p>
                            <p className="text-sm text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getRoleBadgeColor(u.role)}>
                            {getRoleLabel(u.role)}
                          </Badge>
                          {user.role === 'admin' && u.id !== user.id && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => {
                                  updateUserRole(u.id, 'buyer');
                                  toast.success('نقش کاربر تغییر کرد');
                                }}>
                                  <UserCheck className="h-4 w-4 ml-2" />
                                  تبدیل به خریدار
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  updateUserRole(u.id, 'seller');
                                  toast.success('نقش کاربر تغییر کرد');
                                }}>
                                  <UserCheck className="h-4 w-4 ml-2" />
                                  تبدیل به فروشنده
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  updateUserRole(u.id, 'admin');
                                  toast.success('نقش کاربر تغییر کرد');
                                }}>
                                  <Shield className="h-4 w-4 ml-2" />
                                  تبدیل به مدیر
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => {
                                    deleteUser(u.id);
                                    toast.success('کاربر حذف شد');
                                  }}
                                  className="text-destructive"
                                >
                                  <UserX className="h-4 w-4 ml-2" />
                                  حذف کاربر
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>لیست محصولات</CardTitle>
                    <div className="relative w-64">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="جستجوی محصول..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pr-10"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/30 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.category}</p>
                            <p className="text-sm text-primary font-bold">
                              {formatPrice(product.price)} تومان
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">موجودی: {product.stock}</Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/product/${product.id}`)}>
                                <Eye className="h-4 w-4 ml-2" />
                                مشاهده
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 ml-2" />
                                ویرایش
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => {
                                  deleteProduct(product.id);
                                  toast.success('محصول حذف شد');
                                }}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 ml-2" />
                                حذف
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>لیست سفارشات</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-30" />
                      <p>هنوز سفارشی ثبت نشده است</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/30 transition-colors"
                        >
                          <div>
                            <p className="font-medium">{order.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                              {order.status === 'processing' ? 'در حال پردازش' :
                               order.status === 'shipped' ? 'ارسال شده' :
                               order.status === 'delivered' ? 'تحویل شده' : 'در انتظار'}
                            </Badge>
                            <span className="font-bold text-primary">
                              {formatPrice(order.total)} تومان
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminPanel;
