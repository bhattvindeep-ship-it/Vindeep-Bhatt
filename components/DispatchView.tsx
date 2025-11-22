import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { DispatchLog } from '../types';
import { MOCK_TRANSPORTERS, MOCK_CONSIGNORS, MOCK_CONSIGNEES } from '../constants';
import { Calendar, Truck, CheckCircle, Clock, Search, AlertCircle, FileDown } from 'lucide-react';

interface DispatchViewProps {
  activeLogs: DispatchLog[];
  completedLogs: DispatchLog[];
  onDockIn: (data: Omit<DispatchLog, 'id' | 'timestampIn' | 'status' | 'type'>) => void;
  onDockOut: (id: string) => void;
}

export const DispatchView: React.FC<DispatchViewProps> = ({ activeLogs, completedLogs, onDockIn, onDockOut }) => {
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    transporterName: '',
    consignor: '',
    consignee: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.vehicleNumber && formData.transporterName && formData.consignor && formData.consignee) {
      onDockIn(formData);
      setFormData({ vehicleNumber: '', transporterName: '', consignor: '', consignee: '' });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Dock In Form */}
      <Card title="Dock In Vehicle" className="border-t-4 border-t-primary-500">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Number</label>
            <input
              type="text"
              placeholder="Enter vehicle number (e.g., MH12AB1234)"
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
              value={formData.vehicleNumber}
              onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Transporter Name</label>
              <select
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border bg-white"
                value={formData.transporterName}
                onChange={(e) => setFormData({ ...formData, transporterName: e.target.value })}
              >
                <option value="">Select Transporter</option>
                {MOCK_TRANSPORTERS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Consignor</label>
              <select
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border bg-white"
                value={formData.consignor}
                onChange={(e) => setFormData({ ...formData, consignor: e.target.value })}
              >
                <option value="">Select Consignor</option>
                {MOCK_CONSIGNORS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Consignee</label>
              <select
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border bg-white"
                value={formData.consignee}
                onChange={(e) => setFormData({ ...formData, consignee: e.target.value })}
              >
                <option value="">Select Consignee</option>
                {MOCK_CONSIGNEES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <Button type="submit" fullWidth className="bg-primary-600 hover:bg-primary-700 text-lg py-3">
            Dock In Vehicle
          </Button>
        </form>
      </Card>

      {/* Active Vehicles */}
      <Card title="Active Vehicles (Docked In)">
        {activeLogs.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <Truck className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <p>No vehicles currently docked in</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Transporter</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Time In</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {activeLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{log.vehicleNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">{log.transporterName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1.5 text-slate-400" />
                        {new Date(log.timestampIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => onDockOut(log.id)}
                        className="text-red-600 hover:text-red-900 font-semibold bg-red-50 px-3 py-1 rounded-full hover:bg-red-100 transition-colors"
                      >
                        Dock Out
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Export Data Section */}
      <Card title="Export Data">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
            <div className="relative">
              <input type="date" className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-4 py-2 border" />
            </div>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
            <div className="relative">
              <input type="date" className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-4 py-2 border" />
            </div>
          </div>
          <Button className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700">
            <FileDown className="w-4 h-4 mr-2" />
            Download CSV
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-3">Select date range and click download to export all dock activities as CSV file</p>
      </Card>

      {/* Search History */}
      <Card title="Search History">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Transporter</label>
            <select className="w-full rounded-md border-slate-300 text-sm px-3 py-2 border">
              <option>All Transporters</option>
              {MOCK_TRANSPORTERS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Consignor</label>
            <select className="w-full rounded-md border-slate-300 text-sm px-3 py-2 border">
              <option>All Consignors</option>
              {MOCK_CONSIGNORS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Consignee</label>
            <select className="w-full rounded-md border-slate-300 text-sm px-3 py-2 border">
              <option>All Consignees</option>
              {MOCK_CONSIGNEES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end">
           <Button variant="secondary" className="text-sm">Clear Filters</Button>
        </div>
      </Card>

       {/* Completed Activities */}
       <Card title="Completed Activities">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {completedLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{log.vehicleNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                       {new Date(log.timestampIn).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-sm">
                      {log.timestampOut ? '45 mins' : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                         Completed
                       </span>
                    </td>
                  </tr>
                ))}
                {completedLogs.length === 0 && (
                   <tr>
                   <td colSpan={4} className="px-6 py-8 text-center text-slate-400">No history available</td>
                 </tr>
                )}
              </tbody>
            </table>
          </div>
       </Card>
    </div>
  );
};
