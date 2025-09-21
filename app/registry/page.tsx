export default function Registry() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-white py-8 text-center">
        <h1 className="text-title mb-2 text-5xl font-bold text-gray-800">
          Registry
        </h1>
        <p className="text-body text-xl text-gray-600">
          Gift registry information for our guests
        </p>
      </div>

      <div className="flex-grow bg-white py-12">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-body mb-8 text-lg leading-relaxed text-gray-700 md:text-xl">
            We'd like you to donate to a charity of our choice! Check back later for details
          </p>
        </div>
      </div>
    </div>
  );
}
