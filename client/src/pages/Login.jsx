import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // ✅ import toast

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.warning('Please fill in both email and password');
      return;
    }

    try {
      await login(form.email, form.password);
      navigate('/');
      toast.success('Login Successful lets poll 🗳️')
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="bg-fixed bg-cover bg-center bg-[url('/bg.jpg')] min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <img src="/Options Logo.png" alt="Options Logo" className="w-32 mb-6" />
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded w-80 shadow-2xl">
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
            Login
          </button>

          <p className="text-sm mt-2 text-center">
            Don’t have an account?{' '}
            <Link to="/register" className="text-blue-600">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
