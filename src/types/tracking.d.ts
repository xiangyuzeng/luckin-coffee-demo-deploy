export interface OrderTrackingData {
  id: string;
  orderId: string;
  status: 'PLACED' | 'PREPARING' | 'READY' | 'PICKED_UP';
  placedAt: string;
  preparingAt: string | null;
  readyAt: string | null;
  pickedUpAt: string | null;
}
