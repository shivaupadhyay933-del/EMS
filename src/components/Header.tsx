import React from 'react';
import { useEMS } from '../context/EMSContext';
import { ViewTab } from '../types/ems';
import { Plus } from 'lucide-react';

interface HeaderProps {
  onOpenAddModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAddModal }) => {
  const { activeView, setActiveView } = useEMS();

  const navLinks: { id: ViewTab; label: string }[] = [
    { id: 'directory', label: 'Directory' },
    { id: 'attendance', label: 'Time & Leaves' },
    { id: 'payroll', label: 'Payroll' },
    { id: 'orgchart', label: 'Org Chart' },
    { id: 'performance', label: 'Performance' },
    { id: 'assets', label: 'Assets & Tasks' },
    { id: 'analytics', label: 'Analytics' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setActiveView('directory')}
            className="text-lg font-bold tracking-tight text-neutral-900 whitespace-nowrap shrink-0 text-left focus:outline-none"
          >
            TalentPulse EMS
          </button>

          {/* Zone 2: Concise single-line navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
            {navLinks.map((link) => {
              const isActive = activeView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveView(link.id)}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 focus:outline-none ${
                    isActive
                      ? 'text-neutral-950 font-semibold border-b-2 border-neutral-900 -mb-0.5'
                      : 'hover:text-neutral-900'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors whitespace-nowrap shrink-0 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Employee</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary nav overflow strip */}
        <div className="md:hidden flex items-center gap-4 py-2 overflow-x-auto border-t border-neutral-100 text-xs font-medium text-neutral-600 no-scrollbar">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveView(link.id)}
              className={`py-1 whitespace-nowrap shrink-0 ${
                activeView === link.id ? 'text-neutral-950 font-bold' : 'hover:text-neutral-900'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
