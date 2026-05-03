'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import {
  Landmark,
  Briefcase,
  Car,
  Home,
  Gem,
  ArrowRight,
  User,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const loanTypes = [
  {
    id: 'PERSONAL',
    name: 'Personal Loan',
    hindiName: 'पर्सनल लोन',
    description: 'Get instant personal loans for your personal needs, medical emergencies, or travel.',
    maxAmount: '₹5 Lakh',
    interestRate: '10% - 24%',
    icon: User,
    color: 'bg-green-100 text-green-700',
  },
  {
    id: 'MUDRA',
    name: 'Mudra Loan',
    hindiName: 'प्रधान मंत्री मुद्रा योजना',
    description: 'Government-backed loan for small businesses and micro enterprises. No collateral needed.',
    maxAmount: '₹10 Lakh',
    interestRate: '8% - 12%',
    icon: Landmark,
    color: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'BUSINESS',
    name: 'Business Loan',
    hindiName: 'व्यापार लोन',
    description: 'Grow your business with our flexible business loans. Quick disbursement.',
    maxAmount: '₹50 Lakh',
    interestRate: '10% - 18%',
    icon: Briefcase,
    color: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'USED_CAR',
    name: 'Used Car Loan',
    hindiName: 'पुरानी गाड़ी लोन',
    description: 'Finance your dream car with our competitive used car loan rates.',
    maxAmount: '₹20 Lakh',
    interestRate: '12% - 16%',
    icon: Car,
    color: 'bg-red-100 text-red-700',
  },
  {
    id: 'HOME',
    name: 'Home Loan',
    hindiName: 'होम लोन',
    description: 'Make your dream home a reality with our affordable home loan solutions.',
    maxAmount: '₹1 Crore',
    interestRate: '8.5% - 14%',
    icon: Home,
    color: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'GOLD',
    name: 'Gold Loan',
    hindiName: 'सोने का लोन',
    description: 'Instant loan against your gold ornaments. Quick processing, minimal documents.',
    maxAmount: '₹25 Lakh',
    interestRate: '10% - 15%',
    icon: Gem,
    color: 'bg-amber-100 text-amber-700',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

export function LoanTypes() {
  const { navigate, setSelectedLoanType } = useAppStore()

  const handleApply = (loanId: string) => {
    setSelectedLoanType(loanId)
    navigate('apply')
  }

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Partners Marquee */}
        <div className="w-full overflow-hidden mb-16 relative py-4">
          <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            <div className="flex gap-12 md:gap-24 items-center px-6 md:px-12">
              {[...Array(12)].map((_, i) => (
                <img 
                  key={`logo-1-${i}`} 
                  src={`/images/partners/logo-${i + 1}.png`} 
                  alt={`Partner ${i + 1}`} 
                  className="h-10 md:h-14 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 drop-shadow-sm" 
                />
              ))}
            </div>
            <div className="flex gap-12 md:gap-24 items-center px-6 md:px-12">
              {[...Array(12)].map((_, i) => (
                <img 
                  key={`logo-2-${i}`} 
                  src={`/images/partners/logo-${i + 1}.png`} 
                  alt={`Partner ${i + 1}`} 
                  className="h-10 md:h-14 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 drop-shadow-sm" 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 text-xs font-bold tracking-wide text-red-700 bg-red-100 rounded-full mb-3 uppercase">
            Our Loan Products
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            हर ज़रूरत के लिए लोन
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Loan for every need — from business expansion to buying your dream home.
            Choose the right loan type for you.
          </p>
        </motion.div>

        {/* Loan Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {loanTypes.map((loan) => {
            const Icon = loan.icon
            return (
              <motion.div key={loan.id} variants={cardVariants}>
                <Card className="group h-full border border-slate-100 hover:border-blue-200 hover:shadow-xl shadow-lg rounded-2xl transition-all duration-300 cursor-pointer bg-white">
                  <CardContent className="p-5 flex flex-col h-full">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${loan.color} shadow-sm`}>
                      <Icon className="h-6 w-6" />
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-slate-900 text-lg mb-1">{loan.name}</h3>
                    <p className="text-xs text-blue-700 font-medium mb-3">{loan.hindiName}</p>

                    {/* Description */}
                    <p className="text-sm text-slate-500 mb-4 flex-grow leading-relaxed">{loan.description}</p>

                    {/* Stats */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Max Amount</span>
                        <span className="font-semibold text-slate-700">{loan.maxAmount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Interest Rate</span>
                        <span className="font-semibold text-blue-700">{loan.interestRate}</span>
                      </div>
                    </div>

                    {/* Apply Button */}
                    <Button
                      onClick={() => handleApply(loan.id)}
                      className="w-full bg-blue-700 hover:bg-blue-800 text-white group-hover:shadow-md transition-all rounded-xl"
                      size="sm"
                    >
                      Apply Now
                      <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
