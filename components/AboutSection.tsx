export default function AboutSection() {
  return (
    <section id="about" className="mt-24 pt-12 max-w-3xl mx-auto border-t border-gray-800 text-gray-400 space-y-6 pb-4">
      <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">About Episodle & How to Play</h2>

      <div className="space-y-4 leading-relaxed text-sm sm:text-base">
        <p>
          Welcome to <span className="text-white font-bold">Episodle</span>, the ultimate daily TV show guessing game designed specifically for television enthusiasts, binge-watchers, and pop culture trivia masters. If you pride yourself on recognizing characters, sets, cinematography styles, or exact moments from the world's most popular television series, this is the perfect challenge to test your visual memory.
        </p>

        <p>
          The premise is simple but highly addictive. Every single day, Episodle presents a brand-new, randomly selected frame from a specific episode of a well-known TV show. Your objective is to correctly identify the name of the television show. You are given a total of six attempts to guess the correct series. 
        </p>

        <h3 className="text-xl font-bold text-white mt-8 mb-2">How do you play?</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Look at the Initial Frame:</strong> You start with one pixelated, cropped, or obscured image from the day's selected TV show. Examine the lighting, the clothing, the background, or any visible characters.</li>
          <li><strong>Make a Guess:</strong> Type the name of a TV show into the search bar. Our comprehensive database includes hundreds of critically acclaimed dramas, beloved sitcoms, thrilling sci-fi series, and classic television hits.</li>
          <li><strong>Unlock More Clues:</strong> If your guess is incorrect, you don't just lose an attempt—you actually gain an advantage! Every incorrect guess unlocks a brand new frame from the exact same episode. As you progress through your six guesses, the images will typically become more recognizable and revealing.</li>
          <li><strong>Hints and Assistance:</strong> Pay close attention to the built-in hints. After a couple of incorrect tries, you might be given the release year or the primary genre (such as Comedy, Drama, or Sci-Fi) to help narrow down your mental list of possibilities.</li>
          <li><strong>Win and Share:</strong> If you guess correctly within your six tries, you win the daily Episodle! Share your results with friends to see who has the sharpest eye for television history. We build a unique grid of colored emojis so you can brag about your score without spoiling the answer for anyone else.</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-8 mb-2">Why Play Episodle?</h3>
        <p>
          Whether you're a casual viewer who just finished a trending Netflix series or a hardcore television critic who knows the HBO Sunday night lineup by heart, Episodle offers a rewarding mental workout. We carefully curate our pool of shows to include a mix of modern masterpieces, unforgettable 90s cultural phenomenons, and classic golden-age television. 
        </p>

        <p>
          Can't get enough? Don't worry—if you miss a day, you can always visit the <a href="/archive" className="text-blue-400 hover:text-blue-300 underline">Archive</a> to play past puzzles. Challenge yourself to build the longest winning streak possible. Return every day at midnight for a fresh puzzle, a new set of images, and another chance to prove you are the ultimate TV buff!
        </p>

        <h3 id="contact" className="text-xl font-bold text-white mt-8 mb-2">Contact Me</h3>
        <p>
          Have feedback, found a bug, or want to suggest a new TV show for the database? I'd love to hear from you! You can reach me directly at <a href="mailto:aminebayar811@gmail.com" className="text-blue-400 hover:text-blue-300 font-bold underline">aminebayar811@gmail.com</a>.
        </p>

        <p className="text-xs text-gray-500 mt-8 pt-4 border-t border-gray-800/50">
          Episodle is an independent project and is not affiliated with Netflix, HBO, or any television network. All images are used for educational/trivia purposes.
        </p>
      </div>
    </section>
  );
}
