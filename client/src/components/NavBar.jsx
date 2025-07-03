import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaPlusCircle, FaRobot } from 'react-icons/fa';

const NavBar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center px-6 py-3 bg-blue-500 text-white shadow">
      <div className="text-2xl font-bold tracking-wide"><Link to='/'>{`{O}ptions`}</Link></div>

      <div className="flex gap-6 items-center">
        <Link
          to="/polls/manual"
          className="flex items-center gap-2 hover:text-yellow-300 transition duration-200"
        >
          <FaPlusCircle className="text-lg group-hover:animate-pulse" />
          <span className="hover:underline">Manual Poll</span>
        </Link>

        <Link
          to="/polls/ai"
          className="flex items-center gap-2 hover:text-green-300 transition duration-200"
        >
          <FaRobot className="text-lg group-hover:animate-bounce" />
          <span className="hover:underline">AI Poll</span>
        </Link>
      </div>

      <button
        onClick={() => {
          logout();
          navigate('/login');
        }}
        className="bg-white text-blue-700 px-4 py-1 rounded hover:bg-gray-100 hover:shadow transition"
      >
        Log out
      </button>
    </div>
  );
};

export default NavBar;
