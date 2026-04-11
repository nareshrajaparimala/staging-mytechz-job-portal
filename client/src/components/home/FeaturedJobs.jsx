'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import api from '@/lib/api'

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await api.get('/jobs/public')
        const results = res.data?.results || res.data || []
        setJobs(results.slice(0, 6))
      } catch (err) {
        setError('Could not load jobs right now')
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  return (
    <section id="jobs" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Featured Jobs</h2>
          <p className="mt-3 text-gray-500 max-w-lg mx-auto">
            Explore the latest opportunities from top companies
          </p>
        </div>

        {loading && <LoadingSpinner size="lg" className="py-12" />}

        {error && (
          <div className="text-center py-12">
            <p className="text-gray-500">{error}</p>
            <p className="text-sm text-gray-400 mt-1">
              Make sure the backend is running at{' '}
              {process.env.NEXT_PUBLIC_DJANGO_API_URL}
            </p>
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No jobs available at the moment.</p>
          </div>
        )}

        {!loading && !error && jobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Card key={job.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {job.title || job.job_title}
                    </h3>
                    <p className="text-blue-600 text-sm font-medium mt-1">
                      {job.company_name || job.company || 'Company'}
                    </p>
                  </div>
                  {job.is_featured && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {(job.job_type || job.type) && (
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                      {job.job_type || job.type}
                    </span>
                  )}
                  {(job.work_mode || job.mode) && (
                    <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                      {job.work_mode || job.mode}
                    </span>
                  )}
                  {job.location && (
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {job.location}
                    </span>
                  )}
                </div>

                {(job.salary_min || job.salary_max) && (
                  <p className="text-sm text-gray-500">
                    {job.salary_min && `₹${Number(job.salary_min).toLocaleString()}`}
                    {job.salary_min && job.salary_max && ' - '}
                    {job.salary_max && `₹${Number(job.salary_max).toLocaleString()}`}
                    <span className="text-gray-400"> / year</span>
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
