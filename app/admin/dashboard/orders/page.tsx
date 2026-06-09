"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  MOCK_ORDERS,
  VENDORS,
  DELIVERY_PARTNERS,
  CUSTOMERS,
  PRODUCTS,
  Order,
  Product,
  Customer,
  OrderItem,
  Vendor,
  DeliveryPartner
} from "./data";
import LeftSidebar from "@/components/LeftSidebar";
import { INITIAL_ADMINS } from "../admins/data";

export default function OrdersPage() {
  // Page States
    const [pagePermission, setPagePermission] = useState<"view" | "update" | "create" | null>("create");
  useEffect(() => {
    const storedAdmins = localStorage.getItem("stark_admins_list");
    const storedActiveId = localStorage.getItem("stark_active_admin_id");
    let currentAdmins = INITIAL_ADMINS;
    if (storedAdmins) {
      try { currentAdmins = JSON.parse(storedAdmins); } catch(e) {}
    }
    const selectedAdmin = currentAdmins.find(a => a.id === storedActiveId && a.status === "Active") || currentAdmins[0];
    if (selectedAdmin) {
      if (selectedAdmin.id === "adm1") {
        setPagePermission("create");
      } else {
        setPagePermission(selectedAdmin.permissions.orders || null);
      }
    }
  }, []);

const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPayment, setSelectedPayment] = useState<string>("all");
  const [selectedFulfillment, setSelectedFulfillment] = useState<string>("all");
  const [selectedChannel, setSelectedChannel] = useState<string>("all");
  const [minAmount, setMinAmount] = useState<number | "">("");
  const [maxAmount, setMaxAmount] = useState<number | "">("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Presets & Sorting
  const [presetTab, setPresetTab] = useState<"all" | "pending" | "paid" | "refunded" | "cancelled">("all");
  const [sortBy, setSortBy] = useState<keyof Order>("placedDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected Order for Details Drawer
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Add Order Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addOrderStep, setAddOrderStep] = useState(1);
  
  // New Order Form state
  const [customerType, setCustomerType] = useState<"existing" | "new">("existing");
  const [selectedCustomerId, setSelectedCustomerId] = useState(CUSTOMERS[0].id);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerEmail, setNewCustomerEmail] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  
  const [cartItems, setCartItems] = useState<{ product: Product; quantity: number }[]>([]);
  const [searchProductQuery, setSearchProductQuery] = useState("");
  
  const [fulfillmentType, setFulfillmentType] = useState<"Delivery" | "Pickup" | "Self-collect">("Delivery");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  
  const [paymentStatus, setPaymentStatus] = useState<"Paid" | "Pending">("Pending");
  const [orderChannel, setOrderChannel] = useState<"Web" | "Mobile">("Web");
  const [orderNotes, setOrderNotes] = useState("");

  // Quick preset filters
  const applyPreset = (preset: string) => {
    resetFilters();
    if (preset === "pending_delivery") {
      setPresetTab("pending");
      setSelectedStatus("Placed");
      setSelectedFulfillment("Delivery");
    } else if (preset === "unpaid_cod") {
      setSelectedPayment("Pending");
    } else if (preset === "high_value") {
      setMinAmount(200);
    } else if (preset === "completed_today") {
      setSelectedStatus("Delivered");
    }
  };

  // Reset Filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedVendors([]);
    setSelectedStatus("all");
    setSelectedPayment("all");
    setSelectedFulfillment("all");
    setSelectedChannel("all");
    setMinAmount("");
    setMaxAmount("");
    setStartDate("");
    setEndDate("");
    setPresetTab("all");
    setCurrentPage(1);
  };

  // Toggle Vendor Filter
  const toggleVendorFilter = (vendorId: string) => {
    if (selectedVendors.includes(vendorId)) {
      setSelectedVendors(selectedVendors.filter(v => v !== vendorId));
    } else {
      setSelectedVendors([...selectedVendors, vendorId]);
    }
    setCurrentPage(1);
  };

  // Filtered Orders Memo
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // 1. Search Query (Order ID or Customer Name)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesId = order.id.toLowerCase().includes(query);
        const matchesCustomer = order.customer.name.toLowerCase().includes(query);
        if (!matchesId && !matchesCustomer) return false;
      }

      // 2. Preset Tabs
      if (presetTab !== "all") {
        if (presetTab === "pending" && !["Placed", "Packed", "Dispatched", "Out for Delivery"].includes(order.orderStatus)) return false;
        if (presetTab === "paid" && order.paymentStatus !== "Paid") return false;
        if (presetTab === "refunded" && order.paymentStatus !== "Refunded") return false;
        if (presetTab === "cancelled" && order.orderStatus !== "Cancelled") return false;
      }

      // 3. Status Dropdown
      if (selectedStatus !== "all" && order.orderStatus !== selectedStatus) return false;

      // 4. Payment Dropdown
      if (selectedPayment !== "all" && order.paymentStatus !== selectedPayment) return false;

      // 5. Fulfillment Dropdown
      if (selectedFulfillment !== "all" && order.fulfillmentType !== selectedFulfillment) return false;

      // 6. Channel Dropdown
      if (selectedChannel !== "all" && order.orderChannel !== selectedChannel) return false;

      // 7. Vendor Selection
      if (selectedVendors.length > 0) {
        const orderVendorIds = order.vendors.map(v => v.id);
        const matchesVendor = selectedVendors.some(id => orderVendorIds.includes(id));
        if (!matchesVendor) return false;
      }

      // 8. Amount Range
      if (minAmount !== "" && order.totalAmount < minAmount) return false;
      if (maxAmount !== "" && order.totalAmount > maxAmount) return false;

      // 9. Date Range
      if (startDate) {
        const orderDate = new Date(order.placedDate);
        const start = new Date(startDate);
        start.setHours(0,0,0,0);
        if (orderDate < start) return false;
      }
      if (endDate) {
        const orderDate = new Date(order.placedDate);
        const end = new Date(endDate);
        end.setHours(23,59,59,999);
        if (orderDate > end) return false;
      }

      return true;
    }).sort((a, b) => {
      // Sorting
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === "customer") {
        valA = a.customer.name;
        valB = b.customer.name;
      }

      if (valA === undefined || valA === null) return sortOrder === "asc" ? -1 : 1;
      if (valB === undefined || valB === null) return sortOrder === "asc" ? 1 : -1;

      if (typeof valA === "string" && typeof valB === "string") {
        return sortOrder === "asc" 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }

      return sortOrder === "asc"
        ? (valA as number) - (valB as number)
        : (valB as number) - (valA as number);
    });
  }, [orders, searchQuery, selectedVendors, selectedStatus, selectedPayment, selectedFulfillment, selectedChannel, minAmount, maxAmount, startDate, endDate, presetTab, sortBy, sortOrder]);

  // Pagination computations
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Sort Handler
  const handleSort = (field: keyof Order) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Bulk Actions
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const pageIds = paginatedOrders.map(o => o.id);
      setSelectedOrders(Array.from(new Set([...selectedOrders, ...pageIds])));
    } else {
      const pageIds = paginatedOrders.map(o => o.id);
      setSelectedOrders(selectedOrders.filter(id => !pageIds.includes(id)));
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    }
  };

  const executeBulkStatusChange = (newStatus: Order["orderStatus"]) => {
    setOrders(prev => 
      prev.map(o => selectedOrders.includes(o.id) ? { ...o, orderStatus: newStatus } : o)
    );
    setSelectedOrders([]);
  };

  // Action Menu Handlers
  const handleOpenDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order["orderStatus"]) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: status } : o));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, orderStatus: status } : null);
    }
  };

  const handleUpdatePaymentStatus = (orderId: string, payment: Order["paymentStatus"]) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: payment } : o));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, paymentStatus: payment } : null);
    }
  };

  const handleAssignDeliveryPartner = (orderId: string, partnerId: string) => {
    const partner = DELIVERY_PARTNERS.find(p => p.id === partnerId) || null;
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, deliveryPartner: partner } : o));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, deliveryPartner: partner } : null);
    }
  };

  const handleCancelOrder = (orderId: string) => {
    handleUpdateOrderStatus(orderId, "Cancelled");
  };

  const handleRefundOrder = (orderId: string) => {
    handleUpdateOrderStatus(orderId, "Refunded");
    handleUpdatePaymentStatus(orderId, "Refunded");
  };

  // Mock Export CSV function
  const handleExportCSV = () => {
    const headers = ["Order ID", "Placed Date", "Customer Name", "Customer Email", "Vendors", "Total Amount", "Commission", "Fulfillment", "Payment Status", "Order Status"];
    const rows = filteredOrders.map(o => [
      o.id,
      new Date(o.placedDate).toLocaleDateString(),
      o.customer.name,
      o.customer.email,
      o.vendors.map(v => v.name).join("; "),
      o.totalAmount,
      o.commission,
      o.fulfillmentType,
      o.paymentStatus,
      o.orderStatus
    ]);

    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Stark_Orders_Export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadTxtInvoice = (order: Order) => {
    const divider = "==================================================";
    const subDivider = "--------------------------------------------------";
    
    const deliveryFee = order.fulfillmentType === "Delivery" ? 5 : 0;
    const tax = Math.round(order.commission * 0.8 * 100) / 100;
    const subtotal = Math.round((order.totalAmount - deliveryFee - tax) * 100) / 100;
    
    let txt = "";
    txt += divider + "\n";
    txt += "              STARK MULTIVENDOR RECEIPT           \n";
    txt += divider + "\n";
    txt += `Invoice Ref: INV-${order.id.replace("ORD-", "")}\n`;
    txt += `Order ID:    ${order.id}\n`;
    txt += `Placed Date: ${new Date(order.placedDate).toLocaleString()}\n`;
    txt += `Fulfillment: ${order.fulfillmentType}\n`;
    txt += `Payment Mode: COD / Card\n`;
    txt += `Payment Status: ${order.paymentStatus}\n`;
    txt += `Order Status:   ${order.orderStatus}\n`;
    txt += subDivider + "\n";
    txt += "BILL TO:\n";
    txt += `Name:    ${order.customer.name}\n`;
    txt += `Email:   ${order.customer.email}\n`;
    txt += `Phone:   ${order.customer.phone}\n`;
    txt += `Address: ${order.customer.address || ""}, ${order.customer.city || ""}, ${order.customer.zip || ""}\n`;
    txt += subDivider + "\n";
    txt += "ITEMS:\n";
    txt += "Qty  Item Name                    Vendor     Price\n";
    txt += subDivider + "\n";
    
    order.items.forEach(item => {
      const qtyStr = String(item.quantity).padEnd(4);
      const nameStr = item.product.name.substring(0, 24).padEnd(25);
      const vendor = VENDORS.find(v => v.id === item.product.vendorId);
      const vendorName = (vendor?.name || item.product.vendorId).substring(0, 9).padEnd(10);
      const priceStr = `$${(item.product.price * item.quantity).toFixed(2)}`.padStart(8);
      txt += `${qtyStr}${nameStr}${vendorName}${priceStr}\n`;
    });
    
    txt += subDivider + "\n";
    txt += `Subtotal:`.padEnd(40) + `$${subtotal.toFixed(2)}`.padStart(10) + "\n";
    txt += `Tax (8%):`.padEnd(40) + `$${tax.toFixed(2)}`.padStart(10) + "\n";
    txt += `Delivery/Pickup Fee:`.padEnd(40) + `$${deliveryFee.toFixed(2)}`.padStart(10) + "\n";
    txt += subDivider + "\n";
    txt += `GRAND TOTAL:`.padEnd(40) + `$${order.totalAmount.toFixed(2)}`.padStart(10) + "\n";
    txt += divider + "\n";
    txt += "            THANK YOU FOR SHOPPING WITH US!       \n";
    txt += divider + "\n";
    
    const blob = new Blob([txt], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Invoice_INV_${order.id.replace("ORD-", "")}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadHtmlInvoice = (order: Order) => {
    const deliveryFee = order.fulfillmentType === "Delivery" ? 5 : 0;
    const tax = Math.round(order.commission * 0.8 * 100) / 100;
    const subtotal = Math.round((order.totalAmount - deliveryFee - tax) * 100) / 100;
    
    let itemsRows = "";
    order.items.forEach(item => {
      const vendor = VENDORS.find(v => v.id === item.product.vendorId);
      const vendorName = vendor?.name || item.product.vendorId;
      itemsRows += `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600;">${item.product.name}</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #4b5563;">${item.product.category}</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #4b5563;">${vendorName}</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">$${item.product.price.toFixed(2)}</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">${item.quantity}</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; text-align: right; font-weight: 600;">$${(item.product.price * item.quantity).toFixed(2)}</td>
        </tr>
      `;
    });

    const paymentBadgeClass = order.paymentStatus === "Paid" ? "badge-paid" 
      : order.paymentStatus === "Pending" ? "badge-pending" 
      : order.paymentStatus === "Refunded" ? "badge-refunded" : "badge-failed";

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice - INV-${order.id.replace("ORD-", "")}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #111827; line-height: 1.5; padding: 40px; background-color: #f9fafb; margin: 0; }
    .invoice-card { max-width: 800px; margin: 0 auto; background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f3f4f6; padding-bottom: 24px; margin-bottom: 24px; }
    .logo { font-size: 24px; font-weight: 900; letter-spacing: -0.05em; color: #111827; text-transform: uppercase; }
    .meta { text-align: right; }
    .title { font-size: 20px; font-weight: 800; color: #111827; margin: 0 0 8px 0; }
    .meta-text { font-size: 13px; color: #4b5563; margin: 2px 0; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; margin-top: 16px; }
    .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #9ca3af; letter-spacing: 0.05em; margin-bottom: 6px; }
    .info-block p { margin: 2px 0; font-size: 14px; color: #374151; }
    .table { width: 100%; border-collapse: collapse; margin-bottom: 32px; margin-top: 16px; }
    .table th { text-align: left; padding: 10px 0; border-bottom: 2px solid #f3f4f6; font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; }
    .financials { display: flex; flex-direction: column; align-items: flex-end; margin-bottom: 24px; }
    .fin-row { display: flex; justify-content: space-between; width: 280px; font-size: 13.5px; padding: 5px 0; color: #4b5563; }
    .fin-total { border-top: 2px solid #111827; margin-top: 10px; padding-top: 10px; font-weight: 900; font-size: 16.5px; color: #111827; }
    .badge { display: inline-block; padding: 3px 8px; font-size: 10px; font-weight: 700; border-radius: 4px; border: 1px solid; margin-top: 4px; text-transform: uppercase; }
    .badge-paid { background-color: #ecfdf5; border-color: #a7f3d0; color: #047857; }
    .badge-pending { background-color: #fffbeb; border-color: #fde68a; color: #b45309; }
    .badge-failed { background-color: #fef2f2; border-color: #fecaca; color: #b91c1c; }
    .badge-refunded { background-color: #f0fdfa; border-color: #ccfbf1; color: #0f766e; }
    .footer-text { text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 24px; margin-top: 32px; }
    @media print {
      body { background-color: white; padding: 0; }
      .invoice-card { border: none; box-shadow: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header">
      <div>
        <div class="logo">Stark Multivendor</div>
        <p class="meta-text" style="margin-top: 6px;">stark-multivendor.com</p>
      </div>
      <div class="meta">
        <h2 class="title">INVOICE</h2>
        <p class="meta-text" style="font-weight: 700;">INV-${order.id.replace("ORD-", "")}</p>
        <p class="meta-text">Placed Date: ${new Date(order.placedDate).toLocaleDateString()}</p>
        <span class="badge ${paymentBadgeClass}">${order.paymentStatus}</span>
      </div>
    </div>
    
    <div class="grid">
      <div class="info-block">
        <div class="section-title">Bill To</div>
        <p style="font-weight: 700; color: #111827;">${order.customer.name}</p>
        <p>${order.customer.email}</p>
        <p>${order.customer.phone}</p>
        <p style="margin-top: 4px;">${order.customer.address || ""}</p>
        <p>${order.customer.city || ""}, ${order.customer.zip || ""}</p>
      </div>
      <div class="info-block">
        <div class="section-title">Order Info</div>
        <p><strong>Order Reference:</strong> ${order.id}</p>
        <p><strong>Fulfillment Method:</strong> ${order.fulfillmentType}</p>
        <p><strong>Fulfillment Status:</strong> ${order.orderStatus}</p>
        <p><strong>Payment Method:</strong> COD / Card</p>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th style="width: 35%;">Product</th>
          <th style="width: 15%;">Category</th>
          <th style="width: 20%;">Vendor</th>
          <th style="width: 10%;">Price</th>
          <th style="width: 10%;">Qty</th>
          <th style="width: 10%; text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>

    <div class="financials">
      <div class="fin-row">
        <span>Subtotal</span>
        <span>$${subtotal.toFixed(2)}</span>
      </div>
      <div class="fin-row">
        <span>Tax (8%)</span>
        <span>$${tax.toFixed(2)}</span>
      </div>
      <div class="fin-row">
        <span>Delivery/Pickup Fee</span>
        <span>$${deliveryFee.toFixed(2)}</span>
      </div>
      <div class="fin-row fin-total">
        <span>Grand Total</span>
        <span>$${order.totalAmount.toFixed(2)}</span>
      </div>
    </div>

    <div class="footer-text">
      Thank you for shopping with Stark Multivendor Platform. For support, please contact info@stark-multivendor.com
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Invoice_INV_${order.id.replace("ORD-", "")}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Cart / Product Adding in Manual Flow
  const filteredProducts = useMemo(() => {
    if (!searchProductQuery) return PRODUCTS;
    return PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(searchProductQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchProductQuery.toLowerCase())
    );
  }, [searchProductQuery]);

  const addToCart = (product: Product) => {
    const existing = cartItems.find(item => item.product.id === product.id);
    if (existing) {
      setCartItems(cartItems.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { product, quantity: 1 }]);
    }
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(cartItems.filter(item => item.product.id !== productId));
    } else {
      setCartItems(cartItems.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      ));
    }
  };

  // Calculations for Add Order step 5
  const newOrderCalculations = useMemo(() => {
    const subtotal = cartItems.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0);
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const deliveryFee = fulfillmentType === "Delivery" ? 5 : 0;
    const totalAmount = subtotal + tax + deliveryFee;
    const commission = Math.round(subtotal * 0.1 * 100) / 100; // 10% standard commission

    // Identify vendors in cart
    const vendorIds = Array.from(new Set(cartItems.map(item => item.product.vendorId)));
    const selectedOrderVendors = VENDORS.filter(v => vendorIds.includes(v.id));

    return {
      subtotal,
      tax,
      deliveryFee,
      totalAmount,
      commission,
      vendors: selectedOrderVendors
    };
  }, [cartItems, fulfillmentType]);

  // Submit Order Creation
  const handleCreateManualOrder = () => {
    // 1. Get customer
    let activeCustomer: Customer;
    if (customerType === "existing") {
      activeCustomer = CUSTOMERS.find(c => c.id === selectedCustomerId) || CUSTOMERS[0];
    } else {
      activeCustomer = {
        id: `c-manual-${Date.now()}`,
        name: newCustomerName,
        email: newCustomerEmail || "no-email@example.com",
        phone: newCustomerPhone || "+1 (555) 000-0000",
        address: address || "No address provided",
        city: city || "Unknown",
        zip: zip || "00000"
      };
    }

    const { totalAmount, commission, vendors } = newOrderCalculations;

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      placedDate: new Date().toISOString(),
      customer: activeCustomer,
      vendors: vendors.length > 0 ? vendors : [VENDORS[0]],
      deliveryPartner: null,
      paymentStatus: paymentStatus,
      orderStatus: "Placed",
      items: cartItems,
      totalAmount,
      commission,
      orderChannel,
      fulfillmentType,
      commissionStatus: "Calculated",
      notes: orderNotes
    };

    setOrders([newOrder, ...orders]);
    setIsAddModalOpen(false);
    resetManualOrderForm();
  };

  const resetManualOrderForm = () => {
    setAddOrderStep(1);
    setCustomerType("existing");
    setSelectedCustomerId(CUSTOMERS[0].id);
    setNewCustomerName("");
    setNewCustomerEmail("");
    setNewCustomerPhone("");
    setCartItems([]);
    setSearchProductQuery("");
    setFulfillmentType("Delivery");
    setAddress("");
    setCity("");
    setZip("");
    setPaymentStatus("Pending");
    setOrderChannel("Web");
    setOrderNotes("");
  };

  // Quick validation helpers for Add Order steps
  const isStep1Valid = customerType === "existing" ? !!selectedCustomerId : (!!newCustomerName);
  const isStep2Valid = cartItems.length > 0;
  const isStep3Valid = fulfillmentType !== "Delivery" || (!!address && !!city && !!zip);

  return (
    <div className="flex min-h-screen w-full bg-[#F9FAFB] text-[#1F2937] font-sans overflow-x-hidden">
      
      <LeftSidebar activePage="orders" isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

  {pagePermission === null ? (
    <main className="ml-0 md:ml-64 flex-1 p-6 md:p-8 flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-150 p-8 shadow-lg text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h3>
        <p className="text-sm text-gray-500 mb-6">
          You do not have permissions to view this module. Please switch to an admin profile that has view, edit, or create access.
        </p>
      </div>
    </main>
  ) : (
  /* BEGIN: MainContent */
      <main className="ml-0 md:ml-64 flex-1 min-w-0 w-full p-4 md:p-8 min-h-screen transition-all duration-300">
        {/* Mobile Header Bar */}
        <div className="flex md:hidden items-center justify-between bg-white border border-gray-200 p-4 rounded-xl mb-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-stark-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">S</div>
            <span className="font-bold text-sm">Stark Orders</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded hover:bg-gray-100 text-stark-muted"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
        </div>
        
        {/* BEGIN: ContentHeader */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8" data-purpose="page-header">
          <div>
            <h2 className="text-2xl font-bold">Order Management</h2>
            <p className="text-sm text-stark-muted">
              Oversee marketplace orders, filter results, and create manual admin orders.
            </p>
          </div>
          {pagePermission === "create" && (<button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-stark-primary hover:bg-stark-dark text-white px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-all shadow-sm font-medium text-sm shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <span>Add Order</span>
          </button>)}
        </header>
        {/* END: ContentHeader */}

        {/* BEGIN: Stats Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs text-stark-muted font-medium mb-1">Total Orders</p>
            <h3 className="text-2xl font-bold">{orders.length}</h3>
            <p className="text-[10px] text-green-600 mt-1 font-semibold">100% Marketplace</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs text-stark-muted font-medium mb-1">Pending Fulfillment</p>
            <h3 className="text-2xl font-bold text-amber-600">
              {orders.filter(o => ["Placed", "Packed", "Dispatched", "Out for Delivery"].includes(o.orderStatus)).length}
            </h3>
            <p className="text-[10px] text-stark-muted mt-1">Requires admin review</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs text-stark-muted font-medium mb-1">Delivered Orders</p>
            <h3 className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.orderStatus === "Delivered").length}
            </h3>
            <p className="text-[10px] text-green-600 mt-1 font-semibold">✓ 98.4% Fulfillment rate</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs text-stark-muted font-medium mb-1">Total Order Value</p>
            <h3 className="text-2xl font-bold text-stark-primary">
              ${orders.reduce((acc, o) => acc + (o.orderStatus !== "Cancelled" ? o.totalAmount : 0), 0).toLocaleString()}
            </h3>
            <p className="text-[10px] text-stark-muted mt-1">Excludes cancelled orders</p>
          </div>
        </div>
        {/* END: Stats Summary Cards */}

        {/* BEGIN: Filter Presets Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 mb-6 gap-6 whitespace-nowrap pb-1">
          <button
            onClick={() => setPresetTab("all")}
            className={`pb-3 font-semibold text-sm transition-all relative ${
              presetTab === "all" ? "text-stark-primary" : "text-stark-muted hover:text-stark-text"
            }`}
          >
            All Orders ({orders.length})
            {presetTab === "all" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stark-primary"></span>}
          </button>
          <button
            onClick={() => setPresetTab("pending")}
            className={`pb-3 font-semibold text-sm transition-all relative ${
              presetTab === "pending" ? "text-stark-primary" : "text-stark-muted hover:text-stark-text"
            }`}
          >
            Pending ({orders.filter(o => ["Placed", "Packed", "Dispatched", "Out for Delivery"].includes(o.orderStatus)).length})
            {presetTab === "pending" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stark-primary"></span>}
          </button>
          <button
            onClick={() => setPresetTab("paid")}
            className={`pb-3 font-semibold text-sm transition-all relative ${
              presetTab === "paid" ? "text-stark-primary" : "text-stark-muted hover:text-stark-text"
            }`}
          >
            Paid ({orders.filter(o => o.paymentStatus === "Paid").length})
            {presetTab === "paid" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stark-primary"></span>}
          </button>
          <button
            onClick={() => setPresetTab("refunded")}
            className={`pb-3 font-semibold text-sm transition-all relative ${
              presetTab === "refunded" ? "text-stark-primary" : "text-stark-muted hover:text-stark-text"
            }`}
          >
            Refunded ({orders.filter(o => o.paymentStatus === "Refunded").length})
            {presetTab === "refunded" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stark-primary"></span>}
          </button>
          <button
            onClick={() => setPresetTab("cancelled")}
            className={`pb-3 font-semibold text-sm transition-all relative ${
              presetTab === "cancelled" ? "text-stark-primary" : "text-stark-muted hover:text-stark-text"
            }`}
          >
            Cancelled ({orders.filter(o => o.orderStatus === "Cancelled").length})
            {presetTab === "cancelled" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stark-primary"></span>}
          </button>
        </div>
        {/* END: Filter Presets Tabs */}

        {/* BEGIN: Saved Preset Quick Buttons */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs text-stark-muted font-medium">Quick Filters:</span>
          <button 
            onClick={() => applyPreset("pending_delivery")}
            className="text-xs bg-white hover:bg-stark-accent text-stark-text border border-gray-200 px-3 py-1 rounded-full transition-colors"
          >
            ⚡ Pending Delivery
          </button>
          <button 
            onClick={() => applyPreset("unpaid_cod")}
            className="text-xs bg-white hover:bg-stark-accent text-stark-text border border-gray-200 px-3 py-1 rounded-full transition-colors"
          >
            💵 Unpaid / COD
          </button>
          <button 
            onClick={() => applyPreset("high_value")}
            className="text-xs bg-white hover:bg-stark-accent text-stark-text border border-gray-200 px-3 py-1 rounded-full transition-colors"
          >
            💎 High Value (&gt;$200)
          </button>
          <button 
            onClick={() => applyPreset("completed_today")}
            className="text-xs bg-white hover:bg-stark-accent text-stark-text border border-gray-200 px-3 py-1 rounded-full transition-colors"
          >
            ✅ Completed Orders
          </button>
        </div>
        {/* END: Saved Preset Quick Buttons */}

        {/* BEGIN: Filter Panel Box */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            
            {/* Search Input */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-stark-muted">Search Orders</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Order ID, Customer Name..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-stark-primary focus:ring-2 focus:ring-stark-primary/10 transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Status Dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-stark-muted">Order Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg text-sm focus:outline-none focus:border-stark-primary focus:ring-2 focus:ring-stark-primary/10 transition-all"
              >
                <option value="all">All Statuses</option>
                <option value="Placed">Placed</option>
                <option value="Packed">Packed</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            {/* Payment Dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-stark-muted">Payment Status</label>
              <select
                value={selectedPayment}
                onChange={(e) => { setSelectedPayment(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg text-sm focus:outline-none focus:border-stark-primary focus:ring-2 focus:ring-stark-primary/10 transition-all"
              >
                <option value="all">All Payments</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            {/* Fulfillment Dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-stark-muted">Fulfillment Type</label>
              <select
                value={selectedFulfillment}
                onChange={(e) => { setSelectedFulfillment(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg text-sm focus:outline-none focus:border-stark-primary focus:ring-2 focus:ring-stark-primary/10 transition-all"
              >
                <option value="all">All Fulfillments</option>
                <option value="Delivery">Delivery</option>
                <option value="Pickup">Pickup</option>
                <option value="Self-collect">Self-collect</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {/* Amount Range inputs */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-stark-muted">Amount Range ($)</label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Min"
                  value={minAmount}
                  onChange={(e) => { setMinAmount(e.target.value === "" ? "" : Number(e.target.value)); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-stark-primary"
                />
                <span className="text-xs text-stark-muted">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxAmount}
                  onChange={(e) => { setMaxAmount(e.target.value === "" ? "" : Number(e.target.value)); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-stark-primary"
                />
              </div>
            </div>

            {/* Date Range Picker */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-stark-muted">Date From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-stark-primary bg-white"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-stark-muted">Date To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-stark-primary bg-white"
              />
            </div>

            {/* Vendor Selector dropdown/pills combo */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-stark-muted">Vendors</label>
              <div className="flex gap-1 overflow-x-auto pb-1 max-w-full">
                {VENDORS.map(v => {
                  const isSelected = selectedVendors.includes(v.id);
                  return (
                    <button
                      key={v.id}
                      onClick={() => toggleVendorFilter(v.id)}
                      className={`px-2.5 py-1 text-xs rounded-full border transition-all shrink-0 font-medium ${
                        isSelected 
                          ? "bg-stark-primary/10 border-stark-primary text-stark-primary" 
                          : "bg-gray-50 border-gray-200 text-stark-muted hover:bg-gray-100"
                      }`}
                    >
                      {v.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Row inside Filters Box */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {/* Reset Filters */}
              <button 
                onClick={resetFilters}
                className="px-3.5 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
              >
                Clear Filters
              </button>
            </div>

            <div className="flex gap-2">
              {/* CSV Export */}
              <button
                onClick={handleExportCSV}
                className="bg-white hover:bg-stark-accent text-stark-text border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-all shadow-sm"
              >
                <svg className="w-4 h-4 text-stark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </section>
        {/* END: Filter Panel Box */}

        {/* BEGIN: Filter Chips Indicators */}
        {(searchQuery || selectedStatus !== "all" || selectedPayment !== "all" || selectedFulfillment !== "all" || selectedVendors.length > 0 || minAmount !== "" || maxAmount !== "" || startDate || endDate) && (
          <div className="flex flex-wrap items-center gap-2 mb-4 bg-stark-accent/50 p-2.5 rounded-lg border border-gray-100">
            <span className="text-xs text-stark-muted font-bold">Active Filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-white border border-gray-200 px-2.5 py-0.5 rounded-full text-xs text-stark-text font-medium">
                Search: &quot;{searchQuery}&quot;
                <button onClick={() => setSearchQuery("")} className="hover:text-red-500 font-bold ml-1">×</button>
              </span>
            )}
            {selectedStatus !== "all" && (
              <span className="inline-flex items-center gap-1 bg-white border border-gray-200 px-2.5 py-0.5 rounded-full text-xs text-stark-text font-medium">
                Status: {selectedStatus}
                <button onClick={() => setSelectedStatus("all")} className="hover:text-red-500 font-bold ml-1">×</button>
              </span>
            )}
            {selectedPayment !== "all" && (
              <span className="inline-flex items-center gap-1 bg-white border border-gray-200 px-2.5 py-0.5 rounded-full text-xs text-stark-text font-medium">
                Payment: {selectedPayment}
                <button onClick={() => setSelectedPayment("all")} className="hover:text-red-500 font-bold ml-1">×</button>
              </span>
            )}
            {selectedFulfillment !== "all" && (
              <span className="inline-flex items-center gap-1 bg-white border border-gray-200 px-2.5 py-0.5 rounded-full text-xs text-stark-text font-medium">
                Fulfillment: {selectedFulfillment}
                <button onClick={() => setSelectedFulfillment("all")} className="hover:text-red-500 font-bold ml-1">×</button>
              </span>
            )}
            {selectedVendors.map(vid => {
              const vendor = VENDORS.find(v => v.id === vid);
              return (
                <span key={vid} className="inline-flex items-center gap-1 bg-white border border-gray-200 px-2.5 py-0.5 rounded-full text-xs text-stark-text font-medium">
                  Vendor: {vendor?.name || vid}
                  <button onClick={() => toggleVendorFilter(vid)} className="hover:text-red-500 font-bold ml-1">×</button>
                </span>
              );
            })}
            {(minAmount !== "" || maxAmount !== "") && (
              <span className="inline-flex items-center gap-1 bg-white border border-gray-200 px-2.5 py-0.5 rounded-full text-xs text-stark-text font-medium">
                Amount: ${minAmount || "0"} - ${maxAmount || "∞"}
                <button onClick={() => { setMinAmount(""); setMaxAmount(""); }} className="hover:text-red-500 font-bold ml-1">×</button>
              </span>
            )}
            {(startDate || endDate) && (
              <span className="inline-flex items-center gap-1 bg-white border border-gray-200 px-2.5 py-0.5 rounded-full text-xs text-stark-text font-medium">
                Date: {startDate || "*"} to {endDate || "*"}
                <button onClick={() => { setStartDate(""); setEndDate(""); }} className="hover:text-red-500 font-bold ml-1">×</button>
              </span>
            )}
            <button 
              onClick={resetFilters}
              className="text-xs text-stark-primary font-bold hover:underline ml-auto"
            >
              Clear All
            </button>
          </div>
        )}
        {/* END: Filter Chips Indicators */}

        {/* BEGIN: Bulk Actions Indicator Bar */}
        {selectedOrders.length > 0 && (
          <div className="bg-stark-primary text-white p-3 rounded-lg flex items-center justify-between mb-4 shadow-sm animate-fade-in">
            <div className="flex items-center space-x-3 text-sm font-semibold">
              <span>{selectedOrders.length} orders selected</span>
              <button 
                onClick={() => setSelectedOrders([])}
                className="underline text-xs opacity-80 hover:opacity-100"
              >
                Clear Selection
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => executeBulkStatusChange("Delivered")}
                disabled={pagePermission === "view"}
                className={`bg-white hover:bg-gray-100 text-stark-primary px-3 py-1.5 rounded-md text-xs font-bold transition-all ${pagePermission === "view" ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Mark Delivered
              </button>
              <button
                onClick={() => executeBulkStatusChange("Cancelled")}
                disabled={pagePermission !== "create"}
                className={`bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs font-bold transition-all border border-red-500 ${pagePermission !== "create" ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Cancel Selected
              </button>
            </div>
          </div>
        )}
        {/* END: Bulk Actions Indicator Bar */}

        {/* BEGIN: Orders Table Section */}
        {paginatedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-xl border border-gray-150 p-12 shadow-sm text-center">
            <img
              src="/empty-state.png"
              alt="Empty state illustration"
              className="w-64 h-64 object-contain mb-6 rounded-2xl"
            />
            <h3 className="text-lg font-black text-stark-text mb-2">No Orders Found</h3>
            <p className="text-sm text-stark-muted max-w-sm">
              There are currently no records available to display.
            </p>
          </div>
        ) : (
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden" data-purpose="orders-list">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-5 py-4 w-12 text-center">
                      <input 
                        type="checkbox"
                        checked={paginatedOrders.length > 0 && paginatedOrders.every(o => selectedOrders.includes(o.id))}
                        onChange={handleSelectAll}
                        className="rounded text-stark-primary focus:ring-stark-primary"
                      />
                    </th>
                    <th 
                      onClick={() => handleSort("id")}
                      className="px-5 py-4 text-xs font-semibold text-stark-muted uppercase tracking-wider cursor-pointer hover:text-stark-text"
                    >
                      <div className="flex items-center gap-1">
                        Order ID
                        {sortBy === "id" && (sortOrder === "asc" ? "▲" : "▼")}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort("placedDate")}
                      className="px-5 py-4 text-xs font-semibold text-stark-muted uppercase tracking-wider cursor-pointer hover:text-stark-text hidden lg:table-cell"
                    >
                      <div className="flex items-center gap-1">
                        Placed Date
                        {sortBy === "placedDate" && (sortOrder === "asc" ? "▲" : "▼")}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort("customer")}
                      className="px-5 py-4 text-xs font-semibold text-stark-muted uppercase tracking-wider cursor-pointer hover:text-stark-text"
                    >
                      <div className="flex items-center gap-1">
                        Customer
                        {sortBy === "customer" && (sortOrder === "asc" ? "▲" : "▼")}
                      </div>
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold text-stark-muted uppercase tracking-wider hidden sm:table-cell">Vendors</th>
                    <th className="px-5 py-4 text-xs font-semibold text-stark-muted uppercase tracking-wider hidden md:table-cell">Delivery Partner</th>
                    <th className="px-5 py-4 text-xs font-semibold text-stark-muted uppercase tracking-wider hidden lg:table-cell">Fulfillment</th>
                    <th className="px-5 py-4 text-xs font-semibold text-stark-muted uppercase tracking-wider hidden sm:table-cell">Payment</th>
                    <th className="px-5 py-4 text-xs font-semibold text-stark-muted uppercase tracking-wider">Status</th>
                    <th 
                      onClick={() => handleSort("totalAmount")}
                      className="px-5 py-4 text-xs font-semibold text-stark-muted uppercase tracking-wider cursor-pointer hover:text-stark-text"
                    >
                      <div className="flex items-center gap-1">
                        Total
                        {sortBy === "totalAmount" && (sortOrder === "asc" ? "▲" : "▼")}
                      </div>
                    </th>
                    <th className="px-5 py-4 w-20"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedOrders.map(order => {
                    const isSelected = selectedOrders.includes(order.id);
                    
                    // Style badges based on state
                    let statusBadgeClass = "bg-blue-50 text-blue-700 border-blue-200";
                    if (order.orderStatus === "Packed") statusBadgeClass = "bg-indigo-50 text-indigo-700 border-indigo-200";
                    if (order.orderStatus === "Dispatched") statusBadgeClass = "bg-amber-50 text-amber-700 border-amber-200";
                    if (order.orderStatus === "Out for Delivery") statusBadgeClass = "bg-purple-50 text-purple-700 border-purple-200";
                    if (order.orderStatus === "Delivered") statusBadgeClass = "bg-green-50 text-green-700 border-green-200";
                    if (order.orderStatus === "Cancelled") statusBadgeClass = "bg-red-50 text-red-700 border-red-200";
                    if (order.orderStatus === "Refunded") statusBadgeClass = "bg-gray-50 text-gray-700 border-gray-200";

                    let paymentDotClass = "bg-yellow-400";
                    if (order.paymentStatus === "Paid") paymentDotClass = "bg-green-500";
                    if (order.paymentStatus === "Failed") paymentDotClass = "bg-red-500";
                    if (order.paymentStatus === "Refunded") paymentDotClass = "bg-gray-400";

                    return (
                      <tr 
                        key={order.id} 
                        className={`hover:bg-gray-50/50 transition-colors group ${isSelected ? "bg-stark-primary/5" : ""}`}
                      >
                        <td className="px-5 py-4 text-center">
                          <input 
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                            className="rounded text-stark-primary focus:ring-stark-primary"
                          />
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <button 
                            onClick={() => handleOpenDetails(order)}
                            className="text-sm font-bold text-stark-primary hover:underline"
                          >
                            {order.id}
                          </button>
                          <div className="text-[10px] text-stark-muted">
                            Channel: {order.orderChannel}
                          </div>
                          <div className="text-[10px] text-stark-muted lg:hidden">
                            {new Date(order.placedDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-stark-text font-medium hidden lg:table-cell">
                          {new Date(order.placedDate).toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-stark-text">{order.customer.name}</div>
                          <div className="text-xs text-stark-muted hidden sm:block">{order.customer.email}</div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap hidden sm:table-cell">
                          <div className="flex gap-1">
                            {order.vendors.map((vendor, idx) => (
                              <span 
                                key={vendor.id}
                                title={vendor.name}
                                className={`text-[10px] px-2 py-0.5 rounded text-white font-semibold ${vendor.color}`}
                              >
                                {vendor.name.split(" ")[0]}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap hidden md:table-cell">
                          {order.deliveryPartner ? (
                            <div className="flex items-center space-x-2">
                              <span className="w-2 h-2 rounded-full bg-green-500"></span>
                              <span className="text-xs font-semibold">{order.deliveryPartner.name}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-stark-muted font-medium italic">Unassigned</span>
                          )}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-xs text-stark-text font-medium hidden lg:table-cell">
                          {order.fulfillmentType}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap hidden sm:table-cell">
                          <div className="inline-flex items-center gap-1.5 text-xs font-semibold">
                            <span className={`w-2 h-2 rounded-full ${paymentDotClass}`}></span>
                            <span>{order.paymentStatus}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full border text-xs font-bold ${statusBadgeClass}`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm font-bold text-stark-text">
                          ${order.totalAmount.toFixed(2)}
                          <div className="text-[10px] font-normal text-stark-muted">
                            Comm: ${order.commission.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Drawer Viewer */}
                            <button
                              onClick={() => handleOpenDetails(order)}
                              title="View Details"
                              className="p-1 rounded hover:bg-gray-100 text-stark-muted hover:text-stark-primary transition-colors"
                            >
                              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              </svg>
                            </button>

                            {/* Dropdown Quick Actions */}
                            <div className="relative group/action-menu">
                              <button className="p-1 rounded hover:bg-gray-100 text-stark-muted hover:text-stark-text">
                                <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                              </button>
                              
                              <div className="absolute right-0 top-6 hidden group-hover/action-menu:block w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-30">
                                <p className="text-[10px] font-bold text-stark-muted px-3 py-1 uppercase tracking-wider">Quick actions</p>
                                
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, "Packed")}
                                  disabled={pagePermission === "view"}
                                  className={`w-full text-left px-3 py-1.5 text-xs text-stark-text hover:bg-stark-accent font-medium ${pagePermission === "view" ? "opacity-50 cursor-not-allowed hover:bg-transparent" : ""}`}
                                >
                                  📦 Mark Packed
                                </button>
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, "Dispatched")}
                                  disabled={pagePermission === "view"}
                                  className={`w-full text-left px-3 py-1.5 text-xs text-stark-text hover:bg-stark-accent font-medium ${pagePermission === "view" ? "opacity-50 cursor-not-allowed hover:bg-transparent" : ""}`}
                                >
                                  🚚 Mark Dispatched
                                </button>
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, "Delivered")}
                                  disabled={pagePermission === "view"}
                                  className={`w-full text-left px-3 py-1.5 text-xs text-stark-text hover:bg-stark-accent font-medium ${pagePermission === "view" ? "opacity-50 cursor-not-allowed hover:bg-transparent" : ""}`}
                                >
                                  ✅ Mark Delivered
                                </button>
                                
                                <div className="border-t border-gray-100 my-1"></div>
                                
                                <button
                                  disabled={["Dispatched", "Out for Delivery", "Delivered", "Cancelled"].includes(order.orderStatus) || pagePermission !== "create"}
                                  onClick={() => handleCancelOrder(order.id)}
                                  className={`w-full text-left px-3 py-1.5 text-xs font-semibold ${
                                    ["Dispatched", "Out for Delivery", "Delivered", "Cancelled"].includes(order.orderStatus)
                                      ? "text-gray-300 cursor-not-allowed" 
                                      : "text-red-500 hover:bg-red-50"
                                  } ${pagePermission !== "create" ? "text-gray-300 cursor-not-allowed opacity-50 hover:bg-transparent" : ""}`}
                                >
                                  ❌ Cancel Order
                                </button>
                                
                                <button
                                  disabled={order.paymentStatus !== "Paid" || pagePermission !== "create"}
                                  onClick={() => handleRefundOrder(order.id)}
                                  className={`w-full text-left px-3 py-1.5 text-xs font-semibold ${
                                    order.paymentStatus !== "Paid"
                                      ? "text-gray-300 cursor-not-allowed" 
                                      : "text-amber-600 hover:bg-amber-50"
                                  } ${pagePermission !== "create" ? "text-gray-300 cursor-not-allowed opacity-50 hover:bg-transparent" : ""}`}
                                >
                                  ↩ Refund Amount
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* BEGIN: Table Pagination Footer */}
            <div className="bg-white px-5 py-4 border-t border-gray-150 flex items-center justify-between">
              <span className="text-xs text-stark-muted">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 text-xs border rounded-md font-semibold transition-all ${
                  currentPage === 1 
                    ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed" 
                    : "bg-white text-stark-text border-gray-350 hover:bg-stark-accent"
                }`}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 text-xs border rounded-md font-semibold transition-all ${
                    currentPage === i + 1
                      ? "bg-stark-primary text-white border-stark-primary"
                      : "bg-white text-stark-text border-gray-350 hover:bg-stark-accent"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 text-xs border rounded-md font-semibold transition-all ${
                  currentPage === totalPages 
                    ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed" 
                    : "bg-white text-stark-text border-gray-350 hover:bg-stark-accent"
                }`}
              >
                Next
              </button>
            </div>
          </div>
          {/* END: Table Pagination Footer */}
        </section>
      )}
      {/* END: Orders Table Section */}

      </main>
      )}
      {/* END: MainContent */}

      {/* BEGIN: Order Details Slide-over Drawer */}
      {isDrawerOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden" data-purpose="details-drawer">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
            
            {/* Drawer Body */}
            <div className="w-full max-w-md bg-white flex flex-col shadow-2xl animate-slide-in h-full">
              {/* Header */}
              <div className="p-6 border-b border-gray-150 flex items-center justify-between bg-gray-50">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-stark-text">{selectedOrder.id}</h3>
                    <span className="text-[10px] bg-stark-primary/10 border border-stark-primary/20 px-2 py-0.5 rounded text-stark-primary font-bold">
                      {selectedOrder.fulfillmentType}
                    </span>
                  </div>
                  <p className="text-xs text-stark-muted">
                    Placed: {new Date(selectedOrder.placedDate).toLocaleString()}
                  </p>
                </div>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-200 text-stark-muted hover:text-stark-text"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Visual Tracker Timeline */}
                <div className="bg-stark-accent/40 border border-gray-100 p-4 rounded-xl">
                  <h4 className="text-xs font-bold text-stark-text uppercase tracking-wider mb-4">Fulfillment Tracker</h4>
                  
                  {/* Status checklist and line */}
                  <div className="relative pl-6 border-l-2 border-stark-primary/30 space-y-5">
                    {[
                      { state: "Placed", label: "Order Placed", desc: "Customer checked out order successfully" },
                      { state: "Packed", label: "Packed", desc: "Vendor processed and ready for dispatch" },
                      { state: "Dispatched", label: "Dispatched", desc: "Sent to logistics hub" },
                      { state: "Out for Delivery", label: "Out for Delivery", desc: "Assigned partner has departed" },
                      { state: "Delivered", label: "Delivered", desc: "Successfully hand-over completed" }
                    ].map((step, idx, arr) => {
                      const allStates = arr.map(x => x.state);
                      const currentIdx = allStates.indexOf(selectedOrder.orderStatus);
                      const stepIdx = allStates.indexOf(step.state);
                      const isCompleted = stepIdx <= currentIdx && selectedOrder.orderStatus !== "Cancelled" && selectedOrder.orderStatus !== "Refunded";
                      
                      return (
                        <div key={step.state} className="relative">
                          {/* Circle dot marker */}
                          <div className={`absolute -left-[31px] w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center bg-white ${
                            isCompleted ? "border-stark-primary bg-stark-primary text-white" : "border-gray-300 text-gray-300"
                          }`}>
                            {isCompleted && <span className="text-[10px]">✓</span>}
                          </div>
                          <div>
                            <p className={`text-xs font-bold ${isCompleted ? "text-stark-text" : "text-stark-muted"}`}>
                              {step.label}
                            </p>
                            <p className="text-[10px] text-stark-muted mt-0.5">{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Cancelled/Refunded exception warning */}
                  {(selectedOrder.orderStatus === "Cancelled" || selectedOrder.orderStatus === "Refunded") && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-700">
                      <span className="material-symbols-outlined text-sm">warning</span>
                      <span className="text-xs font-semibold">Order was marked {selectedOrder.orderStatus}</span>
                    </div>
                  )}
                </div>

                {/* Quick Advance Status Action Bar */}
                {selectedOrder.orderStatus !== "Cancelled" && selectedOrder.orderStatus !== "Refunded" && selectedOrder.orderStatus !== "Delivered" && (
                  <div className="bg-white border border-gray-150 p-4 rounded-xl shadow-xs">
                    <h4 className="text-xs font-bold text-stark-text uppercase tracking-wider mb-2">Fulfillment Control</h4>
                    <p className="text-xs text-stark-muted mb-3">Advance state of order manually.</p>
                    
                    <button
                      onClick={() => {
                        const states: Order["orderStatus"][] = ["Placed", "Packed", "Dispatched", "Out for Delivery", "Delivered"];
                        const curr = states.indexOf(selectedOrder.orderStatus);
                        if (curr < states.length - 1) {
                          handleUpdateOrderStatus(selectedOrder.id, states[curr + 1]);
                        }
                      }}
                      className="w-full bg-stark-primary hover:bg-stark-dark text-white py-2 rounded-lg font-semibold text-xs transition-colors flex items-center justify-center space-x-1"
                    >
                      <span>Advance Order Status →</span>
                    </button>
                  </div>
                )}

                {/* Customer Details */}
                <div className="bg-white border border-gray-150 p-4 rounded-xl shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-stark-muted uppercase tracking-wider">Customer Contact</h4>
                  <div>
                    <p className="text-sm font-bold text-stark-text">{selectedOrder.customer.name}</p>
                    <p className="text-xs text-stark-muted mt-0.5">{selectedOrder.customer.email}</p>
                    <p className="text-xs text-stark-muted">{selectedOrder.customer.phone}</p>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-xs font-bold text-stark-muted uppercase mb-1">Fulfillment Address</p>
                    <p className="text-xs text-stark-text leading-relaxed">
                      {selectedOrder.customer.address}, {selectedOrder.customer.city}, {selectedOrder.customer.zip}
                    </p>
                  </div>
                </div>

                {/* Delivery Logistics Partner */}
                <div className="bg-white border border-gray-150 p-4 rounded-xl shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-stark-muted uppercase tracking-wider">Logistics Delivery</h4>
                  
                  {selectedOrder.deliveryPartner ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-stark-text">Assigned Driver</span>
                        <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-200">Active</span>
                      </div>
                      <p className="text-sm font-bold text-stark-text">{selectedOrder.deliveryPartner.name}</p>
                      <p className="text-xs text-stark-muted">{selectedOrder.deliveryPartner.phone}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-stark-muted italic mb-3">No delivery driver assigned yet.</p>
                      <label className="text-[10px] font-bold text-stark-muted uppercase block mb-1">Assign Partner</label>
                      <select
                        onChange={(e) => handleAssignDeliveryPartner(selectedOrder.id, e.target.value)}
                        defaultValue=""
                        className="w-full text-xs px-2.5 py-1.5 border border-gray-200 rounded bg-white"
                      >
                        <option value="" disabled>-- Select Driver --</option>
                        {DELIVERY_PARTNERS.map(dp => (
                          <option key={dp.id} value={dp.id}>{dp.name} ({dp.status})</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Items Box */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-stark-muted uppercase tracking-wider">Ordered Products</h4>
                  
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex gap-3 bg-gray-50 border border-gray-150 p-3 rounded-lg">
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.name} 
                          className="w-12 h-12 object-cover rounded bg-gray-100 shrink-0 border border-gray-200" 
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate text-stark-text">{item.product.name}</p>
                          <p className="text-[10px] text-stark-muted mt-0.5">
                            Category: {item.product.category}
                          </p>
                          {/* Vendor info */}
                          {(() => {
                            const vendor = VENDORS.find(v => v.id === item.product.vendorId);
                            return (
                              <span className="inline-block text-[9px] font-semibold text-stark-primary/80 bg-stark-primary/5 px-1.5 py-0.5 rounded mt-1 border border-stark-primary/10">
                                Vendor: {vendor?.name || item.product.vendorId}
                              </span>
                            );
                          })()}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-bold text-stark-text">${item.product.price}</p>
                          <p className="text-[10px] text-stark-muted">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Details */}
                <div className="bg-white border border-gray-150 p-4 rounded-xl shadow-xs space-y-2">
                  <h4 className="text-xs font-bold text-stark-muted uppercase tracking-wider mb-2">Order Calculations</h4>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-stark-muted">Subtotal</span>
                    <span className="text-stark-text font-medium">${(selectedOrder.totalAmount - (selectedOrder.fulfillmentType === "Delivery" ? 5 : 0) - selectedOrder.commission * 0.8).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-stark-muted">Commission (10%)</span>
                    <span className="text-stark-text font-medium">${selectedOrder.commission.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-stark-muted">Delivery/Pickup Fee</span>
                    <span className="text-stark-text font-medium">
                      ${selectedOrder.fulfillmentType === "Delivery" ? "5.00" : "0.00"}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-100 my-2 pt-2 flex justify-between text-sm font-black">
                    <span className="text-stark-text">Grand Total</span>
                    <span className="text-stark-primary">${selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-[10px] text-stark-muted mt-2 pt-2 border-t border-gray-50 border-dashed">
                    <span>Payment Mode: COD / Card</span>
                    <span>Payment Status: <b className="text-stark-text">{selectedOrder.paymentStatus}</b></span>
                  </div>
                </div>

                {/* Order Notes */}
                {selectedOrder.notes && (
                  <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl">
                    <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">Customer Request Note</h4>
                    <p className="text-xs text-amber-700 leading-relaxed italic">&quot;{selectedOrder.notes}&quot;</p>
                  </div>
                )}

              </div>

              {/* Drawer Footer actions */}
              <div className="p-4 border-t border-gray-150 bg-gray-50 flex flex-col gap-2">
                <button
                  onClick={() => setIsInvoiceModalOpen(true)}
                  className="w-full bg-stark-primary hover:bg-stark-dark text-white py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>View & Download Invoice</span>
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCancelOrder(selectedOrder.id)}
                    disabled={["Dispatched", "Out for Delivery", "Delivered", "Cancelled"].includes(selectedOrder.orderStatus)}
                    className="flex-1 bg-white border border-gray-200 text-red-500 hover:bg-red-50 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel Order
                  </button>
                  <button
                    onClick={() => handleRefundOrder(selectedOrder.id)}
                    disabled={selectedOrder.paymentStatus !== "Paid"}
                    className="flex-1 bg-white border border-gray-200 text-amber-600 hover:bg-amber-50 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Refund
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
      {/* END: Order Details Slide-over Drawer */}

      {/* BEGIN: Add Order Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsAddModalOpen(false)}></div>
          
          <div className="bg-white rounded-2xl max-w-2xl w-full relative z-10 flex flex-col max-h-[90vh] shadow-2xl animate-fade-in border border-gray-100 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <div>
                <h3 className="font-black text-lg text-stark-text">Add Manual Order</h3>
                <p className="text-xs text-stark-muted">Manually enter a customer order from telephonic or direct booking.</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1"
              >
                ×
              </button>
            </div>

            {/* Steps Nav Progress Bar */}
            <div className="px-6 py-3 bg-stark-accent/50 border-b border-gray-100 grid grid-cols-5 text-center text-xs font-bold text-stark-muted">
              {[
                { s: 1, label: "Customer" },
                { s: 2, label: "Products" },
                { s: 3, label: "Logistics" },
                { s: 4, label: "Payments" },
                { s: 5, label: "Review" }
              ].map(step => (
                <div 
                  key={step.s} 
                  className={`${addOrderStep === step.s ? "text-stark-primary" : ""} ${addOrderStep > step.s ? "text-green-600" : ""}`}
                >
                  Step {step.s}: {step.label}
                  {addOrderStep > step.s && " ✓"}
                </div>
              ))}
            </div>

            {/* Modal Step Content */}
            <div className="flex-1 overflow-y-auto p-6">
              
              {/* STEP 1: CUSTOMER DETAILS */}
              {addOrderStep === 1 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="flex gap-4 p-1.5 bg-gray-150 rounded-lg mb-4">
                    <button
                      onClick={() => setCustomerType("existing")}
                      className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                        customerType === "existing" ? "bg-white text-stark-primary shadow-xs" : "text-stark-muted hover:text-stark-text"
                      }`}
                    >
                      Choose Existing Customer
                    </button>
                    <button
                      onClick={() => setCustomerType("new")}
                      className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                        customerType === "new" ? "bg-white text-stark-primary shadow-xs" : "text-stark-muted hover:text-stark-text"
                      }`}
                    >
                      Register New Customer
                    </button>
                  </div>

                  {customerType === "existing" ? (
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-stark-muted">Select Customer</label>
                      <select
                        value={selectedCustomerId}
                        onChange={(e) => setSelectedCustomerId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                      >
                        {CUSTOMERS.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-stark-muted">Customer Name*</label>
                        <input
                          type="text"
                          required
                          value={newCustomerName}
                          onChange={(e) => setNewCustomerName(e.target.value)}
                          placeholder="e.g. John Doe"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-stark-primary"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-bold text-stark-muted">Email Address</label>
                          <input
                            type="email"
                            value={newCustomerEmail}
                            onChange={(e) => setNewCustomerEmail(e.target.value)}
                            placeholder="john.doe@company.com"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-bold text-stark-muted">Phone Number</label>
                          <input
                            type="text"
                            value={newCustomerPhone}
                            onChange={(e) => setNewCustomerPhone(e.target.value)}
                            placeholder="+1 (555) 012-3456"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: CART PRODUCTS SELECTION */}
              {addOrderStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-stark-muted uppercase">Select Catalog Items</h4>
                    <span className="text-xs text-stark-primary font-bold">Cart Items: {cartItems.reduce((acc, c) => acc + c.quantity, 0)}</span>
                  </div>

                  {/* Search Bar for products */}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      placeholder="Search items by name, category..."
                      value={searchProductQuery}
                      onChange={(e) => setSearchProductQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>

                  {/* Catalog display grid */}
                  <div className="grid grid-cols-2 gap-3 max-h-[30vh] overflow-y-auto pr-1">
                    {filteredProducts.map(product => {
                      const vendor = VENDORS.find(v => v.id === product.vendorId);
                      return (
                        <div key={product.id} className="border border-gray-200 rounded-lg p-3 flex gap-2 hover:border-stark-primary/50 bg-gray-50/50">
                          <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-cover rounded bg-white shrink-0 border border-gray-150" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-stark-text truncate">{product.name}</p>
                            <p className="text-[10px] text-stark-muted">${product.price.toFixed(2)}</p>
                            <span className="inline-block text-[8px] font-semibold bg-white border border-gray-200 px-1 rounded text-stark-muted">
                              {vendor?.name}
                            </span>
                          </div>
                          <button
                            onClick={() => addToCart(product)}
                            className="bg-stark-primary text-white p-1 rounded hover:bg-stark-dark self-center"
                          >
                            +
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Display Selected items inside cart */}
                  {cartItems.length > 0 && (
                    <div className="border-t border-gray-100 pt-4">
                      <h5 className="text-xs font-bold text-stark-text mb-2">Selected Cart</h5>
                      <div className="space-y-2 max-h-[20vh] overflow-y-auto pr-1">
                        {cartItems.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-stark-accent/20 p-2.5 rounded-lg border border-gray-150">
                            <span className="text-xs font-bold text-stark-text">{item.product.name}</span>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                                className="w-6 h-6 border border-gray-300 rounded bg-white text-xs font-bold hover:bg-gray-50"
                              >
                                -
                              </button>
                              <span className="text-xs font-bold">{item.quantity}</span>
                              <button 
                                onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                                className="w-6 h-6 border border-gray-300 rounded bg-white text-xs font-bold hover:bg-gray-50"
                              >
                                +
                              </button>
                              <span className="text-xs font-bold text-stark-text ml-2">${(item.product.price * item.quantity).toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: LOGISTICS / FULFILLMENT */}
              {addOrderStep === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-stark-muted">Fulfillment Type</label>
                    <select
                      value={fulfillmentType}
                      onChange={(e) => setFulfillmentType(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg text-sm"
                    >
                      <option value="Delivery">Delivery ($5.00)</option>
                      <option value="Pickup">Pickup ($0.00)</option>
                      <option value="Self-collect">Self-collect ($0.00)</option>
                    </select>
                  </div>

                  {fulfillmentType === "Delivery" && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-stark-text uppercase mt-2">Shipping Destination</h4>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-stark-muted">Street Address*</label>
                        <input
                          type="text"
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="e.g. 123 Main St."
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-stark-muted">City*</label>
                          <input
                            type="text"
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="e.g. Boston"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-stark-muted">Zip Code*</label>
                          <input
                            type="text"
                            required
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                            placeholder="e.g. 02108"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: PAYMENTS & NOTES */}
              {addOrderStep === 4 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-stark-muted">Payment Status</label>
                      <select
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value as any)}
                        className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg text-sm"
                      >
                        <option value="Pending">COD / Pending</option>
                        <option value="Paid">Prepaid / Paid</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-stark-muted">Order Channel</label>
                      <select
                        value={orderChannel}
                        onChange={(e) => setOrderChannel(e.target.value as any)}
                        className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg text-sm"
                      >
                        <option value="Web">Web Portal</option>
                        <option value="Mobile">Mobile App</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-stark-muted">Special Order Notes</label>
                    <textarea
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="e.g. Please wrap as gift / Customer phone authorization code."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-stark-primary focus:ring-1 focus:ring-stark-primary"
                    />
                  </div>
                </div>
              )}

              {/* STEP 5: REVIEW & CONFIRM */}
              {addOrderStep === 5 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="bg-green-50 border border-green-150 p-4 rounded-xl text-green-800 text-xs">
                    <h4 className="font-bold mb-1">Validation Verified!</h4>
                    <p>Calculated multi-vendor split and standard admin marketplace commission.</p>
                  </div>

                  {/* Summary grid */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                    
                    {/* Customer Row */}
                    <div className="p-4 bg-gray-50/50 flex justify-between text-xs">
                      <div>
                        <p className="font-bold text-stark-muted">CUSTOMER</p>
                        <p className="text-sm font-extrabold text-stark-text mt-1">
                          {customerType === "existing" 
                            ? CUSTOMERS.find(c => c.id === selectedCustomerId)?.name 
                            : newCustomerName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-stark-muted">FULFILLMENT</p>
                        <p className="text-sm font-extrabold text-stark-text mt-1">{fulfillmentType}</p>
                      </div>
                    </div>

                    {/* Products Row */}
                    <div className="p-4 space-y-2 text-xs">
                      <p className="font-bold text-stark-muted uppercase">ITEMS LIST</p>
                      {cartItems.map((item, idx) => (
                        <div key={idx} className="flex justify-between font-medium">
                          <span>{item.product.name} (x{item.quantity})</span>
                          <span className="font-bold text-stark-text">${(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Financial split */}
                    <div className="p-4 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-stark-muted">Subtotal</span>
                        <span>${newOrderCalculations.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-green-700">
                        <span>Calculated Admin Commission (10%)</span>
                        <span>${newOrderCalculations.commission.toFixed(2)}</span>
                      </div>
                      {fulfillmentType === "Delivery" && (
                        <div className="flex justify-between">
                          <span>Fulfillment/Delivery Charge</span>
                          <span>$5.00</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Estimated Taxes (8%)</span>
                        <span>${newOrderCalculations.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-black text-sm text-stark-primary pt-2 border-t border-gray-100">
                        <span>Grand Total</span>
                        <span>${newOrderCalculations.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Split vendors detail */}
                    <div className="p-4 bg-gray-50/50 text-xs">
                      <p className="font-bold text-stark-muted uppercase mb-1.5">VENDOR SPLIT INVOLVED</p>
                      <div className="flex gap-1.5 flex-wrap">
                        {newOrderCalculations.vendors.map(v => (
                          <span key={v.id} className="bg-white border border-gray-250 px-2.5 py-1 rounded text-stark-text font-bold shadow-2xs">
                            {v.name}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>

            {/* Modal Navigation Buttons */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
              <div>
                {addOrderStep > 1 && (
                  <button
                    onClick={() => setAddOrderStep(addOrderStep - 1)}
                    className="bg-white hover:bg-stark-accent text-stark-text border border-gray-200 px-4 py-2 rounded-lg text-xs font-bold transition-all"
                  >
                    Back
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-stark-muted hover:text-stark-text"
                >
                  Cancel
                </button>

                {addOrderStep < 5 ? (
                  <button
                    disabled={
                      (addOrderStep === 1 && !isStep1Valid) ||
                      (addOrderStep === 2 && !isStep2Valid) ||
                      (addOrderStep === 3 && !isStep3Valid)
                    }
                    onClick={() => setAddOrderStep(addOrderStep + 1)}
                    className="bg-stark-primary hover:bg-stark-dark text-white px-5 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    onClick={handleCreateManualOrder}
                    className="bg-stark-primary hover:bg-stark-dark text-white px-6 py-2 rounded-lg text-xs font-black transition-all shadow-md"
                  >
                    Confirm & Create Order
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
      {/* END: Add Order Modal */}

      {/* BEGIN: Invoice Preview Modal */}
      {isInvoiceModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsInvoiceModalOpen(false)}></div>
          
          <div className="bg-white rounded-2xl max-w-4xl w-full relative z-10 flex flex-col max-h-[90vh] shadow-2xl animate-fade-in border border-gray-100 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <div>
                <h3 className="font-black text-lg text-stark-text">Invoice INV-{selectedOrder.id.replace("ORD-", "")}</h3>
                <p className="text-xs text-stark-muted">Preview and download options for order invoice statement.</p>
              </div>
              <button 
                onClick={() => setIsInvoiceModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold p-1 leading-none"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
              
              {/* Printable Invoice Container */}
              <div id="printable-invoice" className="border border-gray-200 rounded-xl p-6 bg-white shadow-xs">
                
                {/* Invoice Header */}
                <div className="flex flex-col md:flex-row justify-between border-b border-gray-100 pb-6 gap-4">
                  <div>
                    <h2 className="text-xl font-black text-stark-text tracking-tight uppercase">STARK MULTIVENDOR</h2>
                    <p className="text-xs text-stark-muted mt-1">stark-multivendor.com</p>
                    <p className="text-[10px] text-stark-muted">Platform Admin Control Panel</p>
                  </div>
                  <div className="md:text-right">
                    <h1 className="text-lg font-black text-stark-primary">INVOICE STATEMENT</h1>
                    <p className="text-xs font-bold text-stark-text mt-1">INV-{selectedOrder.id.replace("ORD-", "")}</p>
                    <p className="text-[11px] text-stark-muted mt-0.5">Date: {new Date(selectedOrder.placedDate).toLocaleDateString()}</p>
                    
                    {/* Status badges */}
                    <div className="flex md:justify-end gap-1.5 mt-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                        selectedOrder.paymentStatus === "Paid" 
                          ? "bg-green-50 border-green-200 text-green-700" 
                          : selectedOrder.paymentStatus === "Pending"
                          ? "bg-amber-50 border-amber-200 text-amber-700"
                          : "bg-red-50 border-red-200 text-red-700"
                      }`}>
                        PAYMENT: {selectedOrder.paymentStatus}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded border bg-stark-accent/50 border-gray-250 text-stark-text`}>
                        {selectedOrder.fulfillmentType.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Client / Order Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-gray-100 text-xs">
                  <div>
                    <h4 className="text-[10px] font-bold text-stark-muted uppercase tracking-wider mb-2">BILL TO</h4>
                    <p className="font-bold text-sm text-stark-text">{selectedOrder.customer.name}</p>
                    <p className="text-stark-muted mt-0.5">{selectedOrder.customer.email}</p>
                    <p className="text-stark-muted">{selectedOrder.customer.phone}</p>
                    {selectedOrder.customer.address && (
                      <p className="text-stark-text mt-2 leading-relaxed">
                        {selectedOrder.customer.address}, {selectedOrder.customer.city || ""}, {selectedOrder.customer.zip || ""}
                      </p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-stark-muted uppercase tracking-wider mb-2">ORDER INFO</h4>
                    <table className="w-full text-left space-y-1">
                      <tbody>
                        <tr>
                          <td className="text-stark-muted pr-2 pb-1 font-semibold">Order ID:</td>
                          <td className="text-stark-text pb-1 font-medium">{selectedOrder.id}</td>
                        </tr>
                        <tr>
                          <td className="text-stark-muted pr-2 pb-1 font-semibold">Fulfillment:</td>
                          <td className="text-stark-text pb-1 font-medium">{selectedOrder.fulfillmentType}</td>
                        </tr>
                        <tr>
                          <td className="text-stark-muted pr-2 pb-1 font-semibold">Order Status:</td>
                          <td className="text-stark-text pb-1 font-medium">{selectedOrder.orderStatus}</td>
                        </tr>
                        <tr>
                          <td className="text-stark-muted pr-2 font-semibold">Payment Mode:</td>
                          <td className="text-stark-text font-medium">COD / Card Payment</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Products Table */}
                <div className="py-6 border-b border-gray-100 overflow-x-auto">
                  <h4 className="text-[10px] font-bold text-stark-muted uppercase tracking-wider mb-3">ITEMS SUMMARY</h4>
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="border-b border-gray-150 text-[10px] font-bold text-stark-muted uppercase">
                        <th className="pb-2 font-black">Product</th>
                        <th className="pb-2 font-black">Category</th>
                        <th className="pb-2 font-black">Vendor</th>
                        <th className="pb-2 text-right font-black">Price</th>
                        <th className="pb-2 text-center font-black">Qty</th>
                        <th className="pb-2 text-right font-black">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs">
                      {selectedOrder.items.map((item, idx) => {
                        const vendor = VENDORS.find(v => v.id === item.product.vendorId);
                        const vendorName = vendor?.name || item.product.vendorId;
                        return (
                          <tr key={idx} className="hover:bg-gray-50/50">
                            <td className="py-3 font-semibold text-stark-text">{item.product.name}</td>
                            <td className="py-3 text-stark-muted">{item.product.category}</td>
                            <td className="py-3 text-stark-muted">{vendorName}</td>
                            <td className="py-3 text-right text-stark-text">${item.product.price.toFixed(2)}</td>
                            <td className="py-3 text-center text-stark-text">{item.quantity}</td>
                            <td className="py-3 text-right font-semibold text-stark-text">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Financial Summary */}
                <div className="flex flex-col md:flex-row justify-between py-6 gap-6">
                  {/* Vendors Contact list inside invoice */}
                  <div className="flex-1">
                    <h4 className="text-[10px] font-bold text-stark-muted uppercase tracking-wider mb-2">FULFILLING VENDORS</h4>
                    <div className="space-y-1.5 font-medium">
                      {selectedOrder.vendors.map((vendor, idx) => (
                        <div key={idx} className="text-[11px] text-stark-muted flex flex-col sm:flex-row sm:items-center sm:gap-2">
                          <span className="font-semibold text-stark-text">• {vendor.name}</span>
                          {vendor.email && <span>({vendor.email})</span>}
                          {vendor.gst && <span className="bg-gray-100 px-1 py-0.5 rounded text-[9px] border">GST: {vendor.gst}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Calculation Box */}
                  <div className="w-full md:w-80 shrink-0 text-xs space-y-2.5">
                    {(() => {
                      const deliveryFee = selectedOrder.fulfillmentType === "Delivery" ? 5 : 0;
                      const tax = Math.round(selectedOrder.commission * 0.8 * 100) / 100;
                      const subtotal = Math.round((selectedOrder.totalAmount - deliveryFee - tax) * 100) / 100;
                      return (
                        <>
                          <div className="flex justify-between">
                            <span className="text-stark-muted">Subtotal</span>
                            <span className="text-stark-text font-semibold">${subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stark-muted">Tax (8%)</span>
                            <span className="text-stark-text font-semibold">${tax.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stark-muted">Delivery/Pickup Fee</span>
                            <span className="text-stark-text font-semibold">${deliveryFee.toFixed(2)}</span>
                          </div>
                          <div className="border-t border-gray-200 my-2 pt-2.5 flex justify-between text-sm font-black">
                            <span className="text-stark-text">Grand Total</span>
                            <span className="text-stark-primary">${selectedOrder.totalAmount.toFixed(2)}</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Footer notes */}
                <div className="border-t border-gray-100 pt-4 text-center">
                  <p className="text-[10px] text-stark-muted">
                    This document is a digital copy of the transaction invoice on Stark Multivendor marketplace.
                  </p>
                  <p className="text-[10px] text-stark-muted mt-0.5">
                    For inquiries, email billing@stark-multivendor.com
                  </p>
                </div>
              </div>
            </div>
            
            {/* Modal Actions Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-wrap gap-2 justify-end">
              <button
                onClick={() => handleDownloadTxtInvoice(selectedOrder)}
                className="bg-white border border-gray-200 hover:bg-gray-50 text-stark-text px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download POS (.txt)</span>
              </button>
              
              <button
                onClick={() => handleDownloadHtmlInvoice(selectedOrder)}
                className="bg-white border border-gray-200 hover:bg-gray-50 text-stark-text px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download HTML (.html)</span>
              </button>
              
              <button
                onClick={() => {
                  const printStyle = document.createElement("style");
                  printStyle.innerHTML = `
                    @media print {
                      body * { visibility: hidden; }
                      #printable-invoice, #printable-invoice * { visibility: visible; }
                      #printable-invoice { position: absolute; left: 0; top: 0; width: 100%; border: none !important; box-shadow: none !important; margin: 0 !important; padding: 0 !important; }
                    }
                  `;
                  document.head.appendChild(printStyle);
                  window.print();
                  document.head.removeChild(printStyle);
                }}
                className="bg-stark-primary hover:bg-stark-dark text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Print Invoice</span>
              </button>
              
              <button
                onClick={() => setIsInvoiceModalOpen(false)}
                className="bg-gray-200 hover:bg-gray-300 text-stark-text px-4 py-2 rounded-lg text-xs font-bold transition-all"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
      {/* END: Invoice Preview Modal */}

      {/* Embedded CSS for animations */}
      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>

    </div>
  );
}
