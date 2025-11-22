export enum TabView {
  DISPATCH = 'DISPATCH',
  RECEIVING = 'RECEIVING',
  DOWNLOADS = 'DOWNLOADS',
}

export interface VehicleLog {
  id: string;
  vehicleNumber: string;
  timestampIn: string;
  timestampOut?: string;
  status: 'DOCKED' | 'COMPLETED';
}

export interface DispatchLog extends VehicleLog {
  type: 'DISPATCH';
  transporterName: string;
  consignor: string;
  consignee: string;
}

export interface ReceivingLog extends VehicleLog {
  type: 'RECEIVING';
  vendorCode: string;
  srvNumber: string;
  personnelId: string;
}

export interface DownloadLog {
  id: string;
  fileName: string;
  date: string;
  recordCount: number;
  type: 'DISPATCH' | 'RECEIVING';
}
