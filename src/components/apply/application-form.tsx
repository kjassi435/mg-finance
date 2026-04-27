'use client'

import { useState, useMemo } from 'react'
import { useAppStore } from '@/lib/store'
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  User,
  Banknote,
  Briefcase,
  FileText,
  CheckCircle2,
  CreditCard,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'

const LOAN_TYPES = [
  { value: 'MUDRA', label: 'Mudra Loan (मुद्रा योजना)', minRate: 8, maxRate: 12 },
  { value: 'BUSINESS', label: 'Business Loan', minRate: 10, maxRate: 18 },
  { value: 'USED_CAR', label: 'Used Car Loan', minRate: 12, maxRate: 16 },
  { value: 'HOME', label: 'Home Loan', minRate: 8.5, maxRate: 14 },
  { value: 'GOLD', label: 'Gold Loan', minRate: 10, maxRate: 15 },
]

const STEPS = [
  { title: 'Personal Details', icon: User },
  { title: 'Loan Details', icon: Banknote },
  { title: 'Employment', icon: Briefcase },
  { title: 'Documents', icon: FileText },
  { title: 'Review & Submit', icon: CheckCircle2 },
]

function calculateEMI(principal: number, annualRate: number, tenureMonths: number): number {
  const r = annualRate / 12 / 100
  if (r === 0) return principal / tenureMonths
  const factor = Math.pow(1 + r, tenureMonths)
  const emi = (principal * r * factor) / (factor - 1)
  return Math.round(emi * 100) / 100
}

function formatCurrency(num: number): string {
  return `₹${num.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}

interface FormData {
  // Personal
  fullName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  address: string
  city: string
  state: string
  pincode: string
  // Loan
  loanType: string
  loanAmount: number
  interestRate: number
  tenure: number
  // Employment
  employmentType: string
  employerName: string
  monthlyIncome: string
  workExperience: string
  // Documents
  aadhaarNumber: string
  panNumber: string
  itrFiled: boolean
  documents: string[]
}

export function ApplicationForm() {
  const { user, navigate, selectedLoanType, setSelectedLoanType, setApplicationId } = useAppStore()
  const { toast } = useToast()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [feePaid, setFeePaid] = useState(false)

  const [form, setForm] = useState<FormData>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: 'Dehradun',
    state: 'Uttarakhand',
    pincode: '',
    loanType: selectedLoanType || '',
    loanAmount: 500000,
    interestRate: 12,
    tenure: 60,
    employmentType: '',
    employerName: '',
    monthlyIncome: '',
    workExperience: '',
    aadhaarNumber: '',
    panNumber: '',
    itrFiled: false,
    documents: [],
  })

  const updateField = (field: keyof FormData, value: string | number | boolean | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const emi = useMemo(
    () => calculateEMI(form.loanAmount, form.interestRate, form.tenure),
    [form.loanAmount, form.interestRate, form.tenure]
  )

  const progress = ((step + 1) / STEPS.length) * 100

  const validateStep = (): boolean => {
    switch (step) {
      case 0:
        if (!form.fullName || !form.email || !form.phone) {
          toast({ title: 'Required', description: 'Name, email, and phone are required.', variant: 'destructive' })
          return false
        }
        break
      case 1:
        if (!form.loanType || form.loanAmount <= 0) {
          toast({ title: 'Required', description: 'Loan type and amount are required.', variant: 'destructive' })
          return false
        }
        break
      case 2:
        if (!form.employmentType) {
          toast({ title: 'Required', description: 'Employment type is required.', variant: 'destructive' })
          return false
        }
        break
      case 3:
        if (!form.aadhaarNumber || !form.panNumber) {
          toast({ title: 'Required', description: 'Aadhaar and PAN numbers are required.', variant: 'destructive' })
          return false
        }
        break
    }
    return true
  }

  const handleNext = () => {
    if (validateStep()) {
      setStep((s) => Math.min(s + 1, STEPS.length - 1))
    }
  }

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 0))
  }

  const handleLoanTypeChange = (value: string) => {
    const lt = LOAN_TYPES.find((l) => l.value === value)
    updateField('loanType', value)
    if (lt) {
      updateField('interestRate', lt.minRate)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const fileNames = Array.from(files).map((f) => f.name)
      setForm((prev) => ({
        ...prev,
        documents: [...prev.documents, ...fileNames],
      }))
    }
  }

  const removeDocument = (index: number) => {
    setForm((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }))
  }

  const handlePayFee = async () => {
    if (!feePaid) {
      setFeePaid(true)
      toast({ title: 'Processing Fee Paid', description: '₹499 processing fee has been paid successfully.' })
    }
  }

  const handleSubmit = async () => {
    if (!feePaid) {
      toast({ title: 'Fee Required', description: 'Please pay the processing fee first.', variant: 'destructive' })
      return
    }

    if (!user) {
      toast({ title: 'Login Required', description: 'Please login to submit an application.', variant: 'destructive' })
      navigate('login')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          loanType: form.loanType,
          loanAmount: form.loanAmount,
          interestRate: form.interestRate,
          tenure: form.tenure,
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          dateOfBirth: form.dateOfBirth || null,
          gender: form.gender || null,
          address: form.address || null,
          city: form.city || null,
          state: form.state || null,
          pincode: form.pincode || null,
          employmentType: form.employmentType || null,
          employerName: form.employerName || null,
          monthlyIncome: form.monthlyIncome ? Number(form.monthlyIncome) : null,
          workExperience: form.workExperience || null,
          aadhaarNumber: form.aadhaarNumber || null,
          panNumber: form.panNumber || null,
          itrFiled: form.itrFiled,
          documentsUploaded: JSON.stringify(form.documents),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast({ title: 'Error', description: data.error || 'Failed to submit application', variant: 'destructive' })
        return
      }

      setApplicationId(data.application.applicationId)
      setSelectedLoanType(null)
      toast({ title: 'Application Submitted! 🎉', description: `Your application ${data.application.applicationId} has been received.` })
      navigate('apply-success')
    } catch {
      toast({ title: 'Error', description: 'Network error. Please try again.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const currentLoanInfo = LOAN_TYPES.find((l) => l.value === form.loanType)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('landing')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Apply for Loan
          </h1>
          <p className="text-gray-500">Complete the form below to apply for your loan</p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              {STEPS.map((s, i) => {
                const Icon = s.icon
                return (
                  <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        i < step
                          ? 'bg-emerald-600 text-white'
                          : i === step
                          ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {i < step ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium hidden sm:block ${
                        i <= step ? 'text-emerald-700' : 'text-gray-400'
                      }`}
                    >
                      {s.title}
                    </span>
                  </div>
                )
              })}
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Content */}
          <Card className="border-gray-100 shadow-sm">
            <CardContent className="p-6 md:p-8">
              {/* Step 1: Personal Details */}
              {step === 0 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={form.fullName}
                        onChange={(e) => updateField('fullName', e.target.value)}
                        placeholder="Enter your full name"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="your@email.com"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        placeholder="+91 98765 43210"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={form.dateOfBirth}
                        onChange={(e) => updateField('dateOfBirth', e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select value={form.gender} onValueChange={(v) => updateField('gender', v)}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={form.address}
                        onChange={(e) => updateField('address', e.target.value)}
                        placeholder="Street address"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={form.city}
                        onChange={(e) => updateField('city', e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={form.state}
                        onChange={(e) => updateField('state', e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        value={form.pincode}
                        onChange={(e) => updateField('pincode', e.target.value)}
                        placeholder="248001"
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Loan Details */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Loan Details</h2>

                  <div className="space-y-2">
                    <Label>Loan Type *</Label>
                    <Select value={form.loanType} onValueChange={handleLoanTypeChange}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select loan type" />
                      </SelectTrigger>
                      <SelectContent>
                        {LOAN_TYPES.map((lt) => (
                          <SelectItem key={lt.value} value={lt.value}>
                            {lt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {currentLoanInfo && (
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                      <p className="text-sm text-emerald-700">
                        <strong>Interest Rate Range:</strong> {currentLoanInfo.minRate}% - {currentLoanInfo.maxRate}% p.a.
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label>Loan Amount (₹) *</Label>
                      <span className="text-sm font-bold text-emerald-700">
                        {formatCurrency(form.loanAmount)}
                      </span>
                    </div>
                    <Slider
                      value={[form.loanAmount]}
                      onValueChange={([val]) => updateField('loanAmount', val)}
                      min={50000}
                      max={10000000}
                      step={25000}
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>₹50K</span>
                      <span>₹1 Crore</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label>Interest Rate (% p.a.)</Label>
                      <span className="text-sm font-bold text-emerald-700">{form.interestRate}%</span>
                    </div>
                    <Slider
                      value={[form.interestRate]}
                      onValueChange={([val]) => updateField('interestRate', val)}
                      min={5}
                      max={25}
                      step={0.5}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label>Tenure (months)</Label>
                      <span className="text-sm font-bold text-emerald-700">
                        {form.tenure} months ({Math.floor(form.tenure / 12)}y {form.tenure % 12}m)
                      </span>
                    </div>
                    <Slider
                      value={[form.tenure]}
                      onValueChange={([val]) => updateField('tenure', val)}
                      min={6}
                      max={360}
                      step={6}
                    />
                  </div>

                  <Separator />

                  <div className="p-4 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl text-white text-center">
                    <p className="text-sm text-emerald-200 mb-1">Your Monthly EMI</p>
                    <p className="text-3xl font-black">{formatCurrency(emi)}</p>
                  </div>
                </div>
              )}

              {/* Step 3: Employment Details */}
              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Employment Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Employment Type *</Label>
                      <Select value={form.employmentType} onValueChange={(v) => updateField('employmentType', v)}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SALARIED">Salaried</SelectItem>
                          <SelectItem value="SELF_EMPLOYED">Self-Employed</SelectItem>
                          <SelectItem value="BUSINESS">Business</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employer">Employer / Company Name</Label>
                      <Input
                        id="employer"
                        value={form.employerName}
                        onChange={(e) => updateField('employerName', e.target.value)}
                        placeholder="Your employer name"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="income">Monthly Income (₹)</Label>
                      <Input
                        id="income"
                        type="number"
                        value={form.monthlyIncome}
                        onChange={(e) => updateField('monthlyIncome', e.target.value)}
                        placeholder="25000"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="experience">Work Experience</Label>
                      <Input
                        id="experience"
                        value={form.workExperience}
                        onChange={(e) => updateField('workExperience', e.target.value)}
                        placeholder="e.g., 3 years"
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Documents */}
              {step === 3 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Documents</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="aadhaar">Aadhaar Number *</Label>
                      <Input
                        id="aadhaar"
                        value={form.aadhaarNumber}
                        onChange={(e) => updateField('aadhaarNumber', e.target.value)}
                        placeholder="XXXX XXXX XXXX"
                        maxLength={14}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pan">PAN Number *</Label>
                      <Input
                        id="pan"
                        value={form.panNumber}
                        onChange={(e) =>
                          updateField('panNumber', e.target.value.toUpperCase())
                        }
                        placeholder="ABCDE1234F"
                        maxLength={10}
                        className="h-11 uppercase"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="itr"
                      checked={form.itrFiled}
                      onCheckedChange={(checked) => updateField('itrFiled', !!checked)}
                    />
                    <Label htmlFor="itr" className="cursor-pointer">
                      I have filed Income Tax Return (ITR)
                    </Label>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>Upload Documents (Optional)</Label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-emerald-300 transition-colors">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">
                          Click to upload files
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          PDF, JPG, PNG up to 5MB each
                        </p>
                      </label>
                    </div>

                    {form.documents.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">
                          Uploaded Files ({form.documents.length}):
                        </p>
                        {form.documents.map((doc, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-2 text-sm">
                              <FileText className="h-4 w-4 text-emerald-600" />
                              {doc}
                            </div>
                            <button
                              onClick={() => removeDocument(i)}
                              className="text-xs text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 5: Review */}
              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Review Your Application
                  </h2>

                  {/* Personal Info */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-gray-400">Name:</span> <strong>{form.fullName}</strong></div>
                      <div><span className="text-gray-400">Email:</span> <strong>{form.email}</strong></div>
                      <div><span className="text-gray-400">Phone:</span> <strong>{form.phone}</strong></div>
                      <div><span className="text-gray-400">DOB:</span> <strong>{form.dateOfBirth || 'N/A'}</strong></div>
                      <div><span className="text-gray-400">Gender:</span> <strong>{form.gender || 'N/A'}</strong></div>
                      <div><span className="text-gray-400">City:</span> <strong>{form.city}</strong></div>
                    </div>
                  </div>

                  <Separator />

                  {/* Loan Info */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                      Loan Details
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-gray-400">Type:</span> <strong>{LOAN_TYPES.find(l => l.value === form.loanType)?.label}</strong></div>
                      <div><span className="text-gray-400">Amount:</span> <strong className="text-emerald-700">{formatCurrency(form.loanAmount)}</strong></div>
                      <div><span className="text-gray-400">Rate:</span> <strong>{form.interestRate}%</strong></div>
                      <div><span className="text-gray-400">Tenure:</span> <strong>{form.tenure} months</strong></div>
                      <div className="col-span-2"><span className="text-gray-400">Monthly EMI:</span> <strong className="text-emerald-700 text-base">{formatCurrency(emi)}</strong></div>
                    </div>
                  </div>

                  <Separator />

                  {/* Employment Info */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                      Employment Details
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-gray-400">Type:</span> <strong>{form.employmentType}</strong></div>
                      <div><span className="text-gray-400">Employer:</span> <strong>{form.employerName || 'N/A'}</strong></div>
                      <div><span className="text-gray-400">Income:</span> <strong>{form.monthlyIncome ? formatCurrency(Number(form.monthlyIncome)) : 'N/A'}</strong></div>
                      <div><span className="text-gray-400">Experience:</span> <strong>{form.workExperience || 'N/A'}</strong></div>
                    </div>
                  </div>

                  <Separator />

                  {/* Documents */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                      Documents
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-gray-400">Aadhaar:</span> <strong>{form.aadhaarNumber}</strong></div>
                      <div><span className="text-gray-400">PAN:</span> <strong>{form.panNumber}</strong></div>
                      <div><span className="text-gray-400">ITR Filed:</span> <strong>{form.itrFiled ? 'Yes' : 'No'}</strong></div>
                      <div><span className="text-gray-400">Docs:</span> <strong>{form.documents.length} file(s)</strong></div>
                    </div>
                  </div>

                  <Separator />

                  {/* Processing Fee */}
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-amber-600" />
                        <div>
                          <p className="font-semibold text-gray-900">Processing Fee</p>
                          <p className="text-xs text-gray-500">One-time non-refundable fee</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">₹499</p>
                        {!feePaid && (
                          <Button
                            size="sm"
                            onClick={handlePayFee}
                            className="bg-amber-500 hover:bg-amber-600 text-white mt-1"
                          >
                            Pay Now
                          </Button>
                        )}
                        {feePaid && (
                          <span className="text-xs text-emerald-600 font-medium">
                            ✅ Paid
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={step === 0 ? () => navigate('landing') : handleBack}
                  disabled={step === 0}
                  className="border-gray-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {step === 0 ? 'Cancel' : 'Back'}
                </Button>

                {step < STEPS.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || !feePaid}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {loading ? 'Submitting...' : 'Submit Application'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
