interface WeeklyData {
  day: string
  emissions: number
}

interface WeeklyChartProps {
  data: WeeklyData[]
}

export default function WeeklyChart({ data }: WeeklyChartProps) {
  const maxEmission = Math.max(...data.map(d => d.emissions))

  return (
    <div className="lg:col-span-2 gp-card rounded-2xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Weekly Emissions</h3>
      <div className="space-y-4">
        {data.map((day) => (
          <div key={day.day} className="flex items-center gap-4">
            <div className="w-12 text-sm font-medium text-gray-300">{day.day}</div>
            <div className="flex-1 bg-gray-700/50 rounded-full h-3 relative overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full transition-all duration-700"
                style={{ width: `${(day.emissions / maxEmission) * 100}%` }}
              />
            </div>
            <div className="text-sm font-medium text-white w-16 text-right">{day.emissions} kg</div>
          </div>
        ))}
      </div>
    </div>
  )
}
