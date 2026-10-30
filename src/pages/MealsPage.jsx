import { useMemo, useState } from 'react'
import EmptyState from '../components/EmptyState'
import { Icon } from '../components/Icons'
import { builtinFoods } from '../data/foods'
import { caloriesForDate, mealCalories, mealTypeNames, uid } from '../lib/calculations'
import { formatDate, shiftDate, todayISO } from '../lib/date'
import { isPositiveNumber } from '../lib/validation'

const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack']

export default function MealsPage({ data, actions, notify }) {
  const [selectedDate, setSelectedDate] = useState(todayISO())
  const [mealType, setMealType] = useState('breakfast')
  const [query, setQuery] = useState('')
  const [selectedFood, setSelectedFood] = useState(null)
  const [grams, setGrams] = useState('')
  const [showCustom, setShowCustom] = useState(false)
  const [custom, setCustom] = useState({ name: '', kcalPer100g: '', defaultGrams: '100' })
  const foods = useMemo(() => [...data.customFoods, ...builtinFoods], [data.customFoods])
  const results = query.trim()
    ? foods.filter((food) => [food.name, ...(food.aliases || [])].some((name) => name.toLowerCase().includes(query.trim().toLowerCase()))).slice(0, 6)
    : []
  const dayMeals = data.meals.filter((item) => item.date === selectedDate)
  const estimated = selectedFood && isPositiveNumber(grams, 10000) ? Math.round(Number(grams) * selectedFood.kcalPer100g / 100) : 0

  const selectFood = (food) => {
    setSelectedFood(food)
    setQuery(food.name)
    setGrams(String(food.defaultGrams))
  }

  const addMeal = (event) => {
    event.preventDefault()
    if (!selectedFood) return notify('请先从搜索结果中选择一种食物。')
    if (!isPositiveNumber(grams, 10000)) return notify('请输入有效的食物克数。')
    actions.addMeal({
      id: uid('meal'), date: selectedDate, mealType,
      foodId: selectedFood.id, foodName: selectedFood.name,
      grams: Number(grams), kcalPer100g: selectedFood.kcalPer100g,
      createdAt: new Date().toISOString(),
    })
    setSelectedFood(null)
    setQuery('')
    setGrams('')
    notify(`已加入${mealTypeNames[mealType]}。`)
  }

  const addCustomFood = (event) => {
    event.preventDefault()
    if (!custom.name.trim()) return notify('请输入食物名称。')
    if (!isPositiveNumber(custom.kcalPer100g, 2000) || !isPositiveNumber(custom.defaultGrams, 10000)) return notify('请填写有效的热量和默认份量。')
    const item = { id: uid('food'), name: custom.name.trim(), aliases: [], kcalPer100g: Number(custom.kcalPer100g), defaultGrams: Number(custom.defaultGrams) }
    actions.addCustomFood(item)
    selectFood(item)
    setCustom({ name: '', kcalPer100g: '', defaultGrams: '100' })
    setShowCustom(false)
    notify('自定义食物已保存，下次可以直接搜索。')
  }

  return (
    <div className="page-stack">
      <section className="metric-banner meal-banner">
        <div><span>{formatDate(selectedDate)} · 饮食合计</span><strong>{caloriesForDate(data.meals, selectedDate)} <small>kcal</small></strong><p>共 {dayMeals.length} 条记录，热量为近似参考值</p></div>
        <div className="date-stepper">
          <button onClick={() => setSelectedDate(shiftDate(selectedDate, -1))} aria-label="前一天"><Icon name="left" /></button>
          <input aria-label="饮食记录日期" type="date" value={selectedDate} max={todayISO()} onChange={(e) => setSelectedDate(e.target.value)} />
          <button disabled={selectedDate >= todayISO()} onClick={() => setSelectedDate(shiftDate(selectedDate, 1))} aria-label="后一天"><Icon name="right" /></button>
        </div>
      </section>

      <section className="card form-card meal-form-card">
        <div className="section-heading"><div><span className="eyebrow">搜索食物库</span><h3>今天吃了什么？</h3></div><button className="text-button" onClick={() => setShowCustom(!showCustom)}><Icon name="plus" size={16} />自定义食物</button></div>
        <div className="meal-type-tabs" role="tablist" aria-label="餐次">
          {mealTypes.map((type) => <button role="tab" aria-selected={mealType === type} key={type} className={mealType === type ? 'active' : ''} onClick={() => setMealType(type)}>{mealTypeNames[type]}</button>)}
        </div>
        <form onSubmit={addMeal} className="food-form">
          <div className="food-search-wrap">
            <label>食物名称<div className="search-input"><Icon name="search" size={18} /><input value={query} placeholder="输入食物或别名，如：鸡胸肉" onChange={(e) => { setQuery(e.target.value); setSelectedFood(null) }} autoComplete="off" /></div></label>
            {query && !selectedFood && <div className="food-results">{results.length ? results.map((food) => <button type="button" key={food.id} onClick={() => selectFood(food)}><span><strong>{food.name}</strong><small>{food.category || '我的食物'} · {food.kcalPer100g} kcal / 100g</small></span><Icon name="plus" size={17} /></button>) : <p>没有找到，试试「自定义食物」。</p>}</div>}
          </div>
          <label>份量（克）<div className="input-suffix"><input type="number" min="1" max="10000" step="1" value={grams} onChange={(e) => setGrams(e.target.value)} placeholder="选择后自动填入" /><span>g</span></div></label>
          <div className="calorie-preview"><span>本次约</span><strong>{estimated}</strong><span>kcal</span></div>
          <button className="primary-button" type="submit">加入{mealTypeNames[mealType]}<Icon name="plus" size={17} /></button>
        </form>
        {showCustom && <form className="custom-food-form" onSubmit={addCustomFood}><div><strong>添加自己的食物</strong><p>保存后可在搜索中反复使用。</p></div><label>名称<input value={custom.name} maxLength="40" onChange={(e) => setCustom({ ...custom, name: e.target.value })} placeholder="如：自制三明治" /></label><label>每100g热量<input type="number" min="1" max="2000" value={custom.kcalPer100g} onChange={(e) => setCustom({ ...custom, kcalPer100g: e.target.value })} placeholder="kcal" /></label><label>默认克数<input type="number" min="1" max="10000" value={custom.defaultGrams} onChange={(e) => setCustom({ ...custom, defaultGrams: e.target.value })} /></label><button className="secondary-button" type="submit">保存并选择</button></form>}
      </section>

      <div className="meal-groups">
        {mealTypes.map((type) => {
          const meals = dayMeals.filter((item) => item.mealType === type)
          const subtotal = meals.reduce((sum, item) => sum + mealCalories(item), 0)
          return <section className="card meal-group" key={type}>
            <div className="meal-group-heading"><div><span className={`meal-dot ${type}`} /><h3>{mealTypeNames[type]}</h3><small>{meals.length} 项</small></div><strong>{subtotal}<small> kcal</small></strong></div>
            {meals.length ? <div className="meal-items">{meals.map((meal) => <div key={meal.id}><span><strong>{meal.foodName}</strong><small>{meal.grams}g · {meal.kcalPer100g} kcal/100g</small></span><b>{mealCalories(meal)} kcal</b><button onClick={() => { if (window.confirm(`删除「${meal.foodName}」这条记录吗？`)) actions.deleteMeal(meal.id) }} aria-label={`删除${meal.foodName}`}><Icon name="trash" size={16} /></button></div>)}</div> : <p className="meal-empty">这一餐还没有记录</p>}
          </section>
        })}
      </div>
      {!dayMeals.length && <EmptyState icon="utensils" title="这一天还没有饮食记录" text="从上方搜索一种食物，开始记录吧。" />}
      <p className="page-disclaimer"><Icon name="info" size={16} />食物热量会受品种和烹饪方式影响，本工具仅提供估算，不替代专业营养建议。</p>
    </div>
  )
}
