import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Employee,
  AttendanceRecord,
  LeaveRequest,
  PayrollRecord,
  OKRGoal,
  PerformanceReview,
  ITAsset,
  OnboardingTask,
  ViewTab,
  LeaveType,
} from '../types/ems';
import {
  INITIAL_EMPLOYEES,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_PAYROLL_RECORDS,
  INITIAL_OKRS,
  INITIAL_REVIEWS,
  INITIAL_ASSETS,
  INITIAL_ONBOARDING_TASKS,
} from '../data/initialData';
import { formatINR } from '../utils/formatters';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface EMSContextType {
  employees: Employee[];
  selectedEmployee: Employee | null;
  setSelectedEmployee: (emp: Employee | null) => void;
  currentUserId: string; // 'admin' or employee id (e.g. 'emp-4')
  setCurrentUserId: (id: string) => void;
  activeView: ViewTab;
  setActiveView: (view: ViewTab) => void;

  // Employee actions
  addEmployee: (employee: Omit<Employee, 'id' | 'employeeCode' | 'initials' | 'avatarBgColor' | 'leaveBalance' | 'documents'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  // Attendance & Clock in/out
  attendance: AttendanceRecord[];
  isClockedIn: boolean;
  clockInTime: string | null;
  elapsedSeconds: number;
  isOnBreak: boolean;
  toggleClockIn: () => void;
  toggleBreak: () => void;

  // Leaves
  leaveRequests: LeaveRequest[];
  submitLeaveRequest: (data: { leaveType: LeaveType; startDate: string; endDate: string; reason: string }) => void;
  approveLeaveRequest: (id: string, notes?: string) => void;
  rejectLeaveRequest: (id: string, notes?: string) => void;

  // Payroll
  payrollRecords: PayrollRecord[];
  selectedPayslip: PayrollRecord | null;
  setSelectedPayslip: (slip: PayrollRecord | null) => void;
  processMonthlyPayroll: () => void;

  // OKRs & Reviews
  okrs: OKRGoal[];
  updateOKRProgress: (id: string, progress: number) => void;
  reviews: PerformanceReview[];
  addReview: (review: Omit<PerformanceReview, 'id' | 'date'>) => void;

  // Assets & Onboarding
  assets: ITAsset[];
  assignAsset: (assetId: string, employeeId: string | null) => void;
  onboardingTasks: OnboardingTask[];
  toggleOnboardingTask: (taskId: string) => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  // Data Reset
  resetAllData: () => void;
}

const EMSContext = createContext<EMSContextType | undefined>(undefined);

// Using v2 keys to automatically load Indian dataset
const STORAGE_KEYS = {
  EMPLOYEES: 'talentpulse_in_employees_v2',
  ATTENDANCE: 'talentpulse_in_attendance_v2',
  LEAVES: 'talentpulse_in_leaves_v2',
  PAYROLL: 'talentpulse_in_payroll_v2',
  OKRS: 'talentpulse_in_okrs_v2',
  REVIEWS: 'talentpulse_in_reviews_v2',
  ASSETS: 'talentpulse_in_assets_v2',
  TASKS: 'talentpulse_in_tasks_v2',
  CURRENT_USER: 'talentpulse_in_current_user_v2',
};

export const EMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
      return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
    } catch {
      return INITIAL_EMPLOYEES;
    }
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'admin';
    } catch {
      return 'admin';
    }
  });

  const [activeView, setActiveView] = useState<ViewTab>('directory');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
    } catch {
      return INITIAL_ATTENDANCE;
    }
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEAVES);
      return saved ? JSON.parse(saved) : INITIAL_LEAVE_REQUESTS;
    } catch {
      return INITIAL_LEAVE_REQUESTS;
    }
  });

  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAYROLL);
      return saved ? JSON.parse(saved) : INITIAL_PAYROLL_RECORDS;
    } catch {
      return INITIAL_PAYROLL_RECORDS;
    }
  });

  const [selectedPayslip, setSelectedPayslip] = useState<PayrollRecord | null>(null);

  const [okrs, setOkrs] = useState<OKRGoal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OKRS);
      return saved ? JSON.parse(saved) : INITIAL_OKRS;
    } catch {
      return INITIAL_OKRS;
    }
  });

  const [reviews, setReviews] = useState<PerformanceReview[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [assets, setAssets] = useState<ITAsset[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ASSETS);
      return saved ? JSON.parse(saved) : INITIAL_ASSETS;
    } catch {
      return INITIAL_ASSETS;
    }
  });

  const [onboardingTasks, setOnboardingTasks] = useState<OnboardingTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : INITIAL_ONBOARDING_TASKS;
    } catch {
      return INITIAL_ONBOARDING_TASKS;
    }
  });

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Live Attendance Clock-in State
  const [isClockedIn, setIsClockedIn] = useState<boolean>(true);
  const [clockInTime, setClockInTime] = useState<string | null>('08:58 AM IST');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(25920); // 7.2 hours in seconds
  const [isOnBreak, setIsOnBreak] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isClockedIn && !isOnBreak) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isClockedIn, isOnBreak]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
    } catch {}
  }, [employees]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
    } catch {}
  }, [attendance]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(leaveRequests));
    } catch {}
  }, [leaveRequests]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PAYROLL, JSON.stringify(payrollRecords));
    } catch {}
  }, [payrollRecords]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.OKRS, JSON.stringify(okrs));
    } catch {}
  }, [okrs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch {}
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
    } catch {}
  }, [assets]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(onboardingTasks));
    } catch {}
  }, [onboardingTasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, currentUserId);
    } catch {}
  }, [currentUserId]);

  const toggleClockIn = () => {
    const now = new Date();
    const timeStr = `${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST`;
    if (!isClockedIn) {
      setIsClockedIn(true);
      setClockInTime(timeStr);
      setIsOnBreak(false);
      showToast(`Clocked in at ${timeStr}. Attendance marked for today.`, 'success');
      const todayStr = now.toISOString().split('T')[0];
      const actingEmp = currentUserId === 'admin' ? employees[3] : employees.find((e) => e.id === currentUserId) || employees[0];
      setAttendance((prev) => [
        {
          id: `att-${Date.now()}`,
          employeeId: actingEmp.id,
          employeeName: `${actingEmp.firstName} ${actingEmp.lastName}`,
          date: todayStr,
          checkInTime: timeStr,
          checkOutTime: null,
          status: 'Present',
          hoursWorked: 0,
        },
        ...prev,
      ]);
    } else {
      setIsClockedIn(false);
      setIsOnBreak(false);
      const hours = (elapsedSeconds / 3600).toFixed(1);
      showToast(`Clocked out at ${timeStr}. Logged ${hours} hours today.`, 'info');
    }
  };

  const toggleBreak = () => {
    if (!isClockedIn) {
      showToast('You must be clocked in to record a tea/lunch break.', 'warning');
      return;
    }
    const nextState = !isOnBreak;
    setIsOnBreak(nextState);
    if (nextState) {
      showToast('Break initiated. Work timer paused.', 'info');
    } else {
      showToast('Break completed. Shift timer resumed.', 'success');
    }
  };

  // Add Employee (Indian Context)
  const addEmployee = (data: Omit<Employee, 'id' | 'employeeCode' | 'initials' | 'avatarBgColor' | 'leaveBalance' | 'documents'>) => {
    const nextNumber = 1000 + employees.length + 1;
    const employeeCode = `TP-IND-${nextNumber}`;
    const id = `emp-${Date.now()}`;
    const initials = `${data.firstName[0] || ''}${data.lastName[0] || ''}`.toUpperCase();

    const colorClasses = [
      'bg-neutral-800 text-white',
      'bg-indigo-800 text-indigo-50',
      'bg-emerald-800 text-emerald-50',
      'bg-amber-800 text-amber-50',
      'bg-rose-800 text-rose-50',
      'bg-sky-800 text-sky-50',
      'bg-teal-800 text-teal-50',
      'bg-purple-800 text-purple-50',
    ];
    const avatarBgColor = colorClasses[employees.length % colorClasses.length];

    const newEmp: Employee = {
      ...data,
      id,
      employeeCode,
      initials,
      avatarBgColor,
      currency: 'INR',
      documents: [
        {
          id: `doc-${Date.now()}-1`,
          name: `${data.firstName}_${data.lastName}_Signed_Appointment_Letter.pdf`,
          type: 'Offer Letter',
          uploadedAt: new Date().toISOString().split('T')[0],
          size: '1.2 MB',
        },
        {
          id: `doc-${Date.now()}-2`,
          name: `PAN_and_Aadhaar_Verified.pdf`,
          type: 'PAN Card',
          uploadedAt: new Date().toISOString().split('T')[0],
          size: '980 KB',
        },
      ],
      leaveBalance: {
        earnedTotal: 18,
        earnedUsed: 0,
        casualTotal: 12,
        casualUsed: 0,
        sickTotal: 12,
        sickUsed: 0,
        maternityPaternityTotal: 180,
        maternityPaternityUsed: 0,
      },
    };

    setEmployees((prev) => [newEmp, ...prev]);

    // Generate Indian onboarding tasks (EPF Form 11, Aadhaar/PAN, POSH)
    const newTasks: OnboardingTask[] = [
      {
        id: `onb-${Date.now()}-1`,
        employeeId: id,
        employeeName: `${data.firstName} ${data.lastName}`,
        title: 'Provision Okta SSO, Google Workspace & GitHub access',
        category: 'IT Setup',
        isCompleted: false,
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        assignedRole: 'IT Admin',
      },
      {
        id: `onb-${Date.now()}-2`,
        employeeId: id,
        employeeName: `${data.firstName} ${data.lastName}`,
        title: 'Submit EPFO Form 11, Bank Cancelled Cheque & PAN/Aadhaar',
        category: 'HR Documentation',
        isCompleted: false,
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        assignedRole: 'HR Manager',
      },
      {
        id: `onb-${Date.now()}-3`,
        employeeId: id,
        employeeName: `${data.firstName} ${data.lastName}`,
        title: 'Complete Mandatory POSH (Prevention of Sexual Harassment) Training',
        category: 'Compliance & Security',
        isCompleted: false,
        dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
        assignedRole: 'Employee',
      },
    ];
    setOnboardingTasks((prev) => [...newTasks, ...prev]);

    showToast(`Successfully enrolled ${data.firstName} ${data.lastName} (${employeeCode}) into organization roster.`, 'success');
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === id) {
          const updated = { ...emp, ...updates };
          if (updates.firstName || updates.lastName) {
            updated.initials = `${(updates.firstName || emp.firstName)[0] || ''}${(updates.lastName || emp.lastName)[0] || ''}`.toUpperCase();
          }
          if (selectedEmployee?.id === id) {
            setSelectedEmployee(updated);
          }
          return updated;
        }
        return emp;
      })
    );
    showToast('Employee profile updated.', 'success');
  };

  const deleteEmployee = (id: string) => {
    const emp = employees.find((e) => e.id === id);
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    if (selectedEmployee?.id === id) {
      setSelectedEmployee(null);
    }
    showToast(`Removed ${emp?.firstName || ''} ${emp?.lastName || 'employee'} from directory.`, 'info');
  };

  // Leave Management (Indian Leave structure)
  const submitLeaveRequest = (data: { leaveType: LeaveType; startDate: string; endDate: string; reason: string }) => {
    const actingEmp = currentUserId === 'admin' ? employees[3] : employees.find((e) => e.id === currentUserId) || employees[0];

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const daysCount = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

    const newReq: LeaveRequest = {
      id: `lr-${Date.now()}`,
      employeeId: actingEmp.id,
      employeeName: `${actingEmp.firstName} ${actingEmp.lastName}`,
      department: actingEmp.department,
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      daysCount,
      reason: data.reason,
      status: 'Pending',
      requestedAt: new Date().toISOString().split('T')[0],
    };

    setLeaveRequests((prev) => [newReq, ...prev]);
    showToast(`Leave application for ${daysCount} day(s) submitted to reporting manager.`, 'success');
  };

  const approveLeaveRequest = (id: string, notes: string = 'Approved by People Operations') => {
    const req = leaveRequests.find((r) => r.id === id);
    if (!req) return;

    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'Approved',
              reviewedBy: currentUserId === 'admin' ? 'Kavita Patel (Head HR)' : 'Reporting Manager',
              reviewNotes: notes,
            }
          : r
      )
    );

    // Deduct leave balance
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === req.employeeId) {
          const lb = { ...emp.leaveBalance };
          if (req.leaveType === 'Privilege / Earned Leave') {
            lb.earnedUsed += req.daysCount;
          } else if (req.leaveType === 'Casual Leave') {
            lb.casualUsed += req.daysCount;
          } else if (req.leaveType === 'Sick Leave') {
            lb.sickUsed += req.daysCount;
          } else if (req.leaveType === 'Maternity / Paternity Leave') {
            lb.maternityPaternityUsed += req.daysCount;
          }
          return { ...emp, leaveBalance: lb };
        }
        return emp;
      })
    );

    showToast(`Approved ${req.daysCount} day(s) leave for ${req.employeeName}.`, 'success');
  };

  const rejectLeaveRequest = (id: string, notes: string = 'Unable to accommodate due to sprint deliverables') => {
    const req = leaveRequests.find((r) => r.id === id);
    if (!req) return;

    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'Rejected',
              reviewedBy: currentUserId === 'admin' ? 'Kavita Patel (Head HR)' : 'Reporting Manager',
              reviewNotes: notes,
            }
          : r
      )
    );

    showToast(`Rejected leave request for ${req.employeeName}.`, 'info');
  };

  // Indian Payroll Calculation (Basic, HRA, Conveyance, Medical, Special, EPF, PT, TDS, Gratuity)
  const processMonthlyPayroll = () => {
    const newRecords: PayrollRecord[] = employees.map((emp) => {
      const monthlyCTC = Math.round(emp.salary / 12);
      const baseSalary = Math.round(monthlyCTC * 0.5); // 50% Basic
      const hra = Math.round(baseSalary * 0.4); // 40% of Basic
      const conveyance = 1600;
      const medicalAllowance = 2500;
      const performanceBonus = Math.round((emp.salary * (emp.compensation.bonusTargetPercent / 100)) / 12);
      const specialAllowance = Math.max(0, monthlyCTC - (baseSalary + hra + conveyance + medicalAllowance));

      const grossEarnings = baseSalary + hra + conveyance + medicalAllowance + specialAllowance + performanceBonus;

      // Statutory Indian Deductions
      const providentFund = Math.round(baseSalary * 0.12); // EPF 12%
      const professionalTax = 200; // Standard PT ₹200/mo
      const healthInsurance = 1500; // Group Mediclaim
      const gratuityFund = Math.round((15 / 26) * (baseSalary / 12)); // Gratuity provision
      // TDS calculation approximation based on CTC
      const tdsRate = emp.salary > 3000000 ? 0.22 : emp.salary > 1500000 ? 0.15 : emp.salary > 700000 ? 0.08 : 0;
      const tdsTax = Math.round(grossEarnings * tdsRate);

      const totalDeductions = tdsTax + providentFund + professionalTax + healthInsurance + gratuityFund;
      const netPay = grossEarnings - totalDeductions;

      return {
        id: `pay-${emp.id}-${Date.now()}`,
        employeeId: emp.id,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        employeeCode: emp.employeeCode,
        department: emp.department,
        month: 'October 2026',
        baseSalary,
        allowances: {
          hra,
          conveyance,
          medicalAllowance,
          specialAllowance,
          performanceBonus,
        },
        deductions: {
          tdsTax,
          providentFund,
          professionalTax,
          healthInsurance,
          gratuityFund,
        },
        grossEarnings,
        totalDeductions,
        netPay,
        paymentDate: '2026-10-31',
        status: 'Paid',
      };
    });

    setPayrollRecords(newRecords);
    const totalPayout = newRecords.reduce((acc, r) => acc + r.netPay, 0);
    showToast(`Monthly payroll processed for ${employees.length} employees. Total disbursement: ${formatINR(totalPayout)}`, 'success');
  };

  // OKRs
  const updateOKRProgress = (id: string, progress: number) => {
    setOkrs((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const bounded = Math.min(o.targetValue, Math.max(0, progress));
          const isDone = bounded >= o.targetValue;
          return {
            ...o,
            currentValue: bounded,
            status: isDone ? 'Completed' : bounded / o.targetValue < 0.6 ? 'Behind' : 'On Track',
          };
        }
        return o;
      })
    );
  };

  // Performance Reviews
  const addReview = (review: Omit<PerformanceReview, 'id' | 'date'>) => {
    const newRev: PerformanceReview = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setReviews((prev) => [newRev, ...prev]);
    showToast(`Appraisal recorded for ${review.employeeName} (${review.rating}/5 stars).`, 'success');
  };

  // Assets
  const assignAsset = (assetId: string, employeeId: string | null) => {
    const emp = employees.find((e) => e.id === employeeId);
    setAssets((prev) =>
      prev.map((ast) => {
        if (ast.id === assetId) {
          return {
            ...ast,
            assignedToId: employeeId,
            assignedToName: emp ? `${emp.firstName} ${emp.lastName}` : undefined,
            assignedDate: employeeId ? new Date().toISOString().split('T')[0] : null,
          };
        }
        return ast;
      })
    );
    showToast(
      employeeId
        ? `Hardware asset handed over to ${emp?.firstName} ${emp?.lastName}.`
        : 'Asset recovered and marked available in IT stock.',
      'info'
    );
  };

  // Onboarding Tasks
  const toggleOnboardingTask = (taskId: string) => {
    setOnboardingTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  // Reset to Indian Seed Data
  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.EMPLOYEES);
    localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
    localStorage.removeItem(STORAGE_KEYS.LEAVES);
    localStorage.removeItem(STORAGE_KEYS.PAYROLL);
    localStorage.removeItem(STORAGE_KEYS.OKRS);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.ASSETS);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);

    setEmployees(INITIAL_EMPLOYEES);
    setAttendance(INITIAL_ATTENDANCE);
    setLeaveRequests(INITIAL_LEAVE_REQUESTS);
    setPayrollRecords(INITIAL_PAYROLL_RECORDS);
    setOkrs(INITIAL_OKRS);
    setReviews(INITIAL_REVIEWS);
    setAssets(INITIAL_ASSETS);
    setOnboardingTasks(INITIAL_ONBOARDING_TASKS);
    setCurrentUserId('admin');
    setSelectedEmployee(null);
    setSelectedPayslip(null);
    showToast('Reset system to default Indian corporate records.', 'info');
  };

  return (
    <EMSContext.Provider
      value={{
        employees,
        selectedEmployee,
        setSelectedEmployee,
        currentUserId,
        setCurrentUserId,
        activeView,
        setActiveView,
        addEmployee,
        updateEmployee,
        deleteEmployee,
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
        payrollRecords,
        selectedPayslip,
        setSelectedPayslip,
        processMonthlyPayroll,
        okrs,
        updateOKRProgress,
        reviews,
        addReview,
        assets,
        assignAsset,
        onboardingTasks,
        toggleOnboardingTask,
        toasts,
        showToast,
        removeToast,
        resetAllData,
      }}
    >
      {children}
    </EMSContext.Provider>
  );
};

export const useEMS = () => {
  const context = useContext(EMSContext);
  if (!context) {
    throw new Error('useEMS must be used within an EMSProvider');
  }
  return context;
};
