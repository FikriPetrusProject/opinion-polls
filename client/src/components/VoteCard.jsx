import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3000'); // adjust backend host if needed

const VoteCard = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]); // each: { id, text, votes }
  const [hasVoted, setHasVoted] = useState(false);
  const [timer, setTimer] = useState(60);
  const [summary, setSummary] = useState('');

  useEffect(() => {
    socket.emit('join-room', roomId);

    socket.on('room-data', (data) => {
      setQuestion(data.question);
      setOptions(data.options.map(opt => ({ ...opt, votes: 0 })));
      let count = 60;
      const interval = setInterval(() => {
        count--;
        setTimer(count);
        if (count <= 0) clearInterval(interval);
      }, 1000);
    });

    socket.on('vote-update', ({ optionId }) => {
      setOptions(prev =>
        prev.map(opt => opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt)
      );
    });

    socket.on('room-ended', (summaryText) => {
      setSummary(summaryText);
      setTimeout(() => {
        socket.disconnect();
        navigate('/homepage');
      }, 3000);
    });

    return () => socket.disconnect();
  }, [roomId, navigate]);

  const handleVote = async (optionId) => {
    if (hasVoted) return;
    try {
      await axios.post(
        `http://localhost:3000/votes/${roomId}`,
        { optionId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        }
      );
      setHasVoted(true);
    } catch (err) {
      if (err.response?.data?.message === 'ALREADY_VOTED') {
        alert('You already voted');
        setHasVoted(true);
      } else {
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white border p-6 rounded shadow w-full max-w-2xl">
        <h2 className="text-center text-2xl font-bold mb-4">Question</h2>
        <p className="text-center text-xl mb-6 font-semibold">“{question}”</p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {options.map((opt, i) => (
            <div key={opt.id} className="border p-4 rounded flex flex-col items-center">
              <button
                onClick={() => handleVote(opt.id)}
                disabled={hasVoted}
                className={`px-4 py-2 mb-2 rounded ${
                  hasVoted ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'
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
          <h3 className="font-semibold text-gray-700">Summarize by top poll:</h3>
          <p className="text-gray-800 italic mt-2">
            {summary || 'Waiting for summary after 60s...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoteCard;
