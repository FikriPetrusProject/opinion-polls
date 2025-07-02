import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { io } from 'socket.io-client';
import axios from 'axios';

const VoteCard = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [socket, setSocket] = useState(null);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedOptionId, setVotedOptionId] = useState(null);
  const [summary, setSummary] = useState('');

  // ✅ Initial data fetch
  useEffect(() => {
    const fetchPollDetails = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/polls/${roomId}/details`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        });

        setQuestion(data.question);
        setOptions(data.options);
        if (data.userVoteOptionId) {
          setHasVoted(true);
          setVotedOptionId(data.userVoteOptionId);
        }
      } catch (err) {
        console.error('Failed to fetch poll details:', err);
      }
    };

    fetchPollDetails();
  }, [roomId]);

  // ✅ Setup socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    newSocket.emit('join-room', roomId);

    newSocket.on('vote-update', ({ optionId }) => {
      setOptions(prev =>
        prev.map(opt =>
          opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
        )
      );
    });

    newSocket.on('room-ended', (summaryText) => {
      setSummary(summaryText);
    });

    return () => newSocket.disconnect();
  }, [roomId]);

  const handleVote = async (optionId) => {
    if (hasVoted) return;
    try {
      await axios.post(
        `http://localhost:3000/polls/${roomId}/vote`,
        { optionId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        }
      );
      setHasVoted(true);
      setVotedOptionId(optionId);

      setOptions(prev =>
        prev.map(opt =>
          opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
        )
      );
    } catch (err) {
      if (err.response?.data?.message === 'ALREADY_VOTED') {
        alert('You already voted');
        setHasVoted(true);
      } else {
        console.error('Vote error:', err);
      }
    }
  };

  const handleGetSummary = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/polls/${roomId}/summary`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setSummary(res.data.summary);
    } catch (err) {
      console.error('Summary fetch error:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white border p-6 rounded shadow w-full max-w-2xl">
        <h2 className="text-center text-2xl font-bold mb-4">Question</h2>
        <p className="text-center text-xl mb-6 font-semibold">“{question}”</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {options.map((opt) => (
            <div
              key={opt.id}
              className={`border p-4 rounded flex flex-col items-center ${
                votedOptionId === opt.id ? 'border-blue-500 bg-blue-100' : ''
              }`}
            >
              <button
                onClick={() => handleVote(opt.id)}
                disabled={hasVoted}
                className={`px-4 py-2 mb-2 rounded w-full ${
                  hasVoted
                    ? votedOptionId === opt.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {opt.text}
              </button>
              <span className="text-xl">👍 x {opt.votes}</span>
            </div>
          ))}
        </div>

        {/* ✅ Summarize Button */}
        <div className="text-center mt-4">
          <button
            onClick={handleGetSummary}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Summarize
          </button>
        </div>

        {/* ✅ Summary Section */}
        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold text-gray-700">Summarize by top poll:</h3>
          <p className="text-gray-800 italic mt-2">
            {summary || 'No summary yet. Click the button above.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoteCard;
