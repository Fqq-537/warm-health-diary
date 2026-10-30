import { useState } from 'react'
import EmptyState from '../components/EmptyState'
import { Icon } from '../components/Icons'
import { uid } from '../lib/calculations'
import { formatDate, shiftDate, todayISO } from '../lib/date'
import { isPositiveNumber } from '../lib/validation'

export default function WorkoutPage({ data, actions, notify }) {
  const [selectedDate, setSelectedDate] = useState(todayISO())
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState({ date: todayISO(), name: '', type: 'aerobic', minutes: '30', sets: '3', reps: '12' })
  const dayWorkouts = data.workouts.filter((item) => item.date === selectedDate && (filter === 'all' || item.type === filter)).sort((a, b) => Number(a.completed) - Number(b.completed))
  const allDay = data.workouts.filter((item) => item.date === selectedDate)
  const completeCount = allDay.filter((item) => item.completed).length

  const submit = (event) => {
    event.preventDefault()
    if (!form.name.trim()) return notify('给这次运动起个名字吧。')
    if (form.type === 'aerobic' && !isPositiveNumber(form.minutes, 600)) return notify('请输入 1–600 分钟之间的时长。')
    if (form.type === 'strength' && (!isPositiveNumber(form.sets, 100) || !isPositiveNumber(form.reps, 1000))) return notify('请输入有效的组数和次数。')
    actions.addWorkout({
      id: uid('workout'), date: form.date, name: form.name.trim(), type: form.type,
      minutes: form.type === 'aerobic' ? Number(form.minutes) : null,
      sets: form.type === 'strength' ? Number(form.sets) : null,
      reps: form.type === 'strength' ? Number(form.reps) : null,
      completed: false, completedAt: null,
    })
    setSelectedDate(form.date)
    setForm({ ...form, name: '' })
    notify('运动计划已添加，量力而行就好。')
  }

  return (
    <div className="page-stack">
      <section className="metric-banner workout-banner">
        <div><span>{formatDate(selectedDate)} · 完成进度</span><strong>{completeCount}<small> / {allDay.length} 项</small></strong><p>{allDay.length ? '完成不是目标，感受身体的活力才是' : '今天还没有运动安排，休息也是计划的一部分'}</p></div>
        <div className="progress-ring" style={{ '--progress': allDay.length ? `${completeCount / allDay.length * 360}deg` : '0deg' }}><span>{allDay.length ? Math.round(completeCount / allDay.length * 100) : 0}%</span></div>
      </section>

      <div className="two-column-layout workout-layout">
        <section className="card form-card">
          <div className="section-heading"><div><span className="eyebrow">制定适合自己的计划</span><h3>添加运动</h3></div><span className="round-icon sage"><Icon name="dumbbell" /></span></div>
          <form className="stack-form" onSubmit={submit}>
            <div className="form-row two-fields"><label>计划日期<input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></label><label>运动类型<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="aerobic">有氧运动</option><option value="strength">力量训练</option></select></label></div>
            <label>动作或运动名称<input maxLength="40" placeholder={form.type === 'aerobic' ? '如：快走、骑车、游泳' : '如：深蹲、臀桥、平板支撑'} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
            {form.type === 'aerobic' ? <label>计划时长（分钟）<input type="number" min="1" max="600" value={form.minutes} onChange={(e) => setForm({ ...form, minutes: e.target.value })} /></label> : <div className="form-row two-fields"><label>组数<input type="number" min="1" max="100" value={form.sets} onChange={(e) => setForm({ ...form, sets: e.target.value })} /></label><label>每组次数<input type="number" min="1" max="1000" value={form.reps} onChange={(e) => setForm({ ...form, reps: e.target.value })} /></label></div>}
            <button className="primary-button" type="submit">加入计划 <Icon name="plus" size={17} /></button>
          </form>
        </section>

        <section className="card workout-guide">
          <span className="eyebrow">温和运动指南</span><h3>有氧 + 力量，不必一次做完</h3>
          <div className="guide-item"><span>01</span><div><strong>先热身，再开始</strong><p>用 5–10 分钟轻松活动身体，不追求疼痛或力竭。</p></div></div>
          <div className="guide-item"><span>02</span><div><strong>动作规范比数量重要</strong><p>力量训练循序渐进，给肌肉留出恢复时间。</p></div></div>
          <div className="guide-item"><span>03</span><div><strong>留意身体的反馈</strong><p>出现头晕或明显不适时停止运动，必要时寻求专业帮助。</p></div></div>
        </section>
      </div>

      <section className="card workout-list-card">
        <div className="workout-list-toolbar"><div className="date-stepper"><button onClick={() => setSelectedDate(shiftDate(selectedDate, -1))} aria-label="前一天"><Icon name="left" /></button><input aria-label="运动计划日期" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} /><button onClick={() => setSelectedDate(shiftDate(selectedDate, 1))} aria-label="后一天"><Icon name="right" /></button></div><div className="segmented-control">{[['all', '全部'], ['aerobic', '有氧'], ['strength', '力量']].map(([value, label]) => <button key={value} className={filter === value ? 'active' : ''} onClick={() => setFilter(value)}>{label}</button>)}</div></div>
        {dayWorkouts.length ? <div className="workout-list">{dayWorkouts.map((item) => <article className={`workout-item ${item.completed ? 'is-complete' : ''}`} key={item.id}><span className={`workout-type-icon ${item.type}`}><Icon name={item.type === 'aerobic' ? 'flame' : 'dumbbell'} size={22} /></span><div className="workout-item-copy"><span>{item.type === 'aerobic' ? '有氧运动' : '力量训练'}</span><h4>{item.name}</h4><p>{item.type === 'aerobic' ? `${item.minutes} 分钟` : `${item.sets} 组 × 每组 ${item.reps} 次`}{item.completed ? ' · 已完成' : ''}</p></div><button className={item.completed ? 'complete-button completed' : 'complete-button'} onClick={() => actions.toggleWorkout(item.id)}><Icon name="check" size={17} />{item.completed ? '取消完成' : '完成打卡'}</button><button className="delete-icon-button" onClick={() => { if (window.confirm(`删除「${item.name}」计划吗？`)) actions.deleteWorkout(item.id) }} aria-label={`删除${item.name}`}><Icon name="trash" size={17} /></button></article>)}</div> : <EmptyState icon="dumbbell" title={allDay.length ? '这个分类下没有计划' : '这一天还没有运动计划'} text={allDay.length ? '切换分类查看其他运动。' : '可以添加轻松的活动，也可以安心休息。'} />}
      </section>
    </div>
  )
}
