import React from 'react';
import { useAuth } from 'contexts/AuthContext';
import { useSidebar } from 'contexts/SidebarContext';

const DebugInfo: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { isCollapsed } = useSidebar();

  return (
    <div className="fixed top-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg z-50 text-xs">
      <div>Auth: {isAuthenticated ? 'Yes' : 'No'}</div>
      <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
      <div>User: {user ? `${user.firstName} ${user.lastName}` : 'None'}</div>
      <div>Sidebar Collapsed: {isCollapsed ? 'Yes' : 'No'}</div>
    </div>
  );
};

export default DebugInfo;
