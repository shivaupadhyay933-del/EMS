export type Department =
  | 'Engineering'
  | 'Product'
  | 'Design'
  | 'Sales'
  | 'Marketing'
  | 'People & HR'
  | 'Finance'
  | 'Operations';

export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Intern';
export type EmploymentStatus = 'Active' | 'Onboarding' | 'On Leave' | 'Terminated';

export interface DocumentItem {
  id: string;
  name: string;
  type:
    | 'Offer Letter'
    | 'NDA'
    | 'PAN Card'
    | 'Aadhaar Card'
    | 'Form 16'
    | 'Experience Letter'
    | 'Certificate'
    | 'Contract';
  uploadedAt: string;
  size: string;
}

export interface Employee {
  id: string;
  employeeCode: string; // e.g. TP-IND-1001
  firstName: string;
  lastName: string;
  preferredName?: string;
  avatarUrl?: string;
  initials: string;
  avatarBgColor: string;
  email: string;
  phone: string; // e.g. +91 98450 12345
  location: string; // Bengaluru, Mumbai, Pune, Gurugram, Hyderabad, Noida
  workModel: 'Remote' | 'Hybrid' | 'On-site';
  department: Department;
  jobTitle: string;
  employmentType: EmploymentType;
  status: EmploymentStatus;
  managerId: string | null;
  managerName?: string;
  startDate: string;
  salary: number; // Annual CTC in INR (₹)
  currency: 'INR';
  compensation: {
    baseSalary: number; // 50% of CTC
    hra: number; // House Rent Allowance
    specialAllowance: number;
    bonusTargetPercent: number;
    equityShares: number;
    payFrequency: 'Monthly';
  };
  bankInfo: {
    bankName: string; // e.g. HDFC Bank, ICICI Bank, SBI
    accountEnding: string;
    ifscCode: string; // e.g. HDFC0000240
    panNumberMasked: string; // e.g. ABCDE****F
    uanPfNumber: string; // e.g. 101294829102
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  skills: string[];
  documents: DocumentItem[];
  leaveBalance: {
    earnedTotal: number; // Privilege / Earned Leave (PL/EL)
    earnedUsed: number;
    casualTotal: number; // Casual Leave (CL)
    casualUsed: number;
    sickTotal: number; // Sick Leave (SL)
    sickUsed: number;
    maternityPaternityTotal: number;
    maternityPaternityUsed: number;
  };
}

export type AttendanceStatus = 'Present' | 'Late' | 'Half-day' | 'Remote' | 'Absent' | 'On Leave';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string; // YYYY-MM-DD
  checkInTime: string; // e.g. 09:15 AM IST
  checkOutTime: string | null;
  status: AttendanceStatus;
  hoursWorked: number;
}

export type LeaveType =
  | 'Privilege / Earned Leave'
  | 'Casual Leave'
  | 'Sick Leave'
  | 'Maternity / Paternity Leave'
  | 'Compensatory Off'
  | 'Loss of Pay (LWP)';

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: LeaveStatus;
  requestedAt: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: Department;
  month: string; // e.g. "October 2026"
  baseSalary: number; // Basic
  allowances: {
    hra: number; // HRA
    conveyance: number; // Conveyance allowance
    medicalAllowance: number; // Medical reimbursement
    specialAllowance: number; // Special allowance
    performanceBonus: number; // Performance variable
  };
  deductions: {
    tdsTax: number; // TDS under Income Tax Act
    providentFund: number; // Employee EPF (12% of basic)
    professionalTax: number; // PT (standard ₹200)
    healthInsurance: number; // Corporate Mediclaim
    gratuityFund: number;
  };
  grossEarnings: number;
  totalDeductions: number;
  netPay: number;
  paymentDate: string;
  status: 'Pending' | 'Processed' | 'Paid';
}

export interface OKRGoal {
  id: string;
  ownerId: string | 'company';
  ownerName: string;
  quarter: string;
  title: string;
  department: Department | 'All Company';
  currentValue: number;
  targetValue: number;
  unit: string;
  status: 'On Track' | 'At Risk' | 'Behind' | 'Completed';
  category: 'Strategic' | 'Operational' | 'People' | 'Engineering';
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewerId: string;
  reviewerName: string;
  cycle: string;
  rating: number; // 1 to 5
  feedback: string;
  strengths: string[];
  areasForImprovement: string[];
  date: string;
}

export interface ITAsset {
  id: string;
  assetTag: string; // e.g. TP-BLR-2024-001
  name: string;
  category: 'Laptop' | 'Monitor' | 'Mobile Device' | 'Workstation' | 'Peripheral';
  serialNumber: string;
  assignedToId: string | null;
  assignedToName?: string;
  assignedDate: string | null;
  condition: 'Brand New' | 'Good' | 'Needs Service';
  purchaseDate: string;
  warrantyUntil: string;
}

export interface OnboardingTask {
  id: string;
  employeeId: string;
  employeeName: string;
  title: string;
  category: 'IT Setup' | 'HR Documentation' | 'Compliance & Security' | 'Team Introduction';
  isCompleted: boolean;
  dueDate: string;
  assignedRole: 'IT Admin' | 'HR Manager' | 'Department Lead' | 'Employee';
}

export type ViewTab =
  | 'directory'
  | 'attendance'
  | 'payroll'
  | 'orgchart'
  | 'performance'
  | 'assets'
  | 'analytics';
