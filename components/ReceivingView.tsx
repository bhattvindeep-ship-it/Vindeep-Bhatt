import React, { useState, useMemo } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { ReceivingLog } from '../types';
import { Truck, Clock, FileDown } from 'lucide-react';
import { downloadCSV, formatReceivingForCsv, calculateDuration } from '../utils';

interface ReceivingViewProps {
  activeLogs: ReceivingLog[];
  completedLogs: ReceivingLog[];
  onDockIn: (data: Omit<ReceivingLog, 'id' | 'timestampIn' | 'status' | 'type'>) => void;
  onDockOut: (id: string) => void;
  onRegisterDownload: (fileName: string, count: number, type: 'RECEIVING') => void;
}

export const ReceivingView: React.FC<ReceivingViewProps> = ({ activeLogs, completedLogs, onDockIn, onDockOut, onRegisterDownload }) => {
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    vendorCode: '',
    srvNumber: '',
    personnelId: ''
  });

  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const [filters, setFilters] = useState({
    vendorCode: '',
    srvNumber: '',
    personnelId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.vehicleNumber && formData.vendorCode && formData.srvNumber && formData.personnelId) {
      onDockIn(formData);
      setFormData({ vehicleNumber: '', vendorCode: '', srvNumber: '', personnelId: '' });
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
      alert("No completed receiving activities found for the selected date range.");
      return;
    }

    const formattedData = formatReceivingForCsv(filteredLogs);
    const fileName = `receiving_report_${new Date().toISOString().split('T')[0]}.csv`;
    
    downloadCSV(formattedData, fileName);
    onRegisterDownload(fileName, filteredLogs.length, 'RECEIVING');
  };

  const clearFilters = () => {
    setFilters({
        vendorCode: '',
        srvNumber: '',
        personnelId: ''
    });
  };

  const filteredCompletedLogs = useMemo(() => {
    return completedLogs.filter(log => {
        const vendorMatch = !filters.vendorCode || log.vendorCode.toLowerCase().includes(filters.vendorCode.toLowerCase());
        const srvMatch = !filters.srvNumber || log.srvNumber.toLowerCase().includes(filters.srvNumber.toLowerCase());
        const personnelMatch = !filters.personnelId || log.personnelId.toLowerCase().includes(filters.personnelId.toLowerCase());
        return vendorMatch && srvMatch && personnelMatch;
    });
  }, [completedLogs, filters]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Receiving Dock In Form */}
      <Card title="Receiving Dock In" className="border-t-4 border-t-indigo-500">
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
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Vendor Code/Consignor</label>
            <input
              type="text"
              placeholder="Enter vendor code or consignor code"
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5 border"
              value={formData.vendorCode}
              onChange={(e) => setFormData({ ...formData, vendorCode: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">SRV Number</label>
            <input
              type="text"
              placeholder="Enter SRV number"
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5 border"
              value={formData.srvNumber}
              onChange={(e) => setFormData({ ...formData, srvNumber: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Receiving Personnel User ID</label>
            <input
              type="text"
              placeholder="Enter receiving personnel user ID"
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2.5 border"
              value={formData.personnelId}
              onChange={(e) => setFormData({ ...formData, personnelId: e.target.value })}
            />
          </div>

          <Button type="submit" fullWidth className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 font-semibold shadow-md">
            Dock In Press
          </Button>
        </form>
      </Card>

      {/* Active Receiving Vehicles */}
      <Card title="Active Receiving Vehicles (Docked In)">
        {activeLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p>No vehicles currently docked in for receiving</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">SRV #</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {activeLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{log.vehicleNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">{log.vendorCode}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">{log.srvNumber}</td>
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

      {/* Export Receiving Data */}
      <Card title="Export Receiving Data">
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
        <p className="text-xs text-slate-500 mt-3">Select date range and click download to export all completed receiving activities as CSV file</p>
      </Card>

      {/* Search Receiving History */}
      <Card title="Search Receiving History">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Vendor Code</label>
            <input 
                type="text" 
                placeholder="Enter vendor code" 
                className="w-full rounded-md border-slate-300 text-sm px-3 py-2 border focus:border-indigo-500 focus:ring-indigo-500" 
                value={filters.vendorCode}
                onChange={(e) => setFilters({...filters, vendorCode: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">SRV Number</label>
            <input 
                type="text" 
                placeholder="Enter SRV number" 
                className="w-full rounded-md border-slate-300 text-sm px-3 py-2 border focus:border-indigo-500 focus:ring-indigo-500" 
                value={filters.srvNumber}
                onChange={(e) => setFilters({...filters, srvNumber: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Personnel ID</label>
            <input 
                type="text" 
                placeholder="Enter personnel ID" 
                className="w-full rounded-md border-slate-300 text-sm px-3 py-2 border focus:border-indigo-500 focus:ring-indigo-500" 
                value={filters.personnelId}
                onChange={(e) => setFilters({...filters, personnelId: e.target.value})}
            />
          </div>
        </div>
        <div className="flex justify-end">
           <Button variant="secondary" className="text-sm bg-slate-600 hover:bg-slate-700 text-white" onClick={clearFilters}>Clear Filters</Button>
        </div>
      </Card>
      
      {/* Completed Receiving Activities */}
      <Card title="Completed Receiving Activities">
         <div className="space-y-4">
            {filteredCompletedLogs.length === 0 ? (
                 <div className="text-center py-8 text-slate-400">No history available</div>
            ) : (
                filteredCompletedLogs.map((log) => (
                    <div key={log.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow bg-white">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="text-lg font-bold text-slate-800">{log.vehicleNumber}</h4>
                                <p className="text-xs font-medium text-slate-500 uppercase mt-1">{log.vendorCode}</p>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                Completed
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-3">
                            <div>
                                <span className="text-xs text-slate-400 block">SRV Number</span>
                                <span className="text-sm font-semibold text-slate-700">{log.srvNumber}</span>
                            </div>
                            <div>
                                <span className="text-xs text-slate-400 block">Personnel ID</span>
                                <span className="text-sm font-semibold text-slate-700">{log.personnelId}</span>
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