export interface HsnRecord {
  id: string;
  hsnCode: string;
  description: string;
  gstRate: number; // integer only
  effectiveFrom: string; // YYYY-MM-DD (future date)
  effectiveTo?: string; // YYYY-MM-DD (future date, optional)
  status: "Active" | "Inactive";
  createdAt: string;
}

export const INITIAL_HSN_RECORDS: HsnRecord[] = [
  {
    id: "hsn_1",
    hsnCode: "84713010",
    description: "Personal computers (laptop, palmtop, etc.)",
    gstRate: 18,
    effectiveFrom: "2026-07-01",
    effectiveTo: "2027-12-31",
    status: "Active",
    createdAt: "2026-06-01T10:00:00Z"
  },
  {
    id: "hsn_2",
    hsnCode: "85171300",
    description: "Smartphones for cellular networks",
    gstRate: 18,
    effectiveFrom: "2026-08-15",
    status: "Active",
    createdAt: "2026-06-02T11:30:00Z"
  },
  {
    id: "hsn_3",
    hsnCode: "90283010",
    description: "Electricity meters, single phase",
    gstRate: 12,
    effectiveFrom: "2026-09-01",
    effectiveTo: "2028-06-30",
    status: "Active",
    createdAt: "2026-06-03T09:15:00Z"
  },
  {
    id: "hsn_4",
    hsnCode: "61091000",
    description: "T-shirts and vests of cotton",
    gstRate: 5,
    effectiveFrom: "2026-10-01",
    status: "Inactive",
    createdAt: "2026-06-04T14:45:00Z"
  }
];
