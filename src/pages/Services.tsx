import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const services = [
  {
    icon: "Smartphone",
    title: "Ремонт iPhone",
    items: ["Замена экрана", "Замена аккумулятора", "Ремонт камеры", "Замена кнопок", "Ремонт платы"],
    price: "от 990 ₽",
  },
  {
    icon: "Tablet",
    title: "Ремонт iPad",
    items: ["Замена стекла/дисплея", "Замена аккумулятора", "Ремонт разъёма", "Чистка от влаги", "Ремонт платы"],
    price: "от 1 490 ₽",
  },
  {
    icon: "Laptop",
    title: "Ремонт MacBook",
    items: ["Замена клавиатуры", "Замена матрицы", "Апгрейд SSD/RAM", "Чистка от пыли", "Ремонт платы"],
    price: "от 1 990 ₽",
  },
  {
    icon: "Watch",
    title: "Ремонт Apple Watch",
    items: ["Замена экрана", "Замена аккумулятора", "Замена стекла", "Диагностика"],
    price: "от 790 ₽",
  },
  {
    icon: "Headphones",
    title: "Ремонт AirPods",
    items: ["Замена аккумулятора", "Чистка динамиков", "Ремонт кейса"],
    price: "от 590 ₽",
  },
  {
    icon: "Monitor",
    title: "Ремонт iMac / Mac Pro",
    items: ["Замена матрицы", "Замена HDD/SSD", "Чистка и замена термопасты", "Ремонт платы"],
    price: "от 2 990 ₽",
  },
];

const guarantees = [
  { icon: "ShieldCheck", text: "Гарантия 90 дней на все работы" },
  { icon: "Clock", text: "Срочный ремонт от 30 минут" },
  { icon: "BadgeCheck", text: "Только оригинальные запчасти" },
  { icon: "Truck", text: "Бесплатная курьерская доставка" },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Услуги сервисного центра
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Профессиональный ремонт всей техники Apple с гарантией качества
          </p>
        </div>
      </section>

      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/40 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon name={service.icon as "Smartphone"} size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{service.title}</h3>
                  <span className="text-sm font-medium text-primary">{service.price}</span>
                </div>
              </div>
              <ul className="space-y-2 mb-5">
                {service.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="Check" size={14} className="text-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/calculator"
                className="block w-full text-center py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors"
              >
                Рассчитать стоимость
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary py-14">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-foreground mb-8">
            Наши гарантии
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {guarantees.map((g) => (
              <div key={g.text} className="flex flex-col items-center text-center gap-3 p-5 bg-card rounded-2xl border border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name={g.icon as "ShieldCheck"} size={22} className="text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">{g.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}