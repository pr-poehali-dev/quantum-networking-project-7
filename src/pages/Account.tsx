import { useState } from "react";
import Icon from "@/components/ui/icon";

type Tab = "login" | "register" | "dashboard";

const mockUser = {
  name: "Иван Петров",
  email: "ivan@example.com",
  phone: "+7 (999) 123-45-67",
  bonusPoints: 1240,
  level: "Серебряный",
  nextLevel: "Золотой",
  nextLevelPoints: 2000,
  orders: [
    { id: "SC-2024-001", device: "iPhone 15 Pro", service: "Замена экрана", date: "22.04.2024", status: "В ремонте", price: 4990 },
    { id: "SC-2024-002", device: "MacBook Pro 14\"", service: "Замена клавиатуры", date: "20.04.2024", status: "Готово", price: 7990 },
    { id: "SC-2023-089", device: "iPhone 13", service: "Замена аккумулятора", date: "15.11.2023", status: "Готово", price: 1490 },
  ],
};

const loyaltyLevels = [
  { name: "Базовый", points: 0, discount: 2, color: "bg-gray-400" },
  { name: "Серебряный", points: 500, discount: 5, color: "bg-gray-300" },
  { name: "Золотой", points: 2000, discount: 8, color: "bg-yellow-400" },
  { name: "Платиновый", points: 5000, discount: 12, color: "bg-blue-400" },
];

export default function Account() {
  const [tab, setTab] = useState<Tab>("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "loyalty" | "settings">("orders");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSent(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setTab("login");
    setEmail("");
    setPassword("");
  };

  if (isLoggedIn) {
    const progress = Math.min((mockUser.bonusPoints / mockUser.nextLevelPoints) * 100, 100);
    return (
      <div className="min-h-screen bg-background">
        <section className="bg-primary py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <Icon name="User" size={32} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{mockUser.name}</h1>
                  <p className="text-white/70 text-sm">{mockUser.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
              >
                <Icon name="LogOut" size={16} />
                Выйти
              </button>
            </div>
          </div>
        </section>

        <section className="py-10 container mx-auto px-4 max-w-4xl">
          <div className="flex gap-2 mb-8 border-b border-border pb-1">
            {[
              { id: "orders" as const, label: "Мои заказы", icon: "Package" },
              { id: "loyalty" as const, label: "Программа лояльности", icon: "Star" },
              { id: "settings" as const, label: "Настройки", icon: "Settings" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-medium transition-colors ${
                  activeTab === t.id
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon name={t.icon as "Package"} size={16} />
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === "orders" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">История заказов</h2>
              {mockUser.orders.map((order) => (
                <div key={order.id} className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{order.device}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{order.service}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        <Icon name="Calendar" size={12} className="inline mr-1" />
                        {order.date} · #{order.id}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{order.price.toLocaleString()} ₽</p>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium mt-1 inline-block ${
                        order.status === "Готово"
                          ? "bg-green-100 text-green-700"
                          : "bg-primary/10 text-primary"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "loyalty" && (
            <div className="space-y-6">
              <div className="bg-primary rounded-2xl p-6 text-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-white/70 text-sm">Ваш уровень</p>
                    <p className="text-2xl font-bold">{mockUser.level}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/70 text-sm">Бонусных баллов</p>
                    <p className="text-3xl font-bold">{mockUser.bonusPoints.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-white/70 mb-1.5">
                    <span>До уровня «{mockUser.nextLevel}»</span>
                    <span>{mockUser.bonusPoints} / {mockUser.nextLevelPoints} баллов</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-4">Уровни программы</h3>
                <div className="space-y-3">
                  {loyaltyLevels.map((level) => (
                    <div key={level.name} className={`flex items-center justify-between p-3.5 rounded-xl ${
                      level.name === mockUser.level ? "bg-primary/10 border-2 border-primary" : "bg-secondary"
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${level.color} flex items-center justify-center`}>
                          <Icon name="Star" size={14} className="text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{level.name}</p>
                          <p className="text-xs text-muted-foreground">от {level.points.toLocaleString()} баллов</p>
                        </div>
                      </div>
                      <span className={`text-sm font-bold ${level.name === mockUser.level ? "text-primary" : "text-foreground"}`}>
                        -{level.discount}%
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  1 балл = 1 рубль. За каждые 100 ₽ ремонта начисляется 5 баллов.
                </p>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-5 max-w-md">
              <h2 className="text-xl font-bold text-foreground">Настройки профиля</h2>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Имя</label>
                <input
                  type="text"
                  defaultValue={mockUser.name}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <input
                  type="email"
                  defaultValue={mockUser.email}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Телефон</label>
                <input
                  type="tel"
                  defaultValue={mockUser.phone}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <button className="w-full py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
                Сохранить изменения
              </button>
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Личный кабинет</h1>
          <p className="text-white/80 text-lg">Войдите, чтобы управлять заказами и бонусами</p>
        </div>
      </section>

      <section className="py-14 container mx-auto px-4 flex-1">
        <div className="max-w-md mx-auto">
          <div className="flex bg-secondary rounded-2xl p-1 mb-8">
            <button
              onClick={() => { setTab("login"); setEmailSent(false); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === "login" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Войти
            </button>
            <button
              onClick={() => { setTab("register"); setEmailSent(false); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === "register" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Регистрация
            </button>
          </div>

          {tab === "login" && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Пароль</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
                >
                  Войти
                </button>
              </form>
              <div className="mt-4 text-center">
                <button className="text-sm text-primary hover:underline">
                  Забыли пароль?
                </button>
              </div>
            </div>
          )}

          {tab === "register" && !emailSent && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Ваше имя</label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                    placeholder="Иван Петров"
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Телефон</label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+7 (999) 000-00-00"
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Пароль</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    placeholder="Минимум 8 символов"
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
                >
                  Зарегистрироваться
                </button>
              </form>
            </div>
          )}

          {tab === "register" && emailSent && (
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon name="Mail" size={32} className="text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Подтвердите email</h2>
              <p className="text-muted-foreground text-sm">
                Мы отправили письмо на <strong>{regEmail}</strong>.
                Перейдите по ссылке в письме для завершения регистрации.
              </p>
              <button
                onClick={() => setEmailSent(false)}
                className="mt-6 text-sm text-primary hover:underline"
              >
                Отправить повторно
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
