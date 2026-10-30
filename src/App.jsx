import { useRef, useState } from 'react'
import AppHeader from './components/AppHeader'
import AppNav from './components/AppNav'
import { Icon } from './components/Icons'
import { useHealthData } from './hooks/useHealthData'
import HomePage from './pages/HomePage'
import WeightPage from './pages/WeightPage'
import MealsPage from './pages/MealsPage'
import WorkoutPage from './pages/WorkoutPage'
import CyclePage from './pages/CyclePage'
import DataPage from './pages/DataPage'

export default function App() {
  const [page, setPage] = useState('home')
  const [toast, setToast] = useState('')
  const toastTimer = useRef(null)
  const { data, actions, storageWarning } = useHealthData()

  const navigate = (next) => {
    setPage(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const notify = (message) => {
    setToast(message)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 2600)
  }

  const shared = { data, actions, notify }
  const pages = {
    home: <HomePage data={data} onNavigate={navigate} />,
    weight: <WeightPage {...shared} />,
    meals: <MealsPage {...shared} />,
    workout: <WorkoutPage {...shared} />,
    cycle: <CyclePage {...shared} />,
    data: <DataPage {...shared} />,
  }

  return (
    <div className="app-shell">
      <AppNav page={page} onNavigate={navigate} onData={() => navigate('data')} />
      <div className="app-main">
        <AppHeader page={page} onData={() => navigate('data')} />
        {storageWarning && <div className="storage-warning"><Icon name="info" size={18} />{storageWarning}</div>}
        <main className="page-content">{pages[page] || pages.home}</main>
        <footer className="app-footer">暖暖健康日记 · 记录身体，也接纳自己 <span>健康信息仅供参考，不替代专业医疗建议</span></footer>
      </div>
      <div className={`toast ${toast ? 'show' : ''}`} role="status"><Icon name="check" size={18} />{toast}</div>
    </div>
  )
}
