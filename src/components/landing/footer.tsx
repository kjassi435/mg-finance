'use client'

import { IndianRupee, Phone, Mail, MapPin, PhoneCall } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <IndianRupee className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-white">MG Finance</span>
            </div>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              MG Financial Services — Your trusted partner for all loan needs in Dehradun,
              Uttarakhand. We help you achieve your financial goals with ease.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>
                Tarayal Complex, Baniyawala,
                <br />
                Dehradun, Uttarakhand
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                'Home',
                'EMI Calculator',
                'Apply for Loan',
                'About Us',
                'Contact Us',
              ].map((link) => (
                <li key={link}>
                  <span className="hover:text-emerald-400 transition-colors cursor-pointer">
                    {link}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Loan Types */}
          <div>
            <h3 className="font-semibold text-white mb-4">Loan Types</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                'Mudra Loan (मुद्रा योजना)',
                'Business Loan',
                'Used Car Loan',
                'Home Loan',
                'Gold Loan',
              ].map((type) => (
                <li key={type}>
                  <span className="hover:text-emerald-400 transition-colors cursor-pointer">
                    {type}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
              >
                <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                +91 98765 43210
              </a>
              <a
                href="mailto:info@mgfinance.com"
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
              >
                <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
                info@mgfinance.com
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Dehradun, Uttarakhand</span>
              </div>
            </div>

            {/* Missed Call */}
            <div className="mt-5 p-4 bg-emerald-900/30 rounded-xl border border-emerald-800/50">
              <div className="flex items-center gap-2 mb-2">
                <PhoneCall className="h-5 w-5 text-emerald-400" />
                <p className="font-semibold text-white text-sm">
                  Give a Missed Call for Callback
                </p>
              </div>
              <a
                href="tel:+919876543210"
                className="text-lg font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                📞 +91 98765 43210
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} MG Financial Services. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-emerald-400 transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-emerald-400 transition-colors cursor-pointer">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
