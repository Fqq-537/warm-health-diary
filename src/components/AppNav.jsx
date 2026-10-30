import { Icon } from './Icons'

export const navigation = [
  { id: 'home', label: '今日', icon: 'home' },
  { id: 'weight', label: '体重', icon: 'scale' },
  { id: 'meals', label: '饮食', icon: 'utensils' },
  { id: 'workout', label: '运动', icon: 'dumbbell' },
  { id: 'cycle', label: '周期', icon: 'flower' },
]

export function Brand() {
  return (
    <div className="brand" aria-label="暖暖健康日记">
      <span className="brand-mark"><Icon name="flower" size={24} /></span>
      <span><strong>暖暖</strong><small>健康日记</small></span>
    </div>
  )
}

export default function AppNav({ page, onNavigate, onData }) {
  return (
    <>
      <aside className="sidebar">
        <Brand />
        <p className="brand-note">认真生活，也温柔待己。</p>
        <nav className="side-nav" aria-label="主导航">
          {navigation.map((item) => (
            <button key={item.id} className={page === item.id ? 'active' : ''} onClick={() => onNavigate(item.id)}>
              <Icon name={item.icon} /><span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className={`data-nav ${page === 'data' ? 'active' : ''}`} onClick={onData}>
            <Icon name="database" /><span>数据管理</span>
          </button>
          <p>数据仅保存在当前浏览器</p>
        </div>
      </aside>
      <nav className="bottom-nav" aria-label="移动端主导航">
        {navigation.map((item) => (
          <button key={item.id} className={page === item.id ? 'active' : ''} onClick={() => onNavigate(item.id)} aria-current={page === item.id ? 'page' : undefined}>
            <Icon name={item.icon} size={22} /><span>{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  )
}
