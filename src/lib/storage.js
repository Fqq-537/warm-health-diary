import { createEmptyData } from '../data/emptyData'
import { todayISO } from './date'
import { validateImportedData } from './validation'

export const STORAGE_KEY = 'warm-health-diary:v2'
const LEGACY_STORAGE_KEY = 'warm-health-diary:v1'

export function loadStoredData() {
  try {
    // 旧版本自动预填过演示数据，升级时一并移除。
    localStorage.removeItem(LEGACY_STORAGE_KEY)
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { data: createEmptyData(), notice: '' }
    const parsed = JSON.parse(raw)
    const error = validateImportedData(parsed)
    if (error) {
      return { data: createEmptyData(), notice: '原有数据无法读取，已从空白记录开始。你可以从备份文件恢复记录。' }
    }
    return { data: parsed, notice: '' }
  } catch {
    return { data: createEmptyData(), notice: '浏览器中的数据无法读取，已从空白记录开始。' }
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

export function exportData(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `warm-health-diary-${todayISO()}.json`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export async function readImportFile(file) {
  if (!file) throw new Error('请选择要导入的 JSON 文件。')
  if (file.size > 2 * 1024 * 1024) throw new Error('文件不能超过 2MB。')
  if (!file.name.toLowerCase().endsWith('.json')) throw new Error('请选择 .json 格式的备份文件。')
  let parsed
  try {
    parsed = JSON.parse(await file.text())
  } catch {
    throw new Error('文件不是有效的 JSON，请重新选择。')
  }
  const error = validateImportedData(parsed)
  if (error) throw new Error(error)
  return parsed
}
