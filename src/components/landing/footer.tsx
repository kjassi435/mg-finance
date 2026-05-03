'use client'

import { IndianRupee, Phone, Mail, MapPin, PhoneCall } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 text-white shadow-lg shadow-blue-700/20">
                <IndianRupee className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">MG Finance</span>
                <div className="h-[1.5px] w-10 bg-amber-500 rounded-full mt-0.5" />
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              MG Financial Services — Your trusted partner for all loan needs in Dehradun,
              Uttarakhand. We help you achieve your financial goals with ease.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
              <span>
                Tariyal Complex, Bhaniyawala,
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
                  <span className="hover:text-amber-400 transition-colors cursor-pointer">
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
                  <span className="hover:text-amber-400 transition-colors cursor-pointer">
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
                href="tel:+917895407790"
                className="flex items-center gap-2 hover:text-amber-400 transition-colors"
              >
                <Phone className="h-4 w-4 text-amber-400 shrink-0" />
                +91 78954 07790
              </a>
              <a
                href="mailto:mgfinancialservices69@gmail.com"
                className="flex items-center gap-2 hover:text-amber-400 transition-colors"
              >
                <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="truncate">mgfinancialservices69@gmail.com</span>
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Dehradun, Uttarakhand</span>
              </div>
            </div>

            {/* Missed Call */}
            <div className="mt-5 p-4 bg-amber-900/20 rounded-xl border border-amber-600/30">
              <div className="flex items-center gap-2 mb-2">
                <PhoneCall className="h-5 w-5 text-amber-400" />
                <p className="font-semibold text-white text-sm">
                  Give a Missed Call for Callback
                </p>
              </div>
              <a
                href="tel:+917895407790"
                className="text-lg font-bold text-amber-400 hover:text-amber-300 transition-colors"
              >
                📞 +91 78954 07790
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-slate-800" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} MG Financial Services. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-amber-400 transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-amber-400 transition-colors cursor-pointer">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
