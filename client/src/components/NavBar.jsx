import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router'
import { Link } from 'react-router'

const NavBar = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="flex justify-between items-center p-4 bg-blue-400 text-white">
      <div className="text-xl font-bold">{`{O}ptions`}</div>
      <div className="flex gap-6">
        <Link to="/polls/manual" className="hover:underline"> Add Manual</Link>
        <Link to="/polls/ai" className="hover:underline">Add AI</Link>
      </div>
      <button
        onClick={() => {
          logout()
          navigate('/login')
        }}
        className="bg-white text-blue-700 px-4 py-1 rounded hover:bg-gray-100"
      >
        Log out
      </button>
    </div>
  )
}

export default NavBar
