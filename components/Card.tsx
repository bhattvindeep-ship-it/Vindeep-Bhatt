import React, { ReactNode } from 'react';

interface CardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, subtitle, children, className = "", action }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};
