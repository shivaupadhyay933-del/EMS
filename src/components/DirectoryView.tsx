import React, { useState, useMemo } from 'react';
import { useEMS } from '../context/EMSContext';
import { Department, EmploymentStatus, Employee } from '../types/ems';
import { Search, LayoutGrid, List, Mail, Phone, MapPin, Building2, Eye, UserPlus, Trash2 } from 'lucide-react';
import { formatLakhsCrores } from '../utils/formatters';

interface DirectoryViewProps {
  onOpenAddModal: () => void;
}

const DEPARTMENTS: (Department | 'All')[] = [
  'All',
  'Engineering',
  'Product',
  'Design',
  'Sales',
  'Marketing',
  'People & HR',
  'Finance',
  'Operations',
];

export const DirectoryView: React.FC<DirectoryViewProps> = ({ onOpenAddModal }) => {
  const { employees, setSelectedEmployee, deleteEmployee } = useEMS();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<Department | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<EmploymentStatus | 'All'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
      const matchesSearch =
        fullName.includes(searchQuery.toLowerCase()) ||
        emp.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
      const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [employees, searchQuery, selectedDept, selectedStatus]);

  const handleDelete = (e: React.MouseEvent, emp: Employee) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to remove ${emp.firstName} ${emp.lastName} from the organization roster?`)) {
      deleteEmployee(emp.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Toolbar */}
      <div className="bg-white p-5 rounded-xl border border-neutral-200 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name, role, city (e.g. Bengaluru), skill, or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-colors"
            />
          </div>

          {/* Right Tools: Status filter + Grid/Table Toggle */}
          <div className="flex items-center gap-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as EmploymentStatus | 'All')}
              className="text-xs font-medium bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Onboarding">Onboarding</option>
              <option value="On Leave">On Leave</option>
              <option value="Terminated">Terminated</option>
            </select>

            {/* Layout Toggle */}
            <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
                }`}
                title="Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'table' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
                }`}
                title="Table View"
                aria-label="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Department Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-neutral-100 no-scrollbar">
          {DEPARTMENTS.map((dept) => {
            const isSelected = selectedDept === dept;
            return (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                {dept}
                {dept === 'All' ? ` (${employees.length})` : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header count */}
      <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
        <span>
          Showing <strong className="text-neutral-800 tabular-nums">{filteredEmployees.length}</strong> of{' '}
          <strong className="text-neutral-800 tabular-nums">{employees.length}</strong> staff members
        </span>
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDept('All');
              setSelectedStatus('All');
            }}
            className="text-neutral-700 underline hover:text-neutral-950"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Content: Grid or Table */}
      {filteredEmployees.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center space-y-3">
          <Building2 className="w-8 h-8 text-neutral-400 mx-auto" />
          <h3 className="text-base font-semibold text-neutral-900">No employees found</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Try adjusting your search query or add a new team member to your India roster.
          </p>
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add New Employee</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              onClick={() => setSelectedEmployee(emp)}
              className="bg-white rounded-xl border border-neutral-200 p-5 hover:border-neutral-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Employee Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${emp.avatarBgColor}`}
                    >
                      {emp.initials}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors">
                        {emp.firstName} {emp.lastName}
                      </h4>
                      <p className="text-xs text-neutral-500 line-clamp-1">{emp.jobTitle}</p>
                    </div>
                  </div>

                  {/* Clean unboxed status indicator */}
                  <div className="text-right shrink-0">
                    <span
                      className={`text-xs font-medium ${
                        emp.status === 'Active'
                          ? 'text-emerald-700'
                          : emp.status === 'Onboarding'
                          ? 'text-sky-700'
                          : emp.status === 'On Leave'
                          ? 'text-amber-700'
                          : 'text-neutral-500'
                      }`}
                    >
                      {emp.status}
                    </span>
                    <p className="text-[11px] font-mono tabular-nums text-neutral-400">{emp.employeeCode}</p>
                  </div>
                </div>

                {/* Clean unboxed metadata separator */}
                <div className="text-xs text-neutral-500 flex flex-wrap items-center gap-2">
                  <span>{emp.department}</span>
                  <span aria-hidden="true">·</span>
                  <span>{emp.workModel}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums font-semibold text-neutral-800">
                    {formatLakhsCrores(emp.salary)}
                  </span>
                </div>

                {/* Contact & Location details */}
                <div className="space-y-1.5 text-xs text-neutral-600 pt-2 border-t border-neutral-100">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate">{emp.location}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate font-mono tabular-nums">{emp.phone}</span>
                  </div>
                </div>

                {/* Top Skills Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {emp.skills.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {emp.skills.length > 3 && (
                    <span className="text-[11px] text-neutral-400 py-0.5 font-mono tabular-nums">
                      +{emp.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-100">
                <span className="text-[11px] text-neutral-400 font-mono tabular-nums">
                  Joined {emp.startDate}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleDelete(e, emp)}
                    className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                    title="Remove Employee"
                    aria-label={`Remove ${emp.firstName}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setSelectedEmployee(emp)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-neutral-700 bg-neutral-50 hover:bg-neutral-100 rounded-md transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Dossier</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* High-Density Data Table View */
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Work Model</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Annual CTC</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => setSelectedEmployee(emp)}
                    className="hover:bg-neutral-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${emp.avatarBgColor}`}
                        >
                          {emp.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900 group-hover:text-neutral-700">
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p className="text-[11px] text-neutral-500">{emp.jobTitle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-600 tabular-nums">{emp.employeeCode}</td>
                    <td className="py-3 px-4 text-neutral-700">{emp.department}</td>
                    <td className="py-3 px-4 text-neutral-600">{emp.workModel}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-medium ${
                          emp.status === 'Active'
                            ? 'text-emerald-700'
                            : emp.status === 'Onboarding'
                            ? 'text-sky-700'
                            : emp.status === 'On Leave'
                            ? 'text-amber-700'
                            : 'text-neutral-500'
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-neutral-900 font-semibold tabular-nums">
                      {formatLakhsCrores(emp.salary)}
                    </td>
                    <td className="py-3 px-4 text-neutral-500">{emp.location}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedEmployee(emp)}
                          className="px-2 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-200 rounded transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, emp)}
                          className="p-1 text-neutral-400 hover:text-rose-600 rounded transition-colors"
                          title="Delete employee"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
