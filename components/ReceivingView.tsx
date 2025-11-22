import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { ReceivingLog } from '../types';
import { Truck, Clock, FileDown } from 'lucide-react';

interface ReceivingViewProps {
  activeLogs: ReceivingLog[];
  completedLogs: ReceivingLog[];
  onDockIn: (data: Omit<ReceivingLog, 'id' | 'timestampIn' | 'status' | 'type'>) => void;
  onDockOut: (id: string) => void;
}

export const ReceivingView: React.FC<ReceivingViewProps> = ({ activeLogs, completedLogs, onDockIn, onDockOut }) => {
  const [formData, setFormData] = useState({
    vehicleNumber: '',
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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Receiving Dock In Form */}
      <Card title="Receiving Dock In" className="border-t-4 border-t-primary-500">
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
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Vendor Code/Consignor</label>
            <input
              type="text"
              placeholder="Enter vendor code or consignor code"
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
              value={formData.vendorCode}
              onChange={(e) => setFormData({ ...formData, vendorCode: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">SRV Number</label>
            <input
              type="text"
              placeholder="Enter SRV number"
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
              value={formData.srvNumber}
              onChange={(e) => setFormData({ ...formData, srvNumber: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Receiving Personnel User ID</label>
            <input
              type="text"
              placeholder="Enter receiving personnel user ID"
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
              value={formData.personnelId}
              onChange={(e) => setFormData({ ...formData, personnelId: e.target.value })}
            />
          </div>

          <Button type="submit" fullWidth className="bg-primary-600 hover:bg-primary-700 text-lg py-3">
            Dock In Press
          </Button>
        </form>
      </Card>

      {/* Active Receiving Vehicles */}
      <Card title="Active Receiving Vehicles (Docked In)">
        {activeLogs.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <Truck className="mx-auto h-12 w-12 text-slate-300 mb-3" />
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

      {/* Export Receiving Data */}
      <Card title="Export Receiving Data">
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
        <p className="text-xs text-slate-500 mt-3">Select date range and click download to export all receiving activities as CSV file</p>
      </Card>

      {/* Search Receiving History */}
      <Card title="Search Receiving History">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Vendor Code</label>
            <input type="text" placeholder="Enter vendor code" className="w-full rounded-md border-slate-300 text-sm px-3 py-2 border" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">SRV Number</label>
            <input type="text" placeholder="Enter SRV number" className="w-full rounded-md border-slate-300 text-sm px-3 py-2 border" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Personnel ID</label>
            <input type="text" placeholder="Enter personnel ID" className="w-full rounded-md border-slate-300 text-sm px-3 py-2 border" />
          </div>
        </div>
        <div className="flex justify-end">
           <Button variant="secondary" className="text-sm">Clear Filters</Button>
        </div>
      </Card>
      
      {/* Completed Receiving Activities */}
      <Card title="Completed Receiving Activities">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">SRV #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Personnel</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {completedLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{log.vehicleNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">{log.srvNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-sm">{log.personnelId}</td>
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
