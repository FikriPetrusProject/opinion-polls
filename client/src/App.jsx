import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { useAuth } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import VoteCard from "./components/VoteCard";
import AddManual from "./pages/AddManual";
import AddAI from "./pages/AddAi";
import NavBar from "./components/NavBar";

const DOMAIN = "https://fikriprojects.site";
// const DOMAIN = "http://localhost:3000"

function AuthLayout() {
  const access_token = localStorage.getItem("access_token");
  if (!access_token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-blue-400">
      <NavBar />
      <Outlet />
    </div>
  );
}

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route element={<AuthLayout />}>
        <Route path="/" element={<HomePage url={DOMAIN} />} />
        <Route path="/votecard/:roomId" element={<VoteCard url={DOMAIN} />} />
        <Route path="/polls/manual" element={<AddManual url={DOMAIN}/>} />
        <Route path="/polls/ai" element={<AddAI url={DOMAIN}/>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}

export default App;
