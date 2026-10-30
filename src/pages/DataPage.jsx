import { useRef, useState } from 'react'
import { Icon } from '../components/Icons'
import { exportData, readImportFile } from '../lib/storage'

export default function DataPage({ data, actions, notify }) {
  const fileInput = useRef(null)
  const [importing, setImporting] = useState(false)
  const counts = [
    ['体重记录', data.weights.length, 'scale'],
    ['饮食记录', data.meals.length, 'utensils'],
    ['运动计划', data.workouts.length, 'dumbbell'],
    ['周期记录', data.cycles.length, 'flower'],
  ]

  const importFile = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setImporting(true)
    try {
      const imported = await readImportFile(file)
      if (window.confirm('导入会替换当前浏览器中的全部记录，且无法撤销。确定继续吗？')) {
        actions.importData(imported)
        notify('备份已成功导入。')
      }
    } catch (error) {
      notify(error.message)
    } finally {
      setImporting(false)
      event.target.value = ''
    }
  }

  const clear = () => {
    if (window.confirm('确定清空全部体重、饮食、运动和周期记录吗？此操作无法撤销，建议先导出备份。')) {
      actions.clearData()
      notify('全部记录已清空。')
    }
  }

  return (
    <div className="page-stack data-page">
      <section className="data-intro"><span className="round-icon sage"><Icon name="database" size={26} /></span><div><h2>记录只属于你</h2><p>所有数据仅保存在当前浏览器，不会上传到服务器。清除浏览器数据或更换设备前，请先导出备份。</p></div></section>
      <section className="data-counts">{counts.map(([label, count, icon]) => <div className="card" key={label}><Icon name={icon} size={20} /><span>{label}</span><strong>{count}<small> 条</small></strong></div>)}</section>
      <div className="data-actions-grid">
        <section className="card data-action-card"><span className="round-icon peach"><Icon name="download" /></span><h3>导出完整备份</h3><p>将全部记录保存为 JSON 文件，可用于换设备或留档。</p><button className="primary-button" onClick={() => { exportData(data); notify('备份文件已开始下载。') }}>导出 JSON <Icon name="download" size={17} /></button></section>
        <section className="card data-action-card"><span className="round-icon sage"><Icon name="upload" /></span><h3>从备份恢复</h3><p>选择本项目导出的文件，校验通过后替换当前数据。</p><input ref={fileInput} hidden type="file" accept=".json,application/json" onChange={importFile} /><button className="secondary-button" disabled={importing} onClick={() => fileInput.current?.click()}>{importing ? '正在校验…' : '选择 JSON 文件'} <Icon name="upload" size={17} /></button></section>
        <section className="card data-action-card danger-card"><span className="round-icon rose"><Icon name="trash" /></span><h3>清空全部记录</h3><p>删除当前浏览器里的所有体重、饮食、运动与周期记录，操作无法撤销。</p><button className="danger-button" onClick={clear}>清空数据 <Icon name="trash" size={17} /></button></section>
      </div>
      <section className="card privacy-note"><Icon name="info" size={22} /><div><h3>本地存储说明</h3><p>本网站没有账号系统，也不会跨设备同步。同一浏览器、同一访问地址下，刷新页面后记录仍会保留；浏览器的无痕模式或禁用本地存储可能导致记录无法持久保存。</p></div></section>
    </div>
  )
}
