export type Role = 'admin' | 'sales' | 'operations' | 'accountant';

export type MeUser = {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  created_at: string;
};

export type Shipment = {
  id: string;
  tracking_number: string;
  current_status: string;
  carrier_name: string | null;
  estimated_delivery: string | null;
  actual_delivery: string | null;
};

export type Vendor = {
  id: string;
  vendor_name: string;
  vendor_type: 'carrier' | 'shipping_line' | 'agent' | 'warehouse' | 'other';
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  country: string | null;
  countries_supported: string[] | null;
  status: 'active' | 'inactive';
  notes: string | null;
  created_at: string;
};

export type VendorRateCard = {
  id: string;
  vendor_id: string;
  lane_type: 'FCL' | 'LCL' | 'Air' | 'Road_FTL' | 'Road_LTL';
  origin_country: string | null;
  origin_city: string | null;
  destination_country: string | null;
  destination_city: string | null;
  currency: 'AED' | 'USD' | 'SAR';
  base_rate: string;
  min_charge: string | null;
  valid_from: string | null;
  valid_to: string | null;
  notes: string | null;
  created_at: string;
};

export type Lead = {
  id: string;
  company_name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  region: 'GCC' | 'China' | 'India' | 'Africa' | 'International';
  source: string | null;
  outreach_status: 'new' | 'contacted' | 'responded' | 'qualified' | 'lost';
  response_summary: string | null;
  last_contacted_at: string | null;
  next_follow_up_at: string | null;
  assigned_to: string | null;
  created_at: string;
};

export type LeadActivity = {
  id: string;
  lead_id: string;
  activity_type: 'call' | 'whatsapp' | 'email' | 'meeting' | 'note';
  notes: string | null;
  created_by: string;
  created_at: string;
};

export type Customer = {
  id: string;
  company_name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  region: 'GCC' | 'China' | 'India' | 'Africa' | 'International';
  tax_id: string | null;
  assigned_to: string | null;
  created_at: string;
};

export type Quote = {
  id: string;
  customer_id: string;
  origin_city: string;
  destination_city: string;
  cargo_type: string;
  total_amount: string;
  currency: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  valid_until: string | null;
  selected_vendor_id: string | null;
  vendor_rate_card_id: string | null;
  cost_amount: string | null;
  margin_amount: string | null;
  finalized_at: string | null;
  created_at: string;
  customer?: Customer;
};

export type ShipmentDocument = {
  id: string;
  shipment_id: string;
  doc_type: string;
  file_url: string;
  uploaded_by: string;
  created_at: string;
};

export type AdminUser = {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  created_at: string;
};
