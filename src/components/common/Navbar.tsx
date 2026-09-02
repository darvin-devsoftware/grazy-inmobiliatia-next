import React, { useState, useEffect } from 'react';
import { ViewType } from '../../types';
import { Logo } from './Logo';
import {
  Heart,
  Menu,
  X,
  ChevronRight,
  LogIn,
  User
} from 'lucide-react';

interface NavbarProps {
  activeView: ViewType;
  onNavigate: (view: ViewType, propertyId?: string) => void;
  savedCount: number;
  onOpenContactModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onNavigate,
  savedCount,
  onOpenContactModal
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // const navItems: { id: ViewType; label: string }[] = [
  //   { id: 'home', label: 'Inicio' },
  //   { id: 'listings', label: 'Propiedades' },
  //   { id: 'about', label: 'Sobre mí' },
  //   { id: 'services', label: 'Servicios' },
  //   { id: 'contact', label: 'Contacto' },
  // ];
  const navItems: { id: ViewType; label: string }[] = [
    { id: 'home', label: 'Inicio' },
    { id: 'listings', label: 'Propiedades' },
    { id: 'about', label: 'Sobre mí' },
    { id: 'contact', label: 'Contacto' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled
        ? 'bg-[#F7FAFC]/98 backdrop-blur-md shadow-sm border-b border-[#DBE3EE] py-2.5'
        : 'bg-[#F7FAFC] border-b border-[#DBE3EE]/60 py-3.5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* Brand Logo */}
        <button
          onClick={() => { setMobileMenuOpen(false); onNavigate('home'); }}
          className="text-left focus:outline-none group flex items-center gap-2"
        >
          <Logo size="md" variant="dark" />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-3">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors ${isActive
                  ? 'text-[#03459C] font-bold border-b-2 border-[#03459C] bg-[#03459C]/5'
                  : 'text-[#1F2937] hover:text-[#7A8AA3] hover:bg-[#EEF3F8]'
                  }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls & Login Icon */}
        <div className="hidden lg:flex items-center space-x-3">

          {/* LOGIN BUTTON / ICON */}
          <button
            onClick={() => onNavigate('admin-dashboard')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#1F2937] border border-[#DBE3EE] hover:border-[#03459C] hover:text-[#03459C] bg-white rounded-lg shadow-2xs transition-all"
            title="Iniciar Sesión"
          >
            <User className="w-4 h-4 text-[#03459C]" />
            <span>Login</span>
          </button>

        </div>

        {/* Mobile Hamburger Trigger */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => onNavigate('admin-dashboard')}
            className="p-2 text-[#1F2937] hover:text-[#03459C]"
            title="Iniciar Sesión"
          >
            <User className="w-5 h-5" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#1F2937] hover:text-[#03459C] rounded-md focus:outline-none"
            aria-label="Menú de navegación"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F7FAFC] border-b border-[#DBE3EE] px-4 pt-2 pb-6 space-y-3 animate-fadeIn">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate(item.id);
                }}
                className={`flex items-center justify-between px-3 py-2.5 text-sm font-semibold rounded-md text-left ${activeView === item.id
                  ? 'text-[#03459C] bg-[#03459C]/10 font-bold'
                  : 'text-[#1F2937] hover:bg-[#EEF3F8]'
                  }`}
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-[#7A8AA3]" />
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#DBE3EE] space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('admin-dashboard');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#03459C] rounded-lg shadow-xs"
            >
              <LogIn className="w-4 h-4" />
              <span>Iniciar Sesión / Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

