import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../auth/AuthContext'

const Dashboard = () => {
    const navigate = useNavigate()
    const { authenticated } = useContext(AuthContext)

    if (!authenticated) {
        navigate('/login', { replace: true })
    }
    return (
        <>
            <h1>Dashboard</h1>
        </>
    )
}

export default Dashboard