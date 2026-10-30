import { useMemo, useState } from 'react'
import EmptyState from '../components/EmptyState'
import TrendChart from '../components/TrendChart'
import { Icon } from '../components/Icons'
import { latestWeight, sortedWeights, uid } from '../lib/calculations'
import { formatDate, todayISO } from '../lib/date'
import { isPositiveNumber } from '../lib/validation'

export default function WeightPage({ data, actions, notify }) {
  const [form, setForm] = useState({ date: todayISO(), weightKg: '', note: '' })
  const [editingId, setEditingId] = useState(null)
  const [range, setRange] = useState(7)
  const sorted = useMemo(() => sortedWeights(data.weights), [data.weights])
  const visible = range === 'all' ? sorted : sorted.slice(-range)
  const latest = latestWeight(data.weights)
  const previous = sorted.at(-2)
  const change = latest && previous ? (latest.weightKg - previous.weightKg).toFixed(1) : null

  const submit = (event) => {
    event.preventDefault()
    if (!form.date || form.date > todayISO()) return notify('请选择今天或过去的日期。')
    if (!isPositiveNumber(form.weightKg, 300)) return notify('请输入 0–300 kg 之间的有效体重。')
    if (form.note.length > 200) return notify('备注请控制在 200 字以内。')
    if (editingId && data.weights.some((item) => item.date === form.date && item.id !== editingId)) return notify('这个日期已有另一条体重记录，请更换日期。')
    const item = { ...form, weightKg: Number(Number(form.weightKg).toFixed(1)) }
    if (editingId) {
      actions.updateWeight(editingId, item)
      notify('体重记录已更新。')
    } else {
      actions.upsertWeight({ ...item, id: uid('weight'), createdAt: new Date().toISOString() })
      notify('今天的体重已记下。')
    }
    setEditingId(null)
    setForm({ date: todayISO(), weightKg: '', note: '' })
  }

  const edit = (item) => {
    setEditingId(item.id)
    setForm({ date: item.date, weightKg: item.weightKg, note: item.note || '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const remove = (id) => {
    if (window.confirm('确定删除这条体重记录吗？')) {
      actions.deleteWeight(id)
      notify('记录已删除。')
    }
  }

  return (
    <div className="page-stack">
      <section className="metric-banner weight-banner">
        <div><span>最近一次体重</span><strong>{latest ? latest.weightKg : '—'} <small>kg</small></strong><p>{latest ? `${formatDate(latest.date)} 记录` : '从第一次记录开始了解自己'}</p></div>
        <div className="metric-difference"><span>较上次</span><strong>{change === null ? '—' : `${change > 0 ? '+' : ''}${change} kg`}</strong><p>单日变化不代表减脂效果</p></div>
      </section>

      <div className="two-column-layout form-first-mobile">
        <section className="card form-card">
          <div className="section-heading"><div><span className="eyebrow">{editingId ? '编辑记录' : '新记录'}</span><h3>{editingId ? '修改体重' : '今天体重是多少？'}</h3></div><span className="round-icon peach"><Icon name="scale" /></span></div>
          <form onSubmit={submit} className="stack-form">
            <div className="form-row two-fields">
              <label>日期<input type="date" value={form.date} max={todayISO()} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></label>
              <label>体重（kg）<div className="input-suffix"><input type="number" inputMode="decimal" min="1" max="300" step="0.1" placeholder="例如 55.8" value={form.weightKg} onChange={(e) => setForm({ ...form, weightKg: e.target.value })} required /><span>kg</span></div></label>
            </div>
            <label>此刻的感受（选填）<textarea rows="3" maxLength="200" placeholder="睡眠、状态或任何想记下的小事…" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></label>
            <div className="form-actions"><button className="primary-button" type="submit">{editingId ? '保存修改' : '记下体重'}<Icon name="check" size={17} /></button>{editingId && <button type="button" className="secondary-button" onClick={() => { setEditingId(null); setForm({ date: todayISO(), weightKg: '', note: '' }) }}>取消编辑</button>}</div>
          </form>
          <p className="form-tip"><Icon name="sparkles" size={15} />建议在相近的时间、相似的状态下测量，更有助于观察趋势。</p>
        </section>

        <section className="card chart-card weight-chart-card">
          <div className="section-heading chart-heading"><div><span className="eyebrow">身体趋势</span><h3>我的体重曲线</h3></div><div className="segmented-control">{[7, 30, 'all'].map((value) => <button key={value} className={range === value ? 'active' : ''} onClick={() => setRange(value)}>{value === 'all' ? '全部' : `${value} 次`}</button>)}</div></div>
          {visible.length ? <TrendChart weights={visible} /> : <EmptyState icon="scale" title="曲线正在等你" text="添加体重记录后，这里会出现趋势图。" />}
        </section>
      </div>

      <section className="card history-card">
        <div className="section-heading"><div><span className="eyebrow">按时间保存</span><h3>历史记录 <small>{data.weights.length} 条</small></h3></div></div>
        {sorted.length ? <div className="record-list">{[...sorted].reverse().map((item) => (
          <div className="record-row" key={item.id}>
            <div className="record-date"><strong>{formatDate(item.date)}</strong><span>{item.note || '没有添加备注'}</span></div>
            <strong className="record-value">{item.weightKg}<small> kg</small></strong>
            <div className="row-actions"><button onClick={() => edit(item)} aria-label="编辑体重"><Icon name="edit" size={17} /></button><button onClick={() => remove(item.id)} aria-label="删除体重"><Icon name="trash" size={17} /></button></div>
          </div>
        ))}</div> : <EmptyState icon="scale" title="还没有历史记录" />}
      </section>
    </div>
  )
}
