import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-6 mt-12 glass border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} VoteGuide AI. All rights reserved.
        </div>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link href="#" className="text-slate-400 hover:text-white text-sm">
            Privacy Policy
          </Link>
          <Link href="#" className="text-slate-400 hover:text-white text-sm">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
