import React, { useState, Fragment } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  BeakerIcon, 
  ChartBarIcon, 
  InformationCircleIcon,
  Bars3Icon,
  XMarkIcon,
  SparklesIcon,
  DocumentTextIcon,
  BuildingLibraryIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  UserGroupIcon,
  BellIcon,
  SparklesIcon as ParkIcon
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { useI18n } from '../i18n';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import ConnectionRequests from './ConnectionRequests';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, setLang, t } = useI18n();
  const { user, isAuthenticated, logout } = useAuth();
  const { connectionRequests } = useUser();

  const navigation = [
    { name: t('nav.home'), href: '/', icon: HomeIcon },
    { name: t('nav.recommendation'), href: '/recommendation', icon: SparklesIcon },
    { name: t('nav.advisor'), href: '/advisor', icon: SparklesIcon },
    { name: t('nav.soil'), href: '/soil-analysis', icon: BeakerIcon },
    { name: 'Government Schemes', href: '/government-schemes', icon: BuildingLibraryIcon },
    { name: 'Farming Game', href: '/farming-game', icon: ParkIcon },
    { name: t('nav.community'), href: '/community', icon: UserGroupIcon },
    { name: t('nav.dashboard'), href: '/dashboard', icon: ChartBarIcon },
    { name: t('nav.about'), href: '/about', icon: InformationCircleIcon },
  ];

  const authNavigation = [
    { name: t('nav.profile'), href: '/profile', icon: UserCircleIcon },
    { name: t('nav.logout'), href: '#', icon: ArrowRightOnRectangleIcon, action: logout },
  ];

  const guestNavigation = [
    { name: t('nav.login'), href: '/login', icon: ArrowRightOnRectangleIcon },
    { name: t('nav.register'), href: '/register', icon: UserPlusIcon },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 relative z-40 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo and brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold gradient-text whitespace-nowrap">CROP MIND</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center flex-1 ml-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.name} className="relative">
                  <Link
                    to={item.href}
                    className={`
                      ${isActive(item.href) ? 'text-primary-600' : 'text-gray-700 hover:text-gray-900'}
                      flex items-center px-3 py-2 text-sm font-medium whitespace-nowrap
                    `}
                  >
                    {Icon && <Icon className="h-5 w-5 mr-1.5 flex-shrink-0" />}
                    <span>{item.name}</span>
                  </Link>
                </div>
              );
            })}
            
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              {/* Notification Bell */}
              <button
                onClick={() => setShowRequests(!showRequests)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 relative"
              >
                <BellIcon className="h-6 w-6" />
                {connectionRequests.length > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                )}
              </button>
              {showRequests && <ConnectionRequests onClose={() => setShowRequests(false)} />}

              {/* Language Selector */}
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="te">తెలుగు</option>
                <option value="ta">தமிழ்</option>
                <option value="bn">বাংলা</option>
                <option value="mr">मराठी</option>
              </select>

              {/* User Menu */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                      {isAuthenticated ? (
                        user?.name?.charAt(0) || <UserCircleIcon className="h-6 w-6" />
                      ) : (
                        <UserCircleIcon className="h-6 w-6" />
                      )}
                    </div>
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-700 truncate">{user?.name || 'User'}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.id || 'User ID'}</p>
                        </div>
                        {authNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <a
                                href={item.href}
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (item.action) {
                                    item.action();
                                  } else {
                                    navigate(item.href);
                                  }
                                }}
                                className={`block px-4 py-2 text-sm ${
                                  active ? 'bg-gray-100' : ''
                                } text-gray-700`}
                              >
                                <div className="flex items-center">
                                  <item.icon className="h-4 w-4 mr-2" />
                                  {item.name}
                                </div>
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </>
                    ) : (
                      guestNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <a
                              href={item.href}
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(item.href);
                              }}
                              className={`block px-4 py-2 text-sm ${
                                active ? 'bg-gray-100' : ''
                              } text-gray-700`}
                            >
                              <div className="flex items-center">
                                <item.icon className="h-4 w-4 mr-2" />
                                {item.name}
                              </div>
                            </a>
                          )}
                        </Menu.Item>
                      ))
                    )}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-primary-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="px-3 py-2 space-y-2">
              <select
                className="input-field w-full"
                value={lang}
                onChange={(e) => { setLang(e.target.value); setIsOpen(false); }}
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="te">తెలుగు</option>
                <option value="ta">தமிழ்</option>
                <option value="mr">मराठी</option>
                <option value="bn">বাংলা</option>
              </select>
              
              {isAuthenticated ? (
                <div className="space-y-2 mt-2">
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">{user?.name || 'User'}</p>
                    <p className="text-xs truncate">ID: {user?.id || 'N/A'}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center px-4 py-2 text-sm text-white bg-primary-600 hover:bg-primary-700 rounded-md"
                  >
                    <UserPlusIcon className="h-4 w-4 mr-1" />
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
