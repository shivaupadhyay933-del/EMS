import React from 'react';
import { useEMS } from '../context/EMSContext';
import {
  Download,
  RotateCcw,
  Building2,
} from 'lucide-react';
import { formatINR, formatLakhsCrores } from '../utils/formatters';

export const AnalyticsView: React.FC = () => {
  const { employees, resetAllData, showToast } = useEMS();

  // Headcount by department
  const deptCounts: Record<string, number> = {};
  const deptSalary: Record<string, number> = {};

  employees.forEach((emp) => {
    deptCounts[emp.department] = (deptCounts[emp.department] || 0) + 1;
    deptSalary[emp.department] = (deptSalary[emp.department] || 0) + emp.salary;
  });

  // Work model counts
  const modelCounts: Record<string, number> = {};
  employees.forEach((emp) => {
    modelCounts[emp.workModel] = (modelCounts[emp.workModel] || 0) + 1;
  });

  const totalPayroll = employees.reduce((sum, e) => sum + e.salary, 0);
  const avgSalary = Math.round(totalPayroll / employees.length);

  const handleExportCSV = () => {
    const headers = [
      'Employee Code',
      'First Name',
      'Last Name',
      'Email',
      'Job Title',
      'Department',
      'Location (City)',
      'Work Model',
      'Employment Type',
      'Status',
      'DOJ Start Date',
      'Annual CTC INR',
    ];

    const rows = employees.map((e) => [
      e.employeeCode,
      `"${e.firstName}"`,
      `"${e.lastName}"`,
      e.email,
      `"${e.jobTitle}"`,
      `"${e.department}"`,
      `"${e.location}"`,
      e.workModel,
      e.employmentType,
      e.status,
      e.startDate,
      e.salary,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `talentpulse_india_roster_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exported Indian employee roster to CSV.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Toolbar */}
      <div className="bg-white p-5 rounded-xl border border-neutral-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-neutral-900">Workforce Analytics & Intelligence (India Hubs)</h3>
          <p className="text-xs text-neutral-500">
            Real-time headcount dynamics, department CTC allocations, and retention metrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetAllData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
            title="Reset to factory demo records"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Roster (CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-neutral-200 space-y-1">
          <span className="text-xs text-neutral-500 font-medium">Active Headcount</span>
          <p className="text-2xl font-bold font-mono tabular-nums text-neutral-900">
            {employees.length}
          </p>
          <p className="text-[11px] text-neutral-500">Bengaluru, Mumbai, Pune, Gurugram, Hyd, Noida</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 space-y-1">
          <span className="text-xs text-neutral-500 font-medium">Annualized Wage Spend (CTC)</span>
          <p className="text-2xl font-bold font-mono tabular-nums text-neutral-900">
            {formatLakhsCrores(totalPayroll)}
          </p>
          <p className="text-[11px] text-neutral-500 font-mono tabular-nums">
            Avg: {formatLakhsCrores(avgSalary)}/emp
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 space-y-1">
          <span className="text-xs text-neutral-500 font-medium">Annual Retention Rate</span>
          <p className="text-2xl font-bold font-mono tabular-nums text-emerald-700">96.8%</p>
          <p className="text-[11px] text-neutral-500">Top Indian Tech Tier-1 Benchmark</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 space-y-1">
          <span className="text-xs text-neutral-500 font-medium">Average Tenure</span>
          <p className="text-2xl font-bold font-mono tabular-nums text-neutral-900">2.6 yrs</p>
          <p className="text-[11px] text-neutral-500">Founded March 2021</p>
        </div>
      </div>

      {/* Department Distribution Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Headcount by Department */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h4 className="text-sm font-bold text-neutral-900">Headcount by Department</h4>
            <span className="text-xs font-mono text-neutral-400 tabular-nums">
              {employees.length} employees
            </span>
          </div>

          <div className="space-y-3">
            {Object.entries(deptCounts).map(([dept, count]) => {
              const pct = Math.round((count / employees.length) * 100);
              return (
                <div key={dept} className="space-y-1 text-xs">
                  <div className="flex justify-between font-medium text-neutral-800">
                    <span>{dept}</span>
                    <span className="font-mono tabular-nums text-neutral-500">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-neutral-900 h-full rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Salary Budget Allocation by Department */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h4 className="text-sm font-bold text-neutral-900">Annual Wage Spend by Department (INR)</h4>
            <span className="text-xs font-mono text-neutral-400 tabular-nums">
              {formatINR(totalPayroll)}
            </span>
          </div>

          <div className="space-y-3">
            {Object.entries(deptSalary).map(([dept, salarySum]) => {
              const pct = Math.round((salarySum / totalPayroll) * 100);
              return (
                <div key={dept} className="space-y-1 text-xs">
                  <div className="flex justify-between font-medium text-neutral-800">
                    <span>{dept}</span>
                    <span className="font-mono tabular-nums text-neutral-600">
                      {formatINR(salarySum)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-700 h-full rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Workplace Dynamics: Work Model Distribution */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Object.entries(modelCounts).map(([model, count]) => (
          <div
            key={model}
            className="bg-white p-5 rounded-xl border border-neutral-200 space-y-2"
          >
            <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
              <span>{model} Policy</span>
              <Building2 className="w-4 h-4 text-neutral-400" />
            </div>
            <p className="text-xl font-bold font-mono tabular-nums text-neutral-900">
              {count} employees
            </p>
            <p className="text-[11px] text-neutral-500 font-mono tabular-nums">
              {Math.round((count / employees.length) * 100)}% of total company workforce
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
