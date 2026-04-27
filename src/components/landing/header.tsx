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
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <button
          onClick={() => navigate('landing')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <IndianRupee className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-emerald-700">MG Finance</span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {user && currentPage === 'landing' && (
            <>
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => navigate(item.page)}
                  className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
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
            href="tel:+919876543210"
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span className="font-medium">+91 98765 43210</span>
          </a>
          <Separator orientation="vertical" className="h-6" />
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {user.role === 'ADMIN' ? '👨‍💼 Admin' : `👋 ${user.name}`}
              </span>
              {user.role === 'ADMIN' ? (
                <Button
                  onClick={() => navigate('admin')}
                  variant="outline"
                  size="sm"
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  Dashboard
                </Button>
              ) : (
                <Button
                  onClick={() => navigate('dashboard')}
                  variant="outline"
                  size="sm"
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
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
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigate('login')}
                variant="outline"
                size="sm"
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                Login
              </Button>
              <Button
                onClick={() => navigate('signup')}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col gap-4 pt-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                  <IndianRupee className="h-4 w-4" />
                </div>
                <span className="font-bold text-emerald-700">MG Finance</span>
              </div>
              <Separator />
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Button
                    key={item.page}
                    variant="ghost"
                    className="justify-start text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                    onClick={() => {
                      navigate(item.page)
                      setOpen(false)
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </nav>
              <Separator />
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2 text-sm text-gray-600 px-3 py-2"
              >
                <Phone className="h-4 w-4" />
                +91 98765 43210
              </a>
              <Separator />
              {user ? (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-500 px-3">
                    👋 {user.name} ({user.role})
                  </p>
                  <Button
                    onClick={() => {
                      navigate(user.role === 'ADMIN' ? 'admin' : 'dashboard')
                      setOpen(false)
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white justify-start"
                  >
                    {user.role === 'ADMIN' ? 'Admin Dashboard' : 'My Dashboard'}
                  </Button>
                  <Button
                    onClick={() => {
                      logout()
                      setOpen(false)
                    }}
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50 justify-start"
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
                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => {
                      navigate('signup')
                      setOpen(false)
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
