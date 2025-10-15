import StatsChart from '../components/StatsChart'
import Kanban from '../components/Kanban'

export default function Dashboard(){
    return (
        <div style={{ padding:16 }}>
            <StatsChart />
            <Kanban />
        </div>
    )
}