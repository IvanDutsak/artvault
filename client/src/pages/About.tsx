
import { motion } from "framer-motion";
import { Sparkles, MapPin, Mail, Phone, Clock, Award, Users, Globe } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import MegaFooter from "@/components/MegaFooter";
import PageTransition from "@/components/PageTransition";
import GoldParticles from "@/components/GoldParticles";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663390828783/42KexusuZjroriTj2ubQwq/hero-banner-SE3MxU7facrVUGfGHs4666.webp";

const values = [
  {
    icon: Award,
    title: "Автентичність",
    description: "Кожен твір у нашій колекції пройшов ретельну експертизу та має сертифікат автентичності.",
  },
  {
    icon: Users,
    title: "Спільнота",
    description: "Ми об'єднуємо поціновувачів мистецтва з усього світу, створюючи простір для діалогу та натхнення.",
  },
  {
    icon: Globe,
    title: "Доступність",
    description: "Наша місія — зробити мистецтво доступним для кожного, незалежно від місця проживання.",
  },
];

export default function About() {
  return (
    <PageTransition variant="unroll">
    <div className="min-h-screen flex flex-col bg-background relative">
      <GoldParticles count={20} />
      <Navbar />


      <section className="relative z-10 pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_IMAGE}
            alt="Gallery"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="font-ui text-xs tracking-[0.4em] text-gold/60 uppercase">Наша історія</span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-cream font-bold mt-3 mb-4">
              Про ArtVault
            </h1>
            <div className="ornament-divider max-w-md mx-auto">
              <Sparkles size={14} className="text-gold/60" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <p className="font-body text-lg text-cream/70 leading-relaxed text-center mb-8">
              ArtVault — це ексклюзивна онлайн-галерея, де кожен твір мистецтва розповідає свою унікальну історію.
              Ми ретельно відбираємо шедеври від Ренесансу до сучасності, щоб подарувати вам незабутні враження
              від зустрічі з прекрасним.
            </p>
            <p className="font-body text-lg text-cream/70 leading-relaxed text-center">
              Наша місія — зробити великі твори мистецтва доступними для кожного поціновувача краси,
              незалежно від того, де він знаходиться. Ми віримо, що мистецтво здатне змінювати світ,
              надихати та об'єднувати людей.
            </p>
          </motion.div>
        </div>
      </section>


      <section className="relative z-10 py-16 md:py-24 bg-[oklch(0.07_0.003_285)]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="font-ui text-xs tracking-[0.4em] text-gold/60 uppercase">Філософія</span>
            <h2 className="font-display text-4xl text-cream font-bold mt-3 mb-4">
              Наші цінності
            </h2>
            <div className="ornament-divider max-w-sm mx-auto">
              <Sparkles size={14} className="text-gold/60" />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {values.map((val, i) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="p-8 border border-gold/15 bg-[oklch(0.1_0.005_285_/_50%)] text-center group hover:border-gold/30 transition-all duration-500"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 mx-auto mb-6 border border-gold/30 flex items-center justify-center group-hover:border-gold/60 transition-colors duration-500"
                >
                  <val.icon size={24} className="text-gold/70 group-hover:text-gold transition-colors duration-500" />
                </motion.div>
                <h3 className="font-display text-xl text-cream font-semibold mb-3 group-hover:text-gold transition-colors duration-500">
                  {val.title}
                </h3>
                <p className="font-body text-sm text-cream/50 leading-relaxed">
                  {val.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      <section className="relative z-10 py-16 md:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="font-ui text-xs tracking-[0.4em] text-gold/60 uppercase">Зв'язок</span>
            <h2 className="font-display text-4xl text-cream font-bold mt-3 mb-4">
              Контакти
            </h2>
            <div className="ornament-divider max-w-sm mx-auto">
              <Sparkles size={14} className="text-gold/60" />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {[
              { icon: MapPin, label: "Адреса", value: "Київ, вул. Хрещатик, 1" },
              { icon: Mail, label: "Email", value: "info@artvault.gallery" },
              { icon: Phone, label: "Телефон", value: "+380 44 123 4567" },
              { icon: Clock, label: "Графік", value: "Пн-Нд: 10:00 - 20:00" },
            ].map((contact, i) => (
              <motion.div
                key={contact.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 border border-gold/10 bg-[oklch(0.12_0.005_285)] text-center"
              >
                <contact.icon size={20} className="text-gold/60 mx-auto mb-3" />
                <span className="font-ui text-[10px] tracking-[0.2em] text-cream/40 uppercase block mb-1">
                  {contact.label}
                </span>
                <span className="font-ui text-sm text-cream/80">{contact.value}</span>
              </motion.div>
            ))}
          </div>


          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto mt-12 sm:mt-16 p-6 sm:p-8 border border-gold/15 bg-[oklch(0.1_0.005_285)]"
          >
            <h3 className="font-display text-2xl text-cream font-semibold text-center mb-8">
              Напишіть нам
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast("Повідомлення надіслано! Ми зв'яжемося з вами найближчим часом.");
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Ваше ім'я"
                  required
                  className="w-full px-4 py-3 bg-[oklch(0.14_0.005_285)] border border-gold/15 text-cream font-ui text-sm placeholder:text-cream/30 focus:outline-none focus:border-gold/40 transition-colors"
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  className="w-full px-4 py-3 bg-[oklch(0.14_0.005_285)] border border-gold/15 text-cream font-ui text-sm placeholder:text-cream/30 focus:outline-none focus:border-gold/40 transition-colors"
                />
              </div>
              <input
                type="text"
                placeholder="Тема"
                className="w-full px-4 py-3 bg-[oklch(0.14_0.005_285)] border border-gold/15 text-cream font-ui text-sm placeholder:text-cream/30 focus:outline-none focus:border-gold/40 transition-colors"
              />
              <textarea
                placeholder="Ваше повідомлення..."
                rows={5}
                required
                className="w-full px-4 py-3 bg-[oklch(0.14_0.005_285)] border border-gold/15 text-cream font-ui text-sm placeholder:text-cream/30 focus:outline-none focus:border-gold/40 transition-colors resize-none"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, boxShadow: "0 0 25px oklch(0.75 0.12 85 / 20%)" }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 bg-gold text-background font-ui text-sm tracking-[0.2em] uppercase font-medium"
              >
                Надіслати
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      <MegaFooter />
    </div>
    </PageTransition>
  );
}
