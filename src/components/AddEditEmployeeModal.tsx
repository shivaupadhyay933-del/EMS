import React, { useState, useEffect } from 'react';
import { useEMS } from '../context/EMSContext';
import { Employee, Department, EmploymentType, EmploymentStatus } from '../types/ems';
import { X, Check } from 'lucide-react';

interface AddEditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeToEdit?: Employee | null;
}

const DEPARTMENTS: Department[] = [
  'Engineering',
  'Product',
  'Design',
  'Sales',
  'Marketing',
  'People & HR',
  'Finance',
  'Operations',
];

const INDIAN_CITIES = [
  'Bengaluru, Karnataka',
  'Mumbai, Maharashtra',
  'Pune, Maharashtra',
  'Gurugram, Haryana',
  'Hyderabad, Telangana',
  'Noida, Uttar Pradesh',
  'Chennai, Tamil Nadu',
  'Delhi NCR',
];

const INDIAN_BANKS = [
  'HDFC Bank (Koramangala, Bengaluru)',
  'ICICI Bank (Indiranagar, Bengaluru)',
  'State Bank of India (Whitefield)',
  'Axis Bank (Hinjawadi, Pune)',
  'Kotak Mahindra Bank (BKC, Mumbai)',
  'Standard Chartered Bank (Cyber City, Gurugram)',
];

export const AddEditEmployeeModal: React.FC<AddEditEmployeeModalProps> = ({
  isOpen,
  onClose,
  employeeToEdit,
}) => {
  const { addEmployee, updateEmployee, employees } = useEMS();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 98');
  const [location, setLocation] = useState('Bengaluru, Karnataka');
  const [workModel, setWorkModel] = useState<'Remote' | 'Hybrid' | 'On-site'>('Hybrid');
  const [department, setDepartment] = useState<Department>('Engineering');
  const [jobTitle, setJobTitle] = useState('');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('Full-time');
  const [status, setStatus] = useState<EmploymentStatus>('Active');
  const [managerId, setManagerId] = useState<string>('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [salary, setSalary] = useState(1800000); // 18 LPA
  const [bonusPercent, setBonusPercent] = useState(10);
  const [equityShares, setEquityShares] = useState(8000);
  const [bankName, setBankName] = useState('HDFC Bank (Koramangala, Bengaluru)');
  const [accountEnding, setAccountEnding] = useState('4412');
  const [ifscCode, setIfscCode] = useState('HDFC0000240');
  const [panNumber, setPanNumber] = useState('ABCDE****F');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 98');
  const [emergencyRelation, setEmergencyRelation] = useState('Spouse');
  const [skillsString, setSkillsString] = useState('React, TypeScript, Node.js, System Architecture');

  useEffect(() => {
    if (employeeToEdit) {
      setFirstName(employeeToEdit.firstName);
      setLastName(employeeToEdit.lastName);
      setEmail(employeeToEdit.email);
      setPhone(employeeToEdit.phone);
      setLocation(employeeToEdit.location);
      setWorkModel(employeeToEdit.workModel);
      setDepartment(employeeToEdit.department);
      setJobTitle(employeeToEdit.jobTitle);
      setEmploymentType(employeeToEdit.employmentType);
      setStatus(employeeToEdit.status);
      setManagerId(employeeToEdit.managerId || '');
      setStartDate(employeeToEdit.startDate);
      setSalary(employeeToEdit.salary);
      setBonusPercent(employeeToEdit.compensation.bonusTargetPercent);
      setEquityShares(employeeToEdit.compensation.equityShares);
      setBankName(employeeToEdit.bankInfo.bankName);
      setAccountEnding(employeeToEdit.bankInfo.accountEnding);
      setIfscCode(employeeToEdit.bankInfo.ifscCode);
      setPanNumber(employeeToEdit.bankInfo.panNumberMasked);
      setEmergencyName(employeeToEdit.emergencyContact.name);
      setEmergencyPhone(employeeToEdit.emergencyContact.phone);
      setEmergencyRelation(employeeToEdit.emergencyContact.relationship);
      setSkillsString(employeeToEdit.skills.join(', '));
    } else {
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('+91 98');
      setLocation('Bengaluru, Karnataka');
      setWorkModel('Hybrid');
      setDepartment('Engineering');
      setJobTitle('');
      setEmploymentType('Full-time');
      setStatus('Active');
      setManagerId(employees[0]?.id || '');
      setStartDate(new Date().toISOString().split('T')[0]);
      setSalary(1800000); // 18 LPA
      setBonusPercent(10);
      setEquityShares(8000);
      setBankName('HDFC Bank (Koramangala, Bengaluru)');
      setAccountEnding(Math.floor(1000 + Math.random() * 9000).toString());
      setIfscCode('HDFC0000240');
      setPanNumber(`ABCDE${Math.floor(1000 + Math.random() * 9000)}F`);
      setEmergencyName('');
      setEmergencyPhone('+91 98');
      setEmergencyRelation('Spouse');
      setSkillsString('React, TypeScript, Problem Solving');
    }
  }, [employeeToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !jobTitle.trim()) {
      alert('Please fill out all required name and job title fields.');
      return;
    }

    const skills = skillsString
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const managerObj = employees.find((e) => e.id === managerId);
    const baseSalary = Math.round(Number(salary) * 0.5);
    const hra = Math.round(baseSalary * 0.4);
    const specialAllowance = Math.round(Number(salary) - (baseSalary + hra));

    if (employeeToEdit) {
      updateEmployee(employeeToEdit.id, {
        firstName,
        lastName,
        email: email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@talentpulse.in`,
        phone,
        location,
        workModel,
        department,
        jobTitle,
        employmentType,
        status,
        managerId: managerId || null,
        managerName: managerObj ? `${managerObj.firstName} ${managerObj.lastName}` : undefined,
        startDate,
        salary: Number(salary),
        compensation: {
          ...employeeToEdit.compensation,
          baseSalary,
          hra,
          specialAllowance,
          bonusTargetPercent: Number(bonusPercent),
          equityShares: Number(equityShares),
        },
        bankInfo: {
          ...employeeToEdit.bankInfo,
          bankName,
          accountEnding,
          ifscCode,
          panNumberMasked: panNumber,
        },
        emergencyContact: {
          name: emergencyName || 'Primary Family Member',
          phone: emergencyPhone || phone,
          relationship: emergencyRelation,
        },
        skills,
      });
    } else {
      addEmployee({
        firstName,
        lastName,
        email: email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@talentpulse.in`,
        phone: phone || '+91 98450 00000',
        location,
        workModel,
        department,
        jobTitle,
        employmentType,
        status,
        managerId: managerId || null,
        managerName: managerObj ? `${managerObj.firstName} ${managerObj.lastName}` : undefined,
        startDate,
        salary: Number(salary),
        currency: 'INR',
        compensation: {
          baseSalary,
          hra,
          specialAllowance,
          bonusTargetPercent: Number(bonusPercent),
          equityShares: Number(equityShares),
          payFrequency: 'Monthly',
        },
        bankInfo: {
          bankName,
          accountEnding,
          ifscCode,
          panNumberMasked: panNumber,
          uanPfNumber: `1012948${Math.floor(10000 + Math.random() * 90000)}`,
        },
        emergencyContact: {
          name: emergencyName || 'Family Member',
          relationship: emergencyRelation,
          phone: emergencyPhone || '+91 98450 99999',
        },
        skills: skills.length ? skills : ['General Operations'],
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              {employeeToEdit ? `Edit Profile: ${employeeToEdit.firstName} ${employeeToEdit.lastName}` : 'Enroll New Employee (India)'}
            </h2>
            <p className="text-xs text-neutral-500">
              {employeeToEdit
                ? 'Update role, CTC, EPF details, and organization structure.'
                : 'Enroll a new hire into payroll, EPFO compliance, and directory.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Personal Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-neutral-900 uppercase text-[11px] tracking-wider text-neutral-500">
              1. Personal & Contact
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                  placeholder="e.g. Rahul"
                />
              </div>
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                  placeholder="e.g. Varma"
                />
              </div>
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Corporate Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                  placeholder="Leave blank to auto-generate (@talentpulse.in)"
                />
              </div>
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white font-mono"
                  placeholder="+91 98450 00000"
                />
              </div>
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Office / Work City</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                >
                  {INDIAN_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Work Model</label>
                <select
                  value={workModel}
                  onChange={(e) => setWorkModel(e.target.value as any)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                >
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>
            </div>
          </div>

          {/* Job & Org Info */}
          <div className="space-y-3 pt-3 border-t border-neutral-100">
            <h3 className="font-semibold text-neutral-900 uppercase text-[11px] tracking-wider text-neutral-500">
              2. Role & Hierarchy
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                  placeholder="e.g. Senior Backend Engineer"
                />
              </div>
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as Department)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Employment Type</label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Intern">Intern</option>
                </select>
              </div>
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EmploymentStatus)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                >
                  <option value="Active">Active</option>
                  <option value="Onboarding">Onboarding</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Reports To (Manager)</label>
                <select
                  value={managerId}
                  onChange={(e) => setManagerId(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                >
                  <option value="">None (Managing Director / CEO)</option>
                  {employees
                    .filter((e) => e.id !== employeeToEdit?.id)
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.firstName} {m.lastName} ({m.jobTitle})
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Date of Joining (DOJ)</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Compensation in INR */}
          <div className="space-y-3 pt-3 border-t border-neutral-100">
            <h3 className="font-semibold text-neutral-900 uppercase text-[11px] tracking-wider text-neutral-500">
              3. Annual CTC & Compensation (INR ₹)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Annual CTC (₹ INR)</label>
                <input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono"
                  placeholder="e.g. 1800000 (18 LPA)"
                />
                <span className="text-[10px] text-neutral-500 font-mono">
                  {(Number(salary) / 100000).toFixed(1)} LPA
                </span>
              </div>
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Performance Bonus (%)</label>
                <input
                  type="number"
                  value={bonusPercent}
                  onChange={(e) => setBonusPercent(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono"
                />
              </div>
              <div>
                <label className="block text-neutral-700 font-medium mb-1">ESOP Shares</label>
                <input
                  type="number"
                  value={equityShares}
                  onChange={(e) => setEquityShares(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Indian Bank Particulars */}
          <div className="space-y-3 pt-3 border-t border-neutral-100">
            <h3 className="font-semibold text-neutral-900 uppercase text-[11px] tracking-wider text-neutral-500">
              4. Banking & Tax Compliance
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Bank Name</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                >
                  {INDIAN_BANKS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-neutral-700 font-medium mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono"
                  placeholder="HDFC0000240"
                />
              </div>
              <div>
                <label className="block text-neutral-700 font-medium mb-1">PAN Number</label>
                <input
                  type="text"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono"
                  placeholder="ABCDE1234F"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-3 pt-3 border-t border-neutral-100">
            <h3 className="font-semibold text-neutral-900 uppercase text-[11px] tracking-wider text-neutral-500">
              5. Core Skills & Competencies
            </h3>
            <div>
              <label className="block text-neutral-700 font-medium mb-1">
                Comma-separated skills (e.g. React, Distributed Systems, FinTech, Negotiation)
              </label>
              <input
                type="text"
                value={skillsString}
                onChange={(e) => setSkillsString(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{employeeToEdit ? 'Save Changes' : 'Confirm & Enroll'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
