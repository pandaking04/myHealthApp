const INTENSITY_LABELS = {
  low: 'เบา',
  medium: 'ปานกลาง',
  high: 'หนัก',
}

export function ExerciseList({ logs, totalDuration, totalCaloriesBurned, onDelete }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-gray-900 dark:text-white">การออกกำลังกายวันนี้</h2>
        <div className="text-right">
          <div className="text-sm text-gray-500 dark:text-gray-400">{totalDuration} นาที</div>
          {totalCaloriesBurned > 0 && (
            <div className="text-xs text-gray-400">{totalCaloriesBurned.toLocaleString()} แคล</div>
          )}
        </div>
      </div>

      {logs.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-4">ยังไม่มีรายการ</p>
      ) : (
        <div className="space-y-1">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 group"
            >
              <div>
                <span className="text-sm text-gray-900 dark:text-white">{log.type}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  {log.duration_min} นาที · {INTENSITY_LABELS[log.intensity]}
                  {log.calories_burned ? ` · ${log.calories_burned} แคล` : ''}
                </span>
              </div>
              <button
                onClick={() => onDelete(log.id)}
                className="text-gray-400 hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity text-sm"
              >
                ลบ
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
