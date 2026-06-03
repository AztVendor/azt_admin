export interface Vendor {
  id: string;
  name: string;
  color: string; // for UI avatar badge
  email?: string;
  phone?: string;
  contactPerson?: string;
  position?: string;
  gst?: string;
  logoUrl?: string; // base64 or url
  status?: "Active" | "Inactive";
  createdAt?: string;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  status: "Active" | "Offline" | "Delivered" | "In Delivery";
  phone: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  zip?: string;
  dob?: string;
  gender?: "Male" | "Female" | "Other";
  isCodAllowed?: boolean;
  status?: "Active" | "Inactive";
  createdAt?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  vendorId: string;
  category: string;
  imageUrl: string;
  mainCategoryId?: string;
  subCategoryId?: string;
  miniCategoryId?: string;
  macroCategoryId?: string;
  stock?: number;
  status?: "Active" | "Inactive";
  createdAt?: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  placedDate: string; // ISO String
  customer: Customer;
  vendors: Vendor[];
  deliveryPartner: DeliveryPartner | null;
  paymentStatus: "Paid" | "Pending" | "Failed" | "Refunded";
  orderStatus: "Placed" | "Packed" | "Dispatched" | "Out for Delivery" | "Delivered" | "Cancelled" | "Refunded";
  items: OrderItem[];
  totalAmount: number;
  commission: number;
  orderChannel: "Web" | "Mobile";
  fulfillmentType: "Delivery" | "Pickup" | "Self-collect";
  commissionStatus: "Calculated" | "Manually Adjusted";
  notes?: string;
}

export const VENDORS: Vendor[] = [
  { 
    id: "v1", 
    name: "Alpha Tech", 
    color: "bg-blue-500",
    email: "info@alphatech.com",
    phone: "+1 (555) 019-2834",
    contactPerson: "Albert Flores",
    position: "Manager",
    gst: "27AADCA1234F1Z5",
    status: "Active",
    createdAt: "2026-05-01T10:00:00Z"
  },
  { 
    id: "v2", 
    name: "Green Grocer", 
    color: "bg-green-500",
    email: "contact@greengrocer.com",
    phone: "+1 (555) 014-3920",
    contactPerson: "Kristin Watson",
    position: "Owner",
    gst: "27AADCA5678F1Z4",
    status: "Active",
    createdAt: "2026-05-03T11:30:00Z"
  },
  { 
    id: "v3", 
    name: "ElectroWorld", 
    color: "bg-purple-500",
    email: "support@electroworld.com",
    phone: "+1 (555) 012-9847",
    contactPerson: "Arlene McCoy",
    position: "Director",
    gst: "27AADCA9012F1Z3",
    status: "Active",
    createdAt: "2026-05-05T09:15:00Z"
  },
  { 
    id: "v4", 
    name: "Urban Threads", 
    color: "bg-pink-500",
    email: "sales@urbanthreads.com",
    phone: "+1 (555) 017-4839",
    contactPerson: "Leslie Alexander",
    position: "Manager",
    gst: "",
    status: "Inactive",
    createdAt: "2026-05-07T14:45:00Z"
  },
  { 
    id: "v5", 
    name: "Bakehouse", 
    color: "bg-amber-500",
    email: "hello@bakehouse.com",
    phone: "+1 (555) 015-8947",
    contactPerson: "Jenny Wilson",
    position: "Owner",
    gst: "27AADCA3456F1Z2",
    status: "Active",
    createdAt: "2026-05-10T08:00:00Z"
  },
];

export const DELIVERY_PARTNERS: DeliveryPartner[] = [
  { id: "dp1", name: "Robert Fox", status: "Active", phone: "+1 (555) 019-2834" },
  { id: "dp2", name: "Kristin Watson", status: "Active", phone: "+1 (555) 014-3920" },
  { id: "dp3", name: "Arlene McCoy", status: "In Delivery", phone: "+1 (555) 012-9847" },
  { id: "dp4", name: "Albert Flores", status: "Offline", phone: "+1 (555) 017-4839" },
];

export const CUSTOMERS: Customer[] = [
  { 
    id: "c1", 
    name: "Jane Cooper", 
    email: "jane.cooper@example.com", 
    phone: "+1 (555) 011-2839", 
    address: "4517 Washington Ave.", 
    city: "Manchester", 
    zip: "34892",
    dob: "1994-04-12",
    gender: "Female",
    isCodAllowed: true,
    status: "Active",
    createdAt: "2026-05-05T09:00:00Z"
  },
  { 
    id: "c2", 
    name: "Wade Warren", 
    email: "wade.warren@example.com", 
    phone: "+1 (555) 012-4820", 
    address: "1901 Thornridge Cir.", 
    city: "Shiloh", 
    zip: "84729",
    dob: "1988-11-23",
    gender: "Male",
    isCodAllowed: true,
    status: "Active",
    createdAt: "2026-05-08T11:30:00Z"
  },
  { 
    id: "c3", 
    name: "Esther Howard", 
    email: "esther.howard@example.com", 
    phone: "+1 (555) 013-9831", 
    address: "2464 Royal Ln.", 
    city: "Mesa", 
    zip: "48201",
    dob: "1991-07-04",
    gender: "Female",
    isCodAllowed: false,
    status: "Active",
    createdAt: "2026-05-12T14:15:00Z"
  },
  { 
    id: "c4", 
    name: "Cameron Williamson", 
    email: "cameron.w@example.com", 
    phone: "+1 (555) 014-2394", 
    address: "2972 Westheimer Rd.", 
    city: "Santa Ana", 
    zip: "92837",
    dob: "1985-02-18",
    gender: "Male",
    isCodAllowed: true,
    status: "Inactive",
    createdAt: "2026-05-15T10:00:00Z"
  },
  { 
    id: "c5", 
    name: "Jenny Wilson", 
    email: "jenny.w@example.com", 
    phone: "+1 (555) 015-8947", 
    address: "3517 W. Gray St.", 
    city: "Utica", 
    zip: "13502",
    dob: "1997-09-30",
    gender: "Female",
    isCodAllowed: true,
    status: "Active",
    createdAt: "2026-05-20T16:45:00Z"
  },
  { 
    id: "c6", 
    name: "Leslie Alexander", 
    email: "leslie.a@example.com", 
    phone: "+1 (555) 016-3948", 
    address: "8502 Preston Rd.", 
    city: "Inglewood", 
    zip: "90301",
    dob: "1990-12-05",
    gender: "Female",
    isCodAllowed: false,
    status: "Active",
    createdAt: "2026-05-25T08:10:00Z"
  }
];

export const PRODUCTS: Product[] = [
  { 
    id: "p1", 
    name: "Wireless Headphones X", 
    price: 120, 
    vendorId: "v1", 
    category: "Electronics", 
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&q=80&fit=crop",
    mainCategoryId: "mc1",
    subCategoryId: "sc3",
    miniCategoryId: "",
    macroCategoryId: "",
    stock: 25,
    status: "Active",
    createdAt: "2026-05-01T10:00:00Z"
  },
  { 
    id: "p2", 
    name: "Organic Avocado (Pack of 4)", 
    price: 15, 
    vendorId: "v2", 
    category: "Groceries", 
    imageUrl: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=80&q=80&fit=crop",
    mainCategoryId: "mc3",
    subCategoryId: "sc6",
    miniCategoryId: "",
    macroCategoryId: "",
    stock: 8,
    status: "Active",
    createdAt: "2026-05-03T11:30:00Z"
  },
  { 
    id: "p3", 
    name: "Mechanical Keyboard RGB", 
    price: 85, 
    vendorId: "v3", 
    category: "Electronics", 
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=80&q=80&fit=crop",
    mainCategoryId: "mc1",
    subCategoryId: "sc2",
    miniCategoryId: "mn4",
    macroCategoryId: "",
    stock: 12,
    status: "Active",
    createdAt: "2026-05-05T09:15:00Z"
  },
  { 
    id: "p4", 
    name: "Oversized Cotton Hoodie", 
    price: 45, 
    vendorId: "v4", 
    category: "Apparel", 
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=80&q=80&fit=crop",
    mainCategoryId: "mc2",
    subCategoryId: "sc4",
    miniCategoryId: "",
    macroCategoryId: "",
    stock: 3,
    status: "Inactive",
    createdAt: "2026-05-07T14:45:00Z"
  },
  { 
    id: "p5", 
    name: "Sourdough Bread loaf", 
    price: 6, 
    vendorId: "v5", 
    category: "Bakery", 
    imageUrl: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=80&q=80&fit=crop",
    mainCategoryId: "mc3",
    subCategoryId: "sc6",
    miniCategoryId: "",
    macroCategoryId: "",
    stock: 0,
    status: "Active",
    createdAt: "2026-05-10T08:00:00Z"
  },
  { 
    id: "p6", 
    name: "Smart Watch Series 5", 
    price: 299, 
    vendorId: "v1", 
    category: "Electronics", 
    imageUrl: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=80&q=80&fit=crop",
    mainCategoryId: "mc1",
    subCategoryId: "sc1",
    miniCategoryId: "mn1",
    macroCategoryId: "mr2",
    stock: 50,
    status: "Active",
    createdAt: "2026-05-12T10:15:00Z"
  },
  { 
    id: "p7", 
    name: "Organic Bananas (1kg)", 
    price: 4, 
    vendorId: "v2", 
    category: "Groceries", 
    imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=80&q=80&fit=crop",
    mainCategoryId: "mc3",
    subCategoryId: "sc6",
    miniCategoryId: "",
    macroCategoryId: "",
    stock: 15,
    status: "Active",
    createdAt: "2026-05-15T10:30:00Z"
  },
  { 
    id: "p8", 
    name: "Ergonomic Office Chair", 
    price: 180, 
    vendorId: "v3", 
    category: "Furniture", 
    imageUrl: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=80&q=80&fit=crop",
    mainCategoryId: "mc4",
    subCategoryId: "sc7",
    miniCategoryId: "mn5",
    macroCategoryId: "mr4",
    stock: 4,
    status: "Active",
    createdAt: "2026-05-18T11:00:00Z"
  },
  { 
    id: "p9", 
    name: "Gaming Laptop Pro", 
    price: 1499, 
    vendorId: "v1", 
    category: "Electronics", 
    imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=80&q=80&fit=crop",
    mainCategoryId: "mc1",
    subCategoryId: "sc2",
    miniCategoryId: "mn3",
    macroCategoryId: "mr3",
    stock: 9,
    status: "Active",
    createdAt: "2026-05-20T12:00:00Z"
  },
  { 
    id: "p10", 
    name: "Leather Shoulder Bag", 
    price: 95, 
    vendorId: "v4", 
    category: "Fashion", 
    imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=80&q=80&fit=crop",
    mainCategoryId: "mc2",
    subCategoryId: "sc5",
    miniCategoryId: "",
    macroCategoryId: "",
    stock: 18,
    status: "Active",
    createdAt: "2026-05-22T15:00:00Z"
  },
  { 
    id: "p11", 
    name: "Modern Dining Table", 
    price: 450, 
    vendorId: "v3", 
    category: "Furniture", 
    imageUrl: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=80&q=80&fit=crop",
    mainCategoryId: "mc4",
    subCategoryId: "sc7",
    miniCategoryId: "",
    macroCategoryId: "",
    stock: 2,
    status: "Active",
    createdAt: "2026-05-24T09:30:00Z"
  },
  { 
    id: "p12", 
    name: "Gourmet Coffee Beans", 
    price: 18, 
    vendorId: "v2", 
    category: "Groceries", 
    imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=80&q=80&fit=crop",
    mainCategoryId: "mc3",
    subCategoryId: "sc6",
    miniCategoryId: "",
    macroCategoryId: "",
    stock: 35,
    status: "Active",
    createdAt: "2026-05-25T15:15:00Z"
  },
  { 
    id: "p13", 
    name: "Designer Sun Glasses", 
    price: 65, 
    vendorId: "v4", 
    category: "Fashion", 
    imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=80&q=80&fit=crop",
    mainCategoryId: "mc2",
    subCategoryId: "sc5",
    miniCategoryId: "",
    macroCategoryId: "",
    stock: 11,
    status: "Inactive",
    createdAt: "2026-05-26T16:20:00Z"
  },
  { 
    id: "p14", 
    name: "Noise Cancelling Earbuds", 
    price: 79, 
    vendorId: "v3", 
    category: "Electronics", 
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=80&q=80&fit=crop",
    mainCategoryId: "mc1",
    subCategoryId: "sc3",
    miniCategoryId: "",
    macroCategoryId: "",
    stock: 40,
    status: "Active",
    createdAt: "2026-05-27T10:45:00Z"
  },
  { 
    id: "p15", 
    name: "Non-Stick Cookware Set", 
    price: 110, 
    vendorId: "v5", 
    category: "Kitchenware", 
    imageUrl: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=80&q=80&fit=crop",
    mainCategoryId: "mc4",
    subCategoryId: "sc8",
    miniCategoryId: "",
    macroCategoryId: "",
    stock: 7,
    status: "Active",
    createdAt: "2026-05-28T14:10:00Z"
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-9283",
    placedDate: "2026-05-31T14:32:00Z",
    customer: CUSTOMERS[0],
    vendors: [VENDORS[0], VENDORS[2]],
    deliveryPartner: DELIVERY_PARTNERS[0],
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    items: [
      { product: PRODUCTS[0], quantity: 1 },
      { product: PRODUCTS[2], quantity: 1 }
    ],
    totalAmount: 205,
    commission: 20.5,
    orderChannel: "Web",
    fulfillmentType: "Delivery",
    commissionStatus: "Calculated",
    notes: "Leave package at the doorstep, please."
  },
  {
    id: "ORD-9284",
    placedDate: "2026-06-01T08:15:00Z",
    customer: CUSTOMERS[1],
    vendors: [VENDORS[1]],
    deliveryPartner: DELIVERY_PARTNERS[1],
    paymentStatus: "Paid",
    orderStatus: "Out for Delivery",
    items: [
      { product: PRODUCTS[1], quantity: 3 },
      { product: PRODUCTS[6], quantity: 2 }
    ],
    totalAmount: 53,
    commission: 5.3,
    orderChannel: "Mobile",
    fulfillmentType: "Delivery",
    commissionStatus: "Calculated"
  },
  {
    id: "ORD-9285",
    placedDate: "2026-06-01T09:45:00Z",
    customer: CUSTOMERS[2],
    vendors: [VENDORS[3], VENDORS[4]],
    deliveryPartner: null,
    paymentStatus: "Pending",
    orderStatus: "Placed",
    items: [
      { product: PRODUCTS[3], quantity: 2 },
      { product: PRODUCTS[4], quantity: 1 }
    ],
    totalAmount: 96,
    commission: 9.6,
    orderChannel: "Web",
    fulfillmentType: "Pickup",
    commissionStatus: "Calculated",
    notes: "Will pick up around 5:00 PM."
  },
  {
    id: "ORD-9286",
    placedDate: "2026-05-30T16:20:00Z",
    customer: CUSTOMERS[3],
    vendors: [VENDORS[0]],
    deliveryPartner: DELIVERY_PARTNERS[2],
    paymentStatus: "Paid",
    orderStatus: "Dispatched",
    items: [
      { product: PRODUCTS[5], quantity: 1 }
    ],
    totalAmount: 299,
    commission: 25.0,
    orderChannel: "Mobile",
    fulfillmentType: "Delivery",
    commissionStatus: "Manually Adjusted",
    notes: "VIP Customer - applied manual 25$ fixed commission caps."
  },
  {
    id: "ORD-9287",
    placedDate: "2026-05-29T11:05:00Z",
    customer: CUSTOMERS[4],
    vendors: [VENDORS[1], VENDORS[4]],
    deliveryPartner: null,
    paymentStatus: "Failed",
    orderStatus: "Cancelled",
    items: [
      { product: PRODUCTS[1], quantity: 1 },
      { product: PRODUCTS[4], quantity: 2 }
    ],
    totalAmount: 27,
    commission: 2.7,
    orderChannel: "Web",
    fulfillmentType: "Self-collect",
    commissionStatus: "Calculated"
  },
  {
    id: "ORD-9288",
    placedDate: "2026-06-01T11:10:00Z",
    customer: CUSTOMERS[5],
    vendors: [VENDORS[2]],
    deliveryPartner: null,
    paymentStatus: "Paid",
    orderStatus: "Packed",
    items: [
      { product: PRODUCTS[7], quantity: 1 }
    ],
    totalAmount: 180,
    commission: 18.0,
    orderChannel: "Web",
    fulfillmentType: "Delivery",
    commissionStatus: "Calculated"
  },
  {
    id: "ORD-9289",
    placedDate: "2026-05-28T15:00:00Z",
    customer: CUSTOMERS[0],
    vendors: [VENDORS[4]],
    deliveryPartner: DELIVERY_PARTNERS[3],
    paymentStatus: "Refunded",
    orderStatus: "Refunded",
    items: [
      { product: PRODUCTS[4], quantity: 5 }
    ],
    totalAmount: 30,
    commission: 3.0,
    orderChannel: "Mobile",
    fulfillmentType: "Delivery",
    commissionStatus: "Calculated",
    notes: "Refunded due to item stock issue."
  },
  {
    id: "ORD-9290",
    placedDate: "2026-05-31T17:40:00Z",
    customer: CUSTOMERS[2],
    vendors: [VENDORS[0]],
    deliveryPartner: null,
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    items: [
      { product: PRODUCTS[0], quantity: 2 }
    ],
    totalAmount: 240,
    commission: 24.0,
    orderChannel: "Mobile",
    fulfillmentType: "Pickup",
    commissionStatus: "Calculated"
  },
  {
    id: "ORD-9291",
    placedDate: "2026-06-01T12:00:00Z",
    customer: CUSTOMERS[3],
    vendors: [VENDORS[3]],
    deliveryPartner: null,
    paymentStatus: "Pending",
    orderStatus: "Placed",
    items: [
      { product: PRODUCTS[3], quantity: 1 }
    ],
    totalAmount: 45,
    commission: 4.5,
    orderChannel: "Web",
    fulfillmentType: "Delivery",
    commissionStatus: "Calculated"
  },
  {
    id: "ORD-9292",
    placedDate: "2026-05-30T10:00:00Z",
    customer: CUSTOMERS[1],
    vendors: [VENDORS[2]],
    deliveryPartner: DELIVERY_PARTNERS[1],
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    items: [
      { product: PRODUCTS[2], quantity: 2 }
    ],
    totalAmount: 170,
    commission: 17.0,
    orderChannel: "Web",
    fulfillmentType: "Delivery",
    commissionStatus: "Calculated"
  }
];
