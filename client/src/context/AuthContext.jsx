import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // ✅ Import toast
const url = "http://localhost:3000"
// const DOMAIN = "http://localhost:3000"

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setUser({ token });
    }
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${url}/login`, { email, password });
      localStorage.setItem('access_token', data.access_token);
      setUser({ email });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const register = async (name, email, password) => {
    try {
      await axios.post(`${url}/register`, { name, email, password });
      await login(email, password);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Register failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    toast.info('You have been logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
