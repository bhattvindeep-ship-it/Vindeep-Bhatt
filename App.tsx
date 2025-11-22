import React, { useState, useMemo } from 'react';
import { DispatchView } from './components/DispatchView';
import { ReceivingView } from './components/ReceivingView';
import { DownloadsView } from './components/DownloadsView';
import { TabView, DispatchLog, ReceivingLog } from './types';
import { INITIAL_DISPATCH_DATA, INITIAL_RECEIVING_DATA, INITIAL_DOWNLOADS } from './constants';
import { Package, ArrowDownCircle, FolderOpen, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabView>(TabView.DISPATCH);
  
  // Global State
  const [dispatchLogs, setDispatchLogs] = useState<DispatchLog[]>(INITIAL_DISPATCH_DATA);
  const [receivingLogs, setReceivingLogs] = useState<ReceivingLog[]>(INITIAL_RECEIVING_DATA);
  const [downloadHistory] = useState(INITIAL_DOWNLOADS);

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

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-center items-center flex-col text-center">
            <h1 className="text-3xl font-bold text-slate-900">Dock Management System</h1>
            <p className="mt-1 text-sm text-slate-500">Track vehicle dock-in and dock-out activities</p>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <nav className="flex space-x-8 border-b border-slate-200" aria-label="Tabs">
            <button
              onClick={() => setActiveTab(TabView.DISPATCH)}
              className={`
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm flex-1 justify-center transition-colors
                ${activeTab === TabView.DISPATCH 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
              `}
            >
              <Package className={`
                -ml-0.5 mr-2 h-5 w-5
                ${activeTab === TabView.DISPATCH ? 'text-primary-500' : 'text-slate-400 group-hover:text-slate-500'}
              `} />
              Dispatch
            </button>

            <button
              onClick={() => setActiveTab(TabView.RECEIVING)}
              className={`
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm flex-1 justify-center transition-colors
                ${activeTab === TabView.RECEIVING 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
              `}
            >
              <ArrowDownCircle className={`
                -ml-0.5 mr-2 h-5 w-5
                ${activeTab === TabView.RECEIVING ? 'text-primary-500' : 'text-slate-400 group-hover:text-slate-500'}
              `} />
              Receiving
            </button>

            <button
              onClick={() => setActiveTab(TabView.DOWNLOADS)}
              className={`
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm flex-1 justify-center transition-colors
                ${activeTab === TabView.DOWNLOADS 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
              `}
            >
              <FolderOpen className={`
                -ml-0.5 mr-2 h-5 w-5
                ${activeTab === TabView.DOWNLOADS ? 'text-primary-500' : 'text-slate-400 group-hover:text-slate-500'}
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
          />
        )}
        {activeTab === TabView.RECEIVING && (
          <ReceivingView 
            activeLogs={activeReceivingLogs}
            completedLogs={completedReceivingLogs}
            onDockIn={handleReceivingDockIn}
            onDockOut={handleReceivingDockOut}
          />
        )}
        {activeTab === TabView.DOWNLOADS && (
          <DownloadsView history={downloadHistory} />
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
