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
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white">กราฟน้ำหนัก</h2>
          {delta !== null && (
            <span className={`text-sm ${parseFloat(delta) <= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {parseFloat(delta) > 0 ? '+' : ''}{delta} kg จากครั้งก่อน
            </span>
          )}
        </div>
        <div className="flex gap-1">
          {RANGE_OPTIONS.map(({ label, days: d }) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1 text-xs rounded-full transition ${
                days === d
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-48 flex items-center justify-center text-gray-400">กำลังโหลด...</div>
      ) : chartData.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-gray-400">ยังไม่มีข้อมูล</div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="weight_kg"
              name="น้ำหนัก"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ r: 3 }}
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
