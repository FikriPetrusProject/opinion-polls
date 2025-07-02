import { Routes, Route, Navigate, Outlet } from "react-router";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { useAuth } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import VoteCard from "./components/VoteCard";
import AddManual from "./pages/AddManual";
import AddAI from "./pages/AddAi";
import NavBar from "./components/NavBar";

function AuthLayout() {

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
      <Route path="/" element={<AuthLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/votecard/:roomId" element={<VoteCard />} />
        <Route path="/polls/manual" element={<AddManual />} />
        <Route path="/polls/ai" element={<AddAI />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}

export default App;
