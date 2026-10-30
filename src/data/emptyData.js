export function createEmptyData() {
  const now = new Date().toISOString()
  return {
    schemaVersion: 1,
    weights: [],
    meals: [],
    customFoods: [],
    workouts: [],
    cycles: [],
    meta: { createdAt: now, updatedAt: now },
  }
}
