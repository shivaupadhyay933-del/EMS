import React, { useState } from 'react';
import { useEMS } from '../context/EMSContext';
import { LeaveType, LeaveStatus } from '../types/ems';
import { INDIAN_HOLIDAYS } from '../data/initialData';
import {
  Clock,
  Coffee,
  Calendar,
  Check,
  X,
  Plus,
  Send,
  AlertTriangle,
} from 'lucide-react';

export const AttendanceLeaveView: React.FC = () => {
  const {
    attendance,
    isClockedIn,
    clockInTime,
    elapsedSeconds,
    isOnBreak,
    toggleClockIn,
    toggleBreak,
    leaveRequests,
    submitLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
    employees,
    currentUserId,
  } = useEMS();

  // Active acting employee
  const currentEmp =
    currentUserId === 'admin'
      ? employees.find((e) => e.jobTitle.includes('Staff')) || employees[0]
      : employees.find((e) => e.id === currentUserId) || employees[0];

  // Request leave modal state
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<LeaveType>('Privilege / Earned Leave');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]);
  const [reason, setReason] = useState('');

  // Leaves filter
  const [statusFilter, setStatusFilter] = useState<LeaveStatus | 'All'>('All');

  // Format seconds into HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Please provide a reason or project handover note.');
      return;
    }
    submitLeaveRequest({
      leaveType,
      startDate,
      endDate,
      reason,
    });
    setIsRequestModalOpen(false);
    setReason('');
  };

  const filteredLeaves = leaveRequests.filter(
    (req) => statusFilter === 'All' || req.status === statusFilter
  );

  const pendingLeaves = leaveRequests.filter((r) => r.status === 'Pending');

  return (
    <div className="space-y-6">
      {/* Top Banner: Clock-in Terminal & Leave Balances */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Attendance Clock-in Station */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Attendance Terminal (IST)
              </span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                  isClockedIn
                    ? isOnBreak
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                    : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {isClockedIn ? (isOnBreak ? 'Tea / Lunch Break' : 'Active Shift') : 'Not Clocked In'}
              </span>
            </div>

            <div className="mt-4">
              <p className="text-3xl font-bold font-mono tabular-nums text-neutral-900 tracking-tight">
                {formatTime(elapsedSeconds)}
              </p>
              <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                <span>Clocked in: {clockInTime || '—'}</span>
                <span aria-hidden="true">·</span>
                <span className="truncate">{currentEmp.firstName} {currentEmp.lastName}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={toggleClockIn}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                isClockedIn
                  ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                  : 'bg-neutral-900 text-white hover:bg-neutral-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{isClockedIn ? 'Clock Out Shift' : 'Clock In Shift'}</span>
            </button>
            {isClockedIn && (
              <button
                onClick={toggleBreak}
                className={`py-2 px-3 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 border ${
                  isOnBreak
                    ? 'bg-amber-500 text-white border-amber-600'
                    : 'bg-white text-neutral-700 hover:bg-neutral-50 border-neutral-200'
                }`}
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>{isOnBreak ? 'Resume Work' : 'Chai Break'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Leave Balances Grid (2 cols on right) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-neutral-900">
                Annual Leave Ledger: {currentEmp.firstName} {currentEmp.lastName}
              </h3>
              <p className="text-xs text-neutral-500">Accruals calculated per Indian Factories & Shops Establishment Act</p>
            </div>
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Apply for Leave</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <span className="text-[11px] text-neutral-500 font-medium">Privilege Leave (PL)</span>
              <p className="text-xl font-bold font-mono tabular-nums text-neutral-900 mt-1">
                {currentEmp.leaveBalance.earnedTotal - currentEmp.leaveBalance.earnedUsed}
                <span className="text-xs font-normal text-neutral-400">/{currentEmp.leaveBalance.earnedTotal} d</span>
              </p>
              <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-neutral-900 h-full rounded-full"
                  style={{
                    width: `${((currentEmp.leaveBalance.earnedTotal - currentEmp.leaveBalance.earnedUsed) / currentEmp.leaveBalance.earnedTotal) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <span className="text-[11px] text-neutral-500 font-medium">Casual Leave (CL)</span>
              <p className="text-xl font-bold font-mono tabular-nums text-neutral-900 mt-1">
                {currentEmp.leaveBalance.casualTotal - currentEmp.leaveBalance.casualUsed}
                <span className="text-xs font-normal text-neutral-400">/{currentEmp.leaveBalance.casualTotal} d</span>
              </p>
              <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-sky-600 h-full rounded-full"
                  style={{
                    width: `${((currentEmp.leaveBalance.casualTotal - currentEmp.leaveBalance.casualUsed) / currentEmp.leaveBalance.casualTotal) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <span className="text-[11px] text-neutral-500 font-medium">Sick Leave (SL)</span>
              <p className="text-xl font-bold font-mono tabular-nums text-neutral-900 mt-1">
                {currentEmp.leaveBalance.sickTotal - currentEmp.leaveBalance.sickUsed}
                <span className="text-xs font-normal text-neutral-400">/{currentEmp.leaveBalance.sickTotal} d</span>
              </p>
              <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{
                    width: `${((currentEmp.leaveBalance.sickTotal - currentEmp.leaveBalance.sickUsed) / currentEmp.leaveBalance.sickTotal) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <span className="text-[11px] text-neutral-500 font-medium">Maternity / Paternity</span>
              <p className="text-xl font-bold font-mono tabular-nums text-neutral-900 mt-1">
                {currentEmp.leaveBalance.maternityPaternityTotal - currentEmp.leaveBalance.maternityPaternityUsed}
                <span className="text-xs font-normal text-neutral-400">/{currentEmp.leaveBalance.maternityPaternityTotal} d</span>
              </p>
              <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full"
                  style={{
                    width: `${((currentEmp.leaveBalance.maternityPaternityTotal - currentEmp.leaveBalance.maternityPaternityUsed) / currentEmp.leaveBalance.maternityPaternityTotal) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manager / HR Pending Approvals Warning Strip */}
      {pendingLeaves.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-950">
                Action Required: {pendingLeaves.length} Pending Leave Application(s)
              </p>
              <p className="text-[11px] text-amber-800">
                Review absence requests from Indian hub team members for sprint continuity.
              </p>
            </div>
          </div>
          <button
            onClick={() => setStatusFilter('Pending')}
            className="px-3 py-1.5 text-xs font-semibold text-amber-950 bg-amber-200 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap"
          >
            Review Pending Queue
          </button>
        </div>
      )}

      {/* Leave Requests Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs space-y-3 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-neutral-900">Leave Applications & Approval Status</h3>
            <p className="text-xs text-neutral-500">History of requested and approved employee leaves</p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg border border-neutral-200 text-xs">
            {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  statusFilter === st
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50 text-neutral-600 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-2.5 px-3">Employee</th>
                <th className="py-2.5 px-3">Leave Category</th>
                <th className="py-2.5 px-3">Dates</th>
                <th className="py-2.5 px-3 text-center">Duration</th>
                <th className="py-2.5 px-3">Reason / Handover</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-400">
                    No leave requests found for status "{statusFilter}".
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((req) => (
                  <tr key={req.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-3 font-semibold text-neutral-900">
                      <div>{req.employeeName}</div>
                      <span className="text-[11px] text-neutral-400 font-normal">{req.department}</span>
                    </td>
                    <td className="py-3 px-3 text-neutral-700 font-medium">{req.leaveType}</td>
                    <td className="py-3 px-3 font-mono text-neutral-600 tabular-nums">
                      {req.startDate} → {req.endDate}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-neutral-900 tabular-nums">
                      {req.daysCount}d
                    </td>
                    <td className="py-3 px-3 text-neutral-600 max-w-xs truncate" title={req.reason}>
                      {req.reason}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          req.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : req.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {req.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => approveLeaveRequest(req.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
                            title="Approve leave"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => rejectLeaveRequest(req.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors"
                            title="Reject leave"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-neutral-400 italic">
                          {req.reviewedBy ? `by ${req.reviewedBy}` : 'Approved'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom 2 Columns: Today's Shift Logs & Indian Gazetted Holidays */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Attendance Logs */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Today's Check-in Log (IST)</h3>
              <p className="text-xs text-neutral-500">Biometric & Web Check-in across India Hubs</p>
            </div>
            <span className="text-xs font-mono tabular-nums text-neutral-500 font-medium">
              {attendance.length} checked in
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50 text-neutral-600 font-semibold text-[11px] uppercase">
                  <th className="py-2 px-3">Employee</th>
                  <th className="py-2 px-3">Check-in Time (IST)</th>
                  <th className="py-2 px-3">Shift Status</th>
                  <th className="py-2 px-3 text-right">Hours Logged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {attendance.map((rec) => (
                  <tr key={rec.id} className="hover:bg-neutral-50/70">
                    <td className="py-2.5 px-3 font-semibold text-neutral-900">{rec.employeeName}</td>
                    <td className="py-2.5 px-3 font-mono text-neutral-600 tabular-nums">{rec.checkInTime}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-xs font-medium ${
                          rec.status === 'Present'
                            ? 'text-emerald-700'
                            : rec.status === 'Late'
                            ? 'text-amber-700'
                            : rec.status === 'Remote'
                            ? 'text-sky-700'
                            : 'text-neutral-500'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-neutral-800 font-semibold">
                      {rec.hoursWorked}h
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Indian Public Holidays */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 space-y-4">
          <div className="border-b border-neutral-100 pb-3">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-neutral-600" />
              <span>Upcoming Indian Holidays</span>
            </h3>
            <p className="text-xs text-neutral-500">Gazetted and corporate holiday calendar</p>
          </div>

          <div className="space-y-3">
            {INDIAN_HOLIDAYS.map((h, i) => (
              <div key={i} className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-0.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-900">{h.name}</span>
                  <span className="font-mono tabular-nums text-neutral-700 font-medium">{h.date}</span>
                </div>
                <p className="text-[11px] text-neutral-500">{h.type}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Request Leave Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Apply for Leave</h3>
                <p className="text-xs text-neutral-500">Submit leave request for manager sign-off</p>
              </div>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLeaveSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Leave Category *</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                >
                  <option value="Privilege / Earned Leave">Privilege / Earned Leave (PL)</option>
                  <option value="Casual Leave">Casual Leave (CL)</option>
                  <option value="Sick Leave">Sick Leave (SL)</option>
                  <option value="Maternity / Paternity Leave">Maternity / Paternity Leave</option>
                  <option value="Compensatory Off">Compensatory Off (Comp-Off)</option>
                  <option value="Loss of Pay (LWP)">Loss of Pay (LWP)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">From Date *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">To Date *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">
                  Reason & Handover Details *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Taking 3 days for personal family event. Current sprint tasks handed over to Siddharth."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Application</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
