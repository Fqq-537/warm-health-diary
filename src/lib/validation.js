import { isValidDateString } from './date'

export function isPositiveNumber(value, max = 10000) {
  const number = Number(value)
  return Number.isFinite(number) && number > 0 && number <= max
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function validText(value, max = 200) {
  return typeof value === 'string' && value.length <= max
}

export function validateImportedData(data) {
  if (!isObject(data) || data.schemaVersion !== 1) return '文件版本不受支持，请选择本项目导出的 JSON 文件。'
  const arrays = ['weights', 'meals', 'customFoods', 'workouts', 'cycles']
  if (!arrays.every((key) => Array.isArray(data[key]))) return '文件缺少必要的数据列表。'
  if (arrays.some((key) => data[key].length > 20000)) return '文件记录数量过多，无法导入。'

  for (const item of data.weights) {
    if (!isObject(item) || !validText(item.id) || !isValidDateString(item.date) || !isPositiveNumber(item.weightKg, 500) || !validText(item.note || '')) {
      return '文件中的体重记录格式不正确。'
    }
  }
  for (const item of data.meals) {
    if (!isObject(item) || !validText(item.id) || !isValidDateString(item.date) || !['breakfast', 'lunch', 'dinner', 'snack'].includes(item.mealType) || !validText(item.foodName) || !isPositiveNumber(item.grams, 10000) || !isPositiveNumber(item.kcalPer100g, 10000)) {
      return '文件中的饮食记录格式不正确。'
    }
  }
  for (const item of data.customFoods) {
    if (!isObject(item) || !validText(item.id) || !validText(item.name) || !Array.isArray(item.aliases) || !item.aliases.every((alias) => validText(alias, 40)) || !isPositiveNumber(item.kcalPer100g, 10000) || !isPositiveNumber(item.defaultGrams, 10000)) {
      return '文件中的自定义食物格式不正确。'
    }
  }
  for (const item of data.workouts) {
    if (!isObject(item) || !validText(item.id) || !isValidDateString(item.date) || !validText(item.name) || !['aerobic', 'strength'].includes(item.type) || typeof item.completed !== 'boolean') {
      return '文件中的运动记录格式不正确。'
    }
  }
  for (const item of data.cycles) {
    if (!isObject(item) || !validText(item.id) || !isValidDateString(item.startDate) || (item.endDate !== null && !isValidDateString(item.endDate)) || !validText(item.note || '')) {
      return '文件中的周期记录格式不正确。'
    }
  }
  return null
}
