import React from 'react';
import { Calculator } from 'lucide-react';

export const MortgageCalculator = ({ initialPrice = 15000000 }) => {
  const [price, setPrice] = React.useState(initialPrice);
  const [downPayment, setDownPayment] = React.useState(initialPrice * 0.1);
  const [interestRate, setInterestRate] = React.useState(13); // Kenya average CBK rate + margin
  const [years, setYears] = React.useState(15);

  const monthlyPayment = React.useMemo(() => {
    const principal = price - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = years * 12;

    if (monthlyRate === 0) return principal / numberOfPayments;

    return (
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    );
  }, [price, downPayment, interestRate, years]);

  return (
    <div className="bg-white border border-gray-100 p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b">
        <Calculator className="text-brand-accent" />
        <h3 className="text-2xl font-serif">Mortgage Calculator</h3>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">Property Price (KES)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:outline-none focus:border-brand-accent rounded-none"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">Down Payment (KES)</label>
          <input
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:outline-none focus:border-brand-accent rounded-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">Interest Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:outline-none focus:border-brand-accent rounded-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">Period (Years)</label>
            <select
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 focus:outline-none focus:border-brand-accent rounded-none appearance-none"
            >
              {[5, 10, 15, 20, 25].map((y) => (
                <option key={y} value={y}>{y} Years</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-8 mt-4 border-t border-dashed">
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 block font-bold">Estimated Monthly Payment</span>
            <div className="text-4xl font-serif text-brand-primary">
              <span className="text-sm mr-1">KES</span>
              {Math.round(monthlyPayment).toLocaleString()}
            </div>
            <p className="text-[10px] text-gray-400 italic">
              Based on Kenyan banking norms (Approx. 13% p.a.)
            </p>
          </div>
        </div>

        <button className="w-full py-4 bg-brand-primary text-white text-xs uppercase tracking-[0.2em] font-bold hover:bg-brand-accent transition-colors mt-6">
          Check Eligibility
        </button>
      </div>
    </div>
  );
};
