import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/hooks/useStore';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  ChevronLeft,
  Shield,
  Clock,
  Package
} from 'lucide-react';
import { toast } from 'sonner';

const Checkout = () => {
  const navigate = useNavigate();
  const {
    user,
    cart,
    isDark,
    logout,
    toggleDark,
    cartTotal,
    cartCount,
    clearCart,
    addOrder,
  } = useStore();

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [address, setAddress] = useState({
    title: 'منزل',
    fullAddress: '',
    city: '',
    postalCode: '',
    recipientName: user?.name || '',
    recipientPhone: '',
  });
  const [cardInfo, setCardInfo] = useState({
    number: '',
    holder: '',
    expiry: '',
    cvv: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const handleSubmitOrder = async () => {
    if (!user) {
      toast.error('لطفا ابتدا وارد شوید');
      navigate('/login');
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const order = {
      id: `ORD-${Date.now()}`,
      userId: user.id,
      items: cart,
      total: cartTotal + 50000, // + shipping
      status: 'processing' as const,
      createdAt: new Date().toISOString(),
      address: { ...address, id: `addr_${Date.now()}` },
      paymentMethod: paymentMethod as 'card' | 'cash',
    };

    addOrder(order);
    clearCart();
    setIsProcessing(false);
    setStep(4); // Success step
  };

  if (cart.length === 0 && step !== 4) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col" dir="rtl">
        <Header
          user={user}
          cartCount={cartCount}
          isDark={isDark}
          onToggleDark={toggleDark}
          onOpenCart={() => {}}
          onOpenAuth={() => navigate('/login')}
          onLogout={logout}
          onOpenDashboard={() => {}}
          onOpenProfile={() => user ? navigate('/profile') : navigate('/login')}
          searchQuery=""
          onSearchChange={() => {}}
        />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Package className="h-24 w-24 text-muted-foreground/30 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">سبد خرید شما خالی است</h1>
            <p className="text-muted-foreground mb-4">برای خرید، محصولات را به سبد اضافه کنید</p>
            <Button onClick={() => navigate('/')}>بازگشت به فروشگاه</Button>
          </div>
        </main>
        <Footer />
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
        onOpenCart={() => {}}
        onOpenAuth={() => navigate('/login')}
        onLogout={logout}
        onOpenDashboard={() => {}}
        onOpenProfile={() => user ? navigate('/profile') : navigate('/login')}
        searchQuery=""
        onSearchChange={() => {}}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {[
              { num: 1, title: 'آدرس', icon: MapPin },
              { num: 2, title: 'روش ارسال', icon: Truck },
              { num: 3, title: 'پرداخت', icon: CreditCard },
              { num: 4, title: 'تکمیل', icon: CheckCircle2 },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: step >= s.num ? 1 : 0.8 }}
                  className={`flex items-center justify-center w-12 h-12 rounded-full ${
                    step >= s.num
                      ? 'bg-gradient-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  <s.icon className="h-5 w-5" />
                </motion.div>
                <span className={`mr-2 text-sm hidden sm:block ${step >= s.num ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {s.title}
                </span>
                {i < 3 && (
                  <div className={`w-8 sm:w-16 h-1 mx-2 rounded ${step > s.num ? 'bg-primary' : 'bg-secondary'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Address */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      آدرس تحویل سفارش
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>نام گیرنده</Label>
                        <Input
                          value={address.recipientName}
                          onChange={(e) => setAddress({ ...address, recipientName: e.target.value })}
                          placeholder="نام و نام خانوادگی"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>شماره تماس</Label>
                        <Input
                          value={address.recipientPhone}
                          onChange={(e) => setAddress({ ...address, recipientPhone: e.target.value })}
                          placeholder="09123456789"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>شهر</Label>
                        <Input
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          placeholder="تهران"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>کد پستی</Label>
                        <Input
                          value={address.postalCode}
                          onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                          placeholder="1234567890"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>آدرس کامل</Label>
                      <Input
                        value={address.fullAddress}
                        onChange={(e) => setAddress({ ...address, fullAddress: e.target.value })}
                        placeholder="خیابان، کوچه، پلاک، واحد"
                      />
                    </div>
                    <Button
                      onClick={() => setStep(2)}
                      className="w-full bg-gradient-primary"
                      disabled={!address.recipientName || !address.recipientPhone || !address.city || !address.fullAddress}
                    >
                      ادامه
                      <ChevronLeft className="h-4 w-4 mr-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Shipping */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-primary" />
                      روش ارسال
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup defaultValue="express" className="space-y-3">
                      <div className="flex items-center justify-between p-4 border rounded-xl hover:border-primary transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="express" id="express" />
                          <div>
                            <Label htmlFor="express" className="font-medium cursor-pointer">ارسال اکسپرس</Label>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <Clock className="h-4 w-4" />
                              تحویل ۱ تا ۲ روز کاری
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-primary">۵۰,۰۰۰ تومان</span>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-xl hover:border-primary transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="normal" id="normal" />
                          <div>
                            <Label htmlFor="normal" className="font-medium cursor-pointer">ارسال عادی</Label>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <Clock className="h-4 w-4" />
                              تحویل ۳ تا ۵ روز کاری
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-primary">رایگان</span>
                      </div>
                    </RadioGroup>
                    
                    <div className="flex gap-3 pt-4">
                      <Button variant="outline" onClick={() => setStep(1)}>
                        بازگشت
                      </Button>
                      <Button onClick={() => setStep(3)} className="flex-1 bg-gradient-primary">
                        ادامه
                        <ChevronLeft className="h-4 w-4 mr-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      اطلاعات پرداخت
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                      <div className={`flex items-center justify-between p-4 border rounded-xl transition-colors cursor-pointer ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : ''}`}>
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="card" id="card" />
                          <div>
                            <Label htmlFor="card" className="font-medium cursor-pointer">پرداخت آنلاین</Label>
                            <p className="text-sm text-muted-foreground">پرداخت با کارت بانکی</p>
                          </div>
                        </div>
                        <CreditCard className="h-6 w-6 text-primary" />
                      </div>
                      <div className={`flex items-center justify-between p-4 border rounded-xl transition-colors cursor-pointer ${paymentMethod === 'cash' ? 'border-primary bg-primary/5' : ''}`}>
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value="cash" id="cash" />
                          <div>
                            <Label htmlFor="cash" className="font-medium cursor-pointer">پرداخت در محل</Label>
                            <p className="text-sm text-muted-foreground">پرداخت هنگام تحویل</p>
                          </div>
                        </div>
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                    </RadioGroup>

                    {paymentMethod === 'card' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4 pt-4 border-t"
                      >
                        {/* Card Preview */}
                        <div className="relative w-full max-w-sm mx-auto h-48 rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-accent p-6 text-primary-foreground overflow-hidden">
                          <div className="absolute top-4 left-4 w-12 h-8 rounded bg-gradient-to-r from-yellow-400 to-yellow-200" />
                          <div className="absolute bottom-16 right-6 text-xl tracking-widest font-mono">
                            {cardInfo.number || '•••• •••• •••• ••••'}
                          </div>
                          <div className="absolute bottom-6 right-6 text-sm">
                            {cardInfo.holder || 'نام دارنده کارت'}
                          </div>
                          <div className="absolute bottom-6 left-6 text-sm">
                            {cardInfo.expiry || 'MM/YY'}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>شماره کارت</Label>
                            <Input
                              value={cardInfo.number}
                              onChange={(e) => setCardInfo({ ...cardInfo, number: formatCardNumber(e.target.value) })}
                              placeholder="1234 5678 9012 3456"
                              maxLength={19}
                              className="text-center tracking-widest font-mono"
                              dir="ltr"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>نام دارنده کارت</Label>
                            <Input
                              value={cardInfo.holder}
                              onChange={(e) => setCardInfo({ ...cardInfo, holder: e.target.value })}
                              placeholder="نام روی کارت"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>تاریخ انقضا</Label>
                              <Input
                                value={cardInfo.expiry}
                                onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                                placeholder="MM/YY"
                                maxLength={5}
                                dir="ltr"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>CVV2</Label>
                              <Input
                                value={cardInfo.cvv}
                                onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                                placeholder="•••"
                                maxLength={4}
                                type="password"
                                dir="ltr"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 p-3 rounded-lg">
                      <Shield className="h-5 w-5 text-green-500" />
                      <span>پرداخت شما با رمزنگاری SSL محافظت می‌شود</span>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button variant="outline" onClick={() => setStep(2)}>
                        بازگشت
                      </Button>
                      <Button 
                        onClick={handleSubmitOrder} 
                        className="flex-1 bg-gradient-primary"
                        disabled={isProcessing || (paymentMethod === 'card' && (!cardInfo.number || !cardInfo.holder || !cardInfo.cvv))}
                      >
                        {isProcessing ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                          />
                        ) : (
                          <>پرداخت و ثبت سفارش</>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-2">سفارش شما با موفقیت ثبت شد!</h2>
                <p className="text-muted-foreground mb-6">
                  از خرید شما متشکریم. کد پیگیری به شماره موبایل شما ارسال شد.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={() => navigate('/profile')}>
                    مشاهده سفارشات
                  </Button>
                  <Button onClick={() => navigate('/')} className="bg-gradient-primary">
                    بازگشت به فروشگاه
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          {step !== 4 && (
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">خلاصه سفارش</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">تعداد: {item.quantity}</p>
                          <p className="text-sm font-bold text-primary">
                            {formatPrice(item.product.price * item.quantity)} تومان
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">جمع کالاها ({cartCount})</span>
                      <span>{formatPrice(cartTotal)} تومان</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">هزینه ارسال</span>
                      <span>۵۰,۰۰۰ تومان</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>مبلغ قابل پرداخت</span>
                    <span className="text-primary">{formatPrice(cartTotal + 50000)} تومان</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
