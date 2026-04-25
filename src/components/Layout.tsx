import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";

const navLinks = [
  { to: "/", label: "Главная" },
  { to: "/services", label: "Услуги" },
  { to: "/calculator", label: "Расчёт ремонта" },
  { to: "/order-status", label: "Статус заказа" },
];

export default function Layout() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border" : "bg-white border-b border-border"
        }`}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-lg text-foreground">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Icon name="Wrench" size={18} className="text-white" />
            </div>
            <span>
              <span className="text-primary">Apple</span>Сервис
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/account"
              className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === "/account"
                  ? "bg-primary text-white"
                  : "border border-primary text-primary hover:bg-primary hover:text-white"
              }`}
            >
              <Icon name="User" size={16} />
              Личный кабинет
            </Link>
            <a
              href="tel:+78001234567"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Icon name="Phone" size={16} />
              8 800 123-45-67
            </a>
            <button
              className="md:hidden p-2 rounded-xl text-foreground hover:bg-secondary"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Icon name={menuOpen ? "X" : "Menu"} size={22} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-border bg-white px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/account"
              className="block px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-secondary"
            >
              Личный кабинет
            </Link>
            <a
              href="tel:+78001234567"
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-primary text-white mt-2"
            >
              <Icon name="Phone" size={16} />
              8 800 123-45-67
            </a>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-foreground text-white py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                  <Icon name="Wrench" size={18} className="text-white" />
                </div>
                <span className="font-bold text-lg">
                  <span className="text-primary">Apple</span>Сервис
                </span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Профессиональный ремонт техники Apple с гарантией качества и оригинальными запчастями.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-white/90">Услуги</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link to="/services" className="hover:text-white transition-colors">Ремонт iPhone</Link></li>
                <li><Link to="/services" className="hover:text-white transition-colors">Ремонт iPad</Link></li>
                <li><Link to="/services" className="hover:text-white transition-colors">Ремонт MacBook</Link></li>
                <li><Link to="/services" className="hover:text-white transition-colors">Ремонт Apple Watch</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-white/90">Клиентам</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link to="/calculator" className="hover:text-white transition-colors">Рассчитать стоимость</Link></li>
                <li><Link to="/order-status" className="hover:text-white transition-colors">Статус заказа</Link></li>
                <li><Link to="/account" className="hover:text-white transition-colors">Личный кабинет</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-white/90">Контакты</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li className="flex items-center gap-2">
                  <Icon name="Phone" size={14} className="text-primary" />
                  <a href="tel:+78001234567" className="hover:text-white">8 800 123-45-67</a>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={14} className="text-primary" />
                  <a href="mailto:info@appleservice.ru" className="hover:text-white">info@appleservice.ru</a>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="MapPin" size={14} className="text-primary" />
                  <span>Москва, ул. Примерная, 1</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Clock" size={14} className="text-primary" />
                  <span>Ежедневно 9:00 – 21:00</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/40">
            <p>© 2024 AppleСервис. Все права защищены.</p>
            <p>Не является официальным сервисом Apple Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
