export default function Venue() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-white py-8 text-center">
        <h1 className="font-great-vibes mb-2 text-5xl font-bold text-gray-800">
          Venue
        </h1>
        <p className="font-satisfy text-xl text-gray-600">
          Information about our wedding venue
        </p>
      </div>

      {/* Full-width image */}
      <div className="relative h-96 w-full md:h-[500px] lg:h-[600px]">
        <img
          src="/fusion_resorts.jpg"
          alt="Fusion Resorts Da Nang"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex-grow bg-white py-12">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="font-satisfy mb-8 text-lg leading-relaxed text-gray-700 md:text-xl">
            Venue details and directions will be added here
          </p>
        </div>
      </div>
    </div>
  );
}
