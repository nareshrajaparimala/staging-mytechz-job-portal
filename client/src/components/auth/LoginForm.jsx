'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'
import MagicLinkSent from '@/components/auth/MagicLinkSent'

export default function LoginForm() {
  const supabase = createClient()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [error, setError] = useState(null)

  const returnTo = searchParams.get('returnTo') || '/'
  const urlError = searchParams.get('error')
  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  // Save returnTo cookie before OAuth redirect
  const saveReturnTo = () => {
    document.cookie = `return-to=${returnTo}; max-age=600; path=/`
  }

  // Magic Link (Email OTP)
  const handleMagicLink = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          redirectTo: `${origin}/auth/callback`,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to send magic link')
      }

      setMagicLinkSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Google OAuth
  const handleGoogleLogin = async () => {
    saveReturnTo()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    })
  }

  if (magicLinkSent) {
    return (
      <MagicLinkSent email={email} onBack={() => setMagicLinkSent(false)} />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Welcome to MyTechZ</h1>
        <p className="mt-2 text-gray-500">Sign in to access your account</p>
      </div>

      {/* URL Error */}
      {urlError && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {urlError === 'auth_failed'
            ? 'Authentication failed. Please try again.'
            : urlError}
        </div>
      )}

      {/* Google OAuth */}
      <GoogleSignInButton onClick={handleGoogleLogin} />

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-400">or continue with email</span>
        </div>
      </div>

      {/* Email Magic Link Form */}
      <form onSubmit={handleMagicLink} className="space-y-4">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button
          type="submit"
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? 'Sending...' : 'Send Magic Link'}
        </Button>
      </form>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* Footer text */}
      <p className="text-center text-xs text-gray-400">
        By signing in, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  )
}
