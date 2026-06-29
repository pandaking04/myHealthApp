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
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-gray-900 dark:text-white">รายการอาหาร</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          รวม {totalCalories.toLocaleString()} แคล
        </span>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-4">ยังไม่มีรายการ</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([type, items]) => (
            <div key={type}>
              <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                {MEAL_LABELS[type]}
              </h3>
              <div className="space-y-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 group"
                  >
                    <div>
                      <span className="text-sm text-gray-900 dark:text-white">{item.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        {item.calories} แคล
                      </span>
                    </div>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="text-gray-400 hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity text-sm"
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
    </div>
  )
}
