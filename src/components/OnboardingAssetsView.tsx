import React, { useState } from 'react';
import { useEMS } from '../context/EMSContext';
import { ITAsset } from '../types/ems';
import {
  Laptop,
  CheckSquare,
  ShieldCheck,
  UserCheck,
  Search,
  CheckCircle2,
  Circle,
  Plus,
  RefreshCw,
} from 'lucide-react';

export const OnboardingAssetsView: React.FC = () => {
  const { onboardingTasks, toggleOnboardingTask, assets, assignAsset, employees } = useEMS();
  const [activeTab, setActiveTab] = useState<'onboarding' | 'assets'>('onboarding');
  const [assetSearch, setAssetSearch] = useState('');

  // Group tasks by employee
  const groupedTasks: Record<string, typeof onboardingTasks> = {};
  onboardingTasks.forEach((t) => {
    if (!groupedTasks[t.employeeName]) {
      groupedTasks[t.employeeName] = [];
    }
    groupedTasks[t.employeeName].push(t);
  });

  const filteredAssets = assets.filter(
    (a) =>
      a.name.toLowerCase().includes(assetSearch.toLowerCase()) ||
      a.assetTag.toLowerCase().includes(assetSearch.toLowerCase()) ||
      a.serialNumber.toLowerCase().includes(assetSearch.toLowerCase()) ||
      (a.assignedToName && a.assignedToName.toLowerCase().includes(assetSearch.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Switcher */}
      <div className="bg-white p-5 rounded-xl border border-neutral-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('onboarding')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'onboarding'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Onboarding Checklists & Workflows</span>
          </button>
          <button
            onClick={() => setActiveTab('assets')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'assets'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>IT Hardware & Asset Registry</span>
          </button>
        </div>

        {activeTab === 'assets' && (
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search asset, tag, or serial..."
              value={assetSearch}
              onChange={(e) => setAssetSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
            />
          </div>
        )}
      </div>

      {activeTab === 'onboarding' ? (
        /* Onboarding Tasks View */
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
            <span>
              Active Onboarding Workflows ({Object.keys(groupedTasks).length} new hires)
            </span>
            <span>Click any item to toggle task completion</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(groupedTasks).map(([empName, tasks]) => {
              const completedCount = tasks.filter((t) => t.isCompleted).length;
              const percent = Math.round((completedCount / tasks.length) * 100);

              return (
                <div
                  key={empName}
                  className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-xs"
                >
                  <div className="flex items-start justify-between border-b border-neutral-100 pb-4">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900">{empName}</h4>
                      <p className="text-xs text-neutral-500">
                        {completedCount} of {tasks.length} requirements fulfilled
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-neutral-900 tabular-nums">
                      {percent}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-neutral-900 h-full rounded-full transition-all duration-200"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  {/* Task checklist items */}
                  <div className="space-y-2 pt-1">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => toggleOnboardingTask(task.id)}
                        className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                          task.isCompleted
                            ? 'bg-neutral-50/70 border-neutral-200 text-neutral-500'
                            : 'bg-white border-neutral-200 text-neutral-900 hover:border-neutral-300'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {task.isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Circle className="w-4 h-4 text-neutral-300" />
                          )}
                        </div>
                        <div className="flex-1 text-xs space-y-1">
                          <p className={`font-medium ${task.isCompleted ? 'line-through text-neutral-400' : ''}`}>
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono">
                            <span>{task.category}</span>
                            <span aria-hidden="true">·</span>
                            <span>Assignee: {task.assignedRole}</span>
                            <span aria-hidden="true">·</span>
                            <span>Due: {task.dueDate}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* IT Assets Inventory View */
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Assigned Equipment & Devices</h3>
              <p className="text-xs text-neutral-500">
                Track laptops, monitors, serial keys, and employee assignments
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums text-neutral-500 font-medium">
              {assets.length} assets registered
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-4">Asset Tag</th>
                  <th className="py-3 px-4">Hardware Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Serial Number</th>
                  <th className="py-3 px-4">Assigned To</th>
                  <th className="py-3 px-4">Condition</th>
                  <th className="py-3 px-4">Warranty</th>
                  <th className="py-3 px-4 text-right">Assignee Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-neutral-900 tabular-nums">
                      {asset.assetTag}
                    </td>
                    <td className="py-3 px-4 font-medium text-neutral-800">{asset.name}</td>
                    <td className="py-3 px-4 text-neutral-500">{asset.category}</td>
                    <td className="py-3 px-4 font-mono text-neutral-500 tabular-nums">
                      {asset.serialNumber}
                    </td>
                    <td className="py-3 px-4 font-semibold text-neutral-900">
                      {asset.assignedToName || (
                        <span className="text-neutral-400 font-normal italic">Unassigned (In IT Vault)</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                          asset.condition === 'Brand New'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {asset.condition}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-500 tabular-nums">
                      {asset.warrantyUntil}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <select
                        value={asset.assignedToId || ''}
                        onChange={(e) => assignAsset(asset.id, e.target.value || null)}
                        className="text-xs bg-neutral-50 border border-neutral-200 rounded px-2 py-1 text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                      >
                        <option value="">In Stock (Unassigned)</option>
                        {employees.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.firstName} {emp.lastName}
                          </option>
                        ))}
                      </select>
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
