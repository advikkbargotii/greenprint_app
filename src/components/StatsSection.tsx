interface StatItemProps {
  value: string
  label: string
}

function StatItem({ value, label }: StatItemProps) {
  return (
    <div className="text-center">
      <div className="text-5xl font-bold text-green-400 mb-2">{value}</div>
      <div className="text-lg text-gray-300">{label}</div>
    </div>
  )
}

const stats = [
  { value: '2M+', label: 'Lines of code analyzed' },
  { value: '40%', label: 'Average carbon reduction' },
  { value: '500+', label: 'Developer teams' }
]

const companies = ['GitHub', 'Vercel', 'Stripe', 'Netlify']

export default function StatsSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Trusted by Developers Worldwide
          </h2>
          <p className="text-xl text-gray-300">
            Join thousands of developers building sustainably
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              value={stat.value}
              label={stat.label}
            />
          ))}
        </div>

        {/* Company Logos */}
        <div className="text-center mb-16">
          <p className="text-gray-400 mb-8">Trusted by teams at leading companies</p>
          <div className="flex justify-center items-center gap-12 opacity-60">
            {companies.map((company, index) => (
              <div key={index} className="text-2xl font-bold text-gray-400">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
