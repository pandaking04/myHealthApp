import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { DashboardPage } from './pages/DashboardPage'
import { WeightPage } from './pages/WeightPage'
import { FoodPage } from './pages/FoodPage'
import { ExercisePage } from './pages/ExercisePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><DashboardPage /></Layout>} />
      <Route path="/weight" element={<Layout><WeightPage /></Layout>} />
      <Route path="/food" element={<Layout><FoodPage /></Layout>} />
      <Route path="/exercise" element={<Layout><ExercisePage /></Layout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
