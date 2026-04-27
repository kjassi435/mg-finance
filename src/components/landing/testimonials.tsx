'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const testimonials = [
  {
    name: 'Rajesh Sharma',
    location: 'Dehradun, Uttarakhand',
    loanType: 'Mudra Loan',
    quote: 'MG Finance ne meri chhoti si dukaan ke liye loan diya. Bahut acha laga jab mera loan turant approve ho gaya. Staff bahut cooperative tha.',
    quoteEn: 'MG Finance gave me a loan for my small shop. It felt great when my loan got approved immediately. The staff was very cooperative.',
    rating: 5,
  },
  {
    name: 'Priya Negi',
    location: 'Dehradun, Uttarakhand',
    loanType: 'Home Loan',
    quote: 'Humara sapna tha apna ghar hona. MG Finance ne is sapne ko sach kiya. Low interest rate aur easy EMI — kya baat hai!',
    quoteEn: 'It was our dream to have our own home. MG Finance made this dream come true. Low interest rate and easy EMI — amazing!',
    rating: 5,
  },
  {
    name: 'Amit Rawat',
    location: 'Dehradun, Uttarakhand',
    loanType: 'Gold Loan',
    quote: 'Emergency mein gold loan liya tha. Jawab mein paisa mil gaya. Thank you MG Finance!',
    quoteEn: 'Took a gold loan in emergency. Got money within hours. Thank you MG Finance!',
    rating: 5,
  },
  {
    name: 'Sunita Devi',
    location: 'Dehradun, Uttarakhand',
    loanType: 'Business Loan',
    quote: 'Meri beauty parlour ko expand karna tha. MG Finance ne aasaan installment par business loan de diya. Ab business double ho gaya hai.',
    quoteEn: 'I wanted to expand my beauty parlour. MG Finance gave me a business loan on easy installments. Now my business has doubled.',
    rating: 4,
  },
]

export function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  const next = useCallback(() => {
    setDirection(1)
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }, [])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next])

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 200 : -200,
      opacity: 0,
    }),
  }

  const t = testimonials[current]

  return (
    <section className="py-16 md:py-24 bg-emerald-50/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100 rounded-full mb-3">
            Customer Stories
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            हमारे ग्राहक क्या कहते हैं
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Real stories from real customers who trusted MG Finance for their financial needs.
          </p>
        </motion.div>

        {/* Testimonial Card */}
        <div className="max-w-3xl mx-auto">
          <Card className="border-emerald-100 shadow-md">
            <CardContent className="p-6 md:p-10">
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                {/* Quote Icon */}
                <Quote className="h-10 w-10 text-emerald-200 mb-4" />

                {/* Hindi Quote */}
                <blockquote className="text-lg md:text-xl font-medium text-gray-800 mb-3 leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* English Translation */}
                <p className="text-sm text-gray-400 italic mb-6">
                  {t.quoteEn}
                </p>

                {/* Rating */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                    />
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-lg font-bold text-emerald-700">
                      {t.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{t.name}</p>
                    <p className="text-sm text-gray-500">
                      {t.location} • {t.loanType}
                    </p>
                  </div>
                </div>
              </motion.div>
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="rounded-full border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1)
                    setCurrent(i)
                  }}
                  className={`h-2.5 rounded-full transition-all ${
                    i === current
                      ? 'w-8 bg-emerald-600'
                      : 'w-2.5 bg-emerald-200 hover:bg-emerald-300'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="rounded-full border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
