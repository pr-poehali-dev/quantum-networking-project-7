import { useState } from "react";
import Icon from "@/components/ui/icon";
import { apiSearchOrder } from "@/lib/api";

type StatusStep = {
  id: string;
  label: string;
  description: string;
  icon: string;
};

const statusSteps: StatusStep[] = [
  { id: "received", label: "Принят", description: "Устройство принято в сервис", icon: "PackageCheck" },
  { id: "diagnosis", label: "Диагностика", description: "Специалист проводит диагностику", icon: "Search" },
  { id: "waiting", label: "Ожидание запчастей", description: "Ожидаем поставку запчастей", icon: "Clock" },
  { id: "repair", label: "В ремонте", description: "Выполняются ремонтные работы", icon: "Wrench" },
  { id: "testing", label: "Тестирование", description: "Проверяем качество работы", icon: "CheckSquare" },
  { id: "ready", label: "Готово", description: "Устройство готово к выдаче", icon: "PartyPopper" },
];

const mockOrders: Record<string, { device: string; model: string; status: string; master: string; created: string; updated: string; comment: string }> = {
  "SC-2024-001": {
    device: "iPhone 15 Pro",
    model: "iPhone",
    status: "repair",
    master: "Александр К.",
    created: "22.04.2024",
    updated: "25.04.2024 10:30",
    comment: "Заменяем экран на оригинальный. Работа идёт по плану.",
  },
  "SC-2024-002": {
    device: "MacBook Pro 14\"",
    model: "MacBook",
    status: "ready",
    master: "Дмитрий П.",
    created: "20.04.2024",
    updated: "24.04.2024 16:15",
    comment: "Клавиатура заменена. Устройство протестировано, готово к выдаче.",
  },
  "SC-2024-003": {
    device: "iPad Air 5",
    model: "iPad",
    status: "diagnosis",
    master: "Сергей В.",
    created: "25.04.2024",
    updated: "25.04.2024 09:00",
    comment: "Проводим диагностику дисплея и батареи.",
  },
};

type OrderData = {
  device: string;
  status: string;
  master: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  orderNumber: string;
};

export default function OrderStatus() {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setError("");
    setOrder(null);
    if (!orderNumber.trim()) {
      setError("Введите номер заказа");
      return;
    }
    setLoading(true);
    try {
      const data = await apiSearchOrder(orderNumber.trim());
      setOrder(data.order);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("не найден") || msg === "") {
        setError("Заказ не найден. Проверьте номер и попробуйте ещё раз.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = order ? statusSteps.findIndex((s) => s.id === order.status) : -1;

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Статус заказа
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Введите номер заказа, чтобы узнать текущий статус ремонта
          </p>
        </div>
      </section>

      <section className="py-14 container mx-auto px-4 max-w-2xl">
        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          <label className="block text-sm font-medium text-foreground mb-2">
            Номер заказа
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Например: SC-2024-001"
              className="flex-1 px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {loading ? (
                <Icon name="Loader2" size={18} className="animate-spin" />
              ) : (
                <Icon name="Search" size={18} />
              )}
              Найти
            </button>
          </div>
          {error && (
            <p className="mt-3 text-sm text-destructive flex items-center gap-1.5">
              <Icon name="AlertCircle" size={14} />
              {error}
            </p>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            Номер заказа указан в квитанции, которую вы получили при сдаче устройства.
          </p>
        </div>

        {order && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{order.device}</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Заказ №{orderNumber.toUpperCase()}</p>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                  order.status === "ready"
                    ? "bg-green-100 text-green-700"
                    : "bg-primary/10 text-primary"
                }`}>
                  {statusSteps.find((s) => s.id === order.status)?.label}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p className="text-muted-foreground">Мастер</p>
                  <p className="font-medium text-foreground">{order.master}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Принят</p>
                  <p className="font-medium text-foreground">{order.createdAt?.slice(0, 10)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Обновлено</p>
                  <p className="font-medium text-foreground">{order.updatedAt?.slice(0, 16).replace("T", " ")}</p>
                </div>
              </div>
              {order.comment && (
                <div className="bg-secondary rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">Комментарий мастера:</p>
                  <p className="text-sm text-foreground">{order.comment}</p>
                </div>
              )}
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-semibold text-foreground mb-5">Этапы ремонта</h3>
              <div className="space-y-4">
                {statusSteps.map((step, index) => {
                  const isDone = index < currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const isPending = index > currentStepIndex;
                  return (
                    <div key={step.id} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isDone
                            ? "bg-green-500 text-white"
                            : isCurrent
                            ? "bg-primary text-white"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {isDone ? (
                            <Icon name="Check" size={16} />
                          ) : (
                            <Icon name={step.icon as "Clock"} size={16} />
                          )}
                        </div>
                        {index < statusSteps.length - 1 && (
                          <div className={`w-0.5 h-6 mt-1 ${isDone ? "bg-green-500" : "bg-border"}`} />
                        )}
                      </div>
                      <div className="pt-1.5">
                        <p className={`text-sm font-semibold ${
                          isCurrent ? "text-primary" : isDone ? "text-foreground" : "text-muted-foreground"
                        }`}>
                          {step.label}
                          {isCurrent && (
                            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              Сейчас
                            </span>
                          )}
                        </p>
                        <p className={`text-xs mt-0.5 ${isPending ? "text-muted-foreground/50" : "text-muted-foreground"}`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {order.status === "ready" && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
                <Icon name="PartyPopper" size={32} className="text-green-600 mx-auto mb-2" />
                <h3 className="font-bold text-green-800 text-lg">Устройство готово!</h3>
                <p className="text-green-700 text-sm mt-1">
                  Приходите за устройством с квитанцией. Работаем ежедневно с 9:00 до 21:00.
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}