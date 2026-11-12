import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Brain, Search, FolderKanban, Bot,
  Route, RefreshCw, BarChart3, Settings, Database,
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const navItems = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/memories', label: 'Memories', icon: Brain },
  { to: '/search', label: 'Semantic Search', icon: Search },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/agents', label: 'AI Agents', icon: Bot },
  { to: '/traces', label: 'Retrieval Traces', icon: Route },
  { to: '/lifecycle', label: 'Memory Lifecycle', icon: RefreshCw },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const Sidebar: React.FC = () => {
  const { userProfile } = useAppContext();

  const initials = userProfile.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="fixed inset-y-0 left-0 w-60 bg-white border-r border-slate-200 flex flex-col z-30">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-100">
        <div className="p-1.5 bg-slate-900 rounded-lg">
          <Database className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-900 leading-tight">Memory Observatory</h1>
          <p className="text-[10px] text-slate-400 font-medium tracking-wide">AGENTMEMORY</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-0.5 ${
                isActive
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="border-t border-slate-100 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600">
            {initials || 'SP'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{userProfile.name}</p>
            <p className="text-xs text-slate-400 capitalize">{userProfile.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
