import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - Episodle',
  description: 'Comprehensive Privacy Policy for the Episodle web game, explaining our data collection, usage, and your rights under GDPR and CCPA.',
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-black text-white px-4 py-8 font-sans selection:bg-gray-800">
      <div className="max-w-4xl mx-auto space-y-8 bg-gray-900 border border-gray-800 p-6 md:p-10 rounded-2xl shadow-xl">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2">Privacy Policy</h1>
        <p className="text-gray-400 font-medium pb-4 border-b border-gray-800">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <section className="space-y-4">
          <p className="text-gray-300 leading-relaxed">
            Welcome to Episodle. We are committed to protecting your personal information and your right to privacy. 
            If you have any questions or concerns about this privacy notice or our practices with regards to your personal 
            information, please contact us at <a href="mailto:support@episodle.co" className="text-purple-400 hover:text-purple-300 underline">support@episodle.co</a>.
          </p>
          <p className="text-gray-300 leading-relaxed">
            When you visit our website (the &quot;Site&quot;) and use any of our services (the &quot;Services&quot;), we appreciate that 
            you are trusting us with your personal information. We take your privacy very seriously. In this privacy notice, 
            we seek to explain to you in the clearest way possible what information we collect, how we use it, and what rights you have in relation to it.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">1. Information We Collect</h2>
          <p className="text-gray-300 leading-relaxed">
            We automatically collect certain information when you visit, use, or navigate the Site. This information does not reveal 
            your specific identity (like your name or contact information) but may include device and usage information, such as your 
            IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, 
            location, information about how and when you use our Site, and other technical information.
          </p>
          <p className="text-gray-300 leading-relaxed">
            We use third-party tools to understand how you interact with our game:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-3">
            <li>
              <strong>Microsoft Clarity:</strong> We capture how you use and interact with our website through behavioral metrics, 
              heatmaps, and session replay to improve our game. This data is captured using first and third-party cookies.
            </li>
            <li>
              <strong>Google Analytics:</strong> We use Google Analytics to measure site traffic and understand user behavior.
            </li>
            <li>
              <strong>Google AdSense:</strong> We use Google AdSense to serve advertisements. Google uses cookies (like the DART cookie) 
              to serve ads based on your visit to this site and other sites on the Internet.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">2. How We Use Your Data</h2>
          <p className="text-gray-300 leading-relaxed">
            We process your information for purposes based on legitimate business interests, the fulfillment of our contract with you, 
            compliance with our legal obligations, and/or your consent. Specifically, we use the data collected to:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li>Deliver and facilitate delivery of services to the user.</li>
            <li>Respond to user inquiries/offer support to users.</li>
            <li>Fix bugs and improve game UI/UX via session recordings and heatmaps.</li>
            <li>Target advertising to you through partners like Google AdSense to maintain the site&apos;s free-to-play status.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">3. Third-Party Advertising and Cookies</h2>
          <p className="text-gray-300 leading-relaxed">
            We share information with third parties that perform services for us or on our behalf, including advertising networks 
            such as Google AdSense. Third-party vendors use cookies to serve ads based on your prior visits to our website or other websites. 
            Google&apos;s use of advertising cookies enables it and its partners to serve ads to you based on your visit to our sites and/or other sites on the Internet.
          </p>
          <p className="text-gray-300 leading-relaxed">
            You may opt-out of personalized advertising by visiting Google&apos;s <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">Ads Settings</a>. For more detailed information on our use of cookies, please review our <Link prefetch={false} href="/cookies" className="text-purple-400 hover:text-purple-300 underline">Cookie Policy</Link>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">4. Your Privacy Rights (GDPR &amp; CCPA)</h2>
          <p className="text-gray-300 leading-relaxed">
            Depending on where you are located, you may have specific rights regarding your personal information:
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-3">
            <li>
              <strong>General Data Protection Regulation (GDPR) (EEA, UK, Switzerland):</strong> If you are a resident of the European 
              Economic Area, you have the right to request access to and obtain a copy of your personal information, request rectification 
              or erasure, restrict the processing of your personal information, and if applicable, to data portability. You also have the right to withdraw your consent at any time.
            </li>
            <li>
              <strong>California Consumer Privacy Act (CCPA):</strong> If you are a California resident, you have the right to request 
              information about what personal information we collect, request deletion of your data, and opt-out of the &quot;sale&quot; of your 
              personal information (which may include data shared for targeted advertising).
            </li>
          </ul>
          <p className="text-gray-300 leading-relaxed mt-2">
            To exercise these rights, please contact us at <a href="mailto:support@episodle.co" className="text-purple-400 hover:text-purple-300 underline">support@episodle.co</a>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">5. Do Not Track Features</h2>
          <p className="text-gray-300 leading-relaxed">
            Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track (&quot;DNT&quot;) feature or setting 
            you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. 
            At this stage, no uniform technology standard for recognizing and implementing DNT signals has been finalized.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">6. Contact Us</h2>
          <p className="text-gray-300 leading-relaxed">
            If you have questions or comments about this notice, you may email us at:
            <br />
            <a href="mailto:support@episodle.co" className="text-lg font-bold text-purple-400 hover:text-purple-300 underline mt-2 inline-block">support@episodle.co</a>
          </p>
        </section>
      </div>
    </main>
  );
}
