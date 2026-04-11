'use client'

import Button from '@/components/ui/Button'

export default function MagicLinkSent({ email, onBack }) {
  return (
    <div className="text-center space-y-4">
      {/* Email Icon */}
      <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
        <svg
          className="w-8 h-8 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
      <p className="text-gray-500">
        We sent a magic link to{' '}
        <span className="font-semibold text-gray-700">{email}</span>
      </p>
      <p className="text-sm text-gray-400">
        Click the link in the email to sign in. It expires in 10 minutes.
      </p>

      <div className="pt-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          Use a different email
        </Button>
      </div>
    </div>
  )
}
