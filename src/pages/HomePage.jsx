import TipCarousel from '../components/TipCarousel'
import TrendChart from '../components/TrendChart'
import EmptyState from '../components/EmptyState'
import { Icon } from '../components/Icons'
import { caloriesForDate, cycleStats, latestWeight, mealCalories, sortedWeights } from '../lib/calculations'
import { formatDate, greeting, todayISO } from '../lib/date'

export default function HomePage({ data, onNavigate }) {
  const today = todayISO()
  const weight = latestWeight(data.weights)
  const todayMeals = data.meals.filter((item) => item.date === today)
  const todayWorkouts = data.workouts.filter((item) => item.date === today)
  const completed = todayWorkouts.filter((item) => item.completed).length
  const cycle = cycleStats(data.cycles)
  const recentWeights = sortedWeights(data.weights).slice(-7)

  const summaries = [
    { page: 'weight', icon: 'scale', label: '最近体重', value: weight ? weight.weightKg : '—', unit: 'kg', note: weight ? `${formatDate(weight.date)} 记录` : '记录第一次体重', tone: 'peach' },
    { page: 'meals', icon: 'flame', label: '今日摄入', value: caloriesForDate(data.meals, today), unit: 'kcal', note: `${todayMeals.length} 条饮食记录`, tone: 'cream' },
    { page: 'workout', icon: 'dumbbell', label: '今日运动', value: `${completed}/${todayWorkouts.length}`, unit: '项', note: completed ? '每一次活动都值得肯定' : '选择喜欢的方式动起来', tone: 'sage' },
    { page: 'cycle', icon: 'flower', label: '周期状态', value: cycle.current ? `第 ${cycle.currentDay} 天` : (data.cycles.length ? '已记录' : '未记录'), unit: '', note: cycle.average ? `平均间隔约 ${cycle.average} 天` : `${data.cycles.length} 段周期记录`, tone: 'rose' },
  ]

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="hero-copy">
          <span className="eyebrow">{formatDate(today, true)} · {greeting()}</span>
          <h2>不追赶数字，<br /><em>只倾听身体。</em></h2>
          <p>把每一次记录当作对自己的了解，<br className="desktop-only" />健康的生活，从温柔地关注自己开始。</p>
          <button className="primary-button" onClick={() => onNavigate('weight')}>记录今天 <Icon name="arrow" size={18} /></button>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-center"><Icon name="flower" size={58} /></div>
          <span className="art-note">BREATHE · EAT · MOVE · REST</span>
        </div>
      </section>

      <section className="summary-grid" aria-label="今日健康摘要">
        {summaries.map((item) => (
          <button className="summary-card" key={item.page} onClick={() => onNavigate(item.page)}>
            <span className={`summary-icon ${item.tone}`}><Icon name={item.icon} size={21} /></span>
            <span className="summary-label">{item.label}<Icon name="right" size={14} /></span>
            <strong>{item.value} <small>{item.unit}</small></strong>
            <span className="summary-note">{item.note}</span>
          </button>
        ))}
      </section>

      <TipCarousel />

      <div className="home-grid">
        <section className="card chart-card">
          <div className="section-heading">
            <div><span className="eyebrow">近 7 次记录</span><h3>体重的小趋势</h3></div>
            <button className="text-button" onClick={() => onNavigate('weight')}>全部记录 <Icon name="right" size={15} /></button>
          </div>
          {recentWeights.length ? <TrendChart weights={recentWeights} /> : <EmptyState icon="scale" title="还没有体重记录" text="先记录一次，之后就能看到自己的趋势。" />}
          <p className="chart-footnote"><Icon name="info" size={15} />日常波动很正常，我们只看长期趋势。</p>
        </section>

        <section className="card today-card">
          <div className="section-heading">
            <div><span className="eyebrow">今日节奏</span><h3>饮食与运动</h3></div>
          </div>
          <div className="today-section">
            <div className="mini-title"><span><Icon name="utensils" size={17} />今日饮食</span><button onClick={() => onNavigate('meals')}>去记录</button></div>
            {todayMeals.length ? (
              <div className="mini-meal-list">
                {todayMeals.slice(0, 3).map((meal) => <div key={meal.id}><span>{meal.foodName}<small>{meal.grams}g</small></span><strong>{mealCalories(meal)} kcal</strong></div>)}
                {todayMeals.length > 3 && <p>还有 {todayMeals.length - 3} 条记录</p>}
              </div>
            ) : <p className="muted">今天还没有饮食记录。</p>}
          </div>
          <div className="today-section workout-mini">
            <div className="mini-title"><span><Icon name="dumbbell" size={17} />今日运动</span><button onClick={() => onNavigate('workout')}>看计划</button></div>
            {todayWorkouts.length ? todayWorkouts.slice(0, 3).map((item) => (
              <div className="mini-workout" key={item.id}><span className={item.completed ? 'done' : ''}><Icon name="check" size={13} /></span><p className={item.completed ? 'completed' : ''}>{item.name}</p><small>{item.type === 'aerobic' ? `${item.minutes} 分钟` : `${item.sets} 组 × ${item.reps} 次`}</small></div>
            )) : <p className="muted">今天没有安排，可以好好休息。</p>}
          </div>
        </section>
      </div>
    </div>
  )
}
