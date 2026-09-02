import { MapPin, Phone, Mail, Clock } from "lucide-react";
import PageBanner from "../components/PageBanner.jsx";
import ContactForm from "../components/ContactForm.jsx";

const OFFICES = [
  { city: "Lusaka, Zambia", role: "Group Headquarters", address: "Stand No. 1234, Independence Ave" },
  { city: "Johannesburg, South Africa", role: "Regional Financial Services Hub", address: "45 Rivonia Road, Sandton" },
  { city: "Nairobi, Kenya", role: "East Africa Base", address: "12 Riverside Drive, Westlands" },
];

export default function Contact() {
  return (
    <>
      <PageBanner
        eyebrow="Contact Us"
        title="Let's Talk"
        blurb="Whether you're an investor, a partner, or exploring a career with us, our team will route your message to the right people."
      />

      <section className="px-6 lg:px-8 py-16 max-w-7xl mx-auto grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 rounded-sm border border-vh-line bg-vh-forest-card p-6 sm:p-8">
          <h2 className="font-display text-xl text-vh-cream mb-1">Send us a message</h2>
          <p className="text-xs text-vh-cream/50 mb-6">We typically respond within 2 business days.</p>
          <ContactForm />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-sm border border-vh-line bg-vh-forest-card p-6">
            <p className="text-xs tracking-[0.15em] text-vh-gold mb-4">DIRECT CONTACT</p>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="mailto:info@vinkholdings.com" className="flex items-center gap-2 text-vh-cream/80 hover:text-vh-gold transition-colors">
                  <Mail size={15} className="text-vh-gold" /> info@vinkholdings.com
                </a>
              </li>
              <li>
                <a href="mailto:investor.relations@vinkholdings.com" className="flex items-center gap-2 text-vh-cream/80 hover:text-vh-gold transition-colors">
                  <Mail size={15} className="text-vh-gold" /> investor.relations@vinkholdings.com
                </a>
              </li>
              <li>
                <a href="tel:+260971234567" className="flex items-center gap-2 text-vh-cream/80 hover:text-vh-gold transition-colors">
                  <Phone size={15} className="text-vh-gold" /> +260 97 123 4567
                </a>
              </li>
              <li className="flex items-center gap-2 text-vh-cream/80">
                <Clock size={15} className="text-vh-gold" /> Mon–Fri, 08:00–17:00 CAT
              </li>
            </ul>
          </div>

          <div className="rounded-sm border border-vh-line bg-vh-forest-card p-6">
            <p className="text-xs tracking-[0.15em] text-vh-gold mb-4">OUR OFFICES</p>
            <ul className="space-y-4">
              {OFFICES.map((office) => (
                <li key={office.city} className="flex items-start gap-2">
                  <MapPin size={15} className="text-vh-gold mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-vh-cream">{office.city}</p>
                    <p className="text-xs text-vh-cream/50">{office.role}</p>
                    <p className="text-xs text-vh-cream/50">{office.address}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
