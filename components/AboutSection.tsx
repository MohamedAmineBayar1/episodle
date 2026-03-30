import Link from 'next/link';

export default function AboutSection() {
  return (
    <section id="about" className="mt-24 pt-12 max-w-3xl mx-auto border-t border-gray-800 text-gray-400 space-y-6 pb-4">
      <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">About Episodle &amp; How to Play</h2>

      <div className="space-y-4 leading-relaxed text-sm sm:text-base">
        <p>
          Welcome to <span className="text-white font-bold">Episodle</span>, the ultimate daily TV show guessing game designed specifically for television enthusiasts, binge-watchers, and pop culture trivia masters. If you pride yourself on recognizing characters, sets, cinematography styles, or exact moments from the world&apos;s most popular television series, this is the perfect challenge to test your visual memory.
        </p>

        <p>
          The premise is simple but highly addictive. Every single day, Episodle presents a brand-new, randomly selected frame from a specific episode of a well-known TV show. Your objective is to correctly identify the name of the television show. You are given a total of six attempts to guess the correct series.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-2">How Do You Play?</h2>
        <ol className="list-decimal pl-5 space-y-3">
          <li>
            <strong>Look at the Initial Frame:</strong> You start with one pixelated, cropped, or obscured image from the day&apos;s selected TV show. Examine the lighting, the clothing, the background, or any visible characters.
          </li>
          <li>
            <strong>Make a Guess:</strong> Type the name of a TV show into the search bar. Our comprehensive database includes hundreds of critically acclaimed dramas, beloved sitcoms, thrilling sci-fi series, and classic television hits.
          </li>
          <li>
            <strong>Unlock More Clues:</strong> If your guess is incorrect, you don&apos;t just lose an attempt—you actually gain an advantage! Every incorrect guess unlocks a brand new frame from the exact same episode. As you progress through your six guesses, the images will typically become more recognizable and revealing.
          </li>
          <li>
            <strong>Hints and Assistance:</strong> Pay close attention to the built-in hints. After a couple of incorrect tries, you might be given the release year or the primary genre (such as Comedy, Drama, or Sci-Fi) to help narrow down your mental list of possibilities.
          </li>
          <li>
            <strong>Win and Share:</strong> If you guess correctly within your six tries, you win the daily Episodle! Share your results with friends to see who has the sharpest eye for television history. We build a unique grid of colored emojis so you can brag about your score without spoiling the answer for anyone else.
          </li>
        </ol>

        <h2 className="text-xl font-bold text-white mt-8 mb-2">Why Play Episodle?</h2>
        <p>
          Whether you&apos;re a casual viewer who just finished a trending Netflix series or a hardcore television critic who knows the HBO Sunday night lineup by heart, Episodle offers a rewarding mental workout. We carefully curate our pool of shows to include a mix of modern masterpieces, unforgettable 90s cultural phenomena, and classic golden-age television.
        </p>

        <p>
          Explore our growing library of <Link prefetch={false} href="/tv" className="text-blue-400 hover:text-blue-300 underline">TV Shows</Link> and browse the full <Link prefetch={false} href="/archive" className="text-blue-400 hover:text-blue-300 underline">Archive</Link> to play past puzzles. Challenge yourself to build the longest winning streak possible. Return every day at midnight for a fresh puzzle, a new set of images, and another chance to prove you are the ultimate TV buff!
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-2">Technical Stack</h2>
        <p>
          Episodle is built with a modern, high-performance web stack designed for speed and reliability:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Frontend:</strong> Built with <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Next.js</a>, a React framework that enables server-side rendering and static generation for blazing-fast page loads and excellent SEO performance.
          </li>
          <li>
            <strong>Backend &amp; Data:</strong> Powered by a <a href="https://spring.io/projects/spring-boot" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Spring Boot</a> API for robust data management and puzzle generation, integrated with the TMDB database for rich TV show metadata and imagery.
          </li>
          <li>
            <strong>Infrastructure:</strong> Deployed on the <a href="https://www.cloudflare.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Cloudflare</a> Edge network, ensuring global low-latency delivery through Cloudflare Pages and Workers — keeping the game fast and always available for players worldwide.
          </li>
        </ul>
        <p className="text-sm text-gray-500">
          This architecture ensures a median response time well under 100ms and a 16ms median CPU execution time, keeping daily puzzles fresh and instantly accessible for every web gaming session.
        </p>

        <h2 id="contact" className="text-xl font-bold text-white mt-8 mb-2">Contact Me</h2>
        <p>
          Have feedback, found a bug, or want to suggest a new TV show for the database? I&apos;d love to hear from you! You can reach me directly at <a href="mailto:aminebayar811@gmail.com" className="text-blue-400 hover:text-blue-300 font-bold underline">aminebayar811@gmail.com</a>.
        </p>

        <p className="text-xs text-gray-500 mt-8 pt-4 border-t border-gray-800/50">
          Episodle is an independent project and is not affiliated with Netflix, HBO, or any television network. All images are used for educational/trivia purposes.
        </p>
      </div>
    </section>
  );
}
