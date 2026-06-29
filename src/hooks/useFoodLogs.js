import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useFoodLogs(date = null) {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const targetDate = date || new Date().toISOString().split('T')[0]

  useEffect(() => {
    fetchLogs()
  }, [targetDate])

  async function fetchLogs() {
    setLoading(true)
    const startOfDay = `${targetDate}T00:00:00`
    const endOfDay = `${targetDate}T23:59:59`

    const { data, error } = await supabase
      .from('food_logs')
      .select('*')
      .gte('logged_at', startOfDay)
      .lte('logged_at', endOfDay)
      .order('logged_at', { ascending: true })

    if (error) setError(error.message)
    else setLogs(data)
    setLoading(false)
  }

  async function addLog(name, calories, meal_type) {
    const { error } = await supabase
      .from('food_logs')
      .insert({ name, calories, meal_type })
    if (!error) fetchLogs()
    return { error }
  }

  async function deleteLog(id) {
    const { error } = await supabase
      .from('food_logs')
      .delete()
      .eq('id', id)
    if (!error) fetchLogs()
    return { error }
  }

  const totalCalories = logs.reduce((sum, log) => sum + log.calories, 0)

  return { logs, loading, error, addLog, deleteLog, totalCalories, refetch: fetchLogs }
}
