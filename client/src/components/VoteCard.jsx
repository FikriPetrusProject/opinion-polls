import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import io from "socket.io-client";

const socket = io("http://localhost:3000"); // change to your backend URL if needed

const VoteCard = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState("What is your favorite books ?");
  const [options, setOptions] = useState([
  { text: 'Science', votes: 0 },
  { text: 'Romance', votes: 0 },
  { text: 'Fiction', votes: 0 },
  { text: 'Social', votes: 0 }
]); // each: { text, votes }
  const [hasVoted, setHasVoted] = useState(true);
  const [timer, setTimer] = useState(60);
  const [summary, setSummary] = useState("");

  console.log(`⚠️`, options);
  useEffect(() => {
    // Join the room
    socket.emit("join-room", { roomId });

    // Receive question and options
    socket.on("room-data", (data) => {
      setQuestion(data.question);
      setOptions(data.options);

      // Start 60s countdown
      let count = 60;
      const interval = setInterval(() => {
        count--;
        setTimer(count);
        if (count <= 0) clearInterval(interval);
      }, 1000);
    });

    // Update votes live
    socket.on("vote-update", (updatedOptions) => {
      setOptions(updatedOptions);
    });

    // Receive summary from backend after 60s
    socket.on("room-ended", (summaryText) => {
      setSummary(summaryText);
      setTimeout(() => {
        socket.disconnect();
        navigate("/homepage");
      }, 3000);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, navigate]);

  const handleVote = (index) => {
    if (hasVoted) return;
    socket.emit("submit-vote", { roomId, optionIndex: index });
    setHasVoted(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-400 p-4">
      <div className="bg-gray-100 border p-6 rounded shadow w-full max-w-2xl">
        <h2 className="text-center text-2xl font-bold mb-4">Question</h2>
        <p className="text-center text-xl mb-6 font-semibold">“{question}”</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {options.map((opt, i) => (
            <div
              key={i}
              className="border p-4 rounded flex flex-col items-center"
            >
              <button
                onClick={() => handleVote(i)}
                disabled={hasVoted}
                className={`px-4 py-2 mb-2 rounded ${
                  hasVoted
                    ? "bg-gray-300"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {opt.text}
              </button>
              <span className="text-xl">👍 x {opt.votes}</span>
            </div>
          ))}
        </div>

        <div className="text-center text-sm text-gray-500 mb-4">
          Time left: <span className="font-bold">{timer}s</span>
        </div>

        <div className="mt-4 border-t pt-4">
          <h3 className="font-semibold text-gray-700">
            Summarize by top poll:
          </h3>
          <p className="text-gray-800 italic mt-2">
            {summary || "Waiting for summary after 60s..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoteCard;
