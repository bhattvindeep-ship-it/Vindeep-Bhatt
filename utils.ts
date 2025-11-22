import { DispatchLog, ReceivingLog } from './types';

export const downloadCSV = (data: any[], fileName: string) => {
  if (!data || !data.length) {
    alert('No data available to download matching criteria');
    return;
  }

  // Get headers
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(fieldName => {
        const value = row[fieldName];
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        // Escape quotes and wrap in quotes if it contains comma, newline or quotes
        if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const formatDispatchForCsv = (logs: DispatchLog[]) => {
  return logs.map(log => ({
    'Log ID': log.id,
    'Vehicle Number': log.vehicleNumber,
    'Transporter': log.transporterName,
    'Consignor': log.consignor,
    'Consignee': log.consignee,
    'Time In': new Date(log.timestampIn).toLocaleString(),
    'Time Out': log.timestampOut ? new Date(log.timestampOut).toLocaleString() : '-',
    'Status': log.status
  }));
};

export const formatReceivingForCsv = (logs: ReceivingLog[]) => {
  return logs.map(log => ({
    'Log ID': log.id,
    'Vehicle Number': log.vehicleNumber,
    'Vendor Code': log.vendorCode,
    'SRV Number': log.srvNumber,
    'Personnel ID': log.personnelId,
    'Time In': new Date(log.timestampIn).toLocaleString(),
    'Time Out': log.timestampOut ? new Date(log.timestampOut).toLocaleString() : '-',
    'Status': log.status
  }));
};

export const calculateDuration = (start: string, end?: string) => {
  if (!end) return '0m';
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  const diff = endTime - startTime;
  
  if (diff < 0) return '0m';

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }
  return `${minutes}m`;
};