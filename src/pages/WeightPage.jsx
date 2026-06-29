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
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">น้ำหนัก</h1>

      <WeightForm onSubmit={addLog} />
      <WeightChart />

      <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 overflow-hidden">
        <div className="px-5 pt-4 pb-2">
          <h2 className="font-semibold text-gray-900 dark:text-white">ประวัติ</h2>
        </div>

        {loading ? (
          <p className="text-muted text-sm text-center py-6 px-5">กำลังโหลด...</p>
        ) : recentLogs.length === 0 ? (
          <p className="text-muted text-sm text-center py-6 px-5">ยังไม่มีข้อมูล</p>
        ) : (
          <div className="px-2 pb-3">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/40 group transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-sm text-muted whitespace-nowrap">
                    {formatDate(log.logged_at)}
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {log.weight_kg} kg
                  </span>
                  {log.note && (
                    <span className="text-xs text-muted truncate">{log.note}</span>
                  )}
                </div>
                <button
                  onClick={() => deleteLog(log.id)}
                  className="text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-all text-xs font-medium shrink-0 ml-2"
                >
                  ลบ
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
