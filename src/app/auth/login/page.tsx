'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertCircle, CheckCircle, Loader2, Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react'

type FormState = 'idle' | 'loading' | 'success' | 'error'

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

export default function LoginPage() {
  const [formState, setFormState] = useState<FormState>('idle')
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setFormState('error')
      return
    }

    setErrors({})
    setFormState('loading')

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setFormState('success')
      setTimeout(() => {
        setFormState('idle')
        setEmail('')
        setPassword('')
      }, 2000)
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' })
      setFormState('error')
    }
  }

  const handleSocialAuth = async (provider: 'google' | 'apple') => {
    setFormState('loading')
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setFormState('idle')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to access Deafference</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error */}
            {errors.general && (
              <div
                className="flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg"
                role="alert"
                aria-live="assertive"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-red-900 text-sm">Error</p>
                  <p className="text-red-800 text-sm">{errors.general}</p>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors({ ...errors, email: undefined })
                  }}
                  placeholder="Enter your email"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-500 bg-red-50'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && (
                <div id="email-error" className="flex items-center gap-2 mt-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" aria-hidden="true" />
                  <p className="text-sm text-red-600 font-medium">{errors.email}</p>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="text-sm font-semibold text-gray-900">
                  Password
                </label>
                <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" aria-hidden="true" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors({ ...errors, password: undefined })
                  }}
                  placeholder="Enter your password"
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
                    errors.password
                      ? 'border-red-500 focus:ring-red-500 bg-red-50'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-600 hover:text-gray-900 transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <div id="password-error" className="flex items-center gap-2 mt-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" aria-hidden="true" />
                  <p className="text-sm text-red-600 font-medium">{errors.password}</p>
                </div>
              )}
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={formState === 'loading' || formState === 'success'}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 min-h-[48px]"
              aria-busy={formState === 'loading'}
            >
              {formState === 'loading' && <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />}
              {formState === 'success' && <CheckCircle className="w-5 h-5" aria-hidden="true" />}
              <span>{formState === 'loading' ? 'Signing in...' : formState === 'success' ? 'Signed in!' : 'Sign In'}</span>
            </button>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-600">Or continue with</span>
              </div>
            </div>

            {/* Social Auth Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialAuth('google')}
                disabled={formState === 'loading'}
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 transition-colors font-medium text-gray-900 min-h-[48px]"
                aria-label="Sign in with Google"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={() => handleSocialAuth('apple')}
                disabled={formState === 'loading'}
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 transition-colors font-medium text-gray-900 min-h-[48px]"
                aria-label="Sign in with Apple"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.05 13.5c-.91 2.18-.505 3.685 1.75 5.08.961.607 1.91 1.28 1.91 2.66 0 1.88-1.525 2.66-3.205 2.66-1.52 0-2.921-.59-3.854-1.855-.61-.84-1.14-1.735-1.72-2.57-.58.835-1.11 1.73-1.72 2.57-.933 1.265-2.334 1.855-3.854 1.855-1.68 0-3.205-.78-3.205-2.66 0-1.38.949-2.053 1.91-2.66 2.255-1.395 2.66-2.9 1.75-5.08C1.957 11.29.5 9.371.5 7.27 0 3.47 2.966.5 6.766.5c1.925 0 3.828.948 4.984 2.529C13.406 1.448 15.31.5 17.234.5 21.034.5 24 3.47 24 7.27c0 2.101-1.457 4.02-2.95 6.23z" />
                </svg>
                Apple
              </button>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center border-t border-gray-200 pt-6">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-8">
          By signing in, you agree to our{' '}
          <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
