import { useState } from 'react'
import EmptyState from '../components/EmptyState'
import { Icon } from '../components/Icons'
import { cycleStats, uid } from '../lib/calculations'
import { daysBetween, formatDate, todayISO } from '../lib/date'

export default function CyclePage({ data, actions, notify }) {
  const [form, setForm] = useState({ startDate: todayISO(), endDate: '', note: '' })
  const stats = cycleStats(data.cycles)

  const submit = (event) => {
    event.preventDefault()
    const endDate = form.endDate || null
    if (!form.startDate || form.startDate > todayISO()) return notify('开始日期不能晚于今天。')
    if (endDate && (endDate < form.startDate || endDate > todayISO())) return notify('请检查结束日期，它不能早于开始日期或晚于今天。')
    if (!endDate && stats.current) return notify('已有一段进行中的周期，请先结束本次记录。')
    const newEnd = endDate || '9999-12-31'
    const overlaps = data.cycles.some((item) => form.startDate <= (item.endDate || '9999-12-31') && newEnd >= item.startDate)
    if (overlaps) return notify('这段日期与已有周期记录重叠，请检查后再保存。')
    actions.addCycle({ id: uid('cycle'), ...form, endDate })
    setForm({ startDate: todayISO(), endDate: '', note: '' })
    notify('周期记录已保存，继续留意身体的变化。')
  }

  const endCurrent = () => {
    if (!stats.current) return
    if (todayISO() < stats.current.startDate) return notify('结束日期不能早于开始日期。')
    actions.updateCycle(stats.current.id, { endDate: todayISO() })
    notify('本次经期已结束记录。')
  }

  return (
    <div className="page-stack">
      <section className="cycle-hero">
        <div className="cycle-hero-copy"><span className="eyebrow">我的身体节律</span><h2>{stats.current ? `经期第 ${stats.currentDay} 天` : '每一次记录，都更了解自己'}</h2><p>{stats.current ? `本次开始于 ${formatDate(stats.current.startDate)}，注意休息和保暖。` : '周期会受压力、作息与运动影响，偶尔波动并不需要自责。'}</p>{stats.current && <button className="light-button" onClick={endCurrent}>结束本次经期 <Icon name="check" size={17} /></button>}</div>
        <div className="cycle-stats"><div><span>已记录</span><strong>{data.cycles.length}<small> 段</small></strong></div><div><span>平均间隔</span><strong>{stats.average || '—'}<small>{stats.average ? ' 天' : ''}</small></strong></div></div>
      </section>

      {stats.showVariationTip && <div className="gentle-notice"><Icon name="flower" size={22} /><div><strong>近期记录中的周期有一些波动</strong><p>压力、作息和运动都可能带来影响。如果这种情况持续或让你感到不适，可以考虑咨询专业医生。</p></div></div>}

      <div className="two-column-layout cycle-layout">
        <section className="card form-card">
          <div className="section-heading"><div><span className="eyebrow">记录一段经期</span><h3>添加周期</h3></div><span className="round-icon rose"><Icon name="calendar" /></span></div>
          <form className="stack-form" onSubmit={submit}>
            <div className="form-row two-fields"><label>开始日期<input type="date" max={todayISO()} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required /></label><label>结束日期（选填）<input type="date" max={todayISO()} min={form.startDate} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></label></div>
            <label>身体感受或备注（选填）<textarea rows="3" maxLength="200" placeholder="如：腰腹有些不适，今天早点休息…" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></label>
            <button className="primary-button" type="submit">保存周期 <Icon name="check" size={17} /></button>
          </form>
          <p className="form-tip"><Icon name="info" size={15} />不填写结束日期即表示经期仍在进行中。</p>
        </section>

        <section className="card cycle-care-card"><span className="eyebrow">给身体多一点照顾</span><h3>节食不是越少越好</h3><p>长期摄入不足、过量运动和较大心理压力，都可能影响正常周期。比起追求体重快速下降，规律饮食与充足休息更重要。</p><div className="care-tags"><span>规律三餐</span><span>充足睡眠</span><span>适度运动</span><span>关注感受</span></div><small>如果出现持续异常或明显不适，请及时咨询专业医生。</small></section>
      </div>

      <section className="card history-card">
        <div className="section-heading"><div><span className="eyebrow">周期历史</span><h3>过去的记录 <small>{data.cycles.length} 段</small></h3></div></div>
        {stats.sorted.length ? <div className="cycle-history">{stats.sorted.map((item, index) => {
          const older = stats.sorted[index + 1]
          const interval = older ? daysBetween(older.startDate, item.startDate) : null
          return <article className="cycle-record" key={item.id}><div className="cycle-timeline"><span /><i /></div><div className="cycle-record-content"><div><span className={!item.endDate ? 'status-pill current' : 'status-pill'}>{!item.endDate ? '进行中' : `${daysBetween(item.startDate, item.endDate) + 1} 天经期`}</span><h4>{formatDate(item.startDate, true)} — {item.endDate ? formatDate(item.endDate, true) : '今天'}</h4><p>{item.note || '没有添加备注'}{interval !== null ? ` · 距上次开始 ${interval} 天` : ''}</p></div><button className="delete-icon-button" onClick={() => { if (window.confirm('确定删除这段周期记录吗？')) actions.deleteCycle(item.id) }} aria-label="删除周期记录"><Icon name="trash" size={17} /></button></div></article>
        })}</div> : <EmptyState icon="flower" title="还没有周期记录" text="添加第一段记录，慢慢了解自己的节律。" />}
      </section>
      <p className="page-disclaimer"><Icon name="info" size={16} />周期统计仅基于已填写记录，不用于避孕、备孕或疾病诊断。</p>
    </div>
  )
}
