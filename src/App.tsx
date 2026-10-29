/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EMSProvider, useEMS } from './context/EMSContext';
import { Header } from './components/Header';
import { DirectoryView } from './components/DirectoryView';
import { AttendanceLeaveView } from './components/AttendanceLeaveView';
import { PayrollView } from './components/PayrollView';
import { OrgChartView } from './components/OrgChartView';
import { PerformanceView } from './components/PerformanceView';
import { OnboardingAssetsView } from './components/OnboardingAssetsView';
import { AnalyticsView } from './components/AnalyticsView';
import { EmployeeProfileModal } from './components/EmployeeProfileModal';
import { AddEditEmployeeModal } from './components/AddEditEmployeeModal';
import { ToastContainer } from './components/ToastContainer';
import { Employee } from './types/ems';
import { ShieldCheck, UserCheck } from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    activeView,
    currentUserId,
    setCurrentUserId,
    employees,
    selectedEmployee,
    setSelectedEmployee,
    setSelectedPayslip,
    payrollRecords,
  } = useEMS();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);

  const handleOpenEdit = (emp: Employee) => {
    setEmployeeToEdit(emp);
    setIsAddModalOpen(true);
  };

  const handleOpenPayslipForEmployee = (emp: Employee) => {
    const record = payrollRecords.find((r) => r.employeeId === emp.id);
    if (record) {
      setSelectedPayslip(record);
    } else {
      // Indian statutory calculation
      const monthlyCTC = Math.round(emp.salary / 12);
      const baseSalary = Math.round(monthlyCTC * 0.5);
      const hra = Math.round(baseSalary * 0.4);
      const conveyance = 1600;
      const medicalAllowance = 2500;
      const performanceBonus = 15000;
      const specialAllowance = Math.max(0, monthlyCTC - (baseSalary + hra + conveyance + medicalAllowance));
      const grossEarnings = baseSalary + hra + conveyance + medicalAllowance + specialAllowance + performanceBonus;

      const providentFund = Math.round(baseSalary * 0.12);
      const professionalTax = 200;
      const healthInsurance = 1500;
      const gratuityFund = Math.round((15 / 26) * (baseSalary / 12));
      const tdsTax = Math.round(grossEarnings * (emp.salary > 2000000 ? 0.18 : 0.1));
      const totalDeductions = tdsTax + providentFund + professionalTax + healthInsurance + gratuityFund;
      const netPay = grossEarnings - totalDeductions;

      setSelectedPayslip({
        id: `pay-${emp.id}-auto`,
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
        status: 'Processed',
      });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col text-neutral-900">
      {/* Top Bar Header */}
      <Header
        onOpenAddModal={() => {
          setEmployeeToEdit(null);
          setIsAddModalOpen(true);
        }}
      />

      {/* Role Switcher & Context Banner */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-neutral-600">
            <span className="font-semibold text-neutral-900">TalentPulse India Core</span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span>Version 2026.4</span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span className="text-neutral-500">Bengaluru HQ (Embassy TechVillage)</span>
          </div>

          {/* User Persona Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-500 font-medium">Viewing as:</span>
            <select
              value={currentUserId}
              onChange={(e) => setCurrentUserId(e.target.value)}
              className="bg-neutral-50 border border-neutral-200 text-neutral-800 rounded-lg px-2.5 py-1 font-medium focus:outline-none focus:ring-1 focus:ring-neutral-900"
            >
              <option value="admin">Kavita Patel (Head HR & Super Admin)</option>
              {employees.slice(0, 5).map((e) => (
                <option key={e.id} value={e.id}>
                  {e.firstName} {e.lastName} ({e.jobTitle.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'directory' && (
          <DirectoryView
            onOpenAddModal={() => {
              setEmployeeToEdit(null);
              setIsAddModalOpen(true);
            }}
          />
        )}
        {activeView === 'attendance' && <AttendanceLeaveView />}
        {activeView === 'payroll' && <PayrollView />}
        {activeView === 'orgchart' && <OrgChartView />}
        {activeView === 'performance' && <PerformanceView />}
        {activeView === 'assets' && <OnboardingAssetsView />}
        {activeView === 'analytics' && <AnalyticsView />}
      </main>

      {/* Modals & Overlays */}
      <EmployeeProfileModal
        onOpenEdit={handleOpenEdit}
        onOpenPayslipForEmployee={handleOpenPayslipForEmployee}
      />

      <AddEditEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEmployeeToEdit(null);
        }}
        employeeToEdit={employeeToEdit}
      />

      <ToastContainer />

      {/* Clean quiet footer */}
      <footer className="border-t border-neutral-200 bg-white py-6 mt-12 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 TalentPulse India Technologies Pvt. Ltd. All employee records encrypted with AES-256 GCM.</p>
          <div className="flex items-center gap-6 text-neutral-600">
            <span className="hover:text-neutral-900">EPFO & ESIC Compliant</span>
            <span className="hover:text-neutral-900">IT Act Section 192 (TDS)</span>
            <span className="hover:text-neutral-900">Form 16 & 24Q Automated</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <EMSProvider>
      <MainLayout />
    </EMSProvider>
  );
}
