import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, User, Facebook, Instagram } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function ContactSection() {
  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 text-xs font-bold tracking-wide text-blue-700 bg-blue-100 rounded-full mb-3 uppercase">
            Contact Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Get in Touch
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            We are here to help you. Reach out to us for any queries.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Left Side - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <Card className="border-none shadow-xl bg-white h-full">
              <CardContent className="p-8 md:p-10 flex flex-col justify-center h-full">
                <div className="space-y-8">
                  {/* Owner Name */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center shrink-0">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Owner</p>
                      <p className="text-xl font-bold text-slate-900">Mukesh Rawat</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Contact Number</p>
                      <a href="tel:+917895407790" className="text-xl font-bold text-slate-900 hover:text-blue-700 transition-colors">
                        +91 7895407790
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Email Address</p>
                      <a href="mailto:mgfinancialservices69@gmail.com" className="text-lg md:text-xl font-bold text-slate-900 hover:text-blue-700 transition-colors break-all">
                        mgfinancialservices69@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Address Text */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 text-red-700 rounded-full flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Office Address</p>
                      <p className="text-slate-900 font-medium">
                        Tariyal Complex, Hotel Doon,<br />
                        In front of Jayka, Bhaniyawala,<br />
                        Dehradun, Uttarakhand
                      </p>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="pt-6 border-t border-slate-100">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Connect With Us</p>
                    <div className="flex gap-4">
                      {/* WhatsApp Icon Custom SVG since Lucide doesn't have it by default or it's named something else */}
                      <a 
                        href="https://wa.me/917895407790" 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-12 h-12 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-full flex items-center justify-center transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
                        aria-label="WhatsApp"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                        </svg>
                      </a>
                      
                      {/* Facebook Icon */}
                      <a 
                        href="https://facebook.com" 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-12 h-12 bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white rounded-full flex items-center justify-center transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
                        aria-label="Facebook"
                      >
                        <Facebook className="w-6 h-6" />
                      </a>
                      
                      {/* Instagram Icon */}
                      <a 
                        href="https://instagram.com" 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-12 h-12 bg-[#E4405F]/10 text-[#E4405F] hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#bc1888] hover:text-white rounded-full flex items-center justify-center transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
                        aria-label="Instagram"
                      >
                        <Instagram className="w-6 h-6" />
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Side - Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="h-[400px] lg:h-auto min-h-[500px]"
          >
            <Card className="h-full border-none shadow-xl overflow-hidden rounded-2xl relative group">
              <div className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10" />
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13783.334460592784!2d78.1189498110595!3d30.12642861214013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39093a388cc10bd7%3A0x6b4dbfc823053336!2sBhaniyawala%2C%20Uttarakhand!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin&q=Tariyal+Complex,+Hotel+Doon,+Bhaniyawala,+Dehradun,+Uttarakhand"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
              />
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
