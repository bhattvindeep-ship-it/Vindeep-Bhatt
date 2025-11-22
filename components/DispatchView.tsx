import React, { useState, useMemo } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { DispatchLog } from '../types';
import { MOCK_TRANSPORTERS, MOCK_CONSIGNORS, MOCK_CONSIGNEES } from '../constants';
import { Clock, Truck, FileDown } from 'lucide-react';
import { downloadCSV, formatDispatchForCsv, calculateDuration } from '../utils';

interface DispatchViewProps {
  activeLogs: DispatchLog[];
  completedLogs: DispatchLog[];
  onDockIn: (data: Omit<DispatchLog, 'id' | 'timestampIn' | 'status' | 'type'>) => void;
  onDockOut: (id: string) => void;
  onRegisterDownload: (fileName: string, count: number, type: 'DISPATCH') => void;
}

export const DispatchView: React.FC<DispatchViewProps> = ({ activeLogs, completedLogs, onDockIn, onDockOut, onRegisterDownload }) => {
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    transporterName: '',
    consignor: '',
    consignee: ''
  });

  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const [filters, setFilters] = useState({
    transporter: 'All Transporters',
    consignor: 'All Consignors',
    consignee: 'All Consignees'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.vehicleNumber && formData.transporterName && formData.consignor && formData.consignee) {
      onDockIn(formData);
      setFormData({ vehicleNumber: '', transporterName: '', consignor: '', consignee: '' });
    }
  };

  const handleDownload = () => {
    const { startDate, endDate } = dateRange;
    
    let filteredLogs = completedLogs;

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filteredLogs = filteredLogs.filter(log => new Date(log.timestampIn) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filteredLogs = filteredLogs.filter(log => new Date(log.timestampIn) <= end);
    }

    if (filteredLogs.length === 0) {
      alert("No completed dispatch activities found for the selected date range.");
      return;
    }

    const formattedData = formatDispatchForCsv(filteredLogs);
    const fileName = `dispatch_report_${new Date().toISOString().split('T')[0]}.csv`;
    
    downloadCSV(formattedData, fileName);
    onRegisterDownload(fileName, filteredLogs.length, 'DISPATCH');
  };

  const clearFilters = () => {
    setFilters({
        transporter: 'All Transporters',
        consignor: 'All Consignors',
        consignee: 'All Consignees'
    });
  };

  const filteredCompletedLogs = useMemo(() => {
    return completedLogs.filter(log => {
        const transporterMatch = filters.transporter === 'All Transporters' || log.transporterName === filters.transporter;
        const consignorMatch = filters.consignor === 'All Consignors' || log.consignor === filters.consignor;
        const consigneeMatch = filters.consignee === 'All Consignees' || log.consignee === filters.consignee;
        return transporterMatch && consignorMatch && consigneeMatch;
    });
  }, [completedLogs, filters]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Dock In Form */}
      <Card title="Dock In Vehicle" className="border-t-4 border-t-indigo-500">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Number</label>
            <input
              type="text"
              placeholder="Enter vehicle number (e.g., MH12AB1234)"
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5 border"
              value={formData.vehicleNumber}
              onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Transporter Name</label>
              <select
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5 border bg-white"
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
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5 border bg-white"
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
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5 border bg-white"
                value={formData.consignee}
                onChange={(e) => setFormData({ ...formData, consignee: e.target.value })}
              >
                <option value="">Select Consignee</option>
                {MOCK_CONSIGNEES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <Button type="submit" fullWidth className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 font-semibold shadow-md">
            Dock In Vehicle
          </Button>
        </form>
      </Card>

      {/* Active Vehicles */}
      <Card title="Active Vehicles (Docked In)">
        {activeLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
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
                        className="text-red-600 hover:text-red-900 font-semibold bg-red-50 px-4 py-1.5 rounded hover:bg-red-100 transition-colors"
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
            <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">Start Date</label>
            <div className="relative">
              <input 
                type="date" 
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
              />
            </div>
          </div>
          <div className="flex-1 w-full">
             <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">End Date</label>
            <div className="relative">
              <input 
                type="date" 
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
              />
            </div>
          </div>
          <Button 
            className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6"
            onClick={handleDownload}
          >
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
            <select 
                className="w-full rounded-md border-slate-300 text-sm px-3 py-2 border focus:border-indigo-500 focus:ring-indigo-500"
                value={filters.transporter}
                onChange={(e) => setFilters({...filters, transporter: e.target.value})}
            >
              <option>All Transporters</option>
              {MOCK_TRANSPORTERS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Consignor</label>
            <select 
                className="w-full rounded-md border-slate-300 text-sm px-3 py-2 border focus:border-indigo-500 focus:ring-indigo-500"
                value={filters.consignor}
                onChange={(e) => setFilters({...filters, consignor: e.target.value})}
            >
              <option>All Consignors</option>
              {MOCK_CONSIGNORS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Consignee</label>
            <select 
                className="w-full rounded-md border-slate-300 text-sm px-3 py-2 border focus:border-indigo-500 focus:ring-indigo-500"
                value={filters.consignee}
                onChange={(e) => setFilters({...filters, consignee: e.target.value})}
            >
              <option>All Consignees</option>
              {MOCK_CONSIGNEES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end">
           <Button variant="secondary" className="text-sm bg-slate-600 hover:bg-slate-700 text-white" onClick={clearFilters}>Clear Filters</Button>
        </div>
      </Card>

       {/* Completed Activities */}
       <Card title="Completed Activities">
            <div className="space-y-4">
                {filteredCompletedLogs.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">No history available</div>
                ) : (
                    filteredCompletedLogs.map((log) => (
                        <div key={log.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow bg-white">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="text-lg font-bold text-slate-800">{log.vehicleNumber}</h4>
                                    <p className="text-xs font-medium text-slate-500 uppercase mt-1">{log.transporterName}</p>
                                </div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                    Completed
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-3">
                                <div>
                                    <span className="text-xs text-slate-400 block">Consignor</span>
                                    <span className="text-sm font-semibold text-slate-700">{log.consignor}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-400 block">Consignee</span>
                                    <span className="text-sm font-semibold text-slate-700">{log.consignee}</span>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs text-slate-500 border-t border-slate-100 pt-3 mt-2">
                                <div>
                                    <span className="text-slate-400 mr-1">Docked In:</span>
                                    <span className="font-medium">{new Date(log.timestampIn).toLocaleString()}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 mr-1">Docked Out:</span>
                                    <span className="font-medium">{log.timestampOut ? new Date(log.timestampOut).toLocaleString() : '-'}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 mr-1">Duration:</span>
                                    <span className="font-medium">{calculateDuration(log.timestampIn, log.timestampOut)}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
       </Card>
    </div>
  );
};