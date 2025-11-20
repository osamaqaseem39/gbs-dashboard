import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BuildingStorefrontIcon,
  XMarkIcon,
  Bars3Icon,
  TagIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Squares2X2Icon,
  CubeIcon,
  UserGroupIcon,
  TruckIcon,
  PresentationChartLineIcon,
  WrenchScrewdriverIcon,
  BuildingOfficeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useSidebar } from '../../contexts/SidebarContext';
import Tooltip from '../ui/Tooltip';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const Sidebar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const navigation: SidebarItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: Squares2X2Icon },
    { name: 'Products', href: '/dashboard/products', icon: CubeIcon },
    { name: 'Categories', href: '/dashboard/categories', icon: TagIcon },
    { name: 'Inventory', href: '/dashboard/inventory', icon: CubeIcon },
    { name: 'Product Setup', href: '/dashboard/product-setup', icon: BuildingStorefrontIcon },
    { name: 'Orders', href: '/dashboard/orders', icon: TruckIcon },
    { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
    { name: 'Brands', href: '/dashboard/brands', icon: BuildingOfficeIcon },
    { name: 'Delivery Charges', href: '/dashboard/delivery-charges', icon: MapPinIcon },
    { name: 'Analytics', href: '/dashboard/analytics', icon: PresentationChartLineIcon },
    { name: 'Settings', href: '/dashboard/settings', icon: WrenchScrewdriverIcon },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <button
          type="button"
          className="text-gray-500 hover:text-gray-600"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white">
            <div className="flex h-16 items-center justify-between px-4">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GBS</span>
                </div>
                <span className="ml-2 text-lg font-semibold text-gray-900">Gujrat Book Shop</span>
              </div>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`sidebar-item ${isActive(item.href) ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                  {item.badge && (
                    <span className="ml-auto bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:bg-white lg:pt-5 lg:pb-4 sidebar-toggle sidebar-enhanced ${
        isCollapsed ? 'lg:w-16' : 'lg:w-64'
      }`}>
        <div className={`flex items-center justify-between flex-shrink-0 px-4 logo-container ${isCollapsed ? 'collapsed' : ''}`}>
          <div className="flex items-center">
            <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            {!isCollapsed && (
              <span className="ml-2 text-lg font-semibold text-gray-900">Gujrat Book Shop</span>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-4 w-4" />
            ) : (
              <ChevronLeftIcon className="h-4 w-4" />
            )}
          </button>
        </div>
        
        {/* User info */}
        {!isCollapsed && (
          <div className="mt-5 px-4">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-semibold text-sm">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className={`mt-8 flex-1 space-y-1 px-2 ${isCollapsed ? 'px-1' : ''}`}>
          {navigation.map((item) => {
            const linkContent = (
              <Link
                key={item.name}
                to={item.href}
                className={`sidebar-item ${isActive(item.href) ? 'active' : ''} ${
                  isCollapsed ? 'collapsed' : ''
                }`}
              >
                <item.icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
                {!isCollapsed && (
                  <>
                    {item.name}
                    {item.badge && (
                      <span className="ml-auto bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );

            return isCollapsed ? (
              <Tooltip key={item.name} content={item.name} position="right">
                {linkContent}
              </Tooltip>
            ) : (
              linkContent
            );
          })}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="flex-shrink-0 border-t border-gray-200 p-4">
            <div className="text-xs text-gray-500 text-center">
              © 2024 Gujrat Book Shop
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar; 
