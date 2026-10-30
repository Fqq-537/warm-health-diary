import { Icon } from './Icons'

export default function EmptyState({ icon = 'sparkles', title, text }) {
  return (
    <div className="empty-state">
      <span><Icon name={icon} size={26} /></span>
      <strong>{title}</strong>
      {text && <p>{text}</p>}
    </div>
  )
}
