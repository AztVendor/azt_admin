export interface MainCategory {
  id: string;
  name: string;
  iconName: string; // Key corresponding to the SVG presets
  status: "Active" | "Inactive";
  sortOrder: number;
  subCategoryCount: number;
  createdAt: string;
}

export interface SubCategory {
  id: string;
  parentId: string; // Refers to MainCategory id
  name: string;
  iconName: string;
  status: "Active" | "Inactive";
  sortOrder: number;
  childCount: number; // Mini/Macro subcategories nested
  createdAt: string;
}

export interface MiniCategory {
  id: string;
  parentId: string; // Refers to SubCategory id
  name: string;
  iconName: string;
  status: "Active" | "Inactive";
  childCount: number; // Macro categories nested
  createdAt: string;
}

export interface MacroCategory {
  id: string;
  parentId: string; // Refers to MiniCategory id
  name: string;
  iconName: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

export const PRESET_ICONS = [
  { name: "Electronics / Devices", key: "devices" },
  { name: "Fashion / Apparel", key: "apparel" },
  { name: "Groceries / Shopping", key: "groceries" },
  { name: "Home / Interior", key: "home" },
  { name: "Sports / Athletics", key: "sports" },
  { name: "Automotive / Vehicles", key: "automotive" },
  { name: "Books / Knowledge", key: "books" },
  { name: "Toys / Recreation", key: "toys" },
  { name: "Beauty / Cosmetics", key: "beauty" }
];

export const INITIAL_CATEGORIES: MainCategory[] = [
  {
    id: "mc1",
    name: "Electronics",
    iconName: "devices",
    status: "Active",
    sortOrder: 1,
    subCategoryCount: 3,
    createdAt: "2026-01-10T10:00:00Z"
  },
  {
    id: "mc2",
    name: "Fashion",
    iconName: "apparel",
    status: "Active",
    sortOrder: 2,
    subCategoryCount: 2,
    createdAt: "2026-01-12T11:30:00Z"
  },
  {
    id: "mc3",
    name: "Groceries",
    iconName: "groceries",
    status: "Active",
    sortOrder: 3,
    subCategoryCount: 1,
    createdAt: "2026-01-15T09:15:00Z"
  },
  {
    id: "mc4",
    name: "Home & Garden",
    iconName: "home",
    status: "Active",
    sortOrder: 4,
    subCategoryCount: 2,
    createdAt: "2026-01-18T14:45:00Z"
  },
  {
    id: "mc5",
    name: "Sports & Outdoors",
    iconName: "sports",
    status: "Inactive",
    sortOrder: 5,
    subCategoryCount: 0,
    createdAt: "2026-01-20T08:00:00Z"
  }
];

export const INITIAL_SUB_CATEGORIES: SubCategory[] = [
  {
    id: "sc1",
    parentId: "mc1",
    name: "Mobile Phones",
    iconName: "devices",
    status: "Active",
    sortOrder: 1,
    childCount: 2,
    createdAt: "2026-01-10T10:15:00Z"
  },
  {
    id: "sc2",
    parentId: "mc1",
    name: "Computers",
    iconName: "devices",
    status: "Active",
    sortOrder: 2,
    childCount: 2,
    createdAt: "2026-01-10T10:30:00Z"
  },
  {
    id: "sc3",
    parentId: "mc1",
    name: "Audio",
    iconName: "devices",
    status: "Active",
    sortOrder: 3,
    childCount: 0,
    createdAt: "2026-01-10T11:00:00Z"
  },
  {
    id: "sc4",
    parentId: "mc2",
    name: "Apparel",
    iconName: "apparel",
    status: "Active",
    sortOrder: 1,
    childCount: 0,
    createdAt: "2026-01-12T11:45:00Z"
  },
  {
    id: "sc5",
    parentId: "mc2",
    name: "Bags & Accessories",
    iconName: "apparel",
    status: "Active",
    sortOrder: 2,
    childCount: 0,
    createdAt: "2026-01-12T12:00:00Z"
  },
  {
    id: "sc6",
    parentId: "mc3",
    name: "Fruits & Vegetables",
    iconName: "groceries",
    status: "Active",
    sortOrder: 1,
    childCount: 0,
    createdAt: "2026-01-15T09:30:00Z"
  },
  {
    id: "sc7",
    parentId: "mc4",
    name: "Furniture",
    iconName: "home",
    status: "Active",
    sortOrder: 1,
    childCount: 1,
    createdAt: "2026-01-18T15:00:00Z"
  },
  {
    id: "sc8",
    parentId: "mc4",
    name: "Kitchenware",
    iconName: "home",
    status: "Active",
    sortOrder: 2,
    childCount: 0,
    createdAt: "2026-01-18T15:15:00Z"
  }
];

export const INITIAL_MINI_CATEGORIES: MiniCategory[] = [
  {
    id: "mn1",
    parentId: "sc1",
    name: "Smartphones",
    iconName: "devices",
    status: "Active",
    childCount: 2,
    createdAt: "2026-01-10T10:20:00Z"
  },
  {
    id: "mn2",
    parentId: "sc1",
    name: "Feature Phones",
    iconName: "devices",
    status: "Active",
    childCount: 0,
    createdAt: "2026-01-10T10:25:00Z"
  },
  {
    id: "mn3",
    parentId: "sc2",
    name: "Laptops",
    iconName: "devices",
    status: "Active",
    childCount: 1,
    createdAt: "2026-01-10T10:35:00Z"
  },
  {
    id: "mn4",
    parentId: "sc2",
    name: "Desktops",
    iconName: "devices",
    status: "Active",
    childCount: 0,
    createdAt: "2026-01-10T10:40:00Z"
  },
  {
    id: "mn5",
    parentId: "sc7",
    name: "Living Room Furniture",
    iconName: "home",
    status: "Active",
    childCount: 1,
    createdAt: "2026-01-18T15:10:00Z"
  }
];

export const INITIAL_MACRO_CATEGORIES: MacroCategory[] = [
  {
    id: "mr1",
    parentId: "mn1",
    name: "Android Phones",
    iconName: "devices",
    status: "Active",
    createdAt: "2026-01-10T10:21:00Z"
  },
  {
    id: "mr2",
    parentId: "mn1",
    name: "iOS Devices",
    iconName: "devices",
    status: "Active",
    createdAt: "2026-01-10T10:22:00Z"
  },
  {
    id: "mr3",
    parentId: "mn3",
    name: "Gaming Laptops",
    iconName: "devices",
    status: "Active",
    createdAt: "2026-01-10T10:36:00Z"
  },
  {
    id: "mr4",
    parentId: "mn5",
    name: "Sofas & Couches",
    iconName: "home",
    status: "Active",
    createdAt: "2026-01-18T15:12:00Z"
  }
];
