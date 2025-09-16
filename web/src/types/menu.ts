export interface ServiceMenu {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  type: string;
}

// to store localStorage
export interface StoredServices {
  services: ServiceMenu[];
  expiresAt: number;
}