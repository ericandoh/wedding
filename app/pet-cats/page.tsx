export default function PetCats() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-white py-8 text-center">
        <h1 className="font-great-vibes mb-2 text-5xl font-bold text-gray-800">
          Pet Cats
        </h1>
        <p className="font-satisfy text-xl text-gray-600">
          Meet our furry family members
        </p>
      </div>

      <div className="flex-grow bg-white py-12">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="font-satisfy mb-8 text-lg leading-relaxed text-gray-700 md:text-xl">
            Photos and stories about our beloved cats will be added here
          </p>
        </div>
      </div>
    </div>
  );
}
