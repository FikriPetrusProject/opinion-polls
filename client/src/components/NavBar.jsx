import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router'

const NavBar = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="flex justify-between p-4 bg-blue-700 text-white">
      <div className="text-xl font-bold">{`{O}ptions`}</div>
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
