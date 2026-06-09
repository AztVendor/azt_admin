export type PermissionLevel = "view" | "update" | "create";

export interface AdminPermissions {
  dashboard?: PermissionLevel;
  orders?: PermissionLevel;
  categories?: PermissionLevel;
  subcategories?: PermissionLevel;
  minicategories?: PermissionLevel;
  macrocategories?: PermissionLevel;
  products?: PermissionLevel;
  hsn?: PermissionLevel;
  billing?: PermissionLevel;
  customers?: PermissionLevel;
  vendors?: PermissionLevel;
  notifications?: PermissionLevel;
  emails?: PermissionLevel;
  admins?: PermissionLevel;
}

export interface Admin {
  id: string;
  name: string;
  mobile: string;
  email: string;
  status: "Active" | "Inactive";
  createdAt: string;
  permissions: AdminPermissions;
}

export const MODULES_LIST = [
  { key: "dashboard", label: "Dashboard" },
  { key: "orders", label: "Orders" },
  { key: "categories", label: "Categories" },
  { key: "subcategories", label: "Sub Categories" },
  { key: "minicategories", label: "Mini Categories" },
  { key: "macrocategories", label: "Macro Categories" },
  { key: "products", label: "Products" },
  { key: "hsn", label: "HSN Master" },
  { key: "billing", label: "Billing" },
  { key: "customers", label: "Customers" },
  { key: "vendors", label: "Vendors" },
  { key: "notifications", label: "Notifications" },
  { key: "emails", label: "Emails" },
  { key: "admins", label: "Admins" }
] as const;

export const INITIAL_ADMINS: Admin[] = [
  {
    id: "adm1",
    name: "Albert Flores",
    mobile: "+1 (555) 019-2834",
    email: "albert.flores@stark.com",
    status: "Active",
    createdAt: "2026-01-15T09:00:00Z",
    permissions: {
      dashboard: "create",
      orders: "create",
      categories: "create",
      subcategories: "create",
      minicategories: "create",
      macrocategories: "create",
      products: "create",
      hsn: "create",
      billing: "create",
      customers: "create",
      vendors: "create",
      notifications: "create",
      emails: "create",
      admins: "create"
    }
  },
  {
    id: "adm2",
    name: "Kristin Watson",
    mobile: "+1 (555) 014-3920",
    email: "kristin.w@stark.com",
    status: "Active",
    createdAt: "2026-02-10T10:30:00Z",
    permissions: {
      dashboard: "view",
      orders: "create",
      categories: "update",
      subcategories: "update",
      minicategories: "view",
      products: "create",
      hsn: "view",
      billing: "update",
      customers: "view",
      vendors: "view"
    }
  },
  {
    id: "adm3",
    name: "Arlene McCoy",
    mobile: "+1 (555) 012-9847",
    email: "arlene.m@stark.com",
    status: "Active",
    createdAt: "2026-03-05T14:15:00Z",
    permissions: {
      dashboard: "view",
      orders: "view",
      customers: "view",
      notifications: "view",
      emails: "view"
    }
  },
  {
    id: "adm4",
    name: "Leslie Alexander",
    mobile: "+1 (555) 017-4839",
    email: "leslie.a@stark.com",
    status: "Inactive",
    createdAt: "2026-04-01T11:00:00Z",
    permissions: {
      dashboard: "view",
      products: "view",
      hsn: "view"
    }
  }
];
