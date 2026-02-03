import { Zap, Phone, Mail, MapPin, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">الکترو شاپ</span>
            </div>
            <p className="text-muted-foreground text-sm">
              فروشگاه آنلاین لوازم برقی با بهترین قیمت و کیفیت. گارانتی اصالت کالا و ارسال رایگان.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">دسترسی سریع</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-foreground cursor-pointer transition-colors">درباره ما</li>
              <li className="hover:text-foreground cursor-pointer transition-colors">تماس با ما</li>
              <li className="hover:text-foreground cursor-pointer transition-colors">سوالات متداول</li>
              <li className="hover:text-foreground cursor-pointer transition-colors">قوانین و مقررات</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">دسته‌بندی‌ها</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-foreground cursor-pointer transition-colors">یخچال و فریزر</li>
              <li className="hover:text-foreground cursor-pointer transition-colors">لوازم آشپزخانه</li>
              <li className="hover:text-foreground cursor-pointer transition-colors">تلویزیون و صوتی</li>
              <li className="hover:text-foreground cursor-pointer transition-colors">لوازم جانبی</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">ارتباط با ما</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@electroshop.ir</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>تهران، خیابان ولیعصر</span>
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a href="#" className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© ۱۴۰۳ الکترو شاپ. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}
