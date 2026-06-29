import { useExerciseLogs } from '../hooks/useExerciseLogs'
import { ExerciseForm } from '../components/exercise/ExerciseForm'
import { ExerciseList } from '../components/exercise/ExerciseList'

export function ExercisePage() {
  const { logs, loading, totalDuration, totalCaloriesBurned, addLog, deleteLog } = useExerciseLogs()

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">ออกกำลังกาย</h1>

      <ExerciseForm onSubmit={addLog} />

      {loading ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm text-center text-gray-400">
          กำลังโหลด...
        </div>
      ) : (
        <ExerciseList
          logs={logs}
          totalDuration={totalDuration}
          totalCaloriesBurned={totalCaloriesBurned}
          onDelete={deleteLog}
        />
      )}
    </div>
  )
}
