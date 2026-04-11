'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Find Your Dream{' '}
            <span className="text-amber-400">Tech Job</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-blue-100 leading-relaxed">
            Connecting talented professionals with top companies across India.
            Browse thousands of private &amp; government jobs, internships, and more.
          </p>

          {/* Search Bar */}
          <div className="mt-10 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Job title, skills, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-lg"
              />
            </div>
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold shadow-lg whitespace-nowrap"
            >
              Search Jobs
            </Button>
          </div>

          {/* Quick Tags */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {['React Developer', 'Python', 'Data Analyst', 'DevOps', 'UI/UX Design'].map(
              (tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/15 text-white text-sm rounded-full backdrop-blur-sm hover:bg-white/25 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  )
}
