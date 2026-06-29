import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useWeightLogs(days = 30) {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchLogs()
  }, [days])

  async function fetchLogs() {
    setLoading(true)
    const since = new Date()
    since.setDate(since.getDate() - days)

    const { data, error } = await supabase
      .from('weight_logs')
      .select('*')
      .gte('logged_at', since.toISOString())
      .order('logged_at', { ascending: true })

    if (error) setError(error.message)
    else setLogs(data)
    setLoading(false)
  }

  async function addLog(weight_kg, note = '') {
    const { error } = await supabase
      .from('weight_logs')
      .insert({ weight_kg, note })
    if (!error) fetchLogs()
    return { error }
  }

  async function deleteLog(id) {
    const { error } = await supabase
      .from('weight_logs')
      .delete()
      .eq('id', id)
    if (!error) fetchLogs()
    return { error }
  }

  return { logs, loading, error, addLog, deleteLog, refetch: fetchLogs }
}
