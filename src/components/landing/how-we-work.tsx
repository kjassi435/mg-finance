'use client'

import { motion } from 'framer-motion'
import { HandMetal, FileText, Upload, BadgeCheck } from 'lucide-react'

const steps = [
  {
    number: '01',
    title: 'Choose Loan Type',
    titleHindi: 'लोन का प्रकार चुनें',
    description: 'Select from our range of loan products — Mudra, Business, Car, Home, or Gold Loan.',
    icon: HandMetal,
    color: 'bg-blue-100 text-blue-700',
  },
  {
    number: '02',
    title: 'Fill Application',
    titleHindi: 'आवेदन भरें',
    description: 'Complete our simple application form with your personal and loan details.',
    icon: FileText,
    color: 'bg-red-100 text-red-700',
  },
  {
    number: '03',
    title: 'Upload Documents',
    titleHindi: 'दस्तावेज़ अपलोड करें',
    description: 'Upload Aadhaar, PAN, and other required documents securely.',
    icon: Upload,
    color: 'bg-amber-100 text-amber-700',
  },
  {
    number: '04',
    title: 'Get Approval',
    titleHindi: 'अनुमोदन प्राप्त करें',
    description: 'Get your loan approved quickly and receive funds directly to your bank account.',
    icon: BadgeCheck,
    color: 'bg-blue-100 text-blue-700',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

export function HowWeWork() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 text-xs font-bold tracking-wide text-red-700 bg-red-100 rounded-full mb-3 uppercase">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            कैसे काम करता है?
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Get your loan in 4 simple steps. It&apos;s fast, easy, and hassle-free.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto"
        >
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div key={step.number} variants={itemVariants} className="relative">
                {/* Connector Line (desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[calc(100%-20%)] h-0.5 bg-gradient-to-r from-blue-300 to-red-300" />
                )}

                <div className="flex flex-col items-center text-center">
                  {/* Number + Icon */}
                  <div className="relative mb-5">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${step.color} shadow-md`}>
                      <Icon className="h-9 w-9" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center shadow-lg shadow-blue-700/30">
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="font-bold text-slate-900 text-lg mb-1">{step.title}</h3>
                  <p className="text-xs text-blue-700 font-medium mb-2">{step.titleHindi}</p>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
