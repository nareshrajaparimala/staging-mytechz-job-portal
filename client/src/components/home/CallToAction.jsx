import Link from 'next/link'

export default function CallToAction() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Ready to Start Your Career Journey?
        </h2>
        <p className="mt-4 text-lg text-blue-100 max-w-xl mx-auto">
          Join thousands of professionals who found their dream job through MyTechZ.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-blue-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Sign Up Now
          </Link>
          <Link
            href="#jobs"
            className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
    </section>
  )
}
