import { Metadata } from "next";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";

// Іконки, визначені прямо тут, щоб не створювати зайвих файлів
const MapPinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const PhoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export const metadata: Metadata = {
  title: "Контакти",
  description: "Зв'яжіться з нашим магазином для отримання підтримки.",
};

export default function ContactsPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 md:py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Контакти
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Ми завжди раді допомогти. Зв`яжіться з нами будь-яким зручним для вас
          способом.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Ліва колонка: Контактна інформація */}
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <MapPinIcon className="h-7 w-7 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold">Наша адреса</h3>
              <p className="text-muted-foreground">
                м. Київ, вул. Хрещатик, 22
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <PhoneIcon className="h-7 w-7 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold">Телефон</h3>
              <a
                href="tel:+380888888888"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                +38 (088) 888-88-88
              </a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <MailIcon className="h-7 w-7 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold">Email</h3>
              <a
                href="mailto:support@ishop.ua"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                support@orchard.ua
              </a>
            </div>
          </div>
        </div>

        {/* Права колонка: Форма */}
        <div className="rounded-lg border bg-card p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-5">Форма зворотного зв`язку</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Ваше ім`я</Label>
              <Input
                id="name"
                type="text"
                placeholder="Іван Петренко"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Ваш Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="message">Повідомлення</Label>
              <Textarea
                id="message"
                placeholder="Напишіть ваше запитання тут..."
                className="mt-1 min-h-[130px]"
              />
            </div>
            <Button type="submit" className="w-full">
              Надіслати
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
