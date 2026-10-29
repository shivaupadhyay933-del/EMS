import React, { useState } from 'react';
import { useEMS } from '../context/EMSContext';
import { PayrollRecord } from '../types/ems';
import {
  TrendingUp,
  ShieldCheck,
  FileText,
  Printer,
  CheckCircle2,
  Play,
  X,
  CreditCard,
  Building,
} from 'lucide-react';
import { formatINR, formatLakhsCrores, numberToWordsINR } from '../utils/formatters';

export const PayrollView: React.FC = () => {
  const { payrollRecords, processMonthlyPayroll, selectedPayslip, setSelectedPayslip, showToast } = useEMS();
  const [search, setSearch] = useState('');

  const totalGross = payrollRecords.reduce((acc, r) => acc + r.grossEarnings, 0);
  const totalNet = payrollRecords.reduce((acc, r) => acc + r.netPay, 0);
  const totalTDS = payrollRecords.reduce((acc, r) => acc + r.deductions.tdsTax, 0);
  const totalEPF = payrollRecords.reduce((acc, r) => acc + r.deductions.providentFund, 0);

  const filteredRecords = payrollRecords.filter(
    (r) =>
      r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      r.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top KPI Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-neutral-200 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
            <span>Monthly Gross Run</span>
            <span className="font-mono text-neutral-400 font-bold">₹</span>
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-neutral-900">
            {formatINR(totalGross)}
          </p>
          <p className="text-[11px] text-neutral-500">October 2026 payroll batch</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
            <span>Total Net Disbursement</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-emerald-700">
            {formatINR(totalNet)}
          </p>
          <p className="text-[11px] text-neutral-500">Disbursed via automated NEFT / RTGS</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
            <span>TDS (Income Tax) Withheld</span>
            <ShieldCheck className="w-4 h-4 text-neutral-400" />
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-neutral-900">
            {formatINR(totalTDS)}
          </p>
          <p className="text-[11px] text-neutral-500">Payable to Income Tax Department (Challan 281)</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
            <span>Total EPF Remittance</span>
            <CreditCard className="w-4 h-4 text-neutral-400" />
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-neutral-900">
            {formatINR(totalEPF)}
          </p>
          <p className="text-[11px] text-neutral-500">Remitted to EPFO India (ECR)</p>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="bg-white p-5 rounded-xl border border-neutral-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-neutral-900">Salary Register: October 2026 (India)</h3>
          <p className="text-xs text-neutral-500">
            {payrollRecords.length} records processed for cycle 01 Oct - 31 Oct
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search employee or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
          />

          <button
            onClick={processMonthlyPayroll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Process & Disburse Payroll</span>
          </button>
        </div>
      </div>

      {/* Payroll Records Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 text-right">Basic Pay</th>
                <th className="py-3 px-4 text-right">Allowances</th>
                <th className="py-3 px-4 text-right">Deductions (TDS+PF+PT)</th>
                <th className="py-3 px-4 text-right">Net Take-Home</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredRecords.map((record) => {
                const totalAllowances =
                  record.allowances.hra +
                  record.allowances.conveyance +
                  record.allowances.medicalAllowance +
                  record.allowances.specialAllowance +
                  record.allowances.performanceBonus;

                return (
                  <tr key={record.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-4 font-semibold text-neutral-900">{record.employeeName}</td>
                    <td className="py-3 px-4 font-mono text-neutral-500 tabular-nums">{record.employeeCode}</td>
                    <td className="py-3 px-4 text-neutral-600">{record.department}</td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-neutral-700">
                      {formatINR(record.baseSalary)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-neutral-700">
                      +{formatINR(totalAllowances)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-rose-700">
                      -{formatINR(record.totalDeductions)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-neutral-900 text-sm">
                      {formatINR(record.netPay)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Paid</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedPayslip(record)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Payslip</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formal Printable Salary Slip Modal (India Format) */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Controls Header */}
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50 print:hidden">
              <span className="text-xs font-semibold text-neutral-700">
                Formal Salary Voucher (Form 16 Part B Preview) · {selectedPayslip.month}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Payslip</span>
                </button>
                <button
                  onClick={() => setSelectedPayslip(null)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Payslip Body */}
            <div className="p-8 space-y-6 text-xs text-neutral-800">
              {/* Company Header */}
              <div className="flex items-start justify-between border-b border-neutral-200 pb-5">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-neutral-900">
                    TalentPulse India Technologies Pvt. Ltd.
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Embassy TechVillage, Outer Ring Road, Devarabisanahalli
                  </p>
                  <p className="text-xs text-neutral-500">
                    Bengaluru, Karnataka 560103, India
                  </p>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400 mt-1">
                    <span>PAN: AABCT1234F</span>
                    <span aria-hidden="true">·</span>
                    <span>GSTIN: 29AABCT1234F1Z5</span>
                    <span aria-hidden="true">·</span>
                    <span>TAN: BLRT12345F</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Salary Slip
                  </span>
                  <p className="text-base font-bold text-neutral-900 font-mono mt-0.5">
                    {selectedPayslip.month}
                  </p>
                  <p className="text-[11px] text-neutral-500 font-mono">Pay Date: 31 Oct 2026</p>
                </div>
              </div>

              {/* Employee Particulars Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <div>
                  <span className="text-[11px] text-neutral-500 uppercase">Employee Name</span>
                  <p className="font-bold text-neutral-900 mt-0.5">{selectedPayslip.employeeName}</p>
                </div>
                <div>
                  <span className="text-[11px] text-neutral-500 uppercase">Employee Code</span>
                  <p className="font-mono text-neutral-900 mt-0.5">{selectedPayslip.employeeCode}</p>
                </div>
                <div>
                  <span className="text-[11px] text-neutral-500 uppercase">Department</span>
                  <p className="text-neutral-900 mt-0.5">{selectedPayslip.department}</p>
                </div>
                <div>
                  <span className="text-[11px] text-neutral-500 uppercase">Payment Mode</span>
                  <p className="font-mono text-neutral-900 mt-0.5">Direct NEFT/RTGS</p>
                </div>
              </div>

              {/* Financial Earnings vs Deductions Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-b border-neutral-200 py-4">
                {/* Earnings */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-1.5">
                    Gross Earnings (₹)
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Basic Salary</span>
                      <span className="font-mono tabular-nums">{formatINR(selectedPayslip.baseSalary)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">House Rent Allowance (HRA)</span>
                      <span className="font-mono tabular-nums">{formatINR(selectedPayslip.allowances.hra)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Special Allowance</span>
                      <span className="font-mono tabular-nums">{formatINR(selectedPayslip.allowances.specialAllowance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Conveyance Allowance</span>
                      <span className="font-mono tabular-nums">{formatINR(selectedPayslip.allowances.conveyance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Medical Reimbursement</span>
                      <span className="font-mono tabular-nums">{formatINR(selectedPayslip.allowances.medicalAllowance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Performance Bonus</span>
                      <span className="font-mono tabular-nums">{formatINR(selectedPayslip.allowances.performanceBonus)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-neutral-200 font-bold text-neutral-900">
                      <span>Total Gross Earnings</span>
                      <span className="font-mono tabular-nums">{formatINR(selectedPayslip.grossEarnings)}</span>
                    </div>
                  </div>
                </div>

                {/* Statutory Deductions */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-1.5">
                    Statutory Deductions (₹)
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Income Tax (TDS u/s 192)</span>
                      <span className="font-mono tabular-nums">{formatINR(selectedPayslip.deductions.tdsTax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Employees' PF (12% EPF)</span>
                      <span className="font-mono tabular-nums">{formatINR(selectedPayslip.deductions.providentFund)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Professional Tax (PT)</span>
                      <span className="font-mono tabular-nums">{formatINR(selectedPayslip.deductions.professionalTax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Corporate Mediclaim</span>
                      <span className="font-mono tabular-nums">{formatINR(selectedPayslip.deductions.healthInsurance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Gratuity Fund</span>
                      <span className="font-mono tabular-nums">{formatINR(selectedPayslip.deductions.gratuityFund)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-neutral-200 font-bold text-rose-700">
                      <span>Total Deductions</span>
                      <span className="font-mono tabular-nums">-{formatINR(selectedPayslip.totalDeductions)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Payout Summary Banner */}
              <div className="p-4 bg-neutral-900 text-white rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Net Take-Home Pay (Disbursed)
                  </span>
                  <p className="text-2xl font-bold font-mono tabular-nums mt-0.5">
                    {formatINR(selectedPayslip.netPay)}
                  </p>
                  <p className="text-[11px] text-neutral-300 italic mt-1">
                    {numberToWordsINR(selectedPayslip.netPay)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 font-medium px-2.5 py-1 rounded-md border border-emerald-500/30">
                    Transferred to Bank Account
                  </span>
                </div>
              </div>

              {/* Footer Sign-off Note */}
              <div className="text-center text-[11px] text-neutral-400 pt-3">
                This is an electronically generated salary voucher issued by TalentPulse India Technologies Pvt. Ltd. and requires no physical signature.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
