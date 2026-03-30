import Link from 'next/link';

export const metadata = {
  title: 'TV Shows - Episodle',
  description: 'Explore the collection of TV shows available in Episodle.',
};

export default function TVSection() {
  return (
    <main className="min-h-screen bg-black text-white px-4 py-8 font-sans selection:bg-gray-800">
      <div className="max-w-3xl mx-auto space-y-8 bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-xl text-center">
        <Link prefetch={false} href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4 font-medium">
          ← Back to Game
        </Link>
        <h1 className="text-4xl font-black tracking-tighter uppercase mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">TV Show Categories</h1>
        <p className="text-gray-400 text-lg">
          Welcome to the Episodle TV archive. Here you can find all the legendary TV shows featured in our daily puzzles.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <Link prefetch={false} href="/archive" className="p-6 bg-gray-800 border border-gray-700 rounded-xl hover:border-white transition-colors text-xl font-bold">
                Daily Archive
            </Link>
            <Link prefetch={false} href="/" className="p-6 bg-blue-600/20 border border-blue-500/50 rounded-xl hover:border-blue-500 transition-colors text-xl font-bold">
                Play Today's TV Puzzle
            </Link>
        </div>
      </div>
    </main>
  );
}
