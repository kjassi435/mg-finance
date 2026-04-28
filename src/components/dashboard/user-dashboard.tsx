'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import {
  Plus,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  IndianRupee,
  Briefcase,
  User,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'

interface Application {
  id: string
  applicationId: string
  loanType: string
  loanAmount: number
  interestRate: number
  tenure: number
  monthlyEmi: number | null
  status: string
  fullName: string
  email: string
  phone: string
  dateOfBirth: string | null
  gender: string | null
  address: string | null
  city: string | null
  state: string | null
  pincode: string | null
  employmentType: string | null
  employerName: string | null
  monthlyIncome: number | null
  workExperience: string | null
  aadhaarNumber: string | null
  panNumber: string | null
  itrFiled: boolean
  processingFeePaid: boolean
  rejectionReason: string | null
  createdAt: string
  updatedAt: string
}

function formatCurrency(num: number): string {
  return `₹${num.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, { bg: string; text: string; label: string }> = {
    PENDING: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' },
    UNDER_REVIEW: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Under Review' },
    APPROVED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
    REJECTED: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
  }
  const v = variants[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${v.bg} ${v.text}`}>
      {v.label}
    </span>
  )
}

export function UserDashboard() {
  const { user, navigate } = useAppStore()
  const { toast } = useToast()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    if (!user) return
    setLoading(true)
    try {
      const res = await fetch('/api/applications', {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      const data = await res.json()
      if (res.ok) {
        setApplications(data.applications || [])
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to load applications', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === 'PENDING').length,
    approved: applications.filter((a) => a.status === 'APPROVED').length,
    rejected: applications.filter((a) => a.status === 'REJECTED').length,
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Welcome back, {user?.name}
            </h1>
            <p className="text-gray-500 mt-1">
              Track your loan applications and manage your account
            </p>
          </div>
          <Button
            onClick={() => navigate('apply')}
            className="bg-blue-700 hover:bg-blue-800 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Apply for New Loan
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Applications', value: stats.total, icon: FileText, color: 'bg-gray-100 text-gray-700' },
            { label: 'Pending', value: stats.pending, icon: Clock, color: 'bg-amber-100 text-amber-700' },
            { label: 'Approved', value: stats.approved, icon: CheckCircle2, color: 'bg-green-100 text-green-700' },
            { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'bg-red-100 text-red-700' },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="border-gray-100">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Applications List */}
        <Card className="border-gray-100">
          <CardHeader>
            <CardTitle className="text-lg">My Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-500">Loading applications...</span>
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No Applications Yet
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  You haven&apos;t applied for any loan yet. Start your loan journey today!
                </p>
                <Button
                  onClick={() => navigate('apply')}
                  className="bg-blue-700 hover:bg-blue-800 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Apply Now
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="border border-gray-100 rounded-xl overflow-hidden hover:border-blue-200 transition-colors"
                  >
                    {/* Summary Row */}
                    <button
                      onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div>
                          <p className="font-bold text-blue-700 text-sm">{app.applicationId}</p>
                          <p className="text-xs text-gray-400">{formatDate(app.createdAt)}</p>
                        </div>
                        <div className="hidden sm:block h-8 w-px bg-gray-200" />
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{app.loanType}</p>
                          <p className="text-xs text-gray-400">{app.tenure} months</p>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{formatCurrency(app.loanAmount)}</p>
                          <p className="text-xs text-gray-400">{app.interestRate}% p.a.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={app.status} />
                        {expandedId === app.id ? (
                          <ChevronUp className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </button>

                    {/* Expanded Details */}
                    {expandedId === app.id && (
                      <div className="border-t border-gray-100 bg-gray-50/50 p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase mb-2 flex items-center gap-1">
                              <User className="h-3 w-3" /> Personal Details
                            </p>
                            <p>Name: <strong>{app.fullName}</strong></p>
                            <p>Email: <strong>{app.email}</strong></p>
                            <p>Phone: <strong>{app.phone}</strong></p>
                            <p>City: <strong>{app.city || 'N/A'}</strong></p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase mb-2 flex items-center gap-1">
                              <Briefcase className="h-3 w-3" /> Employment & Loan
                            </p>
                            <p>Employment: <strong>{app.employmentType || 'N/A'}</strong></p>
                            <p>Employer: <strong>{app.employerName || 'N/A'}</strong></p>
                            <p>Income: <strong>{app.monthlyIncome ? formatCurrency(app.monthlyIncome) : 'N/A'}</strong></p>
                            <p>Monthly EMI: <strong className="text-blue-700">{app.monthlyEmi ? formatCurrency(app.monthlyEmi) : 'N/A'}</strong></p>
                          </div>
                        </div>

                        {app.rejectionReason && (
                          <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
                            <p className="text-xs font-semibold text-red-700 mb-1">Rejection Reason:</p>
                            <p className="text-sm text-red-600">{app.rejectionReason}</p>
                          </div>
                        )}

                        {!app.processingFeePaid && app.status === 'PENDING' && (
                          <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                            <p className="text-xs text-amber-700">
                              <strong>Note:</strong> Processing fee not yet paid. Please contact us to complete the payment.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
