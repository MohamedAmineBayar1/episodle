import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service - Episodle',
  description: 'Terms of Service and conditions of use for playing Episodle.',
};

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-black text-white px-4 py-8 font-sans selection:bg-gray-800">
      <div className="max-w-4xl mx-auto space-y-8 bg-gray-900 border border-gray-800 p-6 md:p-10 rounded-2xl shadow-xl">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2">Terms of Service</h1>
        <p className="text-gray-400 font-medium pb-4 border-b border-gray-800">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <section className="space-y-4">
          <p className="text-gray-300 leading-relaxed">
            Welcome to Episodle. These Terms of Service (&quot;Terms&quot;) govern your access to and use of our website and services (&quot;Services&quot;). 
            Please read these Terms carefully, and contact us if you have any questions. By accessing or using our Services, you agree to 
            be bound by these Terms and by our <Link prefetch={false} href="/privacy" className="text-purple-400 hover:text-purple-300 underline">Privacy Policy</Link>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">1. Description of Service</h2>
          <p className="text-gray-300 leading-relaxed">
            Episodle is a free daily trivia game accessible via a web browser. We provide this service on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis 
            for entertainment purposes only.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">2. Intellectual Property</h2>
          <p className="text-gray-300 leading-relaxed">
            All original code, mechanics, and design of the Episodle platform are the property of Episodle. However, the game relies heavily 
            on visual imagery and metadata associated with third-party television shows and movies.
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li>We do not claim ownership over the television show screenshots, characters, logos, or titles featured in the daily puzzles.</li>
            <li>All third-party content is used under the principles of &quot;Fair Use&quot; for the purposes of parody, commentary, criticism, and specifically, trivia/educational entertainment.</li>
            <li>Episodle is an independent project and is strictly not affiliated with, endorsed by, or sponsored by Netflix, HBO, Disney, Hulu, or any other television network or production studio.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">3. User Conduct</h2>
          <p className="text-gray-300 leading-relaxed">
            You agree not to use the Service in any way that violates applicable laws or regulations. You also agree not to:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li>Attempt to reverse-engineer, decompile, or otherwise tamper with the game logic or API to uncover the daily puzzle answer ahead of time.</li>
            <li>Use automated scripts, bots, or scraping tools to interact with or download content from the Service without permission.</li>
            <li>Use the Service in any manner that could overburden, damage, or disable the site functionality for others.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">4. Limitation of Liability</h2>
          <p className="text-gray-300 leading-relaxed">
            To the fullest extent permitted by law, Episodle and its creators shall not be liable for any indirect, incidental, special, 
            consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss 
            of data, use, goodwill, or other intangible losses, resulting from (a) your access to or use of or inability to access or use 
            the Service; (b) any conduct or content of any third party on the Service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">5. Changes to the Terms</h2>
          <p className="text-gray-300 leading-relaxed">
            We may modify the Terms at any time, in our sole discretion. If we do so, we&apos;ll let you know either by posting the modified Terms 
            on the Site or through other communications. It&apos;s important that you review the Terms whenever we modify them because if you continue 
            to use the Services after we have posted modified Terms on the Site, you are indicating to us that you agree to be bound by the modified Terms.
          </p>
        </section>

        <section className="space-y-4 pb-4">
          <h2 className="text-2xl font-bold text-white">6. Contact Information</h2>
          <p className="text-gray-300 leading-relaxed">
            For any questions about these Terms, please contact us at <a href="mailto:support@episodle.co" className="text-purple-400 hover:text-purple-300 underline">support@episodle.co</a>.
          </p>
        </section>

      </div>
    </main>
  );
}
