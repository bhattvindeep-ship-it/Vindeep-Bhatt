import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { DownloadLog } from '../types';
import { FileText, Box, ArrowDownCircle } from 'lucide-react';

interface DownloadsViewProps {
  history: DownloadLog[];
}

export const DownloadsView: React.FC<DownloadsViewProps> = ({ history }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Download History */}
      <Card 
        title="Download History" 
        action={<Button variant="danger" className="text-xs py-1">Clear History</Button>}
      >
         {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
                <p>No downloads yet. Export some data to see your download history here.</p>
            </div>
         ) : (
            <div className="space-y-4">
                {history.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-100">
                        <div className="flex items-center">
                            <FileText className="text-primary-500 w-5 h-5 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-slate-800">{item.fileName}</p>
                                <p className="text-xs text-slate-500">{new Date(item.date).toLocaleString()} • {item.recordCount} records</p>
                            </div>
                        </div>
                        <Button variant="outline" className="text-xs py-1 h-8">Redownload</Button>
                    </div>
                ))}
            </div>
         )}
      </Card>

      {/* Quick Export Actions */}
      <Card title="Quick Export Actions">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                    <Box className="text-orange-500 w-5 h-5 mr-2" />
                    <h4 className="font-semibold text-slate-800">Dispatch Data</h4>
                </div>
                <p className="text-sm text-slate-500 mb-4">Export all completed dispatch activities</p>
                <Button fullWidth className="bg-primary-600 hover:bg-primary-700">Export All Dispatch</Button>
            </div>

            <div className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                    <ArrowDownCircle className="text-blue-500 w-5 h-5 mr-2" />
                    <h4 className="font-semibold text-slate-800">Receiving Data</h4>
                </div>
                <p className="text-sm text-slate-500 mb-4">Export all completed receiving activities</p>
                <Button fullWidth className="bg-primary-600 hover:bg-primary-700">Export All Receiving</Button>
            </div>
        </div>
      </Card>

      {/* Download Statistics */}
      <Card title="Download Statistics">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-6 rounded-lg text-center">
                <h2 className="text-3xl font-bold text-blue-600 mb-1">{history.length}</h2>
                <p className="text-xs font-medium text-blue-800 uppercase">Total Downloads</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg text-center">
                <h2 className="text-3xl font-bold text-green-600 mb-1">{history.filter(h => h.type === 'DISPATCH').length}</h2>
                <p className="text-xs font-medium text-green-800 uppercase">Dispatch Exports</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg text-center">
                <h2 className="text-3xl font-bold text-purple-600 mb-1">{history.filter(h => h.type === 'RECEIVING').length}</h2>
                <p className="text-xs font-medium text-purple-800 uppercase">Receiving Exports</p>
            </div>
         </div>
      </Card>
    </div>
  );
};
