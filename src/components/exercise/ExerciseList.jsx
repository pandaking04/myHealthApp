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
      <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 overflow-hidden">
        <div className="px-5 pt-4 pb-2">
          <h2 className="font-semibold text-gray-900 dark:text-white">Weight Training</h2>
        </div>

        {weightLogs.length === 0 ? (
          <p className="text-muted text-sm text-center py-6 px-5">ยังไม่มีรายการ</p>
        ) : (
          <div className="px-4 pb-4 space-y-2.5">
            {weightLogs.map((log) => (
              <div key={log.id} className="rounded-xl bg-gray-50 dark:bg-gray-800/40 p-3 group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex px-2 py-0.5 text-[11px] font-semibold rounded-md bg-primary/15 text-primary">
                      {SUB_TYPE_LABELS[log.sub_type]}
                    </span>
                    <span className="text-xs text-muted">
                      {log.duration_min} นาที
                      {log.calories_burned ? ` · ${log.calories_burned} แคล` : ''}
                    </span>
                  </div>
                  <button
                    onClick={() => onDelete(log.id)}
                    className="text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-all text-xs font-medium"
                  >
                    ลบ
                  </button>
                </div>

                {log.exercise_sets && log.exercise_sets.length > 0 && (
                  <div className="space-y-1">
                    {log.exercise_sets.map((s) => (
                      <div key={s.id} className="flex justify-between text-sm py-1 px-2 rounded-lg bg-white/60 dark:bg-gray-800/60">
                        <span className="text-gray-700 dark:text-gray-300 truncate mr-3">{s.exercise_name}</span>
                        <span className="text-muted whitespace-nowrap">
                          {s.sets}&times;{s.reps} @ {s.weight_kg}kg
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {log.notes && (
                  <p className="text-xs text-muted mt-2">{log.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Cardio */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 overflow-hidden">
        <div className="px-5 pt-4 pb-2">
          <h2 className="font-semibold text-gray-900 dark:text-white">Cardio</h2>
        </div>

        {cardioLogs.length === 0 ? (
          <p className="text-muted text-sm text-center py-6 px-5">ยังไม่มีรายการ</p>
        ) : (
          <div className="px-2 pb-3">
            {cardioLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/40 group transition"
              >
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <span className="inline-flex px-2 py-0.5 text-[11px] font-semibold rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    {SUB_TYPE_LABELS[log.sub_type]}
                  </span>
                  <span className="text-sm text-muted">
                    {log.duration_min} นาที
                    {log.distance_km ? ` · ${log.distance_km} km` : ''}
                    {log.incline_percent ? ` · ชัน ${log.incline_percent}%` : ''}
                    {log.calories_burned ? ` · ${log.calories_burned} แคล` : ''}
                  </span>
                  {log.notes && (
                    <span className="text-xs text-muted truncate">{log.notes}</span>
                  )}
                </div>
                <button
                  onClick={() => onDelete(log.id)}
                  className="text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-all text-xs font-medium shrink-0 ml-2"
                >
                  ลบ
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Summary */}
      {logs.length > 0 && (
        <div className="flex justify-center gap-4 text-sm text-muted py-1">
          <span>รวม {totalDuration} นาที</span>
          {totalCaloriesBurned > 0 && <span>{totalCaloriesBurned.toLocaleString()} แคล</span>}
        </div>
      )}
    </div>
  )
}
