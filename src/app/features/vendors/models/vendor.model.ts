export interface Vendor {
  id: string;
  erpId: string;
  name: string;
  taxRegistrationNumber: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  isApproved: boolean;
}

export interface CreateVendorRequest {
  erpId: string;
  name: string;
  taxRegistrationNumber: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

export interface UpdateVendorRequest {
  id: string;
  erpId: string;
  name: string;
  taxRegistrationNumber: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}
