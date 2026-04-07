import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-8 pb-8 text-center text-sm text-gray-500 font-medium tracking-wide border-t border-gray-800/50 pt-8">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 max-w-4xl mx-auto px-4">
        <span>&copy; {new Date().getFullYear()} Episodle</span>
        <span className="text-gray-700 hidden sm:inline">|</span>
        <Link prefetch={false} href="/" className="hover:text-white transition-colors">Home</Link>
        <span className="text-gray-700 hidden sm:inline">|</span>
        <Link prefetch={false} href="/#about" className="hover:text-white transition-colors">About / How to Play</Link>
        <span className="text-gray-700 hidden sm:inline">|</span>
        <Link prefetch={false} href="/contact" className="hover:text-white transition-colors">Contact</Link>
        <span className="text-gray-700 hidden sm:inline">|</span>
        <Link prefetch={false} href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
        <span className="text-gray-700 hidden sm:inline">|</span>
        <Link prefetch={false} href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
        <span className="text-gray-700 hidden sm:inline">|</span>
        <Link prefetch={false} href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
      </div>
      <div className="mt-4 text-xs text-gray-600">
        <span className="italic">Support the Dev</span>
      </div>
    </footer>
  );
}
