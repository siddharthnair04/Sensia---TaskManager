import { useEffect, useState } from 'react'
import api from '../api/axios'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function StatsChart() {
  const [stats, setStats] = useState<{ by_status: Record<string, number>, due_today: number, due_week: number }>({
    by_status: {},
    due_today: 0,
    due_week: 0
  })

  useEffect(() => { api.get('/tasks/stats/').then(r => setStats(r.data)) }, [])

  const data = Object.entries(stats.by_status).map(([name, value]) => ({ name, value }))

  return (
    <div>
      <h3>Dashboard</h3>
      <p>Due Today: <b>{stats.due_today}</b> • This Week: <b>{stats.due_week}</b></p>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie dataKey="value" data={data} outerRadius={80} label>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
