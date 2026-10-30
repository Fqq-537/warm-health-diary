import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatShortDate } from '../lib/date'

export default function TrendChart({ weights }) {
  const values = weights.map((item) => item.weightKg)
  const min = Math.floor(Math.min(...values) - 0.8)
  const max = Math.ceil(Math.max(...values) + 0.8)

  return (
    <div className="trend-chart" role="img" aria-label={`体重趋势图，共 ${weights.length} 条记录，最低 ${Math.min(...values)} 千克，最高 ${Math.max(...values)} 千克`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={weights} margin={{ top: 12, right: 10, bottom: 0, left: -18 }}>
          <CartesianGrid stroke="#ebe6de" strokeDasharray="4 6" vertical={false} />
          <XAxis dataKey="date" tickFormatter={formatShortDate} tick={{ fill: '#938b81', fontSize: 12 }} axisLine={false} tickLine={false} minTickGap={24} />
          <YAxis domain={[min, max]} tick={{ fill: '#938b81', fontSize: 12 }} axisLine={false} tickLine={false} tickCount={5} />
          <Tooltip
            formatter={(value) => [`${value} kg`, '体重']}
            labelFormatter={(value) => formatShortDate(value)}
            contentStyle={{ borderRadius: 14, border: '1px solid #e8e1d8', boxShadow: '0 8px 24px rgba(83,65,53,.08)', fontSize: 13 }}
          />
          <Line type="monotone" dataKey="weightKg" stroke="#c77e70" strokeWidth={3} dot={{ r: 4, fill: '#fffaf5', stroke: '#c77e70', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#c77e70' }} animationDuration={500} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
