// src/components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  BookOpen, 
  Music, 
  Users, 
  Film, 
  ShoppingBag, 
  Library, 
  User,
  Menu,
  X,
  Search,
  LogOut,
  Settings,
  History,
  Shield
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Learn", href: "/learn", icon: BookOpen },
  { name: "Compositions", href: "/compositions", icon: Music },
  { name: "Masterclasses", href: "/masterclasses", icon: Users },
  { name: "Reels", href: "/reels", icon: Film },
  { name: "Store", href: "/store", icon: ShoppingBag },
];

// Mock user for demo
const mockUser = {
  id: "1",
  name: "Demo User",
  email: "demo@worldofraag.com",
  role: "student",
  profileImage: null,
};

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const pathname = usePathname();

  const handleLogout = () => {
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <nav className="bg-black/95 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-amber-400">WORLD OF RAAG</span>
            <span className="hidden sm:inline text-xs text-white/40 uppercase tracking-wider">
              Violin Academy
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "text-amber-400 bg-amber-400/10"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="flex items-center space-x-1">
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <button className="text-white/50 hover:text-white transition">
              <Search className="w-5 h-5" />
            </button>

            {isLoggedIn ? (
              <div className="relative flex items-center space-x-3">
                <Link
                  href="/library"
                  className="text-white/70 hover:text-white transition"
                >
                  <Library className="w-5 h-5" />
                </Link>
                
                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 rounded-full hover:ring-2 hover:ring-amber-400/50 transition">
                    <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-amber-400" />
                    </div>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-black/95 backdrop-blur-sm rounded-lg shadow-xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-white/10">
                        <p className="text-white text-sm font-medium">{mockUser.name}</p>
                        <p className="text-white/40 text-xs">{mockUser.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        href="/library"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5"
                      >
                        <Library className="w-4 h-4" />
                        <span>My Library</span>
                      </Link>
                      <Link
                        href="/profile/orders"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5"
                      >
                        <History className="w-4 h-4" />
                        <span>Order History</span>
                      </Link>
                      <Link
                        href="/profile/settings"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      <Link
                        href="/admin/dashboard"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 border-t border-white/10"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 border-t border-white/10"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-white/70 hover:text-white text-sm font-medium transition"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="bg-amber-400 hover:bg-amber-500 text-black px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white/70 hover:text-white transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black/95 backdrop-blur-sm border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "text-amber-400 bg-amber-400/10"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}