const stats = [
  { value: '500+', label: 'Jobs Posted' },
  { value: '100+', label: 'Companies' },
  { value: '10K+', label: 'Candidates' },
  { value: '95%', label: 'Success Rate' },
]

export default function StatsBar() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-blue-600">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-gray-500 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
