import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts'
import { useWeightLogs } from '../../hooks/useWeightLogs'

const RANGE_OPTIONS = [
  { label: '7 วัน', days: 7 },
  { label: '30 วัน', days: 30 },
  { label: '90 วัน', days: 90 },
]

function computeMovingAverage(data, window = 7) {
  return data.map((item, i) => {
    const start = Math.max(0, i - window + 1)
    const slice = data.slice(start, i + 1)
    const avg = slice.reduce((sum, d) => sum + d.weight_kg, 0) / slice.length
    return { ...item, ma7: parseFloat(avg.toFixed(1)) }
  })
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`
}

export function WeightChart() {
  const [days, setDays] = useState(30)
  const { logs, loading } = useWeightLogs(days)

  const chartData = computeMovingAverage(
    logs.map((log) => ({
      date: formatDate(log.logged_at),
      weight_kg: parseFloat(log.weight_kg),
    }))
  )

  const delta = logs.length >= 2
    ? (parseFloat(logs[logs.length - 1].weight_kg) - parseFloat(logs[logs.length - 2].weight_kg)).toFixed(1)
    : null

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800/60">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white">กราฟน้ำหนัก</h2>
          {delta !== null && (
            <span className={`text-sm font-medium ${parseFloat(delta) <= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {parseFloat(delta) > 0 ? '+' : ''}{delta} kg จากครั้งก่อน
            </span>
          )}
        </div>
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
          {RANGE_OPTIONS.map(({ label, days: d }) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                days === d
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-muted hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-48 flex items-center justify-center text-muted">กำลังโหลด...</div>
      ) : chartData.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-muted">ยังไม่มีข้อมูล</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9ca3af" tickLine={false} axisLine={false} />
            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} stroke="#9ca3af" tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '13px',
                padding: '8px 12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line
              type="monotone"
              dataKey="weight_kg"
              name="น้ำหนัก"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ r: 3, fill: '#6366f1' }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="ma7"
              name="เฉลี่ย 7 วัน"
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
