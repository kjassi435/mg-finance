'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Calculator, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  const { navigate } = useAppStore()

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center bg-slate-950">
      {/* Background Image with Zoom Out Effect */}
      <motion.div
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 25, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-blue-950/80 z-10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 via-transparent to-slate-950/90 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop" 
          alt="MG Finance Services Background" 
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      {/* Golden Light Orbs */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-10 left-[15%] w-72 h-72 bg-amber-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-amber-400/15 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-20 container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Red Accent Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-sm font-bold tracking-wide text-white bg-red-600/90 rounded-full backdrop-blur-sm border border-red-500/50 shadow-lg shadow-red-900/30">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
              MG FINANCIAL SERVICES | देहरादून
            </span>
          </motion.div>

          {/* Main Headline - Hindi */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tight mb-2"
          >
            लोन | लोन | लोन
          </motion.h1>

          {/* Gold underline */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-6 rounded-full"
          />

          {/* Hindi Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg sm:text-xl md:text-2xl text-blue-100 font-medium mb-3"
          >
            सिबिल स्कोर (CIBIL Score) कम हो या खराब, चिंता छोड़ें...
            <br className="hidden sm:block" />
            सबको मिलेगा लोन!
          </motion.p>

          {/* English Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-base sm:text-lg text-blue-200/70 mb-8 max-w-2xl mx-auto"
          >
            Low CIBIL Score? Bad Credit? Don&apos;t Worry — Everyone Gets a Loan!
            <br />
            <span className="text-sm text-amber-300/50">
              Quick Processing • Lowest Interest Rates • Minimal Documentation
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-5 justify-center mt-6"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0px 0px 0px 0px rgba(255,255,255,0.4)",
                  "0px 0px 0px 15px rgba(255,255,255,0)",
                  "0px 0px 0px 0px rgba(255,255,255,0)"
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-2xl"
            >
              <Button
                size="lg"
                onClick={() => navigate('apply')}
                className="bg-white text-blue-900 hover:bg-blue-50 font-bold text-lg px-8 py-6 h-auto rounded-2xl shadow-xl hover:shadow-2xl transition-all border border-white/50 w-full sm:w-auto"
              >
                Apply Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0px 0px 0px 0px rgba(245,158,11,0.4)",
                  "0px 0px 0px 15px rgba(245,158,11,0)",
                  "0px 0px 0px 0px rgba(245,158,11,0)"
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              className="rounded-2xl"
            >
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('emi-calculator')}
                className="border-2 border-amber-500 text-white hover:bg-amber-500/15 font-bold text-lg px-8 py-6 h-auto rounded-2xl backdrop-blur-sm transition-all bg-transparent w-full sm:w-auto"
              >
                <Calculator className="mr-2 h-5 w-5" />
                Calculate EMI
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-12 grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto"
          >
            {[
              { value: '5000+', label: 'Loans Approved' },
              { value: '98%', label: 'Success Rate' },
              { value: '24hrs', label: 'Avg. Processing' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-black text-white">{stat.value}</p>
                <p className="text-xs sm:text-sm text-amber-400/70 mt-1 font-medium">{stat.label}</p>
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
