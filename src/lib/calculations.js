import { daysBetween, todayISO } from './date'

export const mealTypeNames = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
  snack: '加餐',
}

export function mealCalories(meal) {
  return Math.round((Number(meal.grams) * Number(meal.kcalPer100g)) / 100)
}

export function caloriesForDate(meals, date) {
  return meals
    .filter((meal) => meal.date === date)
    .reduce((sum, meal) => sum + mealCalories(meal), 0)
}

export function sortedWeights(weights) {
  return [...weights].sort((a, b) => a.date.localeCompare(b.date))
}

export function latestWeight(weights) {
  return sortedWeights(weights).at(-1) || null
}

export function cycleStats(cycles) {
  const sorted = [...cycles].sort((a, b) => a.startDate.localeCompare(b.startDate))
  const intervals = sorted.slice(1).map((cycle, index) => daysBetween(sorted[index].startDate, cycle.startDate))
  const average = intervals.length
    ? Math.round(intervals.reduce((sum, value) => sum + value, 0) / intervals.length)
    : null
  const current = sorted.find((cycle) => !cycle.endDate) || null
  const recentVariation = intervals.length >= 2
    ? Math.max(...intervals.slice(-3)) - Math.min(...intervals.slice(-3))
    : 0

  return {
    sorted: [...sorted].reverse(),
    intervals,
    average,
    current,
    currentDay: current ? daysBetween(current.startDate, todayISO()) + 1 : null,
    showVariationTip: recentVariation > 7,
  }
}

export function uid(prefix = 'item') {
  if (globalThis.crypto?.randomUUID) return `${prefix}-${globalThis.crypto.randomUUID()}`
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}
