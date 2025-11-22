import React, { useState, useMemo } from 'react';
import { DispatchView } from './components/DispatchView';
import { ReceivingView } from './components/ReceivingView';
import { DownloadsView } from './components/DownloadsView';
import { TabView, DispatchLog, ReceivingLog, DownloadLog } from './types';
import { INITIAL_DISPATCH_DATA, INITIAL_RECEIVING_DATA, INITIAL_DOWNLOADS } from './constants';
import { Package, ArrowDownCircle, FolderOpen } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabView>(TabView.DISPATCH);
  
  // Global State
  const [dispatchLogs, setDispatchLogs] = useState<DispatchLog[]>(INITIAL_DISPATCH_DATA);
  const [receivingLogs, setReceivingLogs] = useState<ReceivingLog[]>(INITIAL_RECEIVING_DATA);
  const [downloadHistory, setDownloadHistory] = useState<DownloadLog[]>(INITIAL_DOWNLOADS);

  // Derived State
  const activeDispatchLogs = useMemo(() => dispatchLogs.filter(l => l.status === 'DOCKED'), [dispatchLogs]);
  const completedDispatchLogs = useMemo(() => dispatchLogs.filter(l => l.status === 'COMPLETED'), [dispatchLogs]);

  const activeReceivingLogs = useMemo(() => receivingLogs.filter(l => l.status === 'DOCKED'), [receivingLogs]);
  const completedReceivingLogs = useMemo(() => receivingLogs.filter(l => l.status === 'COMPLETED'), [receivingLogs]);

  // Handlers
  const handleDispatchDockIn = (data: any) => {
    const newLog: DispatchLog = {
      ...data,
      id: `d-${Date.now()}`,
      type: 'DISPATCH',
      status: 'DOCKED',
      timestampIn: new Date().toISOString()
    };
    setDispatchLogs([newLog, ...dispatchLogs]);
  };

  const handleDispatchDockOut = (id: string) => {
    setDispatchLogs(logs => logs.map(log => 
      log.id === id 
        ? { ...log, status: 'COMPLETED', timestampOut: new Date().toISOString() } 
        : log
    ));
  };

  const handleReceivingDockIn = (data: any) => {
    const newLog: ReceivingLog = {
      ...data,
      id: `r-${Date.now()}`,
      type: 'RECEIVING',
      status: 'DOCKED',
      timestampIn: new Date().toISOString()
    };
    setReceivingLogs([newLog, ...receivingLogs]);
  };

  const handleReceivingDockOut = (id: string) => {
    setReceivingLogs(logs => logs.map(log => 
      log.id === id 
        ? { ...log, status: 'COMPLETED', timestampOut: new Date().toISOString() } 
        : log
    ));
  };

  const handleRegisterDownload = (fileName: string, recordCount: number, type: 'DISPATCH' | 'RECEIVING') => {
    const newDownload: DownloadLog = {
        id: `dl-${Date.now()}`,
        fileName,
        date: new Date().toISOString(),
        recordCount,
        type
    };
    setDownloadHistory(prev => [newDownload, ...prev]);
  };

  const handleClearHistory = () => {
    setDownloadHistory([]);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white pt-8 pb-4 px-4 sm:px-6 lg:px-8 shadow-sm z-10">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dock Management System</h1>
          <p className="mt-1 text-sm text-slate-500">Track vehicle dock-in and dock-out activities</p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto mt-8">
          <nav className="flex shadow-sm rounded-t-lg overflow-hidden divide-x divide-slate-200 border border-slate-200 bg-white" aria-label="Tabs">
            <button
              onClick={() => setActiveTab(TabView.DISPATCH)}
              className={`
                group relative min-w-0 flex-1 overflow-hidden py-4 px-4 text-center text-sm font-medium hover:bg-slate-50 focus:z-10 transition-colors flex items-center justify-center
                ${activeTab === TabView.DISPATCH 
                  ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' 
                  : 'text-slate-500 bg-white hover:text-slate-700 border-b-2 border-transparent'}
              `}
            >
              <Package className={`
                flex-shrink-0 -ml-1 mr-2 h-5 w-5
                ${activeTab === TabView.DISPATCH ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-500'}
              `} />
              Dispatch
            </button>

            <button
              onClick={() => setActiveTab(TabView.RECEIVING)}
              className={`
                group relative min-w-0 flex-1 overflow-hidden py-4 px-4 text-center text-sm font-medium hover:bg-slate-50 focus:z-10 transition-colors flex items-center justify-center
                ${activeTab === TabView.RECEIVING 
                  ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' 
                  : 'text-slate-500 bg-white hover:text-slate-700 border-b-2 border-transparent'}
              `}
            >
              <ArrowDownCircle className={`
                flex-shrink-0 -ml-1 mr-2 h-5 w-5
                ${activeTab === TabView.RECEIVING ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-500'}
              `} />
              Receiving
            </button>

            <button
              onClick={() => setActiveTab(TabView.DOWNLOADS)}
              className={`
                group relative min-w-0 flex-1 overflow-hidden py-4 px-4 text-center text-sm font-medium hover:bg-slate-50 focus:z-10 transition-colors flex items-center justify-center
                ${activeTab === TabView.DOWNLOADS 
                  ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' 
                  : 'text-slate-500 bg-white hover:text-slate-700 border-b-2 border-transparent'}
              `}
            >
              <FolderOpen className={`
                flex-shrink-0 -ml-1 mr-2 h-5 w-5
                ${activeTab === TabView.DOWNLOADS ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-500'}
              `} />
              Downloads
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === TabView.DISPATCH && (
          <DispatchView 
            activeLogs={activeDispatchLogs}
            completedLogs={completedDispatchLogs}
            onDockIn={handleDispatchDockIn}
            onDockOut={handleDispatchDockOut}
            onRegisterDownload={handleRegisterDownload}
          />
        )}
        {activeTab === TabView.RECEIVING && (
          <ReceivingView 
            activeLogs={activeReceivingLogs}
            completedLogs={completedReceivingLogs}
            onDockIn={handleReceivingDockIn}
            onDockOut={handleReceivingDockOut}
            onRegisterDownload={handleRegisterDownload}
          />
        )}
        {activeTab === TabView.DOWNLOADS && (
          <DownloadsView 
            history={downloadHistory}
            dispatchLogs={completedDispatchLogs}
            receivingLogs={completedReceivingLogs}
            onRegisterDownload={handleRegisterDownload}
            onClearHistory={handleClearHistory}
          />
        )}
      </main>
      
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 overflow-hidden sm:px-6 lg:px-8">
            <p className="text-center text-base text-slate-400">
                &copy; 2023 Dock Management System. All rights reserved.
            </p>
        </div>
      </footer>
    </div>
  );
};

export default App;