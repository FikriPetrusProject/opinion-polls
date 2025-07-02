import { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

const AddAI = () => {
  const [topic, setTopic] = useState('');
  const [choice, setChoice] = useState(4);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:3000/polls/ai',
        { topic, choice },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-blue-400 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
          Create AI Poll
        </h2>
        <label className="block mb-2 font-medium">Topic:</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
          className="w-full mb-4 px-4 py-2 border rounded"
        />

        <label className="block mb-2 font-medium">Number of Choices:</label>
        <input
          type="number"
          value={choice}
          onChange={(e) => setChoice(e.target.value)}
          min={2}
          className="w-full mb-6 px-4 py-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddAI;
