import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - Episodle',
  description: 'Privacy Policy for the Episodle web game.',
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-black text-white px-4 py-8 font-sans selection:bg-gray-800">
      <div className="max-w-3xl mx-auto space-y-8 bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-xl">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4 font-medium">
          ← Back to Game
        </Link>
        <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Privacy Policy for Episodle</h1>
        <p className="text-gray-400 font-medium pb-4 border-b border-gray-800">Last Updated: March 24, 2026</p>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">1. Information We Collect</h2>
          <p className="text-gray-300 leading-relaxed">
            We use third-party tools to understand how you interact with our game.
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li><strong>Microsoft Clarity:</strong> We capture how you use and interact with our website through behavioral metrics, heatmaps, and session replay to improve our game. This data is captured using first and third-party cookies.</li>
            <li><strong>Google AdSense:</strong> We may use Google to serve ads. Google uses cookies (like the DART cookie) to serve ads based on your visit to this site and other sites on the Internet.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">2. How We Use Your Data</h2>
          <p className="text-gray-300 leading-relaxed">The data collected is used solely to:</p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li>Fix bugs (via session recordings).</li>
            <li>Improve game UI/UX (via heatmaps).</li>
            <li>Maintain the site's free-to-play status (via ads).</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">3. Your Choices</h2>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li><strong>Opt-out of Tracking:</strong> You can use browser extensions like &quot;Do Not Track&quot; or ad-blockers to prevent data collection.</li>
            <li><strong>Cookie Management:</strong> You can clear or disable cookies in your browser settings at any time.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">4. Third-Party Links</h2>
          <p className="text-gray-300 leading-relaxed">
            Our site may contain links to other websites (like Buy Me a Coffee or Amazon). We are not responsible for the privacy practices of these external sites.
          </p>
        </section>
      </div>
    </main>
  );
}
