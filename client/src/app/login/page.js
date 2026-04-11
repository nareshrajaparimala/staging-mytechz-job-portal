import { Suspense } from 'react'
import LoginForm from '@/components/auth/LoginForm'

export const metadata = {
  title: 'Login - MyTechZ',
  description: 'Sign in to your MyTechZ account',
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">
              My<span className="text-blue-600">TechZ</span>
            </span>
          </div>
        </div>
        <Suspense fallback={<div className="text-center text-gray-400">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
