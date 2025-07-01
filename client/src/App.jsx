import { Routes, Route, Navigate } from 'react-router'
import Register from './pages/Register'
import Login from './pages/Login'
import HomePage from './pages/HomePage'
import { useAuth } from './context/AuthContext'

function App() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/homepage" element={user ? <HomePage /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default App
