import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import {
  apiLogin, apiRegister, apiLogout, apiGetMe,
  apiUpdateProfile, apiGetMyOrders, apiGetLoyalty, getToken
} from "@/lib/api";

const loyaltyLevelColors: Record<string, string> = {
  base: "bg-gray-400",
  silver: "bg-gray-300",
  gold: "bg-yellow-400",
  platinum: "bg-blue-400",
};

type LoyaltyLevel = { name: string; label: string; minPoints: number; discount: number };
type LoyaltyData = {
  points: number;
  level: LoyaltyLevel;
  nextLevel: { label: string; minPoints: number } | null;
  allLevels: LoyaltyLevel[];
  progress: number;
};
type Order = { id: number; orderNumber: string; device: string; service: string; status: string; price: number; createdAt: string };
type UserData = { id: number; name: string; email: string; phone: string };

export default function Account() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [tab, setTab] = useState<"login" | "register">("login");
  const [activeTab, setActiveTab] = useState<"orders" | "loyalty" | "settings">("orders");

  const [user, setUser] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loyalty, setLoyalty] = useState<LoyaltyData | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [settingsName, setSettingsName] = useState("");
  const [settingsPhone, setSettingsPhone] = useState("");
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    if (getToken()) {
      loadUserData();
    } else {
      setPageLoading(false);
    }
  }, []);

  async function loadUserData() {
    try {
      const [meData, ordersData, loyaltyData] = await Promise.all([
        apiGetMe(), apiGetMyOrders(), apiGetLoyalty(),
      ]);
      setUser(meData.user);
      setSettingsName(meData.user.name);
      setSettingsPhone(meData.user.phone || "");
      setOrders(ordersData.orders || []);
      setLoyalty(loyaltyData);
      setIsLoggedIn(true);
    } catch {
      setIsLoggedIn(false);
    } finally {
      setPageLoading(false);
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFormLoading(true);
    try {
      const data = await apiLogin(email, password);
      setUser(data.user);
      setSettingsName(data.user.name);
      setSettingsPhone(data.user.phone || "");
      const [ordersData, loyaltyData] = await Promise.all([apiGetMyOrders(), apiGetLoyalty()]);
      setOrders(ordersData.orders || []);
      setLoyalty(loyaltyData);
      setIsLoggedIn(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка входа");
    } finally {
      setFormLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFormLoading(true);
    try {
      await apiRegister(regName, regEmail, regPassword, regPhone);
      setEmailSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка регистрации");
    } finally {
      setFormLoading(false);
    }
  };

  const handleLogout = async () => {
    await apiLogout();
    setIsLoggedIn(false);
    setUser(null);
    setOrders([]);
    setLoyalty(null);
    setTab("login");
    setEmail(""); setPassword("");
  };

  const handleSaveProfile = async () => {
    try {
      await apiUpdateProfile(settingsName, settingsPhone);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch { /* ignore */ }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icon name="Loader2" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (isLoggedIn && user && loyalty) {
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
                  <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                  <p className="text-white/70 text-sm">{user.email}</p>
                </div>
              </div>
              <button onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white text-sm hover:bg-white/20 transition-colors">
                <Icon name="LogOut" size={16} />Выйти
              </button>
            </div>
          </div>
        </section>

        <section className="py-10 container mx-auto px-4 max-w-4xl">
          <div className="flex gap-2 mb-8 border-b border-border pb-1 overflow-x-auto">
            {[
              { id: "orders" as const, label: "Мои заказы", icon: "Package" },
              { id: "loyalty" as const, label: "Программа лояльности", icon: "Star" },
              { id: "settings" as const, label: "Настройки", icon: "Settings" },
            ].map((t) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === t.id ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}>
                <Icon name={t.icon as "Package"} size={16} />{t.label}
              </button>
            ))}
          </div>

          {activeTab === "orders" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">История заказов</h2>
              {orders.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Icon name="Package" size={48} className="mx-auto mb-3 opacity-40" />
                  <p>Заказов пока нет</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-card border border-border rounded-2xl p-5">
                    <div className="flex items-start justify-between flex-wrap gap-3">
                      <div>
                        <p className="font-semibold text-foreground">{order.device}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{order.service}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          <Icon name="Calendar" size={12} className="inline mr-1" />
                          {order.createdAt?.slice(0, 10)} · #{order.orderNumber}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">{order.price.toLocaleString()} ₽</p>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium mt-1 inline-block ${
                          order.status === "ready" ? "bg-green-100 text-green-700" : "bg-primary/10 text-primary"}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "loyalty" && (
            <div className="space-y-6">
              <div className="bg-primary rounded-2xl p-6 text-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-white/70 text-sm">Ваш уровень</p>
                    <p className="text-2xl font-bold">{loyalty.level.label}</p>
                    <p className="text-white/60 text-sm">Скидка {loyalty.level.discount}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/70 text-sm">Бонусных баллов</p>
                    <p className="text-3xl font-bold">{loyalty.points.toLocaleString()}</p>
                  </div>
                </div>
                {loyalty.nextLevel && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-white/70 mb-1.5">
                      <span>До уровня «{loyalty.nextLevel.label}»</span>
                      <span>{loyalty.points} / {loyalty.nextLevel.minPoints} баллов</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{ width: `${loyalty.progress}%` }} />
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-4">Уровни программы</h3>
                <div className="space-y-3">
                  {loyalty.allLevels.map((level) => (
                    <div key={level.name} className={`flex items-center justify-between p-3.5 rounded-xl ${
                      level.name === loyalty.level.name ? "bg-primary/10 border-2 border-primary" : "bg-secondary"}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${loyaltyLevelColors[level.name] || "bg-gray-400"} flex items-center justify-center`}>
                          <Icon name="Star" size={14} className="text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{level.label}</p>
                          <p className="text-xs text-muted-foreground">от {level.minPoints.toLocaleString()} баллов</p>
                        </div>
                      </div>
                      <span className={`text-sm font-bold ${level.name === loyalty.level.name ? "text-primary" : "text-foreground"}`}>
                        -{level.discount}%
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4">1 балл = 1 рубль. За каждые 100 ₽ ремонта начисляется 5 баллов.</p>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-5 max-w-md">
              <h2 className="text-xl font-bold text-foreground">Настройки профиля</h2>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Имя</label>
                <input type="text" value={settingsName} onChange={(e) => setSettingsName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <input type="email" value={user.email} disabled
                  className="w-full px-4 py-3 rounded-xl border border-input bg-muted text-muted-foreground cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Телефон</label>
                <input type="tel" value={settingsPhone} onChange={(e) => setSettingsPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <button onClick={handleSaveProfile}
                className="w-full py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
                {settingsSaved ? "Сохранено!" : "Сохранить изменения"}
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
            <button onClick={() => { setTab("login"); setEmailSent(false); setError(""); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === "login" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              Войти
            </button>
            <button onClick={() => { setTab("register"); setEmailSent(false); setError(""); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === "register" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              Регистрация
            </button>
          </div>

          {tab === "login" && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Пароль</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                {error && <p className="text-sm text-destructive flex items-center gap-1.5"><Icon name="AlertCircle" size={14} />{error}</p>}
                <button type="submit" disabled={formLoading}
                  className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {formLoading && <Icon name="Loader2" size={16} className="animate-spin" />}
                  Войти
                </button>
              </form>
            </div>
          )}

          {tab === "register" && !emailSent && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Ваше имя</label>
                  <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} required placeholder="Иван Петров"
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                  <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Телефон</label>
                  <input type="tel" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} placeholder="+7 (999) 000-00-00"
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Пароль</label>
                  <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required placeholder="Минимум 6 символов"
                    className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                {error && <p className="text-sm text-destructive flex items-center gap-1.5"><Icon name="AlertCircle" size={14} />{error}</p>}
                <button type="submit" disabled={formLoading}
                  className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {formLoading && <Icon name="Loader2" size={16} className="animate-spin" />}
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
                Мы отправили письмо на <strong>{regEmail}</strong>. Перейдите по ссылке для завершения регистрации.
              </p>
              <button onClick={() => setEmailSent(false)} className="mt-6 text-sm text-primary hover:underline">
                Отправить повторно
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
