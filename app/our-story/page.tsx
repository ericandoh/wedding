import Image from 'next/image';

export default function OurStory() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-white py-8 text-center">
        <h1 className="font-great-vibes mb-2 text-5xl font-bold text-gray-800">
          About the Couple
        </h1>
      </div>

      {/* Full-width image */}
      <div className="relative h-96 w-full md:h-[500px] lg:h-[600px]">
        <Image
          src="/our_story.JPG"
          alt="Hang & Eric's Love Story"
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-grow bg-white py-12">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="font-satisfy mb-8 text-lg leading-relaxed text-gray-700 md:text-xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p className="font-satisfy mb-8 text-lg leading-relaxed text-gray-700 md:text-xl">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
          </p>
        </div>
      </div>
    </div>
  );
}
