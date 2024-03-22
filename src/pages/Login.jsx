import { useNavigate } from 'react-router-dom'
import { httpPost } from "../lib/request"
import { useContext, useEffect } from 'react'
import { AuthContext } from '../auth/AuthContext'

const Login = () => {
    const navigate = useNavigate()
    const { userData, setUserData, signIn, authenticated, visitorData } = useContext(AuthContext)

    useEffect(() => {
        if (authenticated) {
            navigate('/dashboard', { replace: true })
        }
    }, [authenticated, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { data } = visitorData
        const res = await httpPost('/users/auth', {
            fpjsVisitor: data,
            ...userData
        })
        if (res.success) {
            signIn()
            navigate('/dashboard', { replace: true })
        } else {
            alert(res.message)
        }
        console.log(res)
    }

    const handleChange = (e) => {
        setUserData(prev => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }
    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="username" placeholder="username" onChange={handleChange} autoComplete="username" value={userData.username || ''} />
            <input type="password" name="password" placeholder="password" onChange={handleChange} autoComplete="current-password" value={userData.password || ''} />
            <button type="submit">Log In</button>
        </form>
    )
}

export default Login