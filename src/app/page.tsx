'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { Header } from '@/components/landing/header'
import { Hero } from '@/components/landing/hero'
import { LoanTypes } from '@/components/landing/loan-types'
import { Testimonials } from '@/components/landing/testimonials'
import { HowWeWork } from '@/components/landing/how-we-work'
import { Footer } from '@/components/landing/footer'
import { LoginForm } from '@/components/auth/login-form'
import { SignupForm } from '@/components/auth/signup-form'
import { EMICalculator } from '@/components/emi/emi-calculator'
import { ApplicationForm } from '@/components/apply/application-form'
import { ApplicationSuccess } from '@/components/apply/application-success'
import { UserDashboard } from '@/components/dashboard/user-dashboard'
import { AdminDashboard } from '@/components/dashboard/admin-dashboard'

export default function Home() {
  const { currentPage, isHydrated, hydrate, setUser, user } = useAppStore()

  // Hydrate from localStorage on mount
  useEffect(() => {
    hydrate()
  }, [hydrate])

  // Seed admin on mount and verify token
  useEffect(() => {
    if (!isHydrated) return

    // Seed admin user
    fetch('/api/seed', { method: 'POST' }).catch(() => {})

    // If we have a stored user, verify the token
    if (user?.token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then((res) => {
          if (res.ok) return res.json()
          // Token invalid, clear user
          setUser(null)
          throw new Error('Invalid token')
        })
        .then((data) => {
          if (data.user) {
            setUser({
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              role: data.user.role,
              token: user!.token,
            })
          }
        })
        .catch(() => {
          // Token verification failed, logout
        })
    }
  }, [isHydrated, user?.token, setUser])

  // Show loading while hydrating
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-700 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header - Always visible */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        {currentPage === 'landing' && (
          <>
            <Hero />
            <LoanTypes />
            <Testimonials />
            <HowWeWork />
          </>
        )}
        {currentPage === 'login' && <LoginForm />}
        {currentPage === 'signup' && <SignupForm />}
        {currentPage === 'emi-calculator' && <EMICalculator />}
        {currentPage === 'apply' && <ApplicationForm />}
        {currentPage === 'apply-success' && <ApplicationSuccess />}
        {currentPage === 'dashboard' && <UserDashboard />}
        {currentPage === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer - Only on landing */}
      {currentPage === 'landing' && <Footer />}
    </div>
  )
}
