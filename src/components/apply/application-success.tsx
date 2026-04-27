'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { CheckCircle2, ArrowLeft, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ApplicationSuccess() {
  const { navigate, applicationId } = useAppStore()

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md text-center"
      >
        <Card className="border-emerald-100 shadow-lg">
          <CardContent className="p-8 md:p-10">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mx-auto mb-6"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-12 w-12 text-emerald-600" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-gray-900 mb-2"
            >
              Application Submitted!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-500 mb-6"
            >
              Your loan application has been received successfully.
              Our team will review it and get back to you soon.
            </motion.p>

            {/* Application ID */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-emerald-50 rounded-xl p-4 mb-6 border border-emerald-100"
            >
              <p className="text-sm text-emerald-600 font-medium mb-1">
                Your Application ID
              </p>
              <p className="text-3xl font-black text-emerald-700">
                {applicationId || 'N/A'}
              </p>
              <p className="text-xs text-emerald-500 mt-1">
                Save this ID for tracking your application
              </p>
            </motion.div>

            {/* Note */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-amber-50 rounded-lg p-3 mb-6 border border-amber-100"
            >
              <p className="text-xs text-amber-700">
                <strong>Note:</strong> You can track your application status from your dashboard.
                We will also notify you via email once your application is reviewed.
              </p>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col gap-3"
            >
              <Button
                onClick={() => navigate('dashboard')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-11"
              >
                <Eye className="mr-2 h-4 w-4" />
                View My Applications
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('landing')}
                className="w-full border-gray-200 h-11"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
