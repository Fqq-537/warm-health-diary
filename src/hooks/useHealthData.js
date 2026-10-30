import { useEffect, useReducer, useState } from 'react'
import { createEmptyData } from '../data/emptyData'
import { loadStoredData, saveData } from '../lib/storage'

function withMeta(data, changes) {
  return { ...data, ...changes, meta: { ...data.meta, updatedAt: new Date().toISOString() } }
}

function reducer(data, action) {
  switch (action.type) {
    case 'UPSERT_WEIGHT': {
      const exists = data.weights.some((item) => item.date === action.item.date)
      const weights = exists
        ? data.weights.map((item) => item.date === action.item.date ? { ...item, ...action.item, id: item.id } : item)
        : [...data.weights, action.item]
      return withMeta(data, { weights })
    }
    case 'UPDATE_WEIGHT':
      return withMeta(data, { weights: data.weights.map((item) => item.id === action.id ? { ...item, ...action.changes } : item) })
    case 'DELETE_WEIGHT':
      return withMeta(data, { weights: data.weights.filter((item) => item.id !== action.id) })
    case 'ADD_MEAL':
      return withMeta(data, { meals: [...data.meals, action.item] })
    case 'DELETE_MEAL':
      return withMeta(data, { meals: data.meals.filter((item) => item.id !== action.id) })
    case 'ADD_CUSTOM_FOOD':
      return withMeta(data, { customFoods: [...data.customFoods, action.item] })
    case 'ADD_WORKOUT':
      return withMeta(data, { workouts: [...data.workouts, action.item] })
    case 'TOGGLE_WORKOUT':
      return withMeta(data, {
        workouts: data.workouts.map((item) => item.id === action.id
          ? { ...item, completed: !item.completed, completedAt: !item.completed ? new Date().toISOString() : null }
          : item),
      })
    case 'DELETE_WORKOUT':
      return withMeta(data, { workouts: data.workouts.filter((item) => item.id !== action.id) })
    case 'ADD_CYCLE':
      return withMeta(data, { cycles: [...data.cycles, action.item] })
    case 'UPDATE_CYCLE':
      return withMeta(data, { cycles: data.cycles.map((item) => item.id === action.id ? { ...item, ...action.changes } : item) })
    case 'DELETE_CYCLE':
      return withMeta(data, { cycles: data.cycles.filter((item) => item.id !== action.id) })
    case 'IMPORT_DATA':
      return { ...action.data, meta: { ...action.data.meta, updatedAt: new Date().toISOString() } }
    case 'CLEAR_DATA':
      return createEmptyData()
    default:
      return data
  }
}

export function useHealthData() {
  const [initial] = useState(loadStoredData)
  const [data, dispatch] = useReducer(reducer, initial.data)
  const [storageWarning, setStorageWarning] = useState(initial.notice)

  useEffect(() => {
    const saved = saveData(data)
    setStorageWarning((current) => {
      const next = saved ? (current.startsWith('浏览器') || current.startsWith('本次') ? '' : current) : '本次记录暂时无法保存到浏览器，请先导出备份。'
      return next === current ? current : next
    })
  }, [data])

  const actions = {
    upsertWeight: (item) => dispatch({ type: 'UPSERT_WEIGHT', item }),
    updateWeight: (id, changes) => dispatch({ type: 'UPDATE_WEIGHT', id, changes }),
    deleteWeight: (id) => dispatch({ type: 'DELETE_WEIGHT', id }),
    addMeal: (item) => dispatch({ type: 'ADD_MEAL', item }),
    deleteMeal: (id) => dispatch({ type: 'DELETE_MEAL', id }),
    addCustomFood: (item) => dispatch({ type: 'ADD_CUSTOM_FOOD', item }),
    addWorkout: (item) => dispatch({ type: 'ADD_WORKOUT', item }),
    toggleWorkout: (id) => dispatch({ type: 'TOGGLE_WORKOUT', id }),
    deleteWorkout: (id) => dispatch({ type: 'DELETE_WORKOUT', id }),
    addCycle: (item) => dispatch({ type: 'ADD_CYCLE', item }),
    updateCycle: (id, changes) => dispatch({ type: 'UPDATE_CYCLE', id, changes }),
    deleteCycle: (id) => dispatch({ type: 'DELETE_CYCLE', id }),
    importData: (imported) => dispatch({ type: 'IMPORT_DATA', data: imported }),
    clearData: () => dispatch({ type: 'CLEAR_DATA' }),
  }

  return { data, actions, storageWarning }
}
