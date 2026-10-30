import { uid } from '../lib/calculations'
import { shiftDate, todayISO } from '../lib/date'
import { builtinFoods } from './foods'

// 仅在用户主动点击「载入示例数据」时生成，不会在首次打开时自动执行。
// 内容均为虚构，用来快速预览各页面的完整状态；用户可直接清空。

const weightSeries = [
  [56.6, '经期前容易水肿，不着急'],
  [56.4, ''],
  [56.5, '睡够了，精神不错'],
  [56.2, ''],
  [56.0, '这周走了三次路'],
  [56.1, ''],
  [55.8, ''],
  [55.9, '外食偏咸，先记下来'],
  [55.6, ''],
  [55.7, ''],
  [55.4, '力量训练有点进步'],
  [55.5, ''],
  [55.2, ''],
  [55.3, ''],
  [55.0, '今天状态很好'],
]

const mealTemplates = [
  [
    ['breakfast', 'oats', 40], ['breakfast', 'milk', 250], ['breakfast', 'egg', 50],
    ['lunch', 'rice', 120], ['lunch', 'chicken', 120], ['lunch', 'broccoli', 150],
    ['dinner', 'sweet-potato', 150], ['dinner', 'fish', 120], ['dinner', 'spinach', 150],
    ['snack', 'yogurt', 150], ['snack', 'blueberry', 80],
  ],
  [
    ['breakfast', 'whole-wheat', 60], ['breakfast', 'egg', 50], ['breakfast', 'milk', 250],
    ['lunch', 'brown-rice', 130], ['lunch', 'beef', 100], ['lunch', 'tomato', 150],
    ['dinner', 'noodles', 180], ['dinner', 'shrimp', 100], ['dinner', 'cucumber', 150],
    ['snack', 'apple', 150], ['snack', 'almonds', 15],
  ],
  [
    ['breakfast', 'steamed-bun', 80], ['breakfast', 'yogurt', 150], ['breakfast', 'banana', 100],
    ['lunch', 'rice', 120], ['lunch', 'tofu', 150], ['lunch', 'mushroom', 100],
    ['dinner', 'corn', 150], ['dinner', 'chicken', 100], ['dinner', 'carrot', 100],
    ['snack', 'orange', 150], ['snack', 'walnuts', 15],
  ],
]

const workoutPlan = [
  [5, '快走', 'aerobic', 40, true],
  [5, '深蹲', 'strength', 3, true, 15],
  [4, '骑车', 'aerobic', 30, true],
  [3, '臀桥', 'strength', 3, true, 12],
  [2, '快走', 'aerobic', 35, true],
  [2, '哑铃划船', 'strength', 3, true, 12],
  [1, '游泳', 'aerobic', 45, true],
  [0, '快走', 'aerobic', 30, true],
  [0, '深蹲', 'strength', 3, false, 15],
]

const cyclePlan = [
  [-96, -91, '第一天有点腰酸，喝了热水'],
  [-62, -57, '这次间隔偏长，那阵子熬夜比较多'],
  [-38, -33, ''],
  [-3, null, '量不多，先记下来'],
]

function findFood(id) {
  return builtinFoods.find((food) => food.id === id)
}

export function createSampleData() {
  const today = todayISO()
  const now = new Date().toISOString()

  const weights = weightSeries.map(([weightKg, note], index) => {
    const date = shiftDate(today, -(weightSeries.length - 1 - index) * 2)
    return { id: uid('weight'), date, weightKg, note, createdAt: new Date().toISOString() }
  })

  const meals = []
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = shiftDate(today, -offset)
    const template = mealTemplates[(6 - offset) % mealTemplates.length]
    template.forEach(([mealType, foodId, grams]) => {
      const food = findFood(foodId)
      if (!food) return
      meals.push({
        id: uid('meal'),
        date,
        mealType,
        foodId: food.id,
        foodName: food.name,
        grams,
        kcalPer100g: food.kcalPer100g,
        createdAt: new Date().toISOString(),
      })
    })
  }

  const workouts = workoutPlan.map(([offset, name, type, amount, completed, reps]) => {
    const date = shiftDate(today, -offset)
    return {
      id: uid('workout'),
      date,
      name,
      type,
      minutes: type === 'aerobic' ? amount : null,
      sets: type === 'strength' ? amount : null,
      reps: type === 'strength' ? reps : null,
      completed,
      completedAt: completed ? new Date().toISOString() : null,
    }
  })

  const cycles = cyclePlan.map(([startOffset, endOffset, note]) => ({
    id: uid('cycle'),
    startDate: shiftDate(today, startOffset),
    endDate: endOffset === null ? null : shiftDate(today, endOffset),
    note,
  }))

  const customFoods = [
    { id: uid('food'), name: '自制鸡胸沙拉', aliases: ['沙拉'], kcalPer100g: 98, defaultGrams: 250 },
  ]

  return {
    schemaVersion: 1,
    weights,
    meals,
    customFoods,
    workouts,
    cycles,
    meta: { createdAt: now, updatedAt: now },
  }
}
