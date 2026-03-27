'use client';

import { useState, useMemo } from 'react';
import { Calculator, Info, DollarSign, Percent, Calendar, PieChart } from 'lucide-react';

export function MortgageCalculator({ homePrice = 0 }) {
  const [inputs, setInputs] = useState({
    homePrice: homePrice.toString(),
    downPayment: '20',
    downPaymentType: 'percent', // 'percent' or 'amount'
    interestRate: '6.5',
    loanTerm: '30',
    propertyTax: '1.2', // Annual as percentage of home price
    homeInsurance: '1200', // Annual
    pmi: '0.5', // Annual as percentage (if down payment < 20%)
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const calculations = useMemo(() => {
    const price = parseFloat(inputs.homePrice) || 0;
    const downPaymentPercent = parseFloat(inputs.downPayment) / 100;
    const interestRate = parseFloat(inputs.interestRate) / 100;
    const loanTermYears = parseInt(inputs.loanTerm) || 30;
    const propertyTaxRate = parseFloat(inputs.propertyTax) / 100;
    const insurance = parseFloat(inputs.homeInsurance) || 0;
    const pmiRate = parseFloat(inputs.pmi) / 100;

    // Calculate down payment
    let downPaymentAmount;
    if (inputs.downPaymentType === 'percent') {
      downPaymentAmount = price * downPaymentPercent;
    } else {
      downPaymentAmount = parseFloat(inputs.downPayment) || 0;
    }

    // Loan amount
    const loanAmount = price - downPaymentAmount;

    // Monthly interest rate
    const monthlyRate = interestRate / 12;

    // Number of payments
    const numberOfPayments = loanTermYears * 12;

    // Monthly mortgage payment (P&I)
    let monthlyPrincipalAndInterest;
    if (monthlyRate === 0) {
      monthlyPrincipalAndInterest = loanAmount / numberOfPayments;
    } else {
      monthlyPrincipalAndInterest =
        (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    }

    // Monthly property tax
    const monthlyPropertyTax = (price * propertyTaxRate) / 12;

    // Monthly insurance
    const monthlyInsurance = insurance / 12;

    // PMI (if down payment < 20%)
    const monthlyPMI = downPaymentPercent < 0.2 ? (loanAmount * pmiRate) / 12 : 0;

    // Total monthly payment
    const totalMonthlyPayment =
      monthlyPrincipalAndInterest +
      monthlyPropertyTax +
      monthlyInsurance +
      monthlyPMI;

    // Total interest over life of loan
    const totalInterest = monthlyPrincipalAndInterest * numberOfPayments - loanAmount;

    // Generate amortization schedule (first 12 months)
    const amortizationSchedule = [];
    let balance = loanAmount;

    for (let month = 1; month <= 12; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPrincipalAndInterest - interestPayment;
      balance -= principalPayment;

      amortizationSchedule.push({
        month,
        payment: monthlyPrincipalAndInterest,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance),
      });
    }

    return {
      downPaymentAmount,
      loanAmount,
      monthlyPrincipalAndInterest,
      monthlyPropertyTax,
      monthlyInsurance,
      monthlyPMI,
      totalMonthlyPayment,
      totalInterest,
      amortizationSchedule,
      showPMI: downPaymentPercent < 0.2,
    };
  }, [inputs]);

  const handleInputChange = (field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-2" aria-hidden="true" />
          <p className="text-2xl font-bold text-blue-900">
            ${calculations.loanAmount.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">Loan Amount</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <Calculator className="w-6 h-6 text-green-600 mx-auto mb-2" aria-hidden="true" />
          <p className="text-2xl font-bold text-green-900">
            ${Math.round(calculations.totalMonthlyPayment).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">Monthly Payment</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <Percent className="w-6 h-6 text-purple-600 mx-auto mb-2" aria-hidden="true" />
          <p className="text-2xl font-bold text-purple-900">
            ${Math.round(calculations.totalInterest).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">Total Interest</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <Calendar className="w-6 h-6 text-orange-600 mx-auto mb-2" aria-hidden="true" />
          <p className="text-2xl font-bold text-orange-900">
            {parseInt(inputs.loanTerm)}
          </p>
          <p className="text-sm text-gray-600">Year Term</p>
        </div>
      </div>

      {/* Payment Breakdown */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <PieChart className="w-5 h-5" aria-hidden="true" />
          Monthly Payment Breakdown
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500" aria-hidden="true" />
              <span className="text-gray-700">Principal & Interest</span>
            </div>
            <span className="font-semibold">
              ${Math.round(calculations.monthlyPrincipalAndInterest).toLocaleString()}/mo
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500" aria-hidden="true" />
              <span className="text-gray-700">Property Tax</span>
            </div>
            <span className="font-semibold">
              ${Math.round(calculations.monthlyPropertyTax).toLocaleString()}/mo
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-purple-500" aria-hidden="true" />
              <span className="text-gray-700">Home Insurance</span>
            </div>
            <span className="font-semibold">
              ${Math.round(calculations.monthlyInsurance).toLocaleString()}/mo
            </span>
          </div>
          {calculations.showPMI && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-orange-500" aria-hidden="true" />
                <span className="text-gray-700">PMI (until 20% equity)</span>
              </div>
              <span className="font-semibold">
                ${Math.round(calculations.monthlyPMI).toLocaleString()}/mo
              </span>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mt-4 pt-4 border-t">
            <div className="h-3 rounded-full flex overflow-hidden bg-gray-200">
              <div
                className="bg-blue-500"
                style={{
                  width: `${(calculations.monthlyPrincipalAndInterest / calculations.totalMonthlyPayment) * 100}%`,
                }}
                title="Principal & Interest"
              />
              <div
                className="bg-green-500"
                style={{
                  width: `${(calculations.monthlyPropertyTax / calculations.totalMonthlyPayment) * 100}%`,
                }}
                title="Property Tax"
              />
              <div
                className="bg-purple-500"
                style={{
                  width: `${(calculations.monthlyInsurance / calculations.totalMonthlyPayment) * 100}%`,
                }}
                title="Insurance"
              />
              {calculations.showPMI && (
                <div
                  className="bg-orange-500"
                  style={{
                    width: `${(calculations.monthlyPMI / calculations.totalMonthlyPayment) * 100}%`,
                  }}
                  title="PMI"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        aria-expanded={showAdvanced}
      >
        <Info className="w-4 h-4" aria-hidden="true" />
        {showAdvanced ? 'Hide' : 'Show'} Advanced Options
      </button>

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <label htmlFor="home-price" className="block text-sm font-medium text-gray-700 mb-1">
              Home Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                id="home-price"
                value={inputs.homePrice}
                onChange={(e) => handleInputChange('homePrice', e.target.value)}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="down-payment-type" className="block text-sm font-medium text-gray-700 mb-1">
              Down Payment Type
            </label>
            <select
              id="down-payment-type"
              value={inputs.downPaymentType}
              onChange={(e) => handleInputChange('downPaymentType', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="percent">Percentage</option>
              <option value="amount">Dollar Amount</option>
            </select>
          </div>

          <div>
            <label htmlFor="down-payment" className="block text-sm font-medium text-gray-700 mb-1">
              Down Payment {inputs.downPaymentType === 'percent' ? '(%)' : '($)'}
            </label>
            <div className="relative">
              {inputs.downPaymentType === 'percent' ? (
                <input
                  type="number"
                  id="down-payment"
                  value={inputs.downPayment}
                  onChange={(e) => handleInputChange('downPayment', e.target.value)}
                  className="w-full px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  max="100"
                />
              ) : (
                <>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="down-payment"
                    value={inputs.downPayment}
                    onChange={(e) => handleInputChange('downPayment', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="interest-rate" className="block text-sm font-medium text-gray-700 mb-1">
              Interest Rate (%)
            </label>
            <div className="relative">
              <input
                type="number"
                id="interest-rate"
                value={inputs.interestRate}
                onChange={(e) => handleInputChange('interestRate', e.target.value)}
                className="w-full px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                step="0.1"
                min="0"
                max="20"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
            </div>
          </div>

          <div>
            <label htmlFor="loan-term" className="block text-sm font-medium text-gray-700 mb-1">
              Loan Term
            </label>
            <select
              id="loan-term"
              value={inputs.loanTerm}
              onChange={(e) => handleInputChange('loanTerm', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="30">30 Years</option>
              <option value="20">20 Years</option>
              <option value="15">15 Years</option>
              <option value="10">10 Years</option>
            </select>
          </div>

          <div>
            <label htmlFor="property-tax" className="block text-sm font-medium text-gray-700 mb-1">
              Property Tax Rate (%)
            </label>
            <div className="relative">
              <input
                type="number"
                id="property-tax"
                value={inputs.propertyTax}
                onChange={(e) => handleInputChange('propertyTax', e.target.value)}
                className="w-full px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                step="0.1"
                min="0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
            </div>
          </div>

          <div>
            <label htmlFor="insurance" className="block text-sm font-medium text-gray-700 mb-1">
              Annual Insurance ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                id="insurance"
                value={inputs.homeInsurance}
                onChange={(e) => handleInputChange('homeInsurance', e.target.value)}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Amortization Schedule */}
      <details className="group">
        <summary className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
          View Year 1 Amortization Schedule
        </summary>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3 font-semibold text-gray-700">Month</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700">Payment</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700">Principal</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700">Interest</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700">Balance</th>
              </tr>
            </thead>
            <tbody>
              {calculations.amortizationSchedule.map((row) => (
                <tr key={row.month} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3">{row.month}</td>
                  <td className="text-right py-2 px-3">
                    ${row.payment.toFixed(2)}
                  </td>
                  <td className="text-right py-2 px-3 text-green-600">
                    ${row.principal.toFixed(2)}
                  </td>
                  <td className="text-right py-2 px-3 text-blue-600">
                    ${row.interest.toFixed(2)}
                  </td>
                  <td className="text-right py-2 px-3">
                    ${row.balance.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      {/* Disclaimer */}
      <p className="text-xs text-gray-500 pt-4 border-t">
        This calculator provides estimates for informational purposes only. Actual payments may vary.
        Consult with a mortgage professional for accurate rates and terms.
        {calculations.showPMI && (
          <span className="block mt-1">
            💡 TIP: With less than 20% down, you're paying PMI (Private Mortgage Insurance).
            Once you reach 20% equity, you can request PMI removal.
          </span>
        )}
      </p>
    </div>
  );
}
