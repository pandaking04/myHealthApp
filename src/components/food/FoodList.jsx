const MEAL_LABELS = {
  breakfast: 'เช้า',
  lunch: 'กลางวัน',
  dinner: 'เย็น',
  snack: 'ของว่าง',
}

const MEAL_ORDER = ['breakfast', 'lunch', 'dinner', 'snack']

export function FoodList({ logs, totalCalories, onDelete }) {
  const grouped = MEAL_ORDER.reduce((acc, type) => {
    const items = logs.filter((log) => log.meal_type === type)
    if (items.length > 0) acc[type] = items
    return acc
  }, {})

  return (
    <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <h2 className="font-semibold text-gray-900 dark:text-white">รายการอาหาร</h2>
        <span className="text-sm font-medium text-muted">
          {totalCalories.toLocaleString()} แคล
        </span>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <p className="text-muted text-sm text-center py-6 px-5">ยังไม่มีรายการ</p>
      ) : (
        <div className="px-5 pb-4 space-y-3">
          {Object.entries(grouped).map(([type, items]) => (
            <div key={type}>
              <h3 className="text-[11px] uppercase tracking-wider text-muted mb-1.5">
                {MEAL_LABELS[type]}
              </h3>
              <div className="space-y-0.5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 px-3 -mx-1 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/40 group transition"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm text-gray-900 dark:text-white truncate">{item.name}</span>
                      <span className="text-xs text-muted whitespace-nowrap">{item.calories} แคล</span>
                    </div>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-all text-xs font-medium shrink-0 ml-2"
                    >
                      ลบ
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
