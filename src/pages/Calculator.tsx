import { useState } from "react";
import Icon from "@/components/ui/icon";

const devices = [
  { id: "iphone", label: "iPhone", icon: "Smartphone" },
  { id: "ipad", label: "iPad", icon: "Tablet" },
  { id: "macbook", label: "MacBook", icon: "Laptop" },
  { id: "imac", label: "iMac / Mac Pro", icon: "Monitor" },
  { id: "watch", label: "Apple Watch", icon: "Watch" },
  { id: "airpods", label: "AirPods", icon: "Headphones" },
];

const repairTypes: Record<string, { label: string; price: number }[]> = {
  iphone: [
    { label: "Замена экрана (оригинал)", price: 4990 },
    { label: "Замена экрана (копия)", price: 1990 },
    { label: "Замена аккумулятора", price: 1490 },
    { label: "Замена задней крышки", price: 990 },
    { label: "Ремонт камеры", price: 2490 },
    { label: "Ремонт разъёма зарядки", price: 1290 },
    { label: "Ремонт материнской платы", price: 4990 },
    { label: "Чистка от влаги", price: 1990 },
  ],
  ipad: [
    { label: "Замена стекла", price: 2490 },
    { label: "Замена дисплея", price: 5990 },
    { label: "Замена аккумулятора", price: 2490 },
    { label: "Ремонт разъёма", price: 1490 },
    { label: "Чистка от влаги", price: 2490 },
  ],
  macbook: [
    { label: "Замена клавиатуры", price: 7990 },
    { label: "Замена матрицы", price: 12990 },
    { label: "Апгрейд SSD (256GB)", price: 5990 },
    { label: "Апгрейд SSD (512GB)", price: 8990 },
    { label: "Чистка и замена термопасты", price: 2490 },
    { label: "Ремонт материнской платы", price: 9990 },
    { label: "Ремонт разъёма MagSafe", price: 3490 },
  ],
  imac: [
    { label: "Замена матрицы", price: 19990 },
    { label: "Замена HDD на SSD", price: 6990 },
    { label: "Чистка от пыли", price: 2990 },
    { label: "Ремонт материнской платы", price: 14990 },
  ],
  watch: [
    { label: "Замена экрана", price: 3990 },
    { label: "Замена аккумулятора", price: 1990 },
    { label: "Замена стекла", price: 1490 },
    { label: "Диагностика", price: 0 },
  ],
  airpods: [
    { label: "Замена аккумулятора (1 наушник)", price: 990 },
    { label: "Замена аккумулятора (оба)", price: 1790 },
    { label: "Чистка динамиков", price: 590 },
    { label: "Ремонт кейса", price: 1290 },
  ],
};

const urgencyOptions = [
  { id: "standard", label: "Стандартный (1–3 дня)", multiplier: 1 },
  { id: "express", label: "Экспресс (до 24 часов)", multiplier: 1.3 },
  { id: "urgent", label: "Срочный (2–4 часа)", multiplier: 1.6 },
];

export default function Calculator() {
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [selectedRepairs, setSelectedRepairs] = useState<string[]>([]);
  const [urgency, setUrgency] = useState<string>("standard");

  const repairs = selectedDevice ? repairTypes[selectedDevice] || [] : [];

  const toggleRepair = (label: string) => {
    setSelectedRepairs((prev) =>
      prev.includes(label) ? prev.filter((r) => r !== label) : [...prev, label]
    );
  };

  const selectedRepairObjects = repairs.filter((r) => selectedRepairs.includes(r.label));
  const baseTotal = selectedRepairObjects.reduce((sum, r) => sum + r.price, 0);
  const urgencyMult = urgencyOptions.find((u) => u.id === urgency)?.multiplier ?? 1;
  const total = Math.round(baseTotal * urgencyMult);

  const handleDeviceChange = (id: string) => {
    setSelectedDevice(id);
    setSelectedRepairs([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Онлайн-расчёт стоимости ремонта
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Выберите устройство и необходимые работы — мы сразу покажем цену
          </p>
        </div>
      </section>

      <section className="py-14 container mx-auto px-4 max-w-3xl">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              1. Выберите устройство
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {devices.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleDeviceChange(d.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                    selectedDevice === d.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  <Icon name={d.icon as "Smartphone"} size={28} />
                  <span className="text-sm font-medium">{d.label}</span>
                </button>
              ))}
            </div>
          </div>

          {selectedDevice && (
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                2. Выберите виды работ
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {repairs.map((r) => {
                  const isSelected = selectedRepairs.includes(r.label);
                  return (
                    <button
                      key={r.label}
                      onClick={() => toggleRepair(r.label)}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <span className={`text-sm font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>
                        {r.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${isSelected ? "text-primary" : "text-muted-foreground"}`}>
                          {r.price === 0 ? "Бесплатно" : `${r.price.toLocaleString()} ₽`}
                        </span>
                        {isSelected && (
                          <Icon name="CheckCircle2" size={16} className="text-primary" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {selectedRepairs.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                3. Срочность ремонта
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {urgencyOptions.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => setUrgency(u.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      urgency === u.id
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <p className={`text-sm font-medium ${urgency === u.id ? "text-primary" : "text-foreground"}`}>
                      {u.label}
                    </p>
                    {u.multiplier > 1 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        +{Math.round((u.multiplier - 1) * 100)}% к стоимости
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedRepairs.length > 0 && (
            <div className="bg-primary rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Итого:</h3>
                <span className="text-3xl font-bold">{total.toLocaleString()} ₽</span>
              </div>
              <ul className="space-y-1.5 mb-5">
                {selectedRepairObjects.map((r) => (
                  <li key={r.label} className="flex justify-between text-sm text-white/80">
                    <span>{r.label}</span>
                    <span>{r.price === 0 ? "Бесплатно" : `${r.price.toLocaleString()} ₽`}</span>
                  </li>
                ))}
                {urgencyMult > 1 && (
                  <li className="flex justify-between text-sm text-white/80 border-t border-white/20 pt-2 mt-2">
                    <span>Коэффициент срочности</span>
                    <span>×{urgencyMult}</span>
                  </li>
                )}
              </ul>
              <p className="text-xs text-white/60 mb-4">
                * Точная стоимость определяется после бесплатной диагностики. Цены указаны ориентировочно.
              </p>
              <a
                href="tel:+78001234567"
                className="block w-full text-center py-3 rounded-xl bg-white text-primary font-semibold hover:bg-white/90 transition-colors"
              >
                Записаться на ремонт
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
