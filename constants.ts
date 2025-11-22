import { DispatchLog, ReceivingLog, DownloadLog } from './types';

export const MOCK_TRANSPORTERS = [
  "DHL Logistics",
  "FedEx Freight",
  "Blue Dart Express",
  "Maersk Line",
  "TCI Freight"
];

export const MOCK_CONSIGNORS = [
  "ABC Manufacturing Ltd",
  "Global Tech Supplies",
  "Sunrise Agro",
  "Zenith Components"
];

export const MOCK_CONSIGNEES = [
  "Retail Giant Corp",
  "City Distribution Center",
  "Westside Warehouse",
  "Eastern Exports"
];

export const INITIAL_DISPATCH_DATA: DispatchLog[] = [
  {
    id: 'd-1',
    type: 'DISPATCH',
    vehicleNumber: 'MH12AB1234',
    transporterName: 'DHL Logistics',
    consignor: 'ABC Manufacturing Ltd',
    consignee: 'Retail Giant Corp',
    timestampIn: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    status: 'DOCKED'
  },
  {
    id: 'd-2',
    type: 'DISPATCH',
    vehicleNumber: 'KA05XY9876',
    transporterName: 'FedEx Freight',
    consignor: 'Global Tech Supplies',
    consignee: 'City Distribution Center',
    timestampIn: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    timestampOut: new Date(Date.now() - 82000000).toISOString(),
    status: 'COMPLETED'
  }
];

export const INITIAL_RECEIVING_DATA: ReceivingLog[] = [
  {
    id: 'r-1',
    type: 'RECEIVING',
    vehicleNumber: 'TN01QQ4455',
    vendorCode: 'V-9982',
    srvNumber: 'SRV-2023-001',
    personnelId: 'USER-101',
    timestampIn: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    status: 'DOCKED'
  }
];

export const INITIAL_DOWNLOADS: DownloadLog[] = [
  {
    id: 'dl-1',
    fileName: 'dispatch_report_oct_2023.csv',
    date: new Date().toISOString(),
    recordCount: 154,
    type: 'DISPATCH'
  }
];
