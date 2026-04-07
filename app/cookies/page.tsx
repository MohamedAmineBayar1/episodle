import Link from 'next/link';

export const metadata = {
  title: 'Cookie Policy - Episodle',
  description: 'Cookie Policy for Episodle, explaining how we use first and third-party cookies for gameplay, analytics, and advertising.',
};

export default function CookiePolicy() {
  return (
    <main className="min-h-screen bg-black text-white px-4 py-8 font-sans selection:bg-gray-800">
      <div className="max-w-4xl mx-auto space-y-8 bg-gray-900 border border-gray-800 p-6 md:p-10 rounded-2xl shadow-xl">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2">Cookie Policy</h1>
        <p className="text-gray-400 font-medium pb-4 border-b border-gray-800">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <section className="space-y-4">
          <p className="text-gray-300 leading-relaxed">
            This Cookie Policy explains how Episodle (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) uses cookies and similar technologies to recognize you when you visit our website. 
            It explains what these technologies are and why we use them, as well as your rights to control our use of them.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">What are cookies?</h2>
          <p className="text-gray-300 leading-relaxed">
            Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners 
            in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Cookies set by the website owner (in this case, Episodle) are called &quot;first-party cookies&quot;. Cookies set by parties other than the website owner 
            are called &quot;third-party cookies&quot;. Third-party cookies enable third-party features or functionality to be provided on or through the website 
            (e.g., like advertising, interactive content, and analytics).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Why do we use cookies?</h2>
          <p className="text-gray-300 leading-relaxed">
            We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our website to operate 
            and to remember your game progress (like your daily streak and your guesses today). We refer to these as &quot;essential&quot; or &quot;strictly necessary&quot; cookies.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Other cookies also enable us to track and target the interests of our users to enhance the experience on our Website, such as Analytics and 
            Advertising cookies.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Types of Cookies We Use</h2>
          
          <h3 className="text-xl font-bold text-gray-200 mt-4">1. Essential / Game State Local Storage</h3>
          <p className="text-gray-300 leading-relaxed">
            We use your browser&apos;s <code>localStorage</code> to save your active game state, daily streaks, and statistics. 
            This is technically not a cookie, but a similar storage mechanism essential for the game to function properly so 
            you don&apos;t lose your progress if you refresh the page.
          </p>

          <h3 className="text-xl font-bold text-gray-200 mt-4">2. Analytics &amp; Performance Cookies</h3>
          <p className="text-gray-300 leading-relaxed">
            These cookies collect information that is used either in aggregate form to help us understand how our website is being used 
            or how effective our marketing campaigns are, or to help us customize our Website for you.
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li><strong>Microsoft Clarity:</strong> Used for heatmaps and session playbacks to identify bugs and UX issues.</li>
            <li><strong>Google Analytics:</strong> Used to understand site traffic and geographic distribution of our players.</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-200 mt-4">3. Advertising Cookies</h3>
          <p className="text-gray-300 leading-relaxed">
            These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same 
            ad from continuously reappearing, ensuring that ads are properly displayed for advertisers, and in some cases selecting 
            advertisements that are based on your interests.
          </p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2">
            <li><strong>Google AdSense:</strong> We use Google to serve ads. Their systems use the DART cookie to serve personalized ads based on your browsing history.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">How can I control cookies?</h2>
          <p className="text-gray-300 leading-relaxed">
            You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the 
            consent banner that appears when you first visit our site.
          </p>
          <p className="text-gray-300 leading-relaxed">
            You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our 
            website though your access to some functionality (like saving your game streak) may be restricted. 
            As the means by which you can refuse cookies through your web browser controls vary from browser-to-browser, you should visit your 
            browser&apos;s help menu for more information.
          </p>
          <p className="text-gray-300 leading-relaxed">
            To manage personalized advertising from Google, you can visit the <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">Google Ads Settings</a>.
          </p>
        </section>

        <section className="space-y-4 pb-4">
          <h2 className="text-2xl font-bold text-white">Questions?</h2>
          <p className="text-gray-300 leading-relaxed">
            If you have any questions about our use of cookies or other technologies, please read our <Link prefetch={false} href="/privacy" className="text-purple-400 hover:text-purple-300 underline">Privacy Policy</Link> or contact us at <a href="mailto:support@episodle.co" className="text-purple-400 hover:text-purple-300 underline">support@episodle.co</a>.
          </p>
        </section>

      </div>
    </main>
  );
}
