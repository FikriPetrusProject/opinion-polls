import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router'

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) return alert('Passwords do not match')
    register(form.name, form.email, form.password)
    navigate('/homepage')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-400">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">
        <h1 className="text-2xl font-bold mb-4">Register</h1>

        <input
          type="text"
          placeholder="Name"
          className="w-full px-3 py-2 mb-3 border border-gray-300 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full px-3 py-2 mb-3 border border-gray-300 rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-3 py-2 mb-3 border border-gray-300 rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <input
          type="password"
          placeholder="Confirm password"
          className="w-full px-3 py-2 mb-3 border border-gray-300 rounded"
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
        />

        <button
          type="submit"
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
        >
          Register
        </button>

        <p className="text-sm mt-2">
          Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
        </p>
      </form>
    </div>
  )
}

export default Register
