export interface LibraryTenantOption {
  name: string;
  legalName: string;
  gst: string;
  billingAddress: string;
  cityStatePin: string;
  email: string;
  phone: string;
  defaultTaxType: 'intra' | 'inter';
}

export const CANONICAL_LIBRARY_TENANTS: LibraryTenantOption[] = [
  {
    name: 'City Central Library',
    legalName: 'Central Library Educational Society',
    gst: '09AAATC1234F1Z5',
    billingAddress: '42 MG Road, Hazratganj',
    cityStatePin: 'Lucknow, Uttar Pradesh - 226001',
    email: 'accounts@citycentral.org',
    phone: '+91 98765 43210',
    defaultTaxType: 'intra',
  },
  {
    name: 'Apex Knowledge Hub',
    legalName: 'Apex Knowledge Systems LLP',
    gst: '29AABCA9876Q1ZM',
    billingAddress: '15 Infotech Park, Whitefield',
    cityStatePin: 'Bengaluru, Karnataka - 560066',
    email: 'billing@apexstudy.in',
    phone: '+91 98111 22334',
    defaultTaxType: 'inter',
  },
  {
    name: 'Heritage National Archive',
    legalName: 'Heritage Documentation Trust',
    gst: '08AAATH4567M1Z2',
    billingAddress: '78 Heritage Square',
    cityStatePin: 'Jaipur, Rajasthan - 302001',
    email: 'accounts@heritagelib.gov.in',
    phone: '+91 98450 12345',
    defaultTaxType: 'inter',
  },
  {
    name: 'Silicon Valley Institute Lib',
    legalName: 'SVI Education Foundation',
    gst: '36AAATS9912K1ZY',
    billingAddress: 'Plot 88 Cyber Gateway',
    cityStatePin: 'Hyderabad, Telangana - 500081',
    email: 'finance@svinstitute.edu',
    phone: '+91 97123 45678',
    defaultTaxType: 'inter',
  },
  {
    name: 'Pragya Competitive Study Point',
    legalName: 'Pragya Career Academy Pvt Ltd',
    gst: '10AAACP5566L1Z9',
    billingAddress: 'Boring Road Crossing, Kidwaipuri',
    cityStatePin: 'Patna, Bihar - 800001',
    email: 'admin@pragyastudy.com',
    phone: '+91 99341 55678',
    defaultTaxType: 'inter',
  },
  {
    name: 'Zenith University Library',
    legalName: 'Zenith Higher Education Society',
    gst: '09AAATZ7788R1ZW',
    billingAddress: 'Campus Sector 62',
    cityStatePin: 'Noida, Uttar Pradesh - 201309',
    email: 'librarian@zenithuniv.ac.in',
    phone: '+91 98188 77665',
    defaultTaxType: 'intra',
  },
  {
    name: 'Pinnacle Study Space',
    legalName: 'Pinnacle Learning Spaces LLP',
    gst: '27AABCP1122D1ZM',
    billingAddress: 'FC Road, Shivajinagar',
    cityStatePin: 'Pune, Maharashtra - 411005',
    email: 'accounts@pinnaclestudy.in',
    phone: '+91 98220 33445',
    defaultTaxType: 'inter',
  },
  {
    name: 'Metro Reading Lounge',
    legalName: 'Metro Readers Foundation',
    gst: '19AAATM3344P1ZB',
    billingAddress: 'Salt Lake Sector V',
    cityStatePin: 'Kolkata, West Bengal - 700091',
    email: 'billing@metroreading.org',
    phone: '+91 98301 22334',
    defaultTaxType: 'inter',
  },
  {
    name: 'Vedic Grantha Kendra',
    legalName: 'Vedic Heritage Trust',
    gst: '09AAATV5544J1ZQ',
    billingAddress: 'Assi Ghat Road',
    cityStatePin: 'Varanasi, Uttar Pradesh - 221005',
    email: 'contact@vedicgrantha.org',
    phone: '+91 94150 99887',
    defaultTaxType: 'intra',
  },
];
