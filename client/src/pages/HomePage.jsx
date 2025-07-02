import { Link } from 'react-router'
import NavBar from '../components/NavBar'

const HomePage = () => {
  const polls = [
    {
      question: 'What is your favorite color?',
      options: ['Red', 'Green', 'Blue', 'Yellow'],
      createdAt: '2 days ago'
    },
    {
      question: 'Which season do you prefer?',
      options: ['Spring', 'Summer', 'Fall', 'Winter'],
      createdAt: '5 days ago'
    }
  ]

  return (
    <div className="min-h-screen bg-blue-400">
      <NavBar />
      <div className="p-4 text-white">
        <h2 className="text-xl font-bold mb-4">Active Polls</h2>
        <div className="grid gap-4">
          {polls.map((poll, i) => (
            <div key={i} className="bg-blue-300 p-4 rounded shadow">
              <p className="font-semibold">{poll.question}</p>
              <ul className="list-disc pl-5 mt-2">
                {poll.options.map((opt, idx) => (
                  <li key={idx}>{opt}</li>
                ))}
              </ul>
              <p className="text-sm mt-2 text-gray-200">Created {poll.createdAt}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomePage
