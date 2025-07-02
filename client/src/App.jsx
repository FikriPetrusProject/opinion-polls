import { Routes, Route, Navigate } from "react-router";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { useAuth } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import VoteCard from "./components/VoteCard";
import AddManual from "./pages/AddManual";
import AddAI from "./pages/AddAi";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={<HomePage />}
      />
      <Route path="/votecard/:roomId" element={<VoteCard />} />
      <Route path="/polls/manual" element={<AddManual />} />
      <Route path="/polls/ai" element={<AddAI />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;

