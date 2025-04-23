export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Tracking Bot</h1>
      <form
        className="w-full max-w-sm"
        onSubmit={async (e) => {
          e.preventDefault();
          const trackingNumber = e.target.elements.trackingNumber.value;
          const courierCode = e.target.elements.courierCode.value;
          const response = await fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ trackingNumber, courierCode })
          });
          const result = await response.json();
          alert(JSON.stringify(result, null, 2));
        }}
      >
        <input
          type="text"
          name="trackingNumber"
          placeholder="Tracking Number"
          className="p-2 mb-2 w-full border rounded"
          required
        />
        <input
          type="text"
          name="courierCode"
          placeholder="Courier Code (or leave blank for auto)"
          className="p-2 mb-2 w-full border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Track
        </button>
      </form>
    </div>
  );
}
