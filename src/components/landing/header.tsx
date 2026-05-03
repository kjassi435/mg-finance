'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { IndianRupee, Phone, Menu, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'

export function Header() {
  const { user, currentPage, navigate, logout } = useAppStore()
  const [open, setOpen] = useState(false)

  const navItems = [
    { label: 'Home', page: 'landing' as const },
    { label: 'EMI Calculator', page: 'emi-calculator' as const },
  ]

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Gold accent line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

      {/* Main header */}
      <div className="bg-white/95 backdrop-blur-md shadow-lg shadow-slate-900/5 supports-[backdrop-filter]:bg-white/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <button
            onClick={() => navigate('landing')}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 text-white shadow-md shadow-blue-700/20">
              <IndianRupee className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-900 leading-tight">
                MG Finance Services
              </span>
              <span className="h-[2px] w-0 group-hover:w-full bg-amber-500 transition-all duration-300 rounded-full" />
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {user && currentPage === 'landing' && (
              <>
                {navItems.map((item) => (
                  <button
                    key={item.page}
                    onClick={() => navigate(item.page)}
                    className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:+917895407790"
              className="flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>+91 78954 07790</span>
            </a>
            <Separator orientation="vertical" className="h-6 bg-slate-200" />
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">
                  {user.role === 'ADMIN' ? '👨‍💼 Admin' : `👋 ${user.name}`}
                </span>
                {user.role === 'ADMIN' ? (
                  <Button
                    onClick={() => navigate('admin')}
                    variant="outline"
                    size="sm"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50 bg-white"
                  >
                    Dashboard
                  </Button>
                ) : (
                  <Button
                    onClick={() => navigate('dashboard')}
                    variant="outline"
                    size="sm"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50 bg-white"
                  >
                    My Dashboard
                  </Button>
                )}
                <Button
                  onClick={logout}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
                <a
                  href="https://wa.me/917895407790"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center w-8 h-8 bg-[#25D366] hover:bg-[#1ebe57] text-white rounded-full transition-colors shadow-md shadow-green-500/20 ml-1"
                  title="Chat on WhatsApp"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => navigate('login')}
                  variant="outline"
                  size="sm"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50 bg-white"
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate('signup')}
                  size="sm"
                  className="bg-blue-700 hover:bg-blue-800 text-white shadow-md shadow-blue-700/20"
                >
                  Sign Up
                </Button>
                <a
                  href="https://wa.me/917895407790"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center w-8 h-8 bg-[#25D366] hover:bg-[#1ebe57] text-white rounded-full transition-colors shadow-md shadow-green-500/20 ml-1"
                  title="Chat on WhatsApp"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                </a>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-slate-700">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-blue-950 border-blue-900">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col gap-4 pt-6">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700 text-white">
                    <IndianRupee className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white">MG Finance Services</span>
                    <div className="h-[1.5px] w-12 bg-amber-500 rounded-full mt-0.5" />
                  </div>
                </div>
                <Separator className="bg-blue-800" />
                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <Button
                      key={item.page}
                      variant="ghost"
                      className="justify-start text-blue-100 hover:text-white hover:bg-blue-900/50"
                      onClick={() => {
                        navigate(item.page)
                        setOpen(false)
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </nav>
                <Separator className="bg-blue-800" />
                <a
                  href="tel:+917895407790"
                  className="flex items-center gap-2 text-sm text-amber-400 px-3 py-2 font-medium"
                >
                  <Phone className="h-4 w-4" />
                  +91 78954 07790
                </a>
                <Separator className="bg-blue-800" />
                {user ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-blue-200 px-3">
                      👋 {user.name} ({user.role})
                    </p>
                    <Button
                      onClick={() => {
                        navigate(user.role === 'ADMIN' ? 'admin' : 'dashboard')
                        setOpen(false)
                      }}
                      className="bg-blue-700 hover:bg-blue-800 text-white justify-start"
                    >
                      {user.role === 'ADMIN' ? 'Admin Dashboard' : 'My Dashboard'}
                    </Button>
                    <Button
                      onClick={() => {
                        logout()
                        setOpen(false)
                      }}
                      variant="outline"
                      className="border-red-500/30 text-red-400 hover:bg-red-950/30 justify-start"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => {
                        navigate('login')
                        setOpen(false)
                      }}
                      variant="outline"
                      className="border-blue-700 text-blue-300 hover:bg-blue-900/50"
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => {
                        navigate('signup')
                        setOpen(false)
                      }}
                      className="bg-blue-700 hover:bg-blue-800 text-white"
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
