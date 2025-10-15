import { useEffect, useState } from 'react'
import api from '../api/axios'

const STATUSES = ['pending','in-progress','completed'] as const

type Task = { id:number; title:string; status:string; priority:string }

export default function Kanban(){
    const [tasks,setTasks] = useState<Task[]>([])

    const fetchAll = async()=>{ const {data}=await api.get('/tasks/');setTasks(data) }

    useEffect(()=>{ fetchAll() },[])

    const onDrop = async (status:string, task:Task)=>{ await api.put(`/tasks/${task.id}/`, { status })
        setTasks(ts=>ts.map(t=>t.id===task.id? {...t,status}:t))
    }
    return (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
            {STATUSES.map(s => (
                <Column key={s} title={s} tasks={tasks.filter(t=>t.status===s)} onDrop={(task)=>onDrop(s,task)} />
            ))}
        </div>
    )
}
function Column({title,tasks,onDrop}:{title:string;tasks:Task[];onDrop: (t:Task)=>void}){
    const allowDrop=(e:React.DragEvent)=>e.preventDefault()
    const handleDrop=(e:React.DragEvent)=>{ const t=JSON.parse(e.dataTransfer.getData('text')); onDrop(t)}
        return (
            <div onDragOver={allowDrop} onDrop={handleDrop} style={{ border:'1px solid #000000ff', minHeight:300, padding:8 }}>
                <h3 style={{ textTransform:'capitalize' }}>{title}</h3>
                {tasks.map(t=> <Card key={t.id} task={t} />)}
            </div>
        )
}
    
function Card({task}:{task:Task}){
    const drag=(e:React.DragEvent)=>{ e.dataTransfer.setData('text', JSON.stringify(task)) }
    return(
        <div draggable onDragStart={drag} style={{ border:'1px solid #4ac0eeff', margin:'8px 0', padding:8 }}>
            {task.title} • {task.priority}
        </div>

    ) 
}