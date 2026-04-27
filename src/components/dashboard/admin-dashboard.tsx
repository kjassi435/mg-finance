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
  user?: {
    id: string
    name: string
    email: string
  }
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
  const map: Record<string, { bg: string; text: string; label: string }> = {
    PENDING: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' },
    UNDER_REVIEW: { bg: 'bg-sky-100', text: 'text-sky-700', label: 'Under Review' },
    APPROVED: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Approved' },
    REJECTED: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
  }
  const v = map[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status }
  return (
    <Badge className={`${v.bg} ${v.text} border-0 font-semibold`}>
      {v.label}
    </Badge>
  )
}

export function AdminDashboard() {
  const { user, logout } = useAppStore()
  const { toast } = useToast()
  const [applications, setApplications] = useState<Application[]>([])
  const [statusCounts, setStatusCounts] = useState({
    total: 0,
    PENDING: 0,
    UNDER_REVIEW: 0,
    APPROVED: 0,
    REJECTED: 0,
  })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 10

  // Dialogs
  const [viewApp, setViewApp] = useState<Application | null>(null)
  const [approveApp, setApproveApp] = useState<Application | null>(null)
  const [rejectApp, setRejectApp] = useState<Application | null>(null)
  const [deleteApp, setDeleteApp] = useState<Application | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const fetchApplications = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
      })
      const res = await fetch(`/api/admin/applications?${params}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      const data = await res.json()
      if (res.ok) {
        setApplications(data.applications || [])
        setStatusCounts(data.statusCounts || { total: 0, PENDING: 0, UNDER_REVIEW: 0, APPROVED: 0, REJECTED: 0 })
        setTotalPages(data.pagination?.totalPages || 1)
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to load applications', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [user, page, search, statusFilter, toast])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  const handleSearch = (val: string) => {
    setSearch(val)
    setPage(1)
  }

  const handleStatusFilter = (val: string) => {
    setStatusFilter(val === 'ALL' ? '' : val)
    setPage(1)
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
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'Action failed', variant: 'destructive' })
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              👨‍💼 Admin Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Manage all loan applications from one place
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={fetchApplications}
              disabled={loading}
              className="border-gray-200"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={logout}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[
            { label: 'Total', value: statusCounts.total, icon: FileText, color: 'bg-gray-100 text-gray-700' },
            { label: 'Pending', value: statusCounts.PENDING, icon: Clock, color: 'bg-amber-100 text-amber-700' },
            { label: 'Under Review', value: statusCounts.UNDER_REVIEW, icon: Search, color: 'bg-sky-100 text-sky-700' },
            { label: 'Approved', value: statusCounts.APPROVED, icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-700' },
            { label: 'Rejected', value: statusCounts.REJECTED, icon: XCircle, color: 'bg-red-100 text-red-700' },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="border-gray-100">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500 truncate">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Filters */}
        <Card className="border-gray-100 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, application ID, or email..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
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

        {/* Applications Table */}
        <Card className="border-gray-100">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                <span className="ml-2 text-gray-500">Loading applications...</span>
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-600">No Applications Found</h3>
                <p className="text-sm text-gray-400">
                  {search || statusFilter ? 'Try adjusting your filters.' : 'No applications have been submitted yet.'}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/50">
                        <TableHead className="font-semibold text-xs">Application ID</TableHead>
                        <TableHead className="font-semibold text-xs">Applicant</TableHead>
                        <TableHead className="font-semibold text-xs">Loan Type</TableHead>
                        <TableHead className="font-semibold text-xs text-right">Amount</TableHead>
                        <TableHead className="font-semibold text-xs">Status</TableHead>
                        <TableHead className="font-semibold text-xs">Date</TableHead>
                        <TableHead className="font-semibold text-xs text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map((app) => (
                        <TableRow key={app.id} className="hover:bg-gray-50/50">
                          <TableCell className="font-medium text-emerald-700 text-sm">
                            {app.applicationId}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm text-gray-900">{app.fullName}</p>
                              <p className="text-xs text-gray-400">{app.email}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{app.loanType}</TableCell>
                          <TableCell className="text-sm text-right font-medium">
                            {formatCurrency(app.loanAmount)}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={app.status} />
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {formatDate(app.createdAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8">
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
                                  className="text-red-600"
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
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t">
                    <p className="text-sm text-gray-500">
                      Page {page} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
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
      </div>

      {/* View Details Dialog */}
      <Dialog open={!!viewApp} onOpenChange={() => setViewApp(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details — {viewApp?.applicationId}</DialogTitle>
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
                  <div><span className="text-gray-400">Email:</span> <strong>{viewApp.email}</strong></div>
                  <div><span className="text-gray-400">Phone:</span> <strong>{viewApp.phone}</strong></div>
                  <div><span className="text-gray-400">DOB:</span> <strong>{viewApp.dateOfBirth || 'N/A'}</strong></div>
                  <div><span className="text-gray-400">Gender:</span> <strong>{viewApp.gender || 'N/A'}</strong></div>
                </div>
                {viewApp.address && (
                  <p className="text-sm mt-2">
                    <span className="text-gray-400">Address:</span>{' '}
                    <strong>{viewApp.address}, {viewApp.city}, {viewApp.state} - {viewApp.pincode}</strong>
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
                  <div><span className="text-gray-400">Amount:</span> <strong className="text-emerald-700">{formatCurrency(viewApp.loanAmount)}</strong></div>
                  <div><span className="text-gray-400">Interest Rate:</span> <strong>{viewApp.interestRate}%</strong></div>
                  <div><span className="text-gray-400">Tenure:</span> <strong>{viewApp.tenure} months</strong></div>
                  <div><span className="text-gray-400">Monthly EMI:</span> <strong className="text-emerald-700">{viewApp.monthlyEmi ? formatCurrency(viewApp.monthlyEmi) : 'N/A'}</strong></div>
                  <div><span className="text-gray-400">Fee Paid:</span> <strong>{viewApp.processingFeePaid ? '✅ Yes' : '❌ No'}</strong></div>
                </div>
              </div>

              <Separator />

              {/* Employment */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4" /> Employment Details
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-400">Type:</span> <strong>{viewApp.employmentType || 'N/A'}</strong></div>
                  <div><span className="text-gray-400">Employer:</span> <strong>{viewApp.employerName || 'N/A'}</strong></div>
                  <div><span className="text-gray-400">Income:</span> <strong>{viewApp.monthlyIncome ? formatCurrency(viewApp.monthlyIncome) : 'N/A'}</strong></div>
                  <div><span className="text-gray-400">Experience:</span> <strong>{viewApp.workExperience || 'N/A'}</strong></div>
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

      {/* Approve Dialog */}
      <Dialog open={!!approveApp} onOpenChange={() => setApproveApp(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              Approve Application
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to approve application{' '}
              <strong className="text-emerald-700">{approveApp?.applicationId}</strong> for{' '}
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

      {/* Reject Dialog */}
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

      {/* Delete Dialog */}
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
    </div>
  )
}
