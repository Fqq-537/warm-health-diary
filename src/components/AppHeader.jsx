import { Brand } from './AppNav'
import { Icon } from './Icons'

const pageTitles = {
  home: ['今天，也照顾自己', '你的健康概览'],
  weight: ['体重记录', '看见趋势，不被数字定义'],
  meals: ['饮食记录', '好好吃饭，了解每一份摄入'],
  workout: ['运动计划', '有氧与力量，找到可持续的节奏'],
  cycle: ['月经周期', '记录身体规律，关注细微变化'],
  data: ['数据管理', '你的记录，由你自己掌握'],
}

export default function AppHeader({ page, onData }) {
  const [title, subtitle] = pageTitles[page] || pageTitles.home
  return (
    <header className="app-header">
      <div className="mobile-brand"><Brand /></div>
      <div className="page-heading">
        <p>{subtitle}</p>
        <h1>{title}</h1>
      </div>
      <button className="icon-text-button header-data-button" onClick={onData} aria-label="打开数据管理">
        <Icon name="database" size={19} /><span>数据</span>
      </button>
    </header>
  )
}
