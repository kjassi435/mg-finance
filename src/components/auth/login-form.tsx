'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Loader2, ArrowLeft, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface LoginData {
  email: string
  password: string
}

export function LoginForm() {
  const { navigate, setUser } = useAppStore()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<LoginData>({
    email: '',
    password: '',
  })
  const [isAdmin, setIsAdmin] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const endpoint = isAdmin ? '/api/auth/admin-login' : '/api/auth/login'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        toast({
          title: 'Login Failed',
          description: data.error || 'Something went wrong',
          variant: 'destructive',
        })
        return
      }

      const userData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.role || data.user.role,
        token: data.token,
      }

      setUser(userData)
      toast({
        title: 'Login Successful! 🎉',
        description: `Welcome back, ${data.user.name}!`,
      })

      // Navigate based on role
      if (userData.role === 'ADMIN') {
        navigate('admin')
      } else {
        navigate('dashboard')
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Network error. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate('landing')}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        <Card className="border-slate-100 shadow-2xl rounded-2xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 mb-3 shadow-sm">
              <ShieldCheck className="h-7 w-7 text-blue-700" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              {isAdmin ? 'Admin Login' : 'Welcome Back'}
            </CardTitle>
            <CardDescription className="text-slate-500">
              {isAdmin
                ? 'Access the admin dashboard'
                : 'Sign in to your MG Finance account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={isAdmin ? 'admin@mgfinance.com' : 'your@email.com'}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  disabled={loading}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  disabled={loading}
                  className="h-11"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl shadow-md shadow-blue-700/20"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Toggle */}
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsAdmin(!isAdmin)}
                className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                {isAdmin
                  ? '← Back to User Login'
                  : 'Admin Login →'}
              </button>
            </div>

            {/* Sign Up Link */}
            {!isAdmin && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-400">or</span>
                  </div>
                </div>
                <p className="text-center text-sm text-slate-500">
                  Don&apos;t have an account?{' '}
                  <button
                    onClick={() => navigate('signup')}
                    className="text-blue-700 hover:text-blue-800 font-semibold transition-colors"
                  >
                    Sign Up
                  </button>
                </p>
              </>
            )}

            {/* Admin Hint */}
            {isAdmin && (
              <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-xs text-amber-700">
                  <strong>Demo:</strong> admin@mgfinance.com / admin123
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
