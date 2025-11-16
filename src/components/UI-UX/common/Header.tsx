// components/UI-UX/common/Header.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Heart, User, Search, ChevronDown, Facebook, Instagram, Youtube, Twitter, Link2 } from 'lucide-react'; 
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import AuthModal from '@/components/AuthModal';

// --- TYPE DEFINITIONS (Interfaces) ---
interface TopLink {
  name: string;
  href: string;
}
interface MainNavLink extends TopLink {
  dropdown?: string[];
}
interface DropdownMenuProps {
  items: string[];
}

const topLinks: TopLink[] = [
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contacts' },
  { name: 'Orders', href: '#' },
  { name: 'FAQ', href: '#' },
];
const mainNavLinks: MainNavLink[] = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/product',
     dropdown: ['Whey', 'Protein', 'Weight Burner', 'Weight Gainer'] },
  { name: 'Offers', href: '#' },
  { name: 'Blog', href: '#' },
  { name: 'Pages', href: '#', dropdown: ['Wishlist', 'Cart', 'Checkout', 'Account'] },
];

const DropdownMenu: React.FC<DropdownMenuProps> = ({ items }) => (
  <div className="absolute top-full left-0 mt-0.5 w-64 bg-white shadow-xl overflow-hidden border border-gray-100 z-[100] opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
    {items.map((item: string, index: number) => (
      <a key={index} href="#" className="block px-4 py-3 text-sm text-gray-700 hover:bg-[#629D23] hover:text-white transition-colors duration-150">
        {item}
      </a>
    ))}
  </div>
);

export default function SuppliMaxNavbar() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const mainNavbarRef = useRef<HTMLDivElement>(null);
  const [headerWrapperHeight, setHeaderWrapperHeight] = useState<number>(130); 
  
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartItemsCount } = useCart();

  useEffect(() => {
    const headerWrapperElement = document.getElementById('header-wrapper');
    if (headerWrapperElement) {
        setHeaderWrapperHeight(headerWrapperElement.offsetHeight);
    }
    
    const handleScroll = () => {
      const scrollThreshold = headerWrapperElement?.offsetHeight || headerWrapperHeight; 

      if (window.scrollY > scrollThreshold) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headerWrapperHeight]);
  const navHeight = 56; 

  const stickyClass: string = isScrolled
    ? 'fixed top-0 left-0 right-0 shadow-lg animate-slide-down'
    : 'relative';

  const handleLogout = () => {
    logout();
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-down {
          animation: slideDown 0.3s ease-out forwards;
        }
      `}</style>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />

      <div 
        id="header-wrapper"
        className={`hidden lg:block relative z-40 transition-transform duration-300 ease-in-out ${isScrolled ? 'transform -translate-y-full' : 'transform translate-y-0'}`}
      >
        <div className={`bg-[#629D23] text-white py-2`}>
          <div className="container mx-auto px-4 flex justify-between items-center text-xs font-medium relative"> 
            <div className="flex-1 flex justify-start">
              <nav className="flex space-x-4"> 
                {topLinks.map((link: TopLink) => (
                  <Link key={link.name} href={link.href} className="hover:text-amber-300 transition-colors duration-150">{link.name}</Link>
                ))}
              </nav>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 hidden xl:block">
              <span className="font-semibold text-sm">Welcome to our Organic Suppliments Store</span>
            </div>
            <div className="flex-1 flex justify-end items-center space-x-3">
              <a href="#" aria-label="Follow us on Facebook" className="hover:text-amber-300 transition-colors duration-150"><Facebook className="w-4 h-4" /></a>
              <a href="#" aria-label="Follow us on Instagram" className="hover:text-amber-300 transition-colors duration-150"><Instagram className="w-4 h-4" /></a>
              <a href="#" aria-label="Follow us on YouTube" className="hover:text-amber-300 transition-colors duration-150"><Youtube className="w-4 h-4" /></a>
              <a href="#" aria-label="Follow us on Twitter" className="hover:text-amber-300 transition-colors duration-150"><Twitter className="w-4 h-4" /></a>
            </div>
          </div>
        </div>

        <header className={`bg-white py-4 shadow-sm`}>
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex-shrink-0">
              <Link href="/">
                <h1 className="text-4xl font-extrabold text-[#629D23] tracking-tight hover:text-[#4a7a1b] transition-colors cursor-pointer">SuppliMax</h1>
              </Link>
            </div>
            <div className="flex-1 max-w-xl mx-8">
              <div className="relative flex w-full">
                <input type="text" placeholder="Search for products..." className="w-full pl-5 pr-20 py-3 border border-gray-300  focus:ring-1 focus:ring-[#629D23] focus:border-[#629D23] outline-none transition-all duration-200" />
                <span className="absolute right-0 top-0 h-full px-6 text-white bg-[#629D23] hover:bg-[#2D3B29] transition-colors flex items-center justify-center">
                 Search <Search className="w-5 h-5 ml-2" />
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="flex flex-col items-center justify-center text-gray-600 hover:text-[#629D23] transition-colors group">
                <Heart className="w-6 h-6 transform group-hover:scale-110 transition-transform" /><span className="text-xs font-medium mt-1">Wishlist</span>
              </a>
              
              {/* ✅ Updated Cart Section with Link and Cart Count */}
              <Link href="/cart" className="flex flex-col items-center justify-center text-gray-600 hover:text-[#629D23] transition-colors group relative">
                <ShoppingCart className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
                <span className="absolute top-0 right-0 -mt-2 -mr-3 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {getCartItemsCount()}
                </span>
                <span className="text-xs font-medium mt-1">Cart</span>
              </Link>
              
              {/* ✅ Updated Account Section with Authentication */}
              {isAuthenticated ? (
                <div className="relative group">
                  <div className="flex flex-col items-center justify-center text-gray-600 hover:text-[#629D23] transition-colors group cursor-pointer">
                    <div className="w-6 h-6 bg-[#629D23] rounded-full flex items-center justify-center text-white text-xs font-bold transform group-hover:scale-110 transition-transform">
                      {user ? getUserInitials(user.name) : 'U'}
                    </div>
                    <span className="text-xs font-medium mt-1">Account</span>
                  </div>
                  
                  {/* Dropdown Menu for Authenticated User */}
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-xl border border-gray-100 rounded-lg z-[100] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="p-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#629D23] hover:text-white transition-colors">
                      My Account
                    </Link>
                    <Link href="/cart" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#629D23] hover:text-white transition-colors">
                      My Cart ({getCartItemsCount()})
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="flex flex-col items-center justify-center text-gray-600 hover:text-[#629D23] transition-colors group"
                >
                  <User className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium mt-1">Login</span>
                </button>
              )}
            </div>
          </div>
        </header>
      </div>
      
      {isScrolled && <div style={{ height: navHeight }} className="hidden lg:block" />}
      
      {/* ✅ Level 3 Navbar - Increased z-index to 60 */}
      <nav ref={mainNavbarRef} className={`bg-[#4a7a1b] text-white z-60 w-full ${stickyClass}`}>
        <div className="container mx-auto px-4 flex items-center justify-between h-14">
          
          {/* ✅ All Categories Dropdown - Now with higher z-index */}
          <div className="relative group bg-[#629D23] hover:bg-[#2D3B29] h-full flex items-center transition-colors px-6 cursor-pointer z-[70]">
            <div className="flex items-center space-x-2 font-bold text-lg">
              <span className='w-5 h-5'>
                <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
              </span>
              <span>All Categories</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <DropdownMenu items={['Protein', 'Pre workout', 'Weight Gainer', 'Creatine', 'BCCA', 'Fat Burner','Performance']} />
          </div>

          {/* ✅ Main Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8 h-full">
            {mainNavLinks.map((link: MainNavLink) => (
              <div key={link.name} className={`relative group h-full flex items-center transition-all ${link.dropdown ? 'cursor-pointer z-[70]' : ''}`}>
                <Link href={link.href} className="font-semibold text-sm h-full w-full px-4 uppercase hover:text-white hover:bg-[#2D3B29] transition-colors flex items-center">
                  {link.name}
                  {link.dropdown && <ChevronDown className="w-3 h-3 ml-1 transition-transform group-hover:rotate-180" />}
                </Link>
                {link.dropdown && <DropdownMenu items={link.dropdown} />}
              </div>
            ))}
          </div>

          <div className="flex items-center">
            <span className="px-4 py-2 bg-[#2D3B29] text-white font-bold text-sm rounded-full shadow-lg">
              Exclusive Sale Offer!
            </span>
          </div>
        </div>
      </nav>
      
      {/* ✅ Mobile View */}
      <div className="lg:hidden bg-white shadow-md p-3 flex justify-between items-center sticky top-0 z-50">
          <Link href="/">
            <h1 className="text-xl font-extrabold text-[#629D23]">SuppliMax</h1>
          </Link>
          <div className="flex space-x-3">
            <Search className="w-6 h-6 text-gray-600"/>
            
            {/* ✅ Mobile Cart Link with Count */}
            <Link href="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-600"/>
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {getCartItemsCount()}
                </span>
              )}
            </Link>
            
            {/* ✅ Mobile View Authentication */}
            {isAuthenticated ? (
              <Link href="/account">
                <div className="w-6 h-6 bg-[#629D23] rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user ? getUserInitials(user.name) : 'U'}
                </div>
              </Link>
            ) : (
              <button onClick={() => setShowAuthModal(true)}>
                <User className="w-6 h-6 text-gray-600"/>
              </button>
            )}
          </div>
      </div>
    </>
  );
}