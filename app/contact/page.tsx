import Link from 'next/link';

export const metadata = {
  title: 'Contact Us - Episodle',
  description: 'Provide feedback, report bugs, or suggest new TV shows to Episodle.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white px-4 py-8 font-sans selection:bg-gray-800">
      <div className="max-w-3xl mx-auto space-y-8 bg-gray-900 border border-gray-800 p-6 md:p-10 rounded-2xl shadow-xl">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2">Contact Us</h1>
        <p className="text-gray-400 font-medium pb-4 border-b border-gray-800">We&apos;d love to hear from you!</p>

        <section className="space-y-4">
          <p className="text-gray-300 leading-relaxed text-lg">
            Whether you have feedback, have found a bug in today&apos;s puzzle, or want to suggest a new TV show for our database, please reach out! 
            Episodle is actively developed and maintained by a dedicated solo television enthusiast.
          </p>
        </section>

        <section className="space-y-6 mt-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-2">Email Support</h2>
            <p className="text-gray-300 mb-4">
              Feel free to send an email directly. I usually respond within 24-48 hours.
            </p>
            <a 
              href="mailto:support@episodle.co" 
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Email support@episodle.co
            </a>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-2">Privacy or Data Requests</h2>
            <p className="text-gray-300 mb-4">
              If you have inquiries regarding our data handling, GDPR/CCPA requests, or if you need to contact the Data Controller, please use the same email address and mention &quot;Privacy&quot; in the subject line.
            </p>
            <Link prefetch={false} href="/privacy" className="text-purple-400 hover:text-purple-300 underline font-medium">
              Read our Privacy Policy
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
