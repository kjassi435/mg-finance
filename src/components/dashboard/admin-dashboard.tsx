'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import {
  Search,
  Loader2,
  Eye,
  CheckCircle2,
  XCircle,
  Trash2,
  FileText,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  IndianRupee,
  User,
  Briefcase,
  MapPin,
  CreditCard,
  ShieldCheck,
  Users,
  TrendingUp,
  Wallet,
  BarChart3,
  Phone,
  Mail,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'

// ─────────────────────── Types ───────────────────────

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
  fatherName: string | null
  alternatePhone: string | null
  permanentAddress: string | null
  loanPurpose: string | null
  existingLoan: string | null
  existingLoanDetails: string | null
  existingEmi: string | null
  approxCibilScore: string | null
  bankStatement: boolean
  salarySlip: boolean
  passportPhoto: boolean
  declarationAccepted: boolean
  documentsUploaded: string | null
  user?: {
    id: string
    name: string
    email: string
  }
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string | null
  role: string
  createdAt: string
  _count: {
    applications: number
  }
}

interface CustomerDetail {
  id: string
  name: string
  email: string
  phone: string | null
  role: string
  createdAt: string
  updatedAt: string
  applications: {
    id: string
    applicationId: string
    loanType: string
    loanAmount: number
    interestRate: number
    tenure: number
    status: string
    processingFeePaid: boolean
    paymentStatus: string
    createdAt: string
  }[]
  stats: {
    totalApplications: number
    approvedCount: number
    pendingCount: number
    totalLoanAmount: number
    feesPaid: number
  }
}

// ─────────────────────── Helpers ───────────────────────

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

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    PENDING: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' },
    UNDER_REVIEW: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Under Review' },
    APPROVED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
    REJECTED: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
    COMPLETED: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Completed' },
  }
  const v = map[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status }
  return (
    <Badge className={`${v.bg} ${v.text} border-0 font-semibold text-xs`}>
      {v.label}
    </Badge>
  )
}

// ─────────────────────── Component ───────────────────────

export function AdminDashboard() {
  const { user, logout } = useAppStore()
  const { toast } = useToast()

  // ── Shared analytics state ──
  const [statusCounts, setStatusCounts] = useState({
    total: 0,
    PENDING: 0,
    UNDER_REVIEW: 0,
    APPROVED: 0,
    REJECTED: 0,
  })
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)

  // ── Applications state ──
  const [applications, setApplications] = useState<Application[]>([])
  const [appLoading, setAppLoading] = useState(true)
  const [appSearch, setAppSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [appPage, setAppPage] = useState(1)
  const [appTotalPages, setAppTotalPages] = useState(1)
  const appLimit = 10

  // ── Customers state ──
  const [customers, setCustomers] = useState<Customer[]>([])
  const [custLoading, setCustLoading] = useState(false)
  const [custSearch, setCustSearch] = useState('')
  const [custPage, setCustPage] = useState(1)
  const [custTotalPages, setCustTotalPages] = useState(1)
  const custLimit = 10

  // ── Dialogs: Applications ──
  const [viewApp, setViewApp] = useState<Application | null>(null)
  const [approveApp, setApproveApp] = useState<Application | null>(null)
  const [rejectApp, setRejectApp] = useState<Application | null>(null)
  const [deleteApp, setDeleteApp] = useState<Application | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  // ── Dialogs: Customers ──
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)
  const [customerDetail, setCustomerDetail] = useState<CustomerDetail | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)

  // ── Active tab ──
  const [activeTab, setActiveTab] = useState('applications')

  // ─────────────── Analytics Fetch ───────────────

  const fetchAnalytics = useCallback(async () => {
    if (!user) return
    setAnalyticsLoading(true)
    try {
      const params = new URLSearchParams({
        page: '1',
        limit: '1',
      })
      const res = await fetch(`/api/admin/applications?${params}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      const data = await res.json()
      if (res.ok) {
        setStatusCounts(data.statusCounts || { total: 0, PENDING: 0, UNDER_REVIEW: 0, APPROVED: 0, REJECTED: 0 })
        const approved = data.statusCounts?.APPROVED || 0
        setTotalRevenue(approved * 499)
      }
    } catch {
      // silent
    }
    try {
      const res = await fetch('/api/admin/customers?page=1&limit=1', {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      const data = await res.json()
      if (res.ok) {
        setTotalUsers(data.pagination?.total || 0)
      }
    } catch {
      // silent
    }
    setAnalyticsLoading(false)
  }, [user])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  // ─────────────── Applications Fetch ───────────────

  const fetchApplications = useCallback(async () => {
    if (!user) return
    setAppLoading(true)
    try {
      const params = new URLSearchParams({
        page: appPage.toString(),
        limit: appLimit.toString(),
        ...(appSearch && { search: appSearch }),
        ...(statusFilter && { status: statusFilter }),
      })
      const res = await fetch(`/api/admin/applications?${params}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      const data = await res.json()
      if (res.ok) {
        setApplications(data.applications || [])
        setStatusCounts(data.statusCounts || { total: 0, PENDING: 0, UNDER_REVIEW: 0, APPROVED: 0, REJECTED: 0 })
        setAppTotalPages(data.pagination?.totalPages || 1)
        const approved = data.statusCounts?.APPROVED || 0
        setTotalRevenue(approved * 499)
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to load applications', variant: 'destructive' })
    } finally {
      setAppLoading(false)
    }
  }, [user, appPage, appSearch, statusFilter, toast])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  // ─────────────── Customers Fetch ───────────────

  const fetchCustomers = useCallback(async () => {
    if (!user) return
    setCustLoading(true)
    try {
      const params = new URLSearchParams({
        page: custPage.toString(),
        limit: custLimit.toString(),
        ...(custSearch && { search: custSearch }),
      })
      const res = await fetch(`/api/admin/customers?${params}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      const data = await res.json()
      if (res.ok) {
        setCustomers(data.customers || [])
        setCustTotalPages(data.pagination?.totalPages || 1)
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to load customers', variant: 'destructive' })
    } finally {
      setCustLoading(false)
    }
  }, [user, custPage, custSearch, toast])

  useEffect(() => {
    if (activeTab === 'customers') {
      fetchCustomers()
    }
  }, [activeTab, fetchCustomers])

  // ─────────────── Customer Profile Fetch ───────────────

  const fetchCustomerDetail = async (customerId: string) => {
    if (!user) return
    setProfileLoading(true)
    setProfileDialogOpen(true)
    try {
      const res = await fetch(`/api/admin/customers/${customerId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      const data = await res.json()
      if (res.ok) {
        setCustomerDetail(data.customer)
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' })
        setProfileDialogOpen(false)
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to load customer profile', variant: 'destructive' })
      setProfileDialogOpen(false)
    } finally {
      setProfileLoading(false)
    }
  }

  // ─────────────── Handlers ───────────────

  const handleAppSearch = (val: string) => {
    setAppSearch(val)
    setAppPage(1)
  }

  const handleStatusFilter = (val: string) => {
    setStatusFilter(val === 'ALL' ? '' : val)
    setAppPage(1)
  }

  const handleCustSearch = (val: string) => {
    setCustSearch(val)
    setCustPage(1)
  }

  const handleApprove = async () => {
    if (!approveApp || !user) return
    setActionLoading(true)
    try {
      const res = await fetch(`/api/admin/applications/${approveApp.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status: 'APPROVED' }),
      })
      const data = await res.json()
      if (res.ok) {
        toast({ title: 'Approved', description: `Application ${approveApp.applicationId} has been approved.` })
        setApproveApp(null)
        fetchApplications()
        fetchAnalytics()
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'Action failed', variant: 'destructive' })
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!rejectApp || !user || !rejectReason.trim()) {
      toast({ title: 'Required', description: 'Please enter a rejection reason.', variant: 'destructive' })
      return
    }
    setActionLoading(true)
    try {
      const res = await fetch(`/api/admin/applications/${rejectApp.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status: 'REJECTED', rejectionReason: rejectReason }),
      })
      const data = await res.json()
      if (res.ok) {
        toast({ title: 'Rejected', description: `Application ${rejectApp.applicationId} has been rejected.` })
        setRejectApp(null)
        setRejectReason('')
        fetchApplications()
        fetchAnalytics()
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'Action failed', variant: 'destructive' })
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteApp || !user) return
    setActionLoading(true)
    try {
      const res = await fetch(`/api/admin/applications/${deleteApp.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` },
      })
      const data = await res.json()
      if (res.ok) {
        toast({ title: 'Deleted', description: `Application ${deleteApp.applicationId} has been deleted.` })
        setDeleteApp(null)
        fetchApplications()
        fetchAnalytics()
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'Action failed', variant: 'destructive' })
    } finally {
      setActionLoading(false)
    }
  }

  // ─────────────── Computed Analytics ───────────────

  const conversionRate = statusCounts.total > 0
    ? ((statusCounts.APPROVED / statusCounts.total) * 100).toFixed(1)
    : '0.0'

  // ─────────────── Render ───────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="container mx-auto px-4 py-6 md:py-10 max-w-[1400px]">

        {/* ═══════════ Header ═══════════ */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center shadow-lg shadow-blue-700/20">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-gray-500 text-sm ml-[52px]">
              MG Financial Services — Loan Management Portal
            </p>
          </div>
          <div className="flex gap-2 ml-auto sm:ml-0">
            <Button
              variant="outline"
              onClick={() => {
                fetchAnalytics()
                fetchApplications()
                if (activeTab === 'customers') fetchCustomers()
              }}
              disabled={appLoading}
              className="border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${appLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={logout}
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* ═══════════ Summary Stats ═══════════ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          {[
            {
              label: 'Total Users',
              value: totalUsers,
              icon: Users,
              gradient: 'from-blue-600 to-blue-800',
              shadowColor: 'shadow-blue-600/20',
              bgLight: 'bg-blue-50',
              textColor: 'text-blue-700',
            },
            {
              label: 'Total Applications',
              value: statusCounts.total,
              icon: FileText,
              gradient: 'from-emerald-600 to-emerald-800',
              shadowColor: 'shadow-emerald-600/20',
              bgLight: 'bg-emerald-50',
              textColor: 'text-emerald-700',
            },
            {
              label: 'Total Revenue',
              value: formatCurrency(totalRevenue),
              icon: Wallet,
              gradient: 'from-amber-500 to-amber-700',
              shadowColor: 'shadow-amber-500/20',
              bgLight: 'bg-amber-50',
              textColor: 'text-amber-700',
            },
            {
              label: 'Pending',
              value: statusCounts.PENDING,
              icon: Clock,
              gradient: 'from-orange-500 to-red-600',
              shadowColor: 'shadow-orange-500/20',
              bgLight: 'bg-orange-50',
              textColor: 'text-orange-700',
            },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="border-gray-100/80 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 md:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} ${stat.shadowColor} shadow-lg flex items-center justify-center`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <p className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">{stat.label}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* ═══════════ Analytics Cards ═══════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-8">
          <Card className="border-gray-100/80 shadow-sm bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <CardContent className="p-5 relative">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="h-4 w-4 text-blue-200" />
                <p className="text-sm font-medium text-blue-100">Total Revenue Collected</p>
              </div>
              <p className="text-2xl md:text-3xl font-bold tracking-tight">
                {formatCurrency(totalRevenue)}
              </p>
              <p className="text-xs text-blue-200 mt-1">
                {statusCounts.APPROVED} approved × ₹499 fee
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-100/80 shadow-sm bg-gradient-to-br from-emerald-600 to-emerald-800 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <CardContent className="p-5 relative">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-emerald-200" />
                <p className="text-sm font-medium text-emerald-100">Conversion Rate</p>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-2xl md:text-3xl font-bold tracking-tight">{conversionRate}%</p>
                <span className="text-emerald-200 text-xs font-medium mb-1">
                  {statusCounts.APPROVED}/{statusCounts.total} approved
                </span>
              </div>
              <div className="mt-2 w-full bg-white/20 rounded-full h-1.5">
                <div
                  className="bg-white rounded-full h-1.5 transition-all duration-500"
                  style={{ width: `${Math.min(100, parseFloat(conversionRate))}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-100/80 shadow-sm bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <CardContent className="p-5 relative">
              <div className="flex items-center gap-2 mb-2">
                <IndianRupee className="h-4 w-4 text-amber-200" />
                <p className="text-sm font-medium text-amber-100">Avg. Loan Amount</p>
              </div>
              <p className="text-2xl md:text-3xl font-bold tracking-tight">
                {statusCounts.total > 0
                  ? formatCurrency(applications.reduce((s, a) => s + a.loanAmount, 0) / applications.length || 0)
                  : '₹0'}
              </p>
              <p className="text-xs text-amber-200 mt-1">Across all applications</p>
            </CardContent>
          </Card>
        </div>

        {/* ═══════════ Tabs ═══════════ */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-100 p-1 mb-6 h-auto">
            <TabsTrigger
              value="applications"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2 text-sm font-medium gap-2 rounded-md"
            >
              <FileText className="h-4 w-4" />
              Applications
              {statusCounts.total > 0 && (
                <Badge className="bg-blue-100 text-blue-700 border-0 text-xs h-5 px-1.5 rounded-full">
                  {statusCounts.total}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="customers"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2 text-sm font-medium gap-2 rounded-md"
            >
              <Users className="h-4 w-4" />
              Customers
              {totalUsers > 0 && (
                <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs h-5 px-1.5 rounded-full">
                  {totalUsers}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ═══════════════════════════════════════════ */}
          {/* ═══════════ APPLICATIONS TAB ═══════════ */}
          {/* ═══════════════════════════════════════════ */}
          <TabsContent value="applications">
            {/* Filters */}
            <Card className="border-gray-100/80 shadow-sm mb-4">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by name, application ID, or email..."
                      value={appSearch}
                      onChange={(e) => handleAppSearch(e.target.value)}
                      className="pl-10 h-10"
                    />
                  </div>
                  <Select value={statusFilter || 'ALL'} onValueChange={handleStatusFilter}>
                    <SelectTrigger className="w-full sm:w-44 h-10">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Statuses</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Table */}
            <Card className="border-gray-100/80 shadow-sm">
              <CardContent className="p-0">
                {appLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-500">Loading applications...</span>
                  </div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-16">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-600">No Applications Found</h3>
                    <p className="text-sm text-gray-400">
                      {appSearch || statusFilter ? 'Try adjusting your filters.' : 'No applications have been submitted yet.'}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                            <TableHead className="font-semibold text-xs">Application ID</TableHead>
                            <TableHead className="font-semibold text-xs">Applicant</TableHead>
                            <TableHead className="font-semibold text-xs hidden md:table-cell">Loan Type</TableHead>
                            <TableHead className="font-semibold text-xs text-right">Amount</TableHead>
                            <TableHead className="font-semibold text-xs">Status</TableHead>
                            <TableHead className="font-semibold text-xs hidden sm:table-cell">Date</TableHead>
                            <TableHead className="font-semibold text-xs text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {applications.map((app) => (
                            <TableRow key={app.id} className="hover:bg-blue-50/30 transition-colors">
                              <TableCell className="font-medium text-blue-700 text-sm">
                                {app.applicationId}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium text-sm text-gray-900">{app.fullName}</p>
                                  <p className="text-xs text-gray-400">{app.email}</p>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm hidden md:table-cell">
                                <Badge variant="outline" className="font-normal text-xs">
                                  {app.loanType}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-right font-semibold">
                                {formatCurrency(app.loanAmount)}
                              </TableCell>
                              <TableCell>
                                <StatusBadge status={app.status} />
                              </TableCell>
                              <TableCell className="text-sm text-gray-500 hidden sm:table-cell">
                                {formatDate(app.createdAt)}
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                                      Actions
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setViewApp(app)}>
                                      <Eye className="h-4 w-4 mr-2" /> View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setApproveApp(app)}>
                                      <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-600" />
                                      <span className="text-emerald-600">Approve</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { setRejectApp(app); setRejectReason('') }}>
                                      <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                      <span className="text-red-500">Reject</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => setDeleteApp(app)}
                                      className="text-red-600 focus:text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    {appTotalPages > 1 && (
                      <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50/50">
                        <p className="text-sm text-gray-500">
                          Page {appPage} of {appTotalPages}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setAppPage((p) => Math.max(1, p - 1))}
                            disabled={appPage === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setAppPage((p) => Math.min(appTotalPages, p + 1))}
                            disabled={appPage === appTotalPages}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══════════════════════════════════════════ */}
          {/* ═══════════ CUSTOMERS TAB ═══════════ */}
          {/* ═══════════════════════════════════════════ */}
          <TabsContent value="customers">
            {/* Search */}
            <Card className="border-gray-100/80 shadow-sm mb-4">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, email, or phone..."
                    value={custSearch}
                    onChange={(e) => handleCustSearch(e.target.value)}
                    className="pl-10 h-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Table */}
            <Card className="border-gray-100/80 shadow-sm">
              <CardContent className="p-0">
                {custLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-500">Loading customers...</span>
                  </div>
                ) : customers.length === 0 ? (
                  <div className="text-center py-16">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-600">No Customers Found</h3>
                    <p className="text-sm text-gray-400">
                      {custSearch ? 'Try adjusting your search.' : 'No customers have registered yet.'}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                            <TableHead className="font-semibold text-xs">Customer</TableHead>
                            <TableHead className="font-semibold text-xs hidden sm:table-cell">Email</TableHead>
                            <TableHead className="font-semibold text-xs hidden md:table-cell">Phone</TableHead>
                            <TableHead className="font-semibold text-xs text-center">Apps</TableHead>
                            <TableHead className="font-semibold text-xs hidden sm:table-cell">Joined</TableHead>
                            <TableHead className="font-semibold text-xs text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {customers.map((cust) => (
                            <TableRow key={cust.id} className="hover:bg-blue-50/30 transition-colors">
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-9 w-9 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                                    <AvatarFallback className="text-xs font-bold bg-transparent">
                                      {getInitials(cust.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-sm text-gray-900">{cust.name}</p>
                                    <p className="text-xs text-gray-400 sm:hidden">{cust.email}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-gray-600 hidden sm:table-cell">
                                {cust.email}
                              </TableCell>
                              <TableCell className="text-sm text-gray-600 hidden md:table-cell">
                                {cust.phone || '—'}
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge
                                  variant="outline"
                                  className={`font-semibold text-xs ${
                                    cust._count.applications > 0
                                      ? 'border-blue-200 text-blue-700 bg-blue-50'
                                      : 'border-gray-200 text-gray-400'
                                  }`}
                                >
                                  {cust._count.applications}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-gray-500 hidden sm:table-cell">
                                {formatDate(cust.createdAt)}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 text-xs text-blue-700 hover:text-blue-800 hover:bg-blue-50"
                                  onClick={() => fetchCustomerDetail(cust.id)}
                                >
                                  <Eye className="h-4 w-4 mr-1.5" />
                                  View Profile
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    {custTotalPages > 1 && (
                      <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50/50">
                        <p className="text-sm text-gray-500">
                          Page {custPage} of {custTotalPages}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCustPage((p) => Math.max(1, p - 1))}
                            disabled={custPage === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCustPage((p) => Math.min(custTotalPages, p + 1))}
                            disabled={custPage === custTotalPages}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* ═══════════ DIALOGS ═══════════ */}
      {/* ═══════════════════════════════════════════════════════ */}

      {/* ── View Application Details Dialog ── */}
      <Dialog open={!!viewApp} onOpenChange={() => setViewApp(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">Application Details — {viewApp?.applicationId}</DialogTitle>
            <DialogDescription>Full information about this loan application</DialogDescription>
          </DialogHeader>
          {viewApp && (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <StatusBadge status={viewApp.status} />
                <span className="text-xs text-gray-400">
                  Applied on {formatDate(viewApp.createdAt)}
                </span>
              </div>
              <Separator />

              {/* Personal */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-1.5">
                  <User className="h-4 w-4" /> Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-400">Full Name:</span> <strong>{viewApp.fullName}</strong></div>
                  <div><span className="text-gray-400">Father&apos;s Name:</span> <strong>{viewApp.fatherName || 'N/A'}</strong></div>
                  <div><span className="text-gray-400">Email:</span> <strong>{viewApp.email}</strong></div>
                  <div><span className="text-gray-400">Phone:</span> <strong>{viewApp.phone}</strong></div>
                  <div><span className="text-gray-400">Alternate Phone:</span> <strong>{viewApp.alternatePhone || 'N/A'}</strong></div>
                  <div><span className="text-gray-400">DOB:</span> <strong>{viewApp.dateOfBirth || 'N/A'}</strong></div>
                  <div><span className="text-gray-400">Gender:</span> <strong>{viewApp.gender || 'N/A'}</strong></div>
                </div>
                {viewApp.address && (
                  <p className="text-sm mt-2">
                    <span className="text-gray-400">Current Address:</span>{' '}
                    <strong>{viewApp.address}, {viewApp.city}, {viewApp.state} - {viewApp.pincode}</strong>
                  </p>
                )}
                {viewApp.permanentAddress && (
                  <p className="text-sm mt-1">
                    <span className="text-gray-400">Permanent Address:</span>{' '}
                    <strong>{viewApp.permanentAddress}</strong>
                  </p>
                )}
              </div>
              <Separator />

              {/* Loan Details */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-1.5">
                  <IndianRupee className="h-4 w-4" /> Loan Details
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-400">Loan Type:</span> <strong>{viewApp.loanType}</strong></div>
                  <div><span className="text-gray-400">Amount:</span> <strong className="text-blue-700">{formatCurrency(viewApp.loanAmount)}</strong></div>
                  <div><span className="text-gray-400">Interest Rate:</span> <strong>{viewApp.interestRate}%</strong></div>
                  <div><span className="text-gray-400">Tenure:</span> <strong>{viewApp.tenure} months</strong></div>
                  <div><span className="text-gray-400">Monthly EMI:</span> <strong className="text-blue-700">{viewApp.monthlyEmi ? formatCurrency(viewApp.monthlyEmi) : 'N/A'}</strong></div>
                  <div><span className="text-gray-400">Loan Purpose:</span> <strong>{viewApp.loanPurpose || 'N/A'}</strong></div>
                  <div><span className="text-gray-400">CIBIL Score:</span> <strong>{viewApp.approxCibilScore || 'N/A'}</strong></div>
                  <div><span className="text-gray-400">Fee Paid:</span> <strong>{viewApp.processingFeePaid ? 'Yes' : 'No'}</strong></div>
                </div>
              </div>
              <Separator />

              {/* Employment */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4" /> Employment & Financial Details
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-400">Type:</span> <strong>{viewApp.employmentType || 'N/A'}</strong></div>
                  <div><span className="text-gray-400">Employer:</span> <strong>{viewApp.employerName || 'N/A'}</strong></div>
                  <div><span className="text-gray-400">Income:</span> <strong>{viewApp.monthlyIncome ? formatCurrency(viewApp.monthlyIncome) : 'N/A'}</strong></div>
                  <div><span className="text-gray-400">Experience:</span> <strong>{viewApp.workExperience || 'N/A'}</strong></div>
                  <div><span className="text-gray-400">Existing Loan:</span> <strong>{viewApp.existingLoan || 'N/A'}</strong></div>
                  {viewApp.existingLoan === 'YES' && (
                    <>
                      <div><span className="text-gray-400">Existing EMI:</span> <strong>{viewApp.existingEmi ? `₹${viewApp.existingEmi}` : 'N/A'}</strong></div>
                      {viewApp.existingLoanDetails && (
                        <div className="col-span-2"><span className="text-gray-400">Loan Details:</span> <strong>{viewApp.existingLoanDetails}</strong></div>
                      )}
                    </>
                  )}
                </div>
              </div>
              <Separator />

              {/* Documents */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-1.5">
                  <CreditCard className="h-4 w-4" /> Document Details
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-400">Aadhaar:</span> <strong>{viewApp.aadhaarNumber || 'N/A'}</strong></div>
                  <div><span className="text-gray-400">PAN:</span> <strong>{viewApp.panNumber || 'N/A'}</strong></div>
                  <div><span className="text-gray-400">ITR Filed:</span> <strong>{viewApp.itrFiled ? 'Yes' : 'No'}</strong></div>
                </div>
                <div className="mt-3 text-sm">
                  <span className="text-gray-400 font-medium">Document Checklist: </span>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    <span><strong>Bank Statement:</strong> {viewApp.bankStatement ? 'Yes' : 'No'}</span>
                    <span><strong>Salary Slip:</strong> {viewApp.salarySlip ? 'Yes' : 'No'}</span>
                    <span><strong>Passport Photo:</strong> {viewApp.passportPhoto ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
              <Separator />

              {/* Declaration */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" /> Declaration
                </h3>
                <div className="text-sm">
                  <span className="text-gray-400">Declaration Accepted:</span>{' '}
                  <strong className={viewApp.declarationAccepted ? 'text-green-700' : 'text-red-600'}>
                    {viewApp.declarationAccepted ? 'Yes' : 'No'}
                  </strong>
                </div>
              </div>

              {viewApp.rejectionReason && (
                <>
                  <Separator />
                  <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                    <p className="text-xs font-semibold text-red-700 mb-1">Rejection Reason:</p>
                    <p className="text-sm text-red-600">{viewApp.rejectionReason}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Approve Dialog ── */}
      <Dialog open={!!approveApp} onOpenChange={() => setApproveApp(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              Approve Application
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to approve application{' '}
              <strong className="text-blue-700">{approveApp?.applicationId}</strong> for{' '}
              <strong>{approveApp?.fullName}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setApproveApp(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={actionLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Reject Dialog ── */}
      <Dialog open={!!rejectApp} onOpenChange={() => setRejectApp(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              Reject Application
            </DialogTitle>
            <DialogDescription>
              Reject application <strong className="text-red-600">{rejectApp?.applicationId}</strong> for{' '}
              <strong>{rejectApp?.fullName}</strong>. Please provide a reason.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reject-reason">Rejection Reason *</Label>
            <Textarea
              id="reject-reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              rows={3}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setRejectApp(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={actionLoading || !rejectReason.trim()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Dialog ── */}
      <Dialog open={!!deleteApp} onOpenChange={() => setDeleteApp(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete Application
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to delete application{' '}
              <strong className="text-red-600">{deleteApp?.applicationId}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteApp(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={actionLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Customer Profile Dialog ── */}
      <Dialog open={profileDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setProfileDialogOpen(false)
          setCustomerDetail(null)
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Profile</DialogTitle>
            <DialogDescription>Detailed customer information and application history</DialogDescription>
          </DialogHeader>

          {profileLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-500">Loading profile...</span>
            </div>
          ) : customerDetail ? (
            <div className="space-y-6">
              {/* Customer Info Header */}
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14 bg-gradient-to-br from-blue-600 to-blue-800 text-white shrink-0">
                  <AvatarFallback className="text-lg font-bold bg-transparent">
                    {getInitials(customerDetail.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-bold text-gray-900">{customerDetail.name}</h2>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" /> {customerDetail.email}
                    </span>
                    {customerDetail.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" /> {customerDetail.phone}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" /> Joined {formatDate(customerDetail.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-blue-50 rounded-xl p-3.5 text-center">
                  <p className="text-2xl font-bold text-blue-700">{customerDetail.stats.totalApplications}</p>
                  <p className="text-xs text-blue-600 font-medium mt-0.5">Total Apps</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3.5 text-center">
                  <p className="text-2xl font-bold text-emerald-700">{customerDetail.stats.approvedCount}</p>
                  <p className="text-xs text-emerald-600 font-medium mt-0.5">Approved</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-3.5 text-center">
                  <p className="text-2xl font-bold text-amber-700">{customerDetail.stats.pendingCount}</p>
                  <p className="text-xs text-amber-600 font-medium mt-0.5">Pending</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-3.5 text-center">
                  <p className="text-2xl font-bold text-purple-700">{customerDetail.stats.feesPaid}</p>
                  <p className="text-xs text-purple-600 font-medium mt-0.5">Fees Paid</p>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="bg-gradient-to-br from-blue-700 to-blue-900 text-white border-0">
                  <CardContent className="p-4">
                    <p className="text-xs text-blue-200 font-medium mb-1">Total Loan Amount</p>
                    <p className="text-xl font-bold">{formatCurrency(customerDetail.stats.totalLoanAmount)}</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-amber-500 to-amber-700 text-white border-0">
                  <CardContent className="p-4">
                    <p className="text-xs text-amber-100 font-medium mb-1">Revenue from Customer</p>
                    <p className="text-xl font-bold">{formatCurrency(customerDetail.stats.feesPaid * 499)}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Applications List */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-1.5">
                  <FileText className="h-4 w-4" /> Application History
                  <Badge variant="outline" className="text-xs ml-auto font-normal">
                    {customerDetail.applications.length} total
                  </Badge>
                </h3>
                {customerDetail.applications.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <FileText className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No applications yet</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {customerDetail.applications.map((app) => (
                      <div
                        key={app.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50/50 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0">
                            <IndianRupee className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-blue-700">{app.applicationId}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>{app.loanType}</span>
                              <span className="text-gray-300">•</span>
                              <span className="font-medium text-gray-700">{formatCurrency(app.loanAmount)}</span>
                              <span className="text-gray-300">•</span>
                              <span className={app.processingFeePaid ? 'text-emerald-600' : 'text-gray-400'}>
                                Fee: {app.processingFeePaid ? 'Paid' : 'Unpaid'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 ml-2">
                          <StatusBadge status={app.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
