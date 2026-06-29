import { useWeightLogs } from '../hooks/useWeightLogs'
import { WeightForm } from '../components/weight/WeightForm'
import { WeightChart } from '../components/weight/WeightChart'

export function WeightPage() {
  const { logs, loading, addLog, deleteLog } = useWeightLogs(90)

  const recentLogs = [...logs].reverse().slice(0, 10)

  function formatDate(dateStr) {
    const d = new Date(dateStr)
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">น้ำหนัก</h1>

      <WeightForm onSubmit={addLog} />
      <WeightChart />

      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-3">ประวัติ</h2>

        {loading ? (
          <p className="text-gray-400 text-sm text-center py-4">กำลังโหลด...</p>
        ) : recentLogs.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">ยังไม่มีข้อมูล</p>
        ) : (
          <div className="space-y-1">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 group"
              >
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(log.logged_at)}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white ml-3">
                    {log.weight_kg} kg
                  </span>
                  {log.note && (
                    <span className="text-xs text-gray-400 ml-2">{log.note}</span>
                  )}
                </div>
                <button
                  onClick={() => deleteLog(log.id)}
                  className="text-gray-400 hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity text-sm"
                >
                  ลบ
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
