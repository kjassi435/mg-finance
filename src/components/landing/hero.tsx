'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Calculator, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  const { navigate } = useAppStore()

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-500">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hindi Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-emerald-100 bg-white/15 rounded-full backdrop-blur-sm">
              देहरादून, उत्तराखंड से | Trusted Since 2020
            </span>
          </motion.div>

          {/* Main Headline - Hindi */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tight mb-4"
          >
            लोन | लोन | लोन
          </motion.h1>

          {/* Hindi Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-emerald-50 font-medium mb-3"
          >
            सिबिल स्कोर (CIBIL Score) कम हो या खराब, चिंता छोड़ें...
            <br className="hidden sm:block" />
            सबको मिलेगा लोन!
          </motion.p>

          {/* English Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base sm:text-lg text-emerald-100/80 mb-8 max-w-2xl mx-auto"
          >
            Low CIBIL Score? Bad Credit? Don&apos;t Worry — Everyone Gets a Loan!
            <br />
            <span className="text-sm text-emerald-200/60">
              Quick Processing • Lowest Interest Rates • Minimal Documentation
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              onClick={() => navigate('apply')}
              className="bg-white text-emerald-700 hover:bg-emerald-50 font-bold text-lg px-8 py-6 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Apply Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('emi-calculator')}
              className="border-2 border-white/40 text-white hover:bg-white/15 font-bold text-lg px-8 py-6 h-auto rounded-xl backdrop-blur-sm transition-all"
            >
              <Calculator className="mr-2 h-5 w-5" />
              Calculate EMI
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto"
          >
            {[
              { value: '5000+', label: 'Loans Approved' },
              { value: '98%', label: 'Success Rate' },
              { value: '24hrs', label: 'Avg. Processing' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-xs sm:text-sm text-emerald-200/70 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 80L48 74.7C96 69 192 59 288 53.3C384 48 480 48 576 53.3C672 59 768 69 864 69.3C960 69 1056 59 1152 53.3C1248 48 1344 48 1392 48L1440 48V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0Z"
            fill="var(--background)"
          />
        </svg>
      </div>
    </section>
  )
}
