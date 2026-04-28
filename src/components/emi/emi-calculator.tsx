'use client'

import { useState, useMemo } from 'react'
import { useAppStore } from '@/lib/store'
import { ArrowLeft, Calculator, IndianRupee } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

function formatCurrency(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`
  return `₹${num.toLocaleString('en-IN')}`
}

function formatEMI(num: number): string {
  return `₹${num.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}

function calculateEMI(principal: number, annualRate: number, tenureMonths: number): number {
  const r = annualRate / 12 / 100
  if (r === 0) return principal / tenureMonths
  const factor = Math.pow(1 + r, tenureMonths)
  const emi = (principal * r * factor) / (factor - 1)
  return Math.round(emi * 100) / 100
}

const COLORS = ['#1d4ed8', '#ef4444']

export function EMICalculator() {
  const { navigate } = useAppStore()

  const [loanAmount, setLoanAmount] = useState(500000)
  const [interestRate, setInterestRate] = useState(12)
  const [tenure, setTenure] = useState(60)

  const emi = useMemo(
    () => calculateEMI(loanAmount, interestRate, tenure),
    [loanAmount, interestRate, tenure]
  )

  const totalAmount = emi * tenure
  const totalInterest = totalAmount - loanAmount

  const pieData = useMemo(
    () => [
      { name: 'Principal', value: loanAmount },
      { name: 'Interest', value: Math.round(totalInterest) },
    ],
    [loanAmount, totalInterest]
  )

  const handleApply = () => {
    navigate('apply')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('landing')}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 rounded-full mb-3">
            <Calculator className="h-4 w-4 text-blue-700" />
            <span className="text-sm font-medium text-blue-700">EMI Calculator</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Calculate Your EMI
          </h1>
          <p className="text-slate-500">Plan your loan with our easy EMI calculator</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Input Controls */}
          <Card className="border-slate-100 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">Loan Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Loan Amount */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-slate-700">
                    <IndianRupee className="inline h-4 w-4 mr-1" />
                    Loan Amount
                  </Label>
                  <span className="text-sm font-bold text-blue-700">
                    {formatCurrency(loanAmount)}
                  </span>
                </div>
                <Slider
                  value={[loanAmount]}
                  onValueChange={([val]) => setLoanAmount(val)}
                  min={100000}
                  max={10000000}
                  step={50000}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>₹1 Lakh</span>
                  <span>₹1 Crore</span>
                </div>
                <Input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => {
                    const val = Math.max(100000, Math.min(10000000, Number(e.target.value)))
                    setLoanAmount(val)
                  }}
                  className="h-10"
                />
              </div>

              <Separator />

              {/* Interest Rate */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-slate-700">
                    Interest Rate (% p.a.)
                  </Label>
                  <span className="text-sm font-bold text-blue-700">
                    {interestRate}%
                  </span>
                </div>
                <Slider
                  value={[interestRate]}
                  onValueChange={([val]) => setInterestRate(val)}
                  min={5}
                  max={25}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>5%</span>
                  <span>25%</span>
                </div>
                <Input
                  type="number"
                  value={interestRate}
                  onChange={(e) => {
                    const val = Math.max(5, Math.min(25, Number(e.target.value)))
                    setInterestRate(val)
                  }}
                  step={0.5}
                  className="h-10"
                />
              </div>

              <Separator />

              {/* Tenure */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-slate-700">
                    Loan Tenure
                  </Label>
                  <span className="text-sm font-bold text-blue-700">
                    {tenure} months ({Math.floor(tenure / 12)}y {tenure % 12}m)
                  </span>
                </div>
                <Slider
                  value={[tenure]}
                  onValueChange={([val]) => setTenure(val)}
                  min={6}
                  max={360}
                  step={6}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>6 months</span>
                  <span>30 years</span>
                </div>
                <Input
                  type="number"
                  value={tenure}
                  onChange={(e) => {
                    const val = Math.max(6, Math.min(360, Number(e.target.value)))
                    setTenure(val)
                  }}
                  className="h-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {/* EMI Display */}
            <Card className="border-0 bg-gradient-to-br from-blue-800 to-blue-900 text-white shadow-xl rounded-2xl">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-blue-200 mb-1">Monthly EMI</p>
                <p className="text-4xl md:text-5xl font-black">{formatEMI(emi)}</p>
                <p className="text-xs text-blue-300 mt-2">
                  for {tenure} months at {interestRate}% interest
                </p>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-slate-100 shadow-sm rounded-2xl">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-slate-400 mb-1">Principal Amount</p>
                  <p className="text-lg font-bold text-slate-800">{formatCurrency(loanAmount)}</p>
                </CardContent>
              </Card>
              <Card className="border-slate-100 shadow-sm rounded-2xl">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-slate-400 mb-1">Total Interest</p>
                  <p className="text-lg font-bold text-red-600">
                    {formatCurrency(Math.round(totalInterest))}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-slate-100 shadow-sm rounded-2xl col-span-2">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-slate-400 mb-1">Total Payment</p>
                  <p className="text-xl font-bold text-slate-900">
                    {formatCurrency(Math.round(totalAmount))}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Pie Chart */}
            <Card className="border-slate-100 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base text-slate-900">Payment Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{
                          borderRadius: '12px',
                          border: '1px solid #e5e7eb',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value) => (
                          <span className="text-sm text-slate-600">{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Apply Button */}
            <Button
              onClick={handleApply}
              size="lg"
              className="w-full h-12 bg-blue-700 hover:bg-blue-800 text-white font-bold text-lg rounded-2xl shadow-lg shadow-blue-700/20"
            >
              Apply for this Loan
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
