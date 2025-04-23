// pages/index.js
import { useState } from 'react';

export default function Home() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    try {
      const res = await fetch(`/api/track?tracking_number=${trackingNumber}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">📦 Track Your Package</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          placeholder="Enter tracking number"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          className="border px-4 py-2 rounded w-full max-w-md"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2">
          Track
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}
      {result && (
        <pre className="bg-gray-100 p-4 rounded max-w-xl overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
