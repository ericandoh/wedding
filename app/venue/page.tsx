export default function Venue() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="text-center py-8 bg-white">
        <h1 className="text-5xl font-great-vibes font-bold text-gray-800 mb-2">Venue</h1>
        <p className="text-gray-600 text-xl font-satisfy">
          Information about our wedding venue
        </p>
      </div>
      
      <div className="flex-grow bg-white py-12">
        <div className="text-center max-w-4xl mx-auto px-6">
          <p className="text-gray-700 text-lg md:text-xl font-satisfy mb-8 leading-relaxed">
            Venue details and directions will be added here
          </p>
        </div>
      </div>
    </div>
  );
}
