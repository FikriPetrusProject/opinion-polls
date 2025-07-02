import { Routes, Route, Navigate } from "react-router";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { useAuth } from "./context/AuthContext";
import HomePage from "./pages/Homepage";
import VoteCard from "./components/VoteCard";
import AddManual from "./pages/AddManual";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/votecard/:roomId" element={<VoteCard />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/homepage"
        element={user ? <HomePage /> : <Navigate to="/login" />}
      />
      <Route path="/polls/manual" element={<AddManual />} />
      {/* <Route path="/polls/ai"" element={<Login />} /> */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;

