import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router'


const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    register(form.name, form.email, form.password)
    navigate('/homepage')
  }

  return (
   <div className="min-h-screen flex items-center justify-center bg-blue-400">
      <div className="flex flex-col items-center">
        <img src="/Options Logo.png" alt="Options Logo" className="w-32 mb-6" />
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">

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

          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            Register
          </button>

          <p className="text-sm mt-2 text-center">
            Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
          </p>
        </form>
      </div>
    </div>
  )
}


export default Register
