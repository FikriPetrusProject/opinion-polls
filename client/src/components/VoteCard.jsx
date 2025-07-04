import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const VoteCard = ({ url }) => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const { state } = useLocation();

  const [socket, setSocket] = useState(null);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedOptionId, setVotedOptionId] = useState(null);
  const [summary, setSummary] = useState("");

  // ✅ Fetch poll details
  useEffect(() => {
    const fetchPollDetails = async () => {
      try {
        const { data } = await axios.get(`${url}/polls/${roomId}/details`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        setQuestion(data.question);
        setOptions(data.options);
        if (data.userVoteOptionId) {
          setHasVoted(true);
          setVotedOptionId(data.userVoteOptionId);
        }
      } catch (err) {
        console.error("Failed to fetch poll details:", err);
        toast.error("❌ Failed to load poll details.");
      }
    };

    fetchPollDetails();
  }, [roomId]);

  // ✅ Setup socket connection
  useEffect(() => {
    const newSocket = io(`${url}`);
    setSocket(newSocket);

    newSocket.emit("join-room", roomId);
    toast.info(`🟢 ${user?.name || "User"} joined the room`);

    newSocket.on("vote-update", ({ optionId }) => {
      setOptions((prev) =>
        prev.map((opt) =>
          opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
        )
      );
      toast.success(`🔄 Vote updated`);
    });

    newSocket.on("room-ended", (summaryText) => {
      setSummary(summaryText);
      toast.warn(`⏰ ${user?.name || "User"}, poll has ended`);
    });

    return () => {
      newSocket.disconnect();
      toast.info(`👋 ${user?.name || "User"} left the room`);
    };
  }, [roomId, user]);

  // ✅ Vote handler
  const handleVote = async (optionId) => {
    if (hasVoted) {
      toast.info(`⚠️ ${user?.name || "User"} already voted`);
      return;
    }

    try {
      await axios.post(
        `${url}/polls/${roomId}/vote`,
        { optionId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setHasVoted(true);
      setVotedOptionId(optionId);
      toast.success(`✅ ${user?.name || "User"} voted`);

    } catch (err) {
      if (err.response?.data?.message === "ALREADY_VOTED") {
        setHasVoted(true);
        toast.warning(`⚠️ ${user?.name || "User"} already voted`);
      } else {
        toast.error(`❌ ${user?.name || "User"} vote failed`);
        console.error("Vote error:", err);
      }
    }
  };

  // ✅ Get summary manually
  const handleGetSummary = async () => {
    try {
      const res = await axios.get(`${url}/polls/${roomId}/summary`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setSummary(res.data.summary);
      toast.info("📝 Summary loaded");
    } catch (err) {
      toast.error("❌ Failed to fetch summary");
      console.error("Summary fetch error:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <div className="overflow-hidden whitespace-nowrap mb-6">
        <h2 className="text-3xl font-bold text-gray-100 animate-marquee inline-block">
          🗳️ Vote Now — Your opinion matters!
        </h2>
      </div>

      <div className="bg-white p-5 rounded-lg border-blue-400 border-4 border-double shadow hover:shadow-lg transition-all duration-200">
        <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">
          {question}
        </h3>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {options.map((opt) => (
            <div
              key={opt.id}
              className={`flex flex-col items-center justify-center p-3 rounded transition ${
                votedOptionId === opt.id
                  ? "bg-blue-200 border border-blue-500"
                  : "bg-blue-100 hover:bg-blue-200"
              }`}
            >
              <button
                onClick={() => handleVote(opt.id)}
                disabled={hasVoted}
                className={`w-full rounded py-2 px-3 font-medium ${
                  hasVoted
                    ? votedOptionId === opt.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-700"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {opt.text}
              </button>
              <span className="text-sm mt-1 text-blue-900">
                👍 x {opt.votes}
              </span>
            </div>
          ))}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/">
            <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
              Back to Homepage
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VoteCard;
