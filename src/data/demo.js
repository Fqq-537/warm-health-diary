import { shiftDate, todayISO } from '../lib/date'
import { uid } from '../lib/calculations'
import { builtinFoods } from './foods'

const now = () => new Date().toISOString()

export function createEmptyData() {
  return {
    schemaVersion: 1,
    weights: [],
    meals: [],
    customFoods: [],
    workouts: [],
    cycles: [],
    meta: { createdAt: now(), updatedAt: now() },
  }
}

export function createDemoData() {
  const today = todayISO()
  const weightValues = [56.8, 56.7, 56.9, 56.6, 56.5, 56.7, 56.4, 56.3, 56.5, 56.2, 56.1, 56.3, 56.0, 55.9]
  const weights = weightValues.map((weightKg, index) => ({
    id: uid('weight'),
    date: shiftDate(today, index - 13),
    weightKg,
    note: index === 13 ? '昨晚睡眠不错，今天状态也很好。' : '',
    createdAt: now(),
  }))

  const mealTemplates = [
    ['oats', 'milk', 'blueberry'],
    ['egg', 'whole-wheat', 'apple'],
    ['sweet-potato', 'yogurt', 'banana'],
    ['oats', 'egg', 'orange'],
    ['whole-wheat', 'milk', 'strawberry'],
    ['sweet-potato', 'egg', 'milk'],
    ['oats', 'yogurt', 'banana'],
  ]
  const lunchTemplates = ['rice', 'chicken', 'broccoli']
  const dinnerTemplates = [
    ['brown-rice', 'fish', 'spinach'],
    ['sweet-potato', 'tofu', 'tomato'],
    ['noodles', 'shrimp', 'mushroom'],
    ['rice', 'beef', 'carrot'],
    ['corn', 'chicken', 'cucumber'],
    ['brown-rice', 'fish', 'broccoli'],
    ['rice', 'tofu', 'spinach'],
  ]
  const meals = []
  const addMeal = (date, mealType, foodId, grams) => {
    const food = builtinFoods.find((item) => item.id === foodId)
    meals.push({
      id: uid('meal'),
      date,
      mealType,
      foodId,
      foodName: food.name,
      grams: grams || food.defaultGrams,
      kcalPer100g: food.kcalPer100g,
      createdAt: now(),
    })
  }

  for (let day = 6; day >= 0; day -= 1) {
    const date = shiftDate(today, -day)
    const index = 6 - day
    mealTemplates[index].forEach((foodId) => addMeal(date, 'breakfast', foodId))
    lunchTemplates.forEach((foodId) => addMeal(date, 'lunch', foodId))
    dinnerTemplates[index].forEach((foodId) => addMeal(date, 'dinner', foodId))
    if (index % 2 === 0) addMeal(date, 'snack', index === 6 ? 'yogurt' : 'apple')
    if (index === 2 || index === 5) addMeal(date, 'snack', 'almonds')
  }

  const customFoods = [
    { id: 'custom-salad', name: '鸡胸蔬菜沙拉', aliases: ['鸡肉沙拉'], kcalPer100g: 128, defaultGrams: 250 },
    { id: 'custom-overnight-oats', name: '自制隔夜燕麦', aliases: ['隔夜燕麦'], kcalPer100g: 145, defaultGrams: 200 },
  ]

  const workoutTemplates = [
    { offset: -3, name: '晚饭后快走', type: 'aerobic', minutes: 35, completed: true },
    { offset: -2, name: '深蹲', type: 'strength', sets: 3, reps: 12, completed: true },
    { offset: -2, name: '臀桥', type: 'strength', sets: 3, reps: 15, completed: true },
    { offset: -1, name: '舒缓骑车', type: 'aerobic', minutes: 30, completed: true },
    { offset: 0, name: '平板支撑', type: 'strength', sets: 3, reps: 12, completed: false },
    { offset: 0, name: '轻松快走', type: 'aerobic', minutes: 30, completed: false },
    { offset: 1, name: '深蹲', type: 'strength', sets: 3, reps: 12, completed: false },
  ]
  const workouts = workoutTemplates.map((item) => ({
    id: uid('workout'),
    date: shiftDate(today, item.offset),
    name: item.name,
    type: item.type,
    minutes: item.minutes || null,
    sets: item.sets || null,
    reps: item.reps || null,
    completed: item.completed,
    completedAt: item.completed ? now() : null,
  }))

  const cycles = [
    { id: uid('cycle'), startDate: shiftDate(today, -93), endDate: shiftDate(today, -89), note: '' },
    { id: uid('cycle'), startDate: shiftDate(today, -63), endDate: shiftDate(today, -59), note: '' },
    { id: uid('cycle'), startDate: shiftDate(today, -34), endDate: shiftDate(today, -30), note: '' },
    { id: uid('cycle'), startDate: shiftDate(today, -3), endDate: null, note: '保持规律饮食和休息。' },
  ]

  return {
    schemaVersion: 1,
    weights,
    meals,
    customFoods,
    workouts,
    cycles,
    meta: { createdAt: now(), updatedAt: now() },
  }
}
