export interface ReservationData {
  date: string;
  time: string;
  endTime: string;
  services: {
    id: string;
    service_name: string;
    description: string;
    duration: number;
    price: number;
    category: string;
  }[];
  totalDuration: number;
  totalPrice: number;
}