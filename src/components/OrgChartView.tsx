import React, { useState } from 'react';
import { useEMS } from '../context/EMSContext';
import { Employee, Department } from '../types/ems';
import { ChevronDown, ChevronRight, Users, Eye, Building2, MapPin } from 'lucide-react';

export const OrgChartView: React.FC = () => {
  const { employees, setSelectedEmployee } = useEMS();
  const [selectedDept, setSelectedDept] = useState<Department | 'All'>('All');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    'emp-1': true,
    'emp-2': true,
    'emp-3': true,
    'emp-4': true,
  });

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Build tree from root (managerId === null)
  const rootEmployees = employees.filter((e) => e.managerId === null);

  const getDirectReports = (managerId: string) => {
    return employees.filter((e) => {
      const isReport = e.managerId === managerId;
      const matchesDept = selectedDept === 'All' || e.department === selectedDept;
      return isReport && (selectedDept === 'All' ? true : matchesDept || employees.some(child => child.managerId === e.id && child.department === selectedDept));
    });
  };

  const renderNode = (emp: Employee, depth: number = 0) => {
    const reports = employees.filter((e) => e.managerId === emp.id);
    const isExpanded = expandedIds[emp.id] ?? true;

    return (
      <div key={emp.id} className="relative flex flex-col items-center">
        {/* Node Card */}
        <div
          className={`w-72 bg-white rounded-xl border transition-all p-4 shadow-xs relative z-10 ${
            depth === 0
              ? 'border-neutral-900 ring-2 ring-neutral-900/10'
              : 'border-neutral-200 hover:border-neutral-400'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${emp.avatarBgColor}`}
              >
                {emp.initials}
              </div>
              <div className="truncate">
                <h4 className="text-xs font-bold text-neutral-900 truncate">
                  {emp.firstName} {emp.lastName}
                </h4>
                <p className="text-[11px] text-neutral-500 truncate">{emp.jobTitle}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedEmployee(emp)}
              className="p-1 text-neutral-400 hover:text-neutral-900 rounded-md hover:bg-neutral-100 transition-colors"
              title="View full dossier"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
            <span className="font-medium text-neutral-700">{emp.department}</span>
            <div className="flex items-center gap-1 text-neutral-400">
              <MapPin className="w-3 h-3" />
              <span>{emp.location.split(',')[0]}</span>
            </div>
          </div>

          {reports.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between">
              <button
                onClick={() => toggleExpand(emp.id)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-700 hover:text-neutral-950 transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                )}
                <span>
                  {reports.length} Direct Report{reports.length > 1 ? 's' : ''}
                </span>
              </button>
              <span className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded font-mono">
                L{depth + 1}
              </span>
            </div>
          )}
        </div>

        {/* Children connector lines */}
        {reports.length > 0 && isExpanded && (
          <div className="flex flex-col items-center">
            {/* Vertical stem down from parent */}
            <div className="w-0.5 h-6 bg-neutral-300" />

            {/* Horizontal bar connecting children */}
            <div className="flex justify-center relative">
              {reports.length > 1 && (
                <div
                  className="absolute top-0 h-0.5 bg-neutral-300"
                  style={{
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: `calc(100% - ${288 / reports.length}px)`,
                  }}
                />
              )}

              {/* Children Nodes Grid */}
              <div className="flex items-start gap-8 pt-6 relative">
                {reports.map((report) => (
                  <div key={report.id} className="relative flex flex-col items-center">
                    {/* Vertical stem down to child */}
                    <div className="w-0.5 h-6 bg-neutral-300 absolute -top-6" />
                    {renderNode(report, depth + 1)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Org Chart Header toolbar */}
      <div className="bg-white p-5 rounded-xl border border-neutral-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-neutral-900">Organizational Hierarchy</h3>
          <p className="text-xs text-neutral-500">
            Real-time reporting structures, team sizes, and leadership chain
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500">Filter Department:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value as Department | 'All')}
            className="text-xs font-medium bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900"
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="Design">Design</option>
            <option value="Sales">Sales</option>
            <option value="People & HR">People & HR</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
          </select>
        </div>
      </div>

      {/* Visual Chart Viewport */}
      <div className="bg-neutral-50/70 border border-neutral-200 rounded-2xl p-8 overflow-x-auto min-h-[500px]">
        <div className="min-w-max flex flex-col items-center justify-start space-y-12">
          {rootEmployees.map((root) => renderNode(root, 0))}
        </div>
      </div>
    </div>
  );
};
