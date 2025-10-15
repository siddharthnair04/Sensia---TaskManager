import { useEffect, useState } from 'react'
import api from '../api/axios'

type Task = {
        id: number; title: string; description: string; status: string; priority:
    string;
        due_date?: string; created_at: string; updated_at: string; owner: string
}

type Filters = { status?: string; priority?: string; q?: string; due_after?:
string; due_before?: string }
export default function TaskTable() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [filters, setFilters] = useState<Filters>({})
    const [editing, setEditing] = useState<Task | null>(null)
    const [form, setForm] = useState<Partial<Task>>({ title: '', priority: 'medium', status: 'pending' })
    const fetchTasks = async () => {
        const params: any = {}
        if (filters.status) params.status = filters.status
        if (filters.priority) params.priority = filters.priority
        if (filters.q) params.search = filters.q
        if (filters.due_after) params.due_date_after = filters.due_after
        if (filters.due_before) params.due_date_before = filters.due_before
        const { data } = await api.get('/tasks/', { params })
        setTasks(data)
    }
    useEffect(() => { fetchTasks() }, [filters])

    const save = async () => {
        if (editing) {
            await api.put(`/tasks/${editing.id}/`, form)
            setEditing(null); setForm({ title: '', priority: 'medium', status: 'pending' }); fetchTasks()
        } else {
            await api.post('/tasks/', form)
            setForm({ title: '', priority: 'medium', status: 'pending' });
            fetchTasks()
        }
    }
    const del = async (id: number) => { await api.delete(`/tasks/${id}/`);
    fetchTasks() }
    return (
        <div>
            <h2>Tasks</h2>
            <div style={{ display:'flex', gap:8, marginBottom:12 }}>
                <input placeholder="Search title/description" onChange={e=>setFilters(f=>({...f,q:e.target.value}))} />
                <select onChange={e=>setFilters(f=>({...f,status:e.target.value||undefined}))}>
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
                <select onChange={e=>setFilters(f=>({...f,priority:e.target.value||undefined}))}>
                    <option value="">All Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <input type="date" onChange={e=>setFilters(f=>({...f,due_after:e.target.value}))} />
                <input type="date" onChange={e=>setFilters(f=>({...f,due_before:e.target.value}))} />
            </div>
            <div style={{ border:'1px solid #ddd', padding:12, marginBottom:16 }}>
                <h3>{editing? 'Edit Task' : 'New Task'}</h3>
                <input placeholder="Title" value={form.title||''} onChange={e=>setForm({...form, title:e.target.value})} />
                <input placeholder="Description" value={form.description||''} onChange={e=>setForm({...form, description:e.target.value})} />
                <select value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
                <select value={form.priority} onChange={e=>setForm({...form, priority:e.target.value})}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <input type="date" value={form.due_date||''} onChange={e=>setForm({...form, due_date:e.target.value})} />
                    <button onClick={save}>{editing? 'Update' : 'Create'}</button>
                        {editing && <button onClick={()=>{setEditing(null); setForm({ title:'',priority:'medium', status:'pending'})}}>Cancel</button>}
            </div>
            <table width="100%" cellPadding={8}>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Due</th>
                        <th>Updated</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(t => { const overdue = t.due_date && new Date(t.due_date) < new Date() && t.status !== 'completed'
                        return (
                            <tr key={t.id} style={{ background: overdue? '#ffe5e5' : 'transparent' }}>
                                <td>{t.title}</td>
                                <td>{t.status}</td>
                                <td>{t.priority}</td>
                                <td>{t.due_date || '—'}</td>
                                <td>{new Date(t.updated_at).toLocaleString()}</td>
                                <td>
                                    <button onClick={()=>{setEditing(t); setForm(t)}}>Edit</button>
                                    <button onClick={()=>del(t.id)}>Delete</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}