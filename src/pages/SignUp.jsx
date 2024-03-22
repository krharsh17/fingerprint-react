import { useNavigate } from 'react-router-dom'
import { httpPost } from "../lib/request"
import { useContext } from 'react'
import { AuthContext } from '../auth/AuthContext'

const SignUp = () => {
    const { userData, setUserData, signIn, visitorData } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { data } = visitorData
        const res = await httpPost('/users/add', {
            fpjsVisitor: data,
            ...userData
        })
        if (res.success) {
            signIn(userData)
            navigate('/login', { replace: true })
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
            <button type="submit">Sign Up</button>
        </form>
    )
}

export default SignUp