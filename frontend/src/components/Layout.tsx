import type { ReactNode } from 'react';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { MobileBottomNav } from './navigation/MobileBottomNav';
import { XPBar } from './gamification/XPBar';
import { LogOut, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, clearAuth } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/workouts', label: 'Workouts' },
    { path: '/schedule', label: 'Schedule' },
    { path: '/metrics', label: 'Metrics' },
    { path: '/accountability', label: 'Goals' },
    { path: '/equipment', label: 'Equipment' },
    { path: '/profile', label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Desktop Header */}
      <nav className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center flex-1 min-w-0">
              <Link
                to="/dashboard"
                className="flex items-center text-xl font-bold text-primary-500 hover:text-primary-600 transition-colors flex-shrink-0"
              >
                PersonalFit
              </Link>

              {/* Desktop Navigation - scrollable on smaller screens */}
              <div className="hidden md:flex md:ml-6 lg:ml-8 md:space-x-1 overflow-x-auto flex-1 min-w-0 scrollbar-hide">
                <div className="flex space-x-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`inline-flex items-center px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                        location.pathname === item.path
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Hamburger Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden ml-4 p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              {/* XP Bar */}
              <div className="hidden sm:block">
                <XPBar />
              </div>

              <span className="hidden lg:inline text-sm text-neutral-700 font-medium max-w-[150px] truncate">
                {user?.profile?.first_name
                  ? `${user.profile.first_name} ${user.profile.last_name || ''}`
                  : user?.email}
              </span>
              <button
                onClick={handleLogout}
                data-testid="logout-button"
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 bg-white">
            <div className="px-4 py-2 space-y-1">
              {/* XP Bar on mobile */}
              <div className="pb-3 border-b border-neutral-200 mb-2">
                <XPBar />
              </div>

              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 pb-20 md:pb-6">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
