// src/components/layout/Footer.tsx
import Link from "next/link";
import { Globe, Play, Music2, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black/90 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-amber-400 text-xl font-bold">WORLD OF RAAG</h3>
            <p className="text-white/40 text-sm mt-2">
              A dedicated digital home for violin learning, practice, performance & masterclasses.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-white/40 hover:text-amber-400 transition" aria-label="Website">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/40 hover:text-amber-400 transition" aria-label="Videos">
                <Play className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/40 hover:text-amber-400 transition" aria-label="Music">
                <Music2 className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/40 hover:text-amber-400 transition" aria-label="Contact">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-3">Content</h4>
            <ul className="space-y-2 text-sm text-white/40">
              <li><Link href="/learn" className="hover:text-white transition">Practice Videos</Link></li>
              <li><Link href="/compositions" className="hover:text-white transition">Compositions</Link></li>
              <li><Link href="/masterclasses" className="hover:text-white transition">Masterclasses</Link></li>
              <li><Link href="/reels" className="hover:text-white transition">Reels</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-white/40">
              <li><Link href="/help" className="hover:text-white transition">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-3">Newsletter</h4>
            <p className="text-sm text-white/40 mb-3">
              Subscribe for updates on new compositions and masterclasses.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-l-md text-white placeholder-white/30 focus:outline-none focus:border-amber-400"
              />
              <button className="px-4 py-2 bg-amber-400 text-black font-medium rounded-r-md hover:bg-amber-500 transition">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/30 text-sm">
          <p>&copy; {new Date().getFullYear()} World of Raag. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}