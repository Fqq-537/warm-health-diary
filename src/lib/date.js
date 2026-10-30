export function toLocalISO(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function fromISO(value) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function shiftDate(value, amount) {
  const date = typeof value === 'string' ? fromISO(value) : new Date(value)
  date.setDate(date.getDate() + amount)
  return toLocalISO(date)
}

export function formatDate(value, withYear = false) {
  if (!value) return '记录中'
  const date = fromISO(value)
  return new Intl.DateTimeFormat('zh-CN', {
    ...(withYear ? { year: 'numeric' } : {}),
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatShortDate(value) {
  const date = fromISO(value)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

export function daysBetween(start, end) {
  return Math.round((fromISO(end) - fromISO(start)) / 86400000)
}

export function todayISO() {
  return toLocalISO()
}

export function isValidDateString(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false
  const date = fromISO(value)
  return !Number.isNaN(date.getTime()) && toLocalISO(date) === value
}

export function greeting() {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了'
  if (hour < 11) return '早上好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
}
