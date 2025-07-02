import { Routes, Route, Navigate } from 'react-router'
import Register from './pages/Register'
import Login from './pages/Login'
import { useAuth } from './context/AuthContext'
import HomePage from './pages/Homepage'

function App() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/register" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/homepage" element={user ? <Register/> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default App
