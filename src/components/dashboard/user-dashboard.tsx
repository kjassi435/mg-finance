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
  Calculator,
  Phone,
  Headphones,
  Lightbulb,
  MapPin,
  Mail,
  Clock3,
  CreditCard,
  Banknote,
  ShieldCheck,
  FileCheck,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

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
  paymentStatus: string | null
  paymentOrderId: string | null
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

const loanTips = [
  {
    icon: ShieldCheck,
    title: 'Keep your CIBIL score above 700',
    description: 'A higher credit score increases your chances of loan approval and helps you get better interest rates.',
  },
  {
    icon: FileCheck,
    title: 'Have all documents ready before applying',
    description: 'Keep your Aadhaar, PAN, income proof, and bank statements handy to speed up the application process.',
  },
  {
    icon: TrendingUp,
    title: 'Compare loan offers from multiple lenders',
    description: 'Don\'t settle for the first offer. Compare interest rates, processing fees, and tenure options.',
  },
  {
    icon: Banknote,
    title: 'Choose a comfortable EMI amount',
    description: 'Your total EMI payments should not exceed 40-50% of your monthly income for financial stability.',
  },
]

export function UserDashboard() {
  const { user, navigate } = useAppStore()
  const { toast } = useToast()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [payingFeeId, setPayingFeeId] = useState<string | null>(null)
  const [supportOpen, setSupportOpen] = useState(false)

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

  const handlePayFee = async (app: Application) => {
    if (!user) return
    setPayingFeeId(app.id)
    try {
      const res = await fetch(`/api/applications/${app.id}/pay-fee`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })
      const data = await res.json()
      if (res.ok) {
        toast({
          title: 'Payment Successful',
          description: `Processing fee of ₹499 for application ${app.applicationId} has been paid.`,
        })
        setApplications((prev) =>
          prev.map((a) => (a.id === app.id ? { ...data.application } : a))
        )
      } else {
        toast({
          title: 'Payment Failed',
          description: data.error || 'Could not process the payment. Please try again.',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Payment Failed',
        description: 'Network error. Please check your connection and try again.',
        variant: 'destructive',
      })
    } finally {
      setPayingFeeId(null)
    }
  }

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === 'PENDING').length,
    approved: applications.filter((a) => a.status === 'APPROVED').length,
    rejected: applications.filter((a) => a.status === 'REJECTED').length,
    totalFeesPaid: applications.filter((a) => a.processingFeePaid).length * 499,
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
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
            className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            Apply for New Loan
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Applications', value: stats.total, icon: FileText, color: 'bg-gray-100 text-gray-700' },
            { label: 'Pending', value: stats.pending, icon: Clock, color: 'bg-amber-100 text-amber-700' },
            { label: 'Approved', value: stats.approved, icon: CheckCircle2, color: 'bg-green-100 text-green-700' },
            { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'bg-red-100 text-red-700' },
            { label: 'Total Fees Paid', value: formatCurrency(stats.totalFeesPaid), icon: CreditCard, color: 'bg-[#fef3c7] text-[#92400e]' },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg md:text-2xl font-bold text-gray-900 truncate">{stat.value}</p>
                    <p className="text-xs text-gray-500 truncate">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions Section */}
        <Card className="border-gray-100 shadow-sm mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-gray-900">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <button
                onClick={() => navigate('apply')}
                className="group flex flex-col items-center gap-3 p-4 md:p-6 rounded-xl border border-gray-100 bg-white hover:border-[#1d4ed8] hover:bg-blue-50/50 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-[#1d4ed8]/10 flex items-center justify-center group-hover:bg-[#1d4ed8]/20 transition-colors">
                  <Plus className="h-6 w-6 text-[#1d4ed8]" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-800 text-sm">Apply for New Loan</p>
                  <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">Start a new application</p>
                </div>
              </button>

              <button
                onClick={() => navigate('emi-calculator')}
                className="group flex flex-col items-center gap-3 p-4 md:p-6 rounded-xl border border-gray-100 bg-white hover:border-[#f59e0b] hover:bg-amber-50/50 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-[#f59e0b]/10 flex items-center justify-center group-hover:bg-[#f59e0b]/20 transition-colors">
                  <Calculator className="h-6 w-6 text-[#f59e0b]" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-800 text-sm">Calculate EMI</p>
                  <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">Plan your repayments</p>
                </div>
              </button>

              <button
                onClick={() => setSupportOpen(true)}
                className="group flex flex-col items-center gap-3 p-4 md:p-6 rounded-xl border border-gray-100 bg-white hover:border-green-300 hover:bg-green-50/50 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Phone className="h-6 w-6 text-green-700" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-800 text-sm">Contact Support</p>
                  <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">+91 78954 07790</p>
                </div>
              </button>

              <button
                onClick={() => setSupportOpen(true)}
                className="group flex flex-col items-center gap-3 p-4 md:p-6 rounded-xl border border-gray-100 bg-white hover:border-purple-300 hover:bg-purple-50/50 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Headphones className="h-6 w-6 text-purple-700" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-800 text-sm">Help Center</p>
                  <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">FAQs & assistance</p>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <Card className="border-gray-100 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">My Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-[#1d4ed8]" />
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
                  className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white"
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
                    className="border border-gray-100 rounded-xl overflow-hidden hover:border-[#1d4ed8]/30 transition-colors"
                  >
                    {/* Summary Row */}
                    <button
                      onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50/80 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-w-0">
                        <div className="min-w-0">
                          <p className="font-bold text-[#1d4ed8] text-sm">{app.applicationId}</p>
                          <p className="text-xs text-gray-400">{formatDate(app.createdAt)}</p>
                        </div>
                        <div className="hidden sm:block h-8 w-px bg-gray-200" />
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 text-sm">{app.loanType}</p>
                          <p className="text-xs text-gray-400">{app.tenure} months</p>
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 text-sm">{formatCurrency(app.loanAmount)}</p>
                          <p className="text-xs text-gray-400">{app.interestRate}% p.a.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-2">
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
                            <p>Monthly EMI: <strong className="text-[#1d4ed8]">{app.monthlyEmi ? formatCurrency(app.monthlyEmi) : 'N/A'}</strong></p>
                          </div>
                        </div>

                        {app.rejectionReason && (
                          <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
                            <p className="text-xs font-semibold text-red-700 mb-1">Rejection Reason:</p>
                            <p className="text-sm text-red-600">{app.rejectionReason}</p>
                          </div>
                        )}

                        {!app.processingFeePaid && (app.status === 'PENDING' || app.status === 'UNDER_REVIEW') && (
                          <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-amber-800">
                                  Processing Fee Pending
                                </p>
                                <p className="text-xs text-amber-600 mt-0.5">
                                  Pay the processing fee to proceed with your application review.
                                </p>
                              </div>
                              <Button
                                onClick={() => handlePayFee(app)}
                                disabled={payingFeeId === app.id}
                                className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white shrink-0 w-full sm:w-auto"
                              >
                                {payingFeeId === app.id ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <IndianRupee className="h-4 w-4 mr-2" />
                                    Pay ₹499 Fee
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        )}

                        {app.processingFeePaid && (
                          <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100">
                            <p className="text-xs font-semibold text-green-700 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Processing fee of ₹499 has been paid
                              {app.paymentStatus && (
                                <span className="ml-1 text-green-600 font-normal">
                                  (Status: {app.paymentStatus})
                                </span>
                              )}
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

        {/* Loan Tips & Help Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Loan Tips */}
          <Card className="border-gray-100 shadow-sm lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-[#f59e0b]" />
                Loan Tips & Advice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {loanTips.map((tip) => {
                  const Icon = tip.icon
                  return (
                    <div
                      key={tip.title}
                      className="p-4 rounded-xl border border-gray-100 bg-gradient-to-br from-white to-amber-50/30 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className="h-4 w-4 text-[#f59e0b]" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 text-sm">{tip.title}</p>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{tip.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Help & Support Panel */}
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                <Headphones className="h-5 w-5 text-[#1d4ed8]" />
                Help & Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Phone */}
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                    <Phone className="h-4 w-4 text-green-700" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase">Phone</p>
                    <a
                      href="tel:+917895407790"
                      className="text-sm font-semibold text-[#1d4ed8] hover:underline"
                    >
                      +91 78954 07790
                    </a>
                  </div>
                </div>

                <Separator className="bg-gray-100" />

                {/* Email */}
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-[#1d4ed8]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase">Email</p>
                    <a
                      href="mailto:info@mgfinance.com"
                      className="text-sm font-semibold text-[#1d4ed8] hover:underline break-all"
                    >
                      info@mgfinance.com
                    </a>
                  </div>
                </div>

                <Separator className="bg-gray-100" />

                {/* Address */}
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4 text-purple-700" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase">Office Address</p>
                    <p className="text-sm text-gray-700">
                      Tarayal Complex, Baniyawala,<br />
                      Dehradun, Uttarakhand
                    </p>
                  </div>
                </div>

                <Separator className="bg-gray-100" />

                {/* Working Hours */}
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                    <Clock3 className="h-4 w-4 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase">Working Hours</p>
                    <p className="text-sm text-gray-700">Mon - Sat</p>
                    <p className="text-sm font-semibold text-gray-800">10:00 AM - 6:00 PM</p>
                  </div>
                </div>

                <Button
                  onClick={() => setSupportOpen(true)}
                  variant="outline"
                  className="w-full mt-2 border-[#1d4ed8] text-[#1d4ed8] hover:bg-[#1d4ed8] hover:text-white transition-colors"
                >
                  <Headphones className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support Contact Dialog */}
        <Dialog open={supportOpen} onOpenChange={setSupportOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-[#1d4ed8]">
                <Headphones className="h-5 w-5" />
                Contact Support
              </DialogTitle>
              <DialogDescription>
                Reach out to us through any of the following channels. We&apos;re here to help!
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              {/* Phone */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-green-50 border border-green-100">
                <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-green-600 uppercase">Call Us</p>
                  <a
                    href="tel:+917895407790"
                    className="text-lg font-bold text-gray-900 hover:text-[#1d4ed8] transition-colors"
                  >
                    +91 78954 07790
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
                <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-[#1d4ed8]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-blue-600 uppercase">Email Us</p>
                  <a
                    href="mailto:info@mgfinance.com"
                    className="text-base font-bold text-gray-900 hover:text-[#1d4ed8] transition-colors break-all"
                  >
                    info@mgfinance.com
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-purple-50 border border-purple-100">
                <div className="w-11 h-11 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-purple-700" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-purple-600 uppercase">Visit Us</p>
                  <p className="text-sm font-semibold text-gray-900">
                    Tarayal Complex, Baniyawala,<br />
                    Dehradun, Uttarakhand
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-amber-50 border border-amber-100">
                <div className="w-11 h-11 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <Clock3 className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-amber-600 uppercase">Working Hours</p>
                  <p className="text-sm font-semibold text-gray-900">
                    Monday - Saturday<br />
                    10:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
