import { useEffect, useState } from 'react'
import { healthTips } from '../data/tips'
import { Icon } from './Icons'

export default function TipCarousel() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (paused || reduceMotion) return undefined
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % healthTips.length), 5000)
    return () => window.clearInterval(timer)
  }, [paused, reduceMotion])

  const previous = () => setIndex((index - 1 + healthTips.length) % healthTips.length)
  const next = () => setIndex((index + 1) % healthTips.length)
  const tip = healthTips[index]

  return (
    <section className="tip-carousel" aria-label="健康科普短句" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="tip-icon"><Icon name="sparkles" size={22} /></div>
      <div className="tip-copy" aria-live="polite">
        <span>{tip.label}</span>
        <p>{tip.text}</p>
      </div>
      <div className="tip-controls">
        <button onClick={previous} aria-label="上一条科普"><Icon name="left" size={17} /></button>
        <span>{String(index + 1).padStart(2, '0')} / {healthTips.length}</span>
        <button onClick={next} aria-label="下一条科普"><Icon name="right" size={17} /></button>
      </div>
    </section>
  )
}
