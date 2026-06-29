const SUB_TYPE_LABELS = {
  push: 'Push',
  pull: 'Pull',
  leg: 'Leg',
  upper: 'Upper',
  walk: 'เดิน',
  run: 'วิ่ง',
  incline_walk: 'เดินชัน',
}

export function ExerciseList({ logs, totalDuration, totalCaloriesBurned, onDelete }) {
  const weightLogs = logs.filter(l => l.category === 'weight_training')
  const cardioLogs = logs.filter(l => l.category === 'cardio')

  return (
    <div className="space-y-4">
      {/* Weight Training */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900 dark:text-white">Weight Training</h2>
        </div>

        {weightLogs.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-2">ยังไม่มีรายการ</p>
        ) : (
          <div className="space-y-3">
            {weightLogs.map((log) => (
              <div key={log.id} className="border border-gray-100 dark:border-gray-800 rounded-xl p-3 group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                      {SUB_TYPE_LABELS[log.sub_type]}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {log.duration_min} นาที
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

                {log.exercise_sets && log.exercise_sets.length > 0 && (
                  <div className="space-y-1">
                    {log.exercise_sets.map((s) => (
                      <div key={s.id} className="flex justify-between text-sm py-0.5 px-2 rounded bg-gray-50 dark:bg-gray-800/50">
                        <span className="text-gray-900 dark:text-white">{s.exercise_name}</span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {s.sets} &times; {s.reps} @ {s.weight_kg} kg
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {log.notes && (
                  <p className="text-xs text-gray-400 mt-2">{log.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cardio */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900 dark:text-white">Cardio</h2>
        </div>

        {cardioLogs.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-2">ยังไม่มีรายการ</p>
        ) : (
          <div className="space-y-1">
            {cardioLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 group"
              >
                <div>
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 mr-2">
                    {SUB_TYPE_LABELS[log.sub_type]}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {log.duration_min} นาที
                    {log.distance_km ? ` · ${log.distance_km} km` : ''}
                    {log.incline_percent ? ` · ชัน ${log.incline_percent}%` : ''}
                    {log.calories_burned ? ` · ${log.calories_burned} แคล` : ''}
                  </span>
                  {log.notes && (
                    <span className="text-xs text-gray-400 ml-2">{log.notes}</span>
                  )}
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

      {/* Summary */}
      {logs.length > 0 && (
        <div className="flex justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
          <span>รวม {totalDuration} นาที</span>
          {totalCaloriesBurned > 0 && <span>{totalCaloriesBurned.toLocaleString()} แคล</span>}
        </div>
      )}
    </div>
  )
}