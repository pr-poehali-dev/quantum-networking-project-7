import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowRight, ShieldCheck, Clock, Wrench, Star, ChevronRight, BadgeCheck } from "lucide-react"
import { motion, type Variants } from "framer-motion"
import { GridMotion } from "./ui/grid-motion"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
)
CardHeader.displayName = "CardHeader"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
)
CardContent.displayName = "CardContent"

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

function AnimatedGroup({
  children,
  className,
  variants,
}: {
  children: React.ReactNode
  className?: string
  variants?: { container?: Variants; item?: Variants }
}) {
  const containerVariants = variants?.container || defaultContainerVariants
  const itemVariants = variants?.item || defaultItemVariants

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className={cn(className)}>
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

const transitionVariants = {
  item: {
    hidden: { opacity: 0, filter: "blur(12px)", y: 12 },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: { type: "spring", bounce: 0.3, duration: 1.5 },
    },
  },
}

const CardDecorator = ({ children }: { children: React.ReactNode }) => (
  <div
    aria-hidden
    className="relative mx-auto size-36 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"
  >
    <div className="absolute inset-0 [--border:black] dark:[--border:white] bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:24px_24px] opacity-10" />
    <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-t border-l border-primary/20">
      {children}
    </div>
  </div>
)

const stats = [
  { value: "12+", label: "лет на рынке" },
  { value: "15 000+", label: "отремонтировано устройств" },
  { value: "98%", label: "довольных клиентов" },
  { value: "90 дней", label: "гарантия на работы" },
]

const reviews = [
  { name: "Анна М.", device: "iPhone 14 Pro", text: "Заменили экран за 2 часа. Качество отличное, всё работает как новый. Рекомендую!", rating: 5 },
  { name: "Сергей К.", device: "MacBook Air M2", text: "Починили клавиатуру и почистили от пыли. Теперь работает тихо и быстро. Спасибо!", rating: 5 },
  { name: "Мария Д.", device: "iPad Pro", text: "Разбила экран — думала всё. Но ребята восстановили идеально. Даже следа не видно.", rating: 5 },
]

export default function SoftwareDevelopmentWebsite() {
  const gridItems = [
    "https://cdn.poehali.dev/templates/landing-page/fluid-gradient.jpg",
    "https://cdn.poehali.dev/templates/landing-page/vr-experience.jpg",
    "https://cdn.poehali.dev/templates/landing-page/ai-whiteboard.jpg",
    "https://cdn.poehali.dev/templates/landing-page/human-ai.jpg",
    "https://cdn.poehali.dev/templates/landing-page/digital-eye.jpg",
    "https://cdn.poehali.dev/templates/landing-page/robot.jpg",
    "https://cdn.poehali.dev/templates/landing-page/purple-flow.jpg",
    "https://cdn.poehali.dev/templates/landing-page/data-beam.jpg",
    "https://cdn.poehali.dev/templates/landing-page/ai-keyboard.jpg",
    "https://cdn.poehali.dev/templates/landing-page/fiber-optic.jpg",
    "https://cdn.poehali.dev/templates/landing-page/fluid-gradient.jpg",
    "https://cdn.poehali.dev/templates/landing-page/vr-experience.jpg",
    "https://cdn.poehali.dev/templates/landing-page/ai-whiteboard.jpg",
    "https://cdn.poehali.dev/templates/landing-page/human-ai.jpg",
    "https://cdn.poehali.dev/templates/landing-page/digital-eye.jpg",
    "https://cdn.poehali.dev/templates/landing-page/robot.jpg",
    "https://cdn.poehali.dev/templates/landing-page/purple-flow.jpg",
    "https://cdn.poehali.dev/templates/landing-page/data-beam.jpg",
    "https://cdn.poehali.dev/templates/landing-page/ai-keyboard.jpg",
    "https://cdn.poehali.dev/templates/landing-page/fiber-optic.jpg",
    "https://cdn.poehali.dev/templates/landing-page/fluid-gradient.jpg",
    "https://cdn.poehali.dev/templates/landing-page/vr-experience.jpg",
    "https://cdn.poehali.dev/templates/landing-page/ai-whiteboard.jpg",
    "https://cdn.poehali.dev/templates/landing-page/human-ai.jpg",
    "https://cdn.poehali.dev/templates/landing-page/digital-eye.jpg",
    "https://cdn.poehali.dev/templates/landing-page/robot.jpg",
  ]

  return (
    <main className="overflow-hidden">
      <div
        aria-hidden
        className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block"
      >
        <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsl(227_80%_47%_/_0.08)_0,hsl(227_80%_47%_/_0.02)_50%,transparent_80%)]" />
        <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsl(227_80%_47%_/_0.06)_0,transparent_100%)] [translate:5%_-50%]" />
      </div>

      {/* HERO */}
      <section>
        <div className="relative pt-16 md:pt-28">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]"
          />
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
              <AnimatedGroup variants={transitionVariants}>
                <Link
                  to="/order-status"
                  className="hover:bg-background bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-black/5 transition-all duration-300"
                >
                  <span className="text-foreground text-sm">Узнайте статус вашего заказа онлайн</span>
                  <span className="block h-4 w-0.5 border-l bg-border"></span>
                  <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                    <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                      <span className="flex size-6">
                        <ArrowRight className="m-auto size-3" />
                      </span>
                      <span className="flex size-6">
                        <ArrowRight className="m-auto size-3" />
                      </span>
                    </div>
                  </div>
                </Link>

                <h1 className="mt-8 max-w-4xl mx-auto text-balance text-5xl md:text-6xl lg:mt-12 xl:text-[5rem] font-bold">
                  Профессиональный ремонт{" "}
                  <span className="inline-block text-primary">
                    техники Apple
                  </span>
                </h1>
                <p className="mx-auto mt-8 max-w-2xl text-balance text-lg text-muted-foreground">
                  Быстро, качественно, с гарантией 90 дней. iPhone, iPad, MacBook, Apple Watch, AirPods —
                  вернём вашему устройству жизнь в день обращения.
                </p>
              </AnimatedGroup>

              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: { staggerChildren: 0.05, delayChildren: 0.75 },
                    },
                  },
                  ...transitionVariants,
                }}
                className="mt-10 flex flex-col items-center justify-center gap-3 md:flex-row"
              >
                <div key={1} className="bg-primary/10 rounded-[14px] border border-primary/20 p-0.5">
                  <Button size="lg" className="rounded-xl px-6 text-base" asChild>
                    <Link to="/calculator">Рассчитать стоимость</Link>
                  </Button>
                </div>
                <Button key={2} size="lg" variant="ghost" className="h-10.5 rounded-xl px-5 hover:text-primary" asChild>
                  <Link to="/order-status" className="flex items-center gap-2">
                    <span>Статус заказа</span>
                    <ChevronRight className="size-4" />
                  </Link>
                </Button>
              </AnimatedGroup>
            </div>
          </div>

          <AnimatedGroup
            variants={{
              container: {
                visible: {
                  transition: { staggerChildren: 0.05, delayChildren: 0.75 },
                },
              },
              ...transitionVariants,
            }}
          >
            <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
              <div
                aria-hidden
                className="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
              />
              <div className="inset-shadow-2xs ring-background bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-primary/20 p-4 shadow-lg shadow-primary/10 ring-1">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 aspect-[15/8] relative rounded-2xl border border-primary/20 overflow-hidden">
                  <GridMotion items={gridItems} gradientColor="rgba(63, 90, 200, 0.1)" className="h-full w-full" />
                </div>
              </div>
            </div>

            {/* STATS */}
            <section className="bg-background pb-10 pt-16 md:pb-20">
              <div className="mx-auto max-w-5xl px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {stats.map((stat) => (
                    <div key={stat.value} className="text-center p-5 rounded-2xl bg-secondary border border-border">
                      <p className="text-3xl font-bold text-primary">{stat.value}</p>
                      <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </AnimatedGroup>
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-muted/50 py-16 md:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <h2 className="text-balance text-4xl font-bold lg:text-5xl">
              Почему выбирают{" "}
              <span className="text-primary">AppleСервис</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Мы не просто ремонтируем — мы возвращаем вашу технику в идеальное состояние с заботой о каждой детали.
            </p>
          </div>
          <Card className="mx-auto mt-8 grid max-w-sm divide-y overflow-hidden shadow-zinc-950/5 border-primary/20 *:text-center md:mt-16 md:max-w-full md:grid-cols-3 md:divide-x md:divide-y-0">
            <div className="group shadow-zinc-950/5">
              <CardHeader className="pb-3">
                <CardDecorator>
                  <ShieldCheck className="size-6 text-primary" aria-hidden />
                </CardDecorator>
                <h3 className="mt-6 font-semibold text-foreground">Гарантия 90 дней</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Даём письменную гарантию на все виды работ и запчасти. Если что-то пойдёт не так — исправим бесплатно.
                </p>
              </CardContent>
            </div>

            <div className="group shadow-zinc-950/5">
              <CardHeader className="pb-3">
                <CardDecorator>
                  <Clock className="size-6 text-primary" aria-hidden />
                </CardDecorator>
                <h3 className="mt-6 font-semibold text-foreground">Срочный ремонт от 30 мин</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Большинство поломок устраняем в день обращения. Замена стекла и аккумулятора — прямо при вас.
                </p>
              </CardContent>
            </div>

            <div className="group shadow-zinc-950/5">
              <CardHeader className="pb-3">
                <CardDecorator>
                  <BadgeCheck className="size-6 text-primary" aria-hidden />
                </CardDecorator>
                <h3 className="mt-6 font-semibold text-foreground">Только оригинальные запчасти</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Используем только сертифицированные компоненты Apple и проверенных поставщиков. Ваше устройство в надёжных руках.
                </p>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="py-16 md:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Все устройства Apple
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Ремонтируем весь модельный ряд Apple — от самых новых до старых моделей
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: "📱", name: "iPhone", desc: "Все модели от iPhone 6 до 15 Pro Max" },
              { icon: "💻", name: "MacBook", desc: "Air, Pro, все поколения включая M-серию" },
              { icon: "⌚", name: "Apple Watch", desc: "Series 1–9, Ultra, SE" },
              { icon: "🎧", name: "AirPods", desc: "AirPods, AirPods Pro, Max" },
              { icon: "📟", name: "iPad", desc: "iPad, Air, Pro, mini всех поколений" },
              { icon: "🖥️", name: "iMac / Mac", desc: "iMac, Mac Pro, Mac mini, Mac Studio" },
            ].map((item) => (
              <Link
                key={item.name}
                to="/services"
                className="group flex flex-col items-center text-center p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all duration-300"
              >
                <span className="text-4xl mb-3">{item.icon}</span>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button size="lg" className="rounded-xl" asChild>
              <Link to="/services">Все услуги и цены</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="bg-muted/50 py-16 md:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Отзывы клиентов</h2>
            <p className="text-muted-foreground">Нам доверяют тысячи клиентов по всей Москве</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div key={review.name} className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center gap-0.5 mb-3">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-foreground mb-4 leading-relaxed">"{review.text}"</p>
                <div className="border-t border-border pt-3">
                  <p className="text-sm font-semibold text-foreground">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.device}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="bg-primary rounded-3xl p-10 md:p-16">
            <Wrench className="size-12 text-white/80 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Готовы починить ваше устройство?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
              Рассчитайте стоимость онлайн или позвоните — ответим в течение 2 минут.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" variant="secondary" className="rounded-xl px-8 text-base font-semibold" asChild>
                <Link to="/calculator">Рассчитать стоимость</Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-xl px-8 text-base border-white/40 text-white hover:bg-white/10 hover:text-white" asChild>
                <a href="tel:+78001234567">8 800 123-45-67</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
