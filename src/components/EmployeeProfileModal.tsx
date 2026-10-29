import React, { useState } from 'react';
import { useEMS } from '../context/EMSContext';
import { Employee, DocumentItem } from '../types/ems';
import {
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  ShieldAlert,
  Users,
  Award,
  Download,
  CreditCard,
  CheckCircle2,
  Upload,
} from 'lucide-react';
import { formatINR, formatLakhsCrores } from '../utils/formatters';

interface EmployeeProfileModalProps {
  onOpenEdit: (emp: Employee) => void;
  onOpenPayslipForEmployee: (emp: Employee) => void;
}

export const EmployeeProfileModal: React.FC<EmployeeProfileModalProps> = ({
  onOpenEdit,
  onOpenPayslipForEmployee,
}) => {
  const { selectedEmployee, setSelectedEmployee, employees, updateEmployee, showToast } = useEMS();
  const [activeTab, setActiveTab] = useState<'overview' | 'compensation' | 'leaves' | 'documents' | 'emergency'>('overview');
  const [newSkill, setNewSkill] = useState('');

  if (!selectedEmployee) return null;

  const emp = selectedEmployee;
  const manager = employees.find((e) => e.id === emp.managerId);
  const directReports = employees.filter((e) => e.managerId === emp.id);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (emp.skills.includes(newSkill.trim())) {
      showToast('Competency already listed.', 'info');
      return;
    }
    const updatedSkills = [...emp.skills, newSkill.trim()];
    updateEmployee(emp.id, { skills: updatedSkills });
    setNewSkill('');
    showToast(`Added competency: ${newSkill.trim()}`, 'success');
  };

  const handleSimulateUpload = () => {
    const docNames = ['Form16_FY2025_26.pdf', 'EPFO_Passbook_Summary.pdf', 'Cancelled_Cheque_HDFC.pdf'];
    const randomName = docNames[Math.floor(Math.random() * docNames.length)];
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      name: randomName,
      type: 'Form 16',
      uploadedAt: new Date().toISOString().split('T')[0],
      size: '1.2 MB',
    };
    const updatedDocs = [...emp.documents, newDoc];
    updateEmployee(emp.id, { documents: updatedDocs });
    showToast(`Uploaded verified document "${randomName}".`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Header */}
        <div className="p-6 border-b border-neutral-100 flex items-start justify-between gap-4 bg-neutral-50/50">
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 shadow-xs ${emp.avatarBgColor}`}
            >
              {emp.initials}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-neutral-900">
                  {emp.firstName} {emp.lastName}
                </h2>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    emp.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : emp.status === 'Onboarding'
                      ? 'bg-sky-50 text-sky-700 border border-sky-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {emp.status}
                </span>
              </div>
              <p className="text-sm text-neutral-600 mt-0.5">{emp.jobTitle}</p>
              <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1.5 font-mono">
                <span>{emp.employeeCode}</span>
                <span aria-hidden="true">·</span>
                <span>{emp.department}</span>
                <span aria-hidden="true">·</span>
                <span>{emp.workModel}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenEdit(emp)}
              className="px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Edit Profile
            </button>
            <button
              onClick={() => setSelectedEmployee(null)}
              className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 border-b border-neutral-200 bg-white overflow-x-auto text-xs font-medium text-neutral-600">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'compensation', label: 'Compensation, Bank & EPF' },
            { id: 'leaves', label: 'Leave Balances (PL/CL/SL)' },
            { id: 'documents', label: 'Documents & Vault' },
            { id: 'emergency', label: 'Skills & Contacts' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 transition-colors whitespace-nowrap border-b-2 -mb-[1px] ${
                activeTab === tab.id
                  ? 'border-neutral-900 text-neutral-950 font-semibold'
                  : 'border-transparent hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Tab Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Primary Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
                  <span className="text-[11px] font-semibold uppercase text-neutral-500 tracking-wider">
                    Official Contact & Office
                  </span>
                  <div className="space-y-1.5 text-xs text-neutral-700">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{emp.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-neutral-400" />
                      <span className="font-mono tabular-nums">{emp.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{emp.location}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
                  <span className="text-[11px] font-semibold uppercase text-neutral-500 tracking-wider">
                    Employment Details
                  </span>
                  <div className="space-y-1.5 text-xs text-neutral-700">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Employment Type</span>
                      <span className="font-medium text-neutral-900">{emp.employmentType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Date of Joining (DOJ)</span>
                      <span className="font-mono tabular-nums font-medium text-neutral-900">{emp.startDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Reporting Manager</span>
                      <span className="font-medium text-neutral-900">{manager ? `${manager.firstName} ${manager.lastName}` : 'Managing Director'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Reports Hierarchy Section */}
              {directReports.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-neutral-900">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-neutral-500" />
                      Direct Reports ({directReports.length})
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {directReports.map((report) => (
                      <div
                        key={report.id}
                        onClick={() => setSelectedEmployee(report)}
                        className="flex items-center gap-3 p-3 bg-neutral-50 hover:bg-neutral-100 rounded-lg border border-neutral-200 cursor-pointer transition-colors"
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${report.avatarBgColor}`}
                        >
                          {report.initials}
                        </div>
                        <div className="truncate text-xs">
                          <p className="font-semibold text-neutral-900 truncate">
                            {report.firstName} {report.lastName}
                          </p>
                          <p className="text-neutral-500 text-[11px] truncate">{report.jobTitle}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'compensation' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                  <span className="text-xs text-neutral-500">Annual Cost to Company (CTC)</span>
                  <p className="text-xl font-bold font-mono tabular-nums text-neutral-900 mt-1">
                    {formatINR(emp.salary)}
                  </p>
                  <span className="text-[11px] font-semibold text-emerald-800">
                    {formatLakhsCrores(emp.salary)} · {emp.compensation.payFrequency}
                  </span>
                </div>
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                  <span className="text-xs text-neutral-500">Performance Variable</span>
                  <p className="text-xl font-bold font-mono tabular-nums text-neutral-900 mt-1">
                    {emp.compensation.bonusTargetPercent}%
                  </p>
                  <span className="text-[11px] text-neutral-500 font-mono tabular-nums">
                    ~{formatINR(Math.round((emp.salary * emp.compensation.bonusTargetPercent) / 100))}/yr
                  </span>
                </div>
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                  <span className="text-xs text-neutral-500">ESOPs / Company Stock</span>
                  <p className="text-xl font-bold font-mono tabular-nums text-neutral-900 mt-1">
                    {emp.compensation.equityShares.toLocaleString()}
                  </p>
                  <span className="text-[11px] text-neutral-400">Vested over 4 Years</span>
                </div>
              </div>

              {/* Indian Bank Details & Statutory IDs */}
              <div className="p-4 bg-white rounded-xl border border-neutral-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-900">
                  <CreditCard className="w-4 h-4 text-neutral-600" />
                  <span>Statutory Payroll & Bank Particulars (India)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-neutral-500 text-[11px]">Salary Bank & Branch</span>
                    <p className="font-medium text-neutral-900 mt-0.5">{emp.bankInfo.bankName}</p>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[11px]">IFSC Code</span>
                    <p className="font-mono text-neutral-900 mt-0.5">{emp.bankInfo.ifscCode}</p>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[11px]">Account Number</span>
                    <p className="font-mono text-neutral-900 mt-0.5">••••••••{emp.bankInfo.accountEnding}</p>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[11px]">Income Tax PAN</span>
                    <p className="font-mono text-neutral-900 mt-0.5">{emp.bankInfo.panNumberMasked}</p>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[11px]">EPFO Universal Account No (UAN)</span>
                    <p className="font-mono text-neutral-900 mt-0.5">{emp.bankInfo.uanPfNumber}</p>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[11px]">Gratuity Eligible</span>
                    <p className="font-medium text-emerald-700 mt-0.5">Yes (Statutory 15/26)</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => onOpenPayslipForEmployee(emp)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Generate October Salary Slip</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'leaves' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Privilege / Earned Leave */}
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-neutral-900">
                    <span>Privilege / Earned Leave (PL)</span>
                    <span className="font-mono tabular-nums text-neutral-700">
                      {emp.leaveBalance.earnedTotal - emp.leaveBalance.earnedUsed} days left
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-neutral-900 h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (emp.leaveBalance.earnedUsed / emp.leaveBalance.earnedTotal) * 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-neutral-500 font-mono tabular-nums">
                    Avail {emp.leaveBalance.earnedUsed} of {emp.leaveBalance.earnedTotal} allocated annual leaves
                  </p>
                </div>

                {/* Casual Leave */}
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-neutral-900">
                    <span>Casual Leave (CL)</span>
                    <span className="font-mono tabular-nums text-neutral-700">
                      {emp.leaveBalance.casualTotal - emp.leaveBalance.casualUsed} days left
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-sky-700 h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (emp.leaveBalance.casualUsed / emp.leaveBalance.casualTotal) * 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-neutral-500 font-mono tabular-nums">
                    Used {emp.leaveBalance.casualUsed} of {emp.leaveBalance.casualTotal} casual days
                  </p>
                </div>

                {/* Sick Leave */}
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-neutral-900">
                    <span>Sick Leave (SL)</span>
                    <span className="font-mono tabular-nums text-neutral-700">
                      {emp.leaveBalance.sickTotal - emp.leaveBalance.sickUsed} days left
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-700 h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (emp.leaveBalance.sickUsed / emp.leaveBalance.sickTotal) * 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-neutral-500 font-mono tabular-nums">
                    Used {emp.leaveBalance.sickUsed} of {emp.leaveBalance.sickTotal} sick days
                  </p>
                </div>

                {/* Maternity / Paternity Leave */}
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-neutral-900">
                    <span>Maternity / Paternity Leave</span>
                    <span className="font-mono tabular-nums text-neutral-700">
                      {emp.leaveBalance.maternityPaternityTotal - emp.leaveBalance.maternityPaternityUsed} days left
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-700 h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (emp.leaveBalance.maternityPaternityUsed / emp.leaveBalance.maternityPaternityTotal) * 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-neutral-500 font-mono tabular-nums">
                    As per Maternity Benefit Act (26 weeks / 180 days)
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-900">
                  Verified KYC & Corporate Records ({emp.documents.length})
                </span>
                <button
                  onClick={handleSimulateUpload}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload KYC Document</span>
                </button>
              </div>

              <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden">
                {emp.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3.5 bg-white hover:bg-neutral-50 transition-colors text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-neutral-400 shrink-0" />
                      <div>
                        <p className="font-semibold text-neutral-900">{doc.name}</p>
                        <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-mono">
                          <span>{doc.type}</span>
                          <span aria-hidden="true">·</span>
                          <span>{doc.size}</span>
                          <span aria-hidden="true">·</span>
                          <span>Uploaded {doc.uploadedAt}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => showToast(`Simulated download for ${doc.name}`, 'info')}
                      className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                      title="Download document"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'emergency' && (
            <div className="space-y-5">
              {/* Emergency Contact */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-900">
                  <ShieldAlert className="w-4 h-4 text-neutral-600" />
                  <span>Primary Emergency Contact</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-[11px] text-neutral-500">Contact Name</span>
                    <p className="font-medium text-neutral-900 mt-0.5">{emp.emergencyContact.name}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-neutral-500">Relationship</span>
                    <p className="font-medium text-neutral-900 mt-0.5">{emp.emergencyContact.relationship}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-neutral-500">Emergency Phone</span>
                    <p className="font-mono tabular-nums font-medium text-neutral-900 mt-0.5">
                      {emp.emergencyContact.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Skills Management */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-900">
                  <span className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-neutral-500" />
                    Core Technical & Functional Skills
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {emp.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-neutral-100 text-neutral-800 rounded-md"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Add Skill form */}
                <form onSubmit={handleAddSkill} className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Add a new skill or certification..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
                  >
                    Add Skill
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between text-xs text-neutral-500">
          <span>Employee Profile verified by TalentPulse India People Ops</span>
          <button
            onClick={() => setSelectedEmployee(null)}
            className="px-4 py-2 text-xs font-semibold text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
