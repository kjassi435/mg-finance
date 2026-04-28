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
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
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

const DOC_CHECKLIST_ITEMS = [
  { key: 'aadhaarCard', label: 'Aadhaar Card' },
  { key: 'panCard', label: 'PAN Card' },
  { key: 'bankStatement', label: 'Bank Statement (Last 6 Months)' },
  { key: 'salarySlip', label: 'Salary Slip / Income Proof' },
  { key: 'passportPhoto', label: 'Passport Size Photo' },
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
  fatherName: string
  email: string
  phone: string
  alternatePhone: string
  dateOfBirth: string
  gender: string
  address: string
  city: string
  state: string
  pincode: string
  permanentAddress: string
  // Loan
  loanType: string
  loanAmount: number
  interestRate: number
  tenure: number
  loanPurpose: string
  // Employment
  employmentType: string
  employerName: string
  monthlyIncome: string
  workExperience: string
  existingLoan: string
  existingLoanDetails: string
  existingEmi: string
  approxCibilScore: string
  // Documents
  aadhaarNumber: string
  panNumber: string
  itrFiled: boolean
  documents: string[]
  docChecklist: Record<string, boolean>
  // Declarations
  declarationAccepted: boolean
  serviceFeeAccepted: boolean
}

export function ApplicationForm() {
  const { user, navigate, selectedLoanType, setSelectedLoanType, setApplicationId } = useAppStore()
  const { toast } = useToast()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState<FormData>({
    fullName: user?.name || '',
    fatherName: '',
    email: user?.email || '',
    phone: '',
    alternatePhone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: 'Dehradun',
    state: 'Uttarakhand',
    pincode: '',
    permanentAddress: '',
    loanType: selectedLoanType || '',
    loanAmount: 500000,
    interestRate: 12,
    tenure: 60,
    loanPurpose: '',
    employmentType: '',
    employerName: '',
    monthlyIncome: '',
    workExperience: '',
    existingLoan: '',
    existingLoanDetails: '',
    existingEmi: '',
    approxCibilScore: '',
    aadhaarNumber: '',
    panNumber: '',
    itrFiled: false,
    documents: [],
    docChecklist: {},
    declarationAccepted: false,
    serviceFeeAccepted: false,
  })

  const updateField = (field: keyof FormData, value: string | number | boolean | string[] | Record<string, boolean>) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const toggleDocChecklist = (key: string) => {
    setForm((prev) => ({
      ...prev,
      docChecklist: { ...prev.docChecklist, [key]: !prev.docChecklist[key] },
    }))
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

  const handleSubmit = async () => {
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
          fatherName: form.fatherName || null,
          alternatePhone: form.alternatePhone || null,
          permanentAddress: form.permanentAddress || null,
          loanPurpose: form.loanPurpose || null,
          existingLoan: form.existingLoan || null,
          existingLoanDetails: form.existingLoanDetails || null,
          existingEmi: form.existingEmi || null,
          approxCibilScore: form.approxCibilScore || null,
          bankStatement: !!form.docChecklist.bankStatement,
          salarySlip: !!form.docChecklist.salarySlip,
          passportPhoto: !!form.docChecklist.passportPhoto,
          declarationAccepted: form.declarationAccepted,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast({ title: 'Error', description: data.error || 'Failed to submit application', variant: 'destructive' })
        return
      }

      setApplicationId(data.application.applicationId)
      setSelectedLoanType(null)
      toast({ title: 'Application Submitted!', description: `Your application ${data.application.applicationId} has been received.` })
      navigate('apply-success')
    } catch {
      toast({ title: 'Error', description: 'Network error. Please try again.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const currentLoanInfo = LOAN_TYPES.find((l) => l.value === form.loanType)
  const canSubmit = form.declarationAccepted && form.serviceFeeAccepted

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('landing')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors"
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
                          ? 'bg-blue-700 text-white'
                          : i === step
                          ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500'
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
                        i <= step ? 'text-blue-700' : 'text-gray-400'
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
                      <Label htmlFor="fullName" className="text-blue-700">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={form.fullName}
                        onChange={(e) => updateField('fullName', e.target.value)}
                        placeholder="Enter your full name"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="fatherName" className="text-blue-700">Father&apos;s / Husband&apos;s Name</Label>
                      <Input
                        id="fatherName"
                        value={form.fatherName}
                        onChange={(e) => updateField('fatherName', e.target.value)}
                        placeholder="पिता / पति का नाम"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-blue-700">Email *</Label>
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
                      <Label htmlFor="phone" className="text-blue-700">Mobile Number *</Label>
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
                      <Label htmlFor="alternatePhone" className="text-blue-700">Alternate Number</Label>
                      <Input
                        id="alternatePhone"
                        type="tel"
                        value={form.alternatePhone}
                        onChange={(e) => updateField('alternatePhone', e.target.value)}
                        placeholder="+91 98765 00000"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob" className="text-blue-700">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={form.dateOfBirth}
                        onChange={(e) => updateField('dateOfBirth', e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-blue-700">Gender</Label>
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
                      <Label htmlFor="address" className="text-blue-700">Current Address</Label>
                      <Input
                        id="address"
                        value={form.address}
                        onChange={(e) => updateField('address', e.target.value)}
                        placeholder="Street address"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-blue-700">City</Label>
                      <Input
                        id="city"
                        value={form.city}
                        onChange={(e) => updateField('city', e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-blue-700">State</Label>
                      <Input
                        id="state"
                        value={form.state}
                        onChange={(e) => updateField('state', e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode" className="text-blue-700">Pincode</Label>
                      <Input
                        id="pincode"
                        value={form.pincode}
                        onChange={(e) => updateField('pincode', e.target.value)}
                        placeholder="248001"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="permanentAddress" className="text-blue-700">Permanent Address</Label>
                      <Textarea
                        id="permanentAddress"
                        value={form.permanentAddress}
                        onChange={(e) => updateField('permanentAddress', e.target.value)}
                        placeholder="If different from current address / यदि वर्तमान पते से अलग हो"
                        rows={2}
                        className="resize-none"
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
                    <Label className="text-blue-700">Loan Type *</Label>
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
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-sm text-blue-700">
                        <strong>Interest Rate Range:</strong> {currentLoanInfo.minRate}% - {currentLoanInfo.maxRate}% p.a.
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label className="text-blue-700">Loan Amount (₹) *</Label>
                      <span className="text-sm font-bold text-blue-700">
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
                      <Label className="text-blue-700">Interest Rate (% p.a.)</Label>
                      <span className="text-sm font-bold text-blue-700">{form.interestRate}%</span>
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
                      <Label className="text-blue-700">Tenure (months)</Label>
                      <span className="text-sm font-bold text-blue-700">
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

                  <div className="space-y-2">
                    <Label htmlFor="loanPurpose" className="text-blue-700">Loan Purpose</Label>
                    <Input
                      id="loanPurpose"
                      value={form.loanPurpose}
                      onChange={(e) => updateField('loanPurpose', e.target.value)}
                      placeholder="किसलिए लोन चाहिए"
                      className="h-11"
                    />
                  </div>

                  <Separator />

                  <div className="p-4 bg-gradient-to-r from-blue-700 to-blue-800 rounded-xl text-white text-center">
                    <p className="text-sm text-blue-200 mb-1">Your Monthly EMI</p>
                    <p className="text-3xl font-black">{formatCurrency(emi)}</p>
                  </div>
                </div>
              )}

              {/* Step 3: Employment Details */}
              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Employment & Financial Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 sm:col-span-2">
                      <Label className="text-blue-700">Employment Type *</Label>
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
                      <Label htmlFor="employer" className="text-blue-700">Employer / Company Name</Label>
                      <Input
                        id="employer"
                        value={form.employerName}
                        onChange={(e) => updateField('employerName', e.target.value)}
                        placeholder="Your employer name"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="income" className="text-blue-700">Monthly Income (₹)</Label>
                      <Input
                        id="income"
                        type="number"
                        value={form.monthlyIncome}
                        onChange={(e) => updateField('monthlyIncome', e.target.value)}
                        placeholder="25000"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience" className="text-blue-700">Work Experience</Label>
                      <Input
                        id="experience"
                        value={form.workExperience}
                        onChange={(e) => updateField('workExperience', e.target.value)}
                        placeholder="e.g., 3 years"
                        className="h-11"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Existing Loan */}
                  <div className="space-y-3">
                    <Label className="text-blue-700 font-semibold">Do you have any existing loan?</Label>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="existingLoan"
                          value="YES"
                          checked={form.existingLoan === 'YES'}
                          onChange={(e) => updateField('existingLoan', e.target.value)}
                          className="accent-blue-700 w-4 h-4"
                        />
                        <span className="text-sm font-medium">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="existingLoan"
                          value="NO"
                          checked={form.existingLoan === 'NO'}
                          onChange={(e) => updateField('existingLoan', e.target.value)}
                          className="accent-blue-700 w-4 h-4"
                        />
                        <span className="text-sm font-medium">No</span>
                      </label>
                    </div>

                    {form.existingLoan === 'YES' && (
                      <div className="space-y-4 pl-2 border-l-2 border-blue-200">
                        <div className="space-y-2">
                          <Label htmlFor="existingLoanDetails" className="text-blue-700">Existing Loan Details</Label>
                          <Textarea
                            id="existingLoanDetails"
                            value={form.existingLoanDetails}
                            onChange={(e) => updateField('existingLoanDetails', e.target.value)}
                            placeholder="Bank name, loan type, outstanding amount, etc."
                            rows={2}
                            className="resize-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="existingEmi" className="text-blue-700">Current EMI Amount (₹)</Label>
                          <Input
                            id="existingEmi"
                            type="number"
                            value={form.existingEmi}
                            onChange={(e) => updateField('existingEmi', e.target.value)}
                            placeholder="e.g., 5000"
                            className="h-11"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cibilScore" className="text-blue-700">Approx CIBIL Score (if known)</Label>
                    <Input
                      id="cibilScore"
                      value={form.approxCibilScore}
                      onChange={(e) => updateField('approxCibilScore', e.target.value)}
                      placeholder="e.g., 750"
                      className="h-11"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Documents */}
              {step === 3 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Documents</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="aadhaar" className="text-blue-700">Aadhaar Number *</Label>
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
                      <Label htmlFor="pan" className="text-blue-700">PAN Number *</Label>
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
                      className="data-[state=checked]:bg-blue-700 data-[state=checked]:border-blue-700"
                    />
                    <Label htmlFor="itr" className="cursor-pointer">
                      I have filed Income Tax Return (ITR)
                    </Label>
                  </div>

                  <Separator />

                  {/* Document Checklist */}
                  <div className="space-y-3">
                    <Label className="text-blue-700 font-semibold">Document Checklist</Label>
                    <p className="text-xs text-gray-500">Select the documents you have ready</p>
                    <div className="space-y-2">
                      {DOC_CHECKLIST_ITEMS.map((item) => (
                        <div key={item.key} className="flex items-center gap-2">
                          <Checkbox
                            id={`doc-${item.key}`}
                            checked={!!form.docChecklist[item.key]}
                            onCheckedChange={() => toggleDocChecklist(item.key)}
                            className="data-[state=checked]:bg-blue-700 data-[state=checked]:border-blue-700"
                          />
                          <Label htmlFor={`doc-${item.key}`} className="cursor-pointer text-sm">
                            {item.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label className="text-blue-700">Upload Documents (Optional)</Label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-300 transition-colors">
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
                              <FileText className="h-4 w-4 text-blue-600" />
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

              {/* Step 5: Review & Submit */}
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
                      <div><span className="text-gray-400">Father&apos;s Name:</span> <strong>{form.fatherName || 'N/A'}</strong></div>
                      <div><span className="text-gray-400">Email:</span> <strong>{form.email}</strong></div>
                      <div><span className="text-gray-400">Phone:</span> <strong>{form.phone}</strong></div>
                      <div><span className="text-gray-400">Alternate Phone:</span> <strong>{form.alternatePhone || 'N/A'}</strong></div>
                      <div><span className="text-gray-400">DOB:</span> <strong>{form.dateOfBirth || 'N/A'}</strong></div>
                      <div><span className="text-gray-400">Gender:</span> <strong>{form.gender || 'N/A'}</strong></div>
                      <div><span className="text-gray-400">City:</span> <strong>{form.city}</strong></div>
                    </div>
                    {form.permanentAddress && (
                      <p className="text-sm mt-2">
                        <span className="text-gray-400">Permanent Address:</span>{' '}
                        <strong>{form.permanentAddress}</strong>
                      </p>
                    )}
                  </div>

                  <Separator />

                  {/* Loan Info */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                      Loan Details
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-gray-400">Type:</span> <strong>{LOAN_TYPES.find(l => l.value === form.loanType)?.label}</strong></div>
                      <div><span className="text-gray-400">Amount:</span> <strong className="text-blue-700">{formatCurrency(form.loanAmount)}</strong></div>
                      <div><span className="text-gray-400">Rate:</span> <strong>{form.interestRate}%</strong></div>
                      <div><span className="text-gray-400">Tenure:</span> <strong>{form.tenure} months</strong></div>
                      <div className="col-span-2"><span className="text-gray-400">Monthly EMI:</span> <strong className="text-blue-700 text-base">{formatCurrency(emi)}</strong></div>
                      {form.loanPurpose && (
                        <div className="col-span-2"><span className="text-gray-400">Loan Purpose:</span> <strong>{form.loanPurpose}</strong></div>
                      )}
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
                      <div><span className="text-gray-400">Existing Loan:</span> <strong>{form.existingLoan || 'N/A'}</strong></div>
                      {form.existingLoan === 'YES' && (
                        <>
                          <div><span className="text-gray-400">Existing EMI:</span> <strong>{form.existingEmi ? `₹${form.existingEmi}` : 'N/A'}</strong></div>
                          {form.existingLoanDetails && (
                            <div className="col-span-2"><span className="text-gray-400">Loan Details:</span> <strong>{form.existingLoanDetails}</strong></div>
                          )}
                        </>
                      )}
                      {form.approxCibilScore && (
                        <div><span className="text-gray-400">CIBIL Score:</span> <strong>{form.approxCibilScore}</strong></div>
                      )}
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
                    <div className="mt-2 text-sm">
                      <span className="text-gray-400">Doc Checklist: </span>
                      {DOC_CHECKLIST_ITEMS.filter(d => form.docChecklist[d.key]).length > 0
                        ? DOC_CHECKLIST_ITEMS.filter(d => form.docChecklist[d.key]).map(d => (
                            <span key={d.key} className="inline-flex items-center gap-1 mr-3">
                              <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                              <strong>{d.label}</strong>
                            </span>
                          ))
                        : <span className="text-gray-400 font-medium">None selected</span>
                      }
                    </div>
                  </div>

                  <Separator />

                  {/* Service Fee Box */}
                  <div className="p-4 rounded-xl border-2 border-red-200 bg-red-50">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-red-800 text-base">Service Fee - ₹499</p>
                        <p className="text-sm text-red-700 mt-1">
                          This is a one-time service fee for processing your loan application. This fee is <strong>NON-REFUNDABLE</strong> under any circumstances.
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <Checkbox
                            id="service-fee"
                            checked={form.serviceFeeAccepted}
                            onCheckedChange={(checked) => updateField('serviceFeeAccepted', !!checked)}
                            className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                          />
                          <Label htmlFor="service-fee" className="cursor-pointer text-sm text-red-800 font-medium">
                            I agree to pay the non-refundable service fee of ₹499 and understand that this amount will not be refunded.
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Declaration Box */}
                  <div className="p-4 rounded-xl border-2 border-amber-200 bg-amber-50">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <ShieldCheck className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-amber-800 text-base">Declaration / घोषणा</p>
                        <p className="text-sm text-amber-700 mt-1">
                          मैं घोषणा करता/करती हूँ कि ऊपर दी गई सभी जानकारी सही है। गलत जानकारी देने पर मेरी एप्लीकेशन रद्द की जा सकती है।
                        </p>
                        <p className="text-sm text-amber-700 mt-1 italic">
                          I declare that all the information provided above is true and correct. The application may be rejected if any information is found false.
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <Checkbox
                            id="declaration"
                            checked={form.declarationAccepted}
                            onCheckedChange={(checked) => updateField('declarationAccepted', !!checked)}
                            className="data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                          />
                          <Label htmlFor="declaration" className="cursor-pointer text-sm text-amber-800 font-medium">
                            I accept the above declaration / मैं उपरोक्त घोषणा स्वीकार करता/करती हूँ
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {!canSubmit && (
                    <p className="text-sm text-center text-gray-400">
                      Please accept both the declaration and service fee to enable submission.
                    </p>
                  )}
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
                    className="bg-blue-700 hover:bg-blue-800 text-white"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || !canSubmit}
                    className="bg-blue-700 hover:bg-blue-800 text-white"
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
