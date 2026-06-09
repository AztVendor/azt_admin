"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { VENDORS, MOCK_ORDERS, Vendor, Order, OrderItem } from "../orders/data";
import LeftSidebar from "@/components/LeftSidebar";
import { INITIAL_ADMINS } from "../admins/data";

// Helper function to render sidebar icons
const renderSidebarIcon = (key: string, className = "w-5 h-5") => {
  switch (key) {
    case "dashboard":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      );
    case "orders":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      );
    case "categories":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M4 6h16M4 10h16M4 14h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      );
    case "subcategories":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M4 6h16M7 10h13M7 14h13M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      );
    case "minicategories":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M4 6h16M7 10h13M10 14h10M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      );
    case "macrocategories":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M4 6h16M7 10h13M10 14h10M13 18h7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      );
    case "products":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      );
    case "customers":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      );
    case "billing":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      );
    case "vendors":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      );
    case "notifications":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      );
    case "emails":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      );
    default:
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      );
  }
};

// Helper: Extract month & year short format, e.g. "Jun/2026"
const getOrderMonthShort = (dateStr: string) => {
  const d = new Date(dateStr);
  const month = d.toLocaleString("en-US", { month: "short" });
  const year = d.getFullYear();
  return `${month}/${year}`;
};

// Helper: Extract month & year long format, e.g. "June 2026"
const getOrderMonthLong = (dateStr: string) => {
  const d = new Date(dateStr);
  const month = d.toLocaleString("en-US", { month: "long" });
  const year = d.getFullYear();
  return `${month} ${year}`;
};

export default function BillingPage() {
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
        setPagePermission(selectedAdmin.permissions.billing || null);
      }
    }
  }, []);

const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Selected view and vendor state
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);

  // Filters state (Main Dashboard)
  const [vendorFilter, setVendorFilter] = useState<string>("all");
  const [monthFilter, setMonthFilter] = useState<string>("all"); // "all" or e.g. "Jun/2026"

  // Sub-view Filters state (Vendor Detail View)
  const [detailMonthFilter, setDetailMonthFilter] = useState<string>("Jun/2026"); // default is June 2026

  // Simulated current month
  const CURRENT_MONTH_SHORT = "Jun/2026";
  const CURRENT_MONTH_LONG = "June 2026";

  // Find unique months in mock orders
  const uniqueMonths = useMemo(() => {
    const months = MOCK_ORDERS.map(order => getOrderMonthShort(order.placedDate));
    return Array.from(new Set(months));
  }, []);

  // Vendor Lookup
  const vendorsMap = useMemo(() => {
    const map = new Map<string, Vendor>();
    VENDORS.forEach(v => map.set(v.id, v));
    return map;
  }, []);

  const selectedVendor = useMemo(() => {
    if (!selectedVendorId) return null;
    return vendorsMap.get(selectedVendorId) || null;
  }, [selectedVendorId, vendorsMap]);

  // Helper: Calculate vendor statistics inside a specific order
  const getVendorOrderStats = (order: Order, vendorId: string) => {
    const vendorItems = order.items.filter(item => item.product.vendorId === vendorId);
    
    // Sum of items price * quantity
    const rawAmount = vendorItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const hasItems = vendorItems.length > 0;
    
    let orderAmount = 0;
    let quotedAmount = 0;
    let profit = 0;
    let refundedAmount = 0;

    if (hasItems) {
      if (order.orderStatus === "Cancelled") {
        orderAmount = 0;
        quotedAmount = 0;
        profit = 0;
      } else if (order.orderStatus === "Refunded" || order.paymentStatus === "Refunded") {
        orderAmount = rawAmount;
        quotedAmount = 0;
        profit = 0;
        refundedAmount = rawAmount;
      } else {
        orderAmount = rawAmount;
        // Quoted Amount = 90% payout to vendor
        quotedAmount = rawAmount * 0.9;
        // Profit = 10% commission to Stark
        profit = rawAmount * 0.1;
      }
    }

    const itemsDescription = vendorItems
      .map(item => `${item.product.name} (x${item.quantity})`)
      .join(", ");

    return {
      orderAmount,
      quotedAmount,
      profit,
      refundedAmount,
      itemsDescription,
      hasItems
    };
  };

  // --- KPI Card Calculations ---

  // 1. Overall Calculations
  const overallKPIs = useMemo(() => {
    let ordersCount = 0;
    let orderAmount = 0;
    let refundCount = 0;
    let refundAmount = 0;
    let profit = 0;

    MOCK_ORDERS.forEach(order => {
      // If vendor filter is active and this order doesn't have their products, skip
      if (vendorFilter !== "all") {
        const stats = getVendorOrderStats(order, vendorFilter);
        if (!stats.hasItems) return;

        if (order.orderStatus === "Cancelled") {
          // ignore cancelled orders
        } else if (order.orderStatus === "Refunded" || order.paymentStatus === "Refunded") {
          refundCount += 1;
          refundAmount += stats.refundedAmount;
        } else {
          ordersCount += 1;
          orderAmount += stats.orderAmount;
          profit += stats.profit;
        }
      } else {
        // Platform wide totals
        if (order.orderStatus === "Cancelled") {
          // ignore
        } else if (order.orderStatus === "Refunded" || order.paymentStatus === "Refunded") {
          refundCount += 1;
          refundAmount += order.totalAmount;
        } else {
          ordersCount += 1;
          orderAmount += order.totalAmount;
          profit += order.commission;
        }
      }
    });

    return { ordersCount, orderAmount, refundCount, refundAmount, profit };
  }, [vendorFilter]);

  // 2. This Month (June 2026) Calculations
  const monthlyKPIs = useMemo(() => {
    let ordersCount = 0;
    let orderAmount = 0;
    let refundCount = 0;
    let refundAmount = 0;
    let profit = 0;

    MOCK_ORDERS.forEach(order => {
      const orderMonth = getOrderMonthShort(order.placedDate);
      if (orderMonth !== CURRENT_MONTH_SHORT) return;

      if (vendorFilter !== "all") {
        const stats = getVendorOrderStats(order, vendorFilter);
        if (!stats.hasItems) return;

        if (order.orderStatus === "Cancelled") {
          // ignore
        } else if (order.orderStatus === "Refunded" || order.paymentStatus === "Refunded") {
          refundCount += 1;
          refundAmount += stats.refundedAmount;
        } else {
          ordersCount += 1;
          orderAmount += stats.orderAmount;
          profit += stats.profit;
        }
      } else {
        if (order.orderStatus === "Cancelled") {
          // ignore
        } else if (order.orderStatus === "Refunded" || order.paymentStatus === "Refunded") {
          refundCount += 1;
          refundAmount += order.totalAmount;
        } else {
          ordersCount += 1;
          orderAmount += order.totalAmount;
          profit += order.commission;
        }
      }
    });

    return { ordersCount, orderAmount, refundCount, refundAmount, profit };
  }, [vendorFilter]);

  // --- Main List Table Data ---
  const latestVendorsList = useMemo(() => {
    return VENDORS.map(vendor => {
      let ordersCount = 0;
      let orderAmount = 0;
      let refundCount = 0;
      let refundAmount = 0;
      let profit = 0;
      let quotedAmount = 0;

      MOCK_ORDERS.forEach(order => {
        // Month filter checking
        if (monthFilter !== "all") {
          const orderMonth = getOrderMonthShort(order.placedDate);
          if (orderMonth !== monthFilter) return;
        }

        const stats = getVendorOrderStats(order, vendor.id);
        if (!stats.hasItems) return;

        if (order.orderStatus === "Cancelled") {
          // ignore
        } else if (order.orderStatus === "Refunded" || order.paymentStatus === "Refunded") {
          refundCount += 1;
          refundAmount += stats.refundedAmount;
        } else {
          ordersCount += 1;
          orderAmount += stats.orderAmount;
          quotedAmount += stats.quotedAmount;
          profit += stats.profit;
        }
      });

      return {
        vendor,
        ordersCount,
        orderAmount,
        refundCount,
        refundAmount,
        quotedAmount,
        profit
      };
    }).filter(item => {
      // If vendor filter is active on main page, only show selected vendor
      if (vendorFilter !== "all" && item.vendor.id !== vendorFilter) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      // Sort by sales high-to-low as default, or registration date. 
      // Let's sort by sales volume to highlight top financial items, but keep it clean.
      return b.orderAmount - a.orderAmount;
    });
  }, [monthFilter, vendorFilter]);

  // --- Vendor Details View Calculations ---
  const filteredVendorOrders = useMemo(() => {
    if (!selectedVendorId) return [];

    return MOCK_ORDERS.filter(order => {
      const stats = getVendorOrderStats(order, selectedVendorId);
      if (!stats.hasItems) return false;

      // Filter by sub-view month selection
      if (detailMonthFilter !== "all") {
        const orderMonth = getOrderMonthShort(order.placedDate);
        if (orderMonth !== detailMonthFilter) return false;
      }

      return true;
    }).sort((a, b) => {
      // Order by date descending
      return new Date(b.placedDate).getTime() - new Date(a.placedDate).getTime();
    });
  }, [selectedVendorId, detailMonthFilter]);

  // Totals for the detailed view table summary row
  const detailTotals = useMemo(() => {
    let totalOrder = 0;
    let totalQuoted = 0;
    let totalProfit = 0;

    if (!selectedVendorId) return { totalOrder, totalQuoted, totalProfit };

    filteredVendorOrders.forEach(order => {
      const stats = getVendorOrderStats(order, selectedVendorId);
      totalOrder += stats.orderAmount;
      totalQuoted += stats.quotedAmount;
      totalProfit += stats.profit;
    });

    return { totalOrder, totalQuoted, totalProfit };
  }, [filteredVendorOrders, selectedVendorId]);

  // Helper: CSV Export for vendor billing
  const handleExportCSV = () => {
    if (!selectedVendor) return;

    const csvRows = [];
    csvRows.push([`Billing Summary Report`]);
    csvRows.push([`Vendor Business Name`, selectedVendor.name]);
    csvRows.push([`Contact Person`, selectedVendor.contactPerson || "N/A"]);
    csvRows.push([`Contact Position`, selectedVendor.position || "N/A"]);
    csvRows.push([`Phone Number`, selectedVendor.phone || "N/A"]);
    csvRows.push([`Email ID`, selectedVendor.email || "N/A"]);
    csvRows.push([`GST Number`, selectedVendor.gst || "N/A"]);
    csvRows.push([`Report Period`, detailMonthFilter === "all" ? "All Time" : getOrderMonthLong(filteredVendorOrders[0]?.placedDate || "2026-06-03")]);
    csvRows.push([]); // empty spacer line

    // Table Columns
    csvRows.push([
      "Order ID",
      "Placed Date",
      "Customer Name",
      "Items Purchased",
      "Order Status",
      "Order Amount ($)",
      "Vendor Quoted (90% Payout) ($)",
      "Stark Commission (10% Profit) ($)"
    ]);

    // Data rows
    filteredVendorOrders.forEach(order => {
      const stats = getVendorOrderStats(order, selectedVendor.id);
      const formattedDate = new Date(order.placedDate).toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
      csvRows.push([
        order.id,
        formattedDate,
        order.customer.name,
        stats.itemsDescription,
        order.orderStatus,
        stats.orderAmount.toFixed(2),
        stats.quotedAmount.toFixed(2),
        stats.profit.toFixed(2)
      ]);
    });

    // Summary totals row
    csvRows.push([]);
    csvRows.push([
      "Total Summary",
      "",
      "",
      "",
      "",
      detailTotals.totalOrder.toFixed(2),
      detailTotals.totalQuoted.toFixed(2),
      detailTotals.totalProfit.toFixed(2)
    ]);

    // Build and trigger download
    const csvContent = csvRows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const dateLabel = detailMonthFilter === "all" ? "all_time" : detailMonthFilter.replace("/", "_");
    const filename = `stark_billing_${selectedVendor.name.toLowerCase().replace(/\s+/g, "_")}_${dateLabel}.csv`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen w-full bg-[#F9FAFB] text-[#1F2937] font-sans overflow-x-hidden">
      
      <LeftSidebar activePage="billing" isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

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
            <span className="font-bold text-sm">Stark Billing</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded hover:bg-gray-100 text-stark-muted cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
        </div>

        {/* Dynamic view switcher */}
        {!selectedVendorId ? (
          /* ========================================================
             VIEW 1: BILLING MAIN DASHBOARD
             ======================================================== */
          <div className="space-y-6">
            
            {/* BEGIN: ContentHeader */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4" data-purpose="page-header">
              <div>
                <h2 className="text-2xl font-bold">Billing Dashboard</h2>
                <p className="text-sm text-stark-muted">
                  Track vendor payouts, calculate platform profits, and monitor sales and refunds.
                </p>
              </div>
            </header>
            {/* END: ContentHeader */}

            {/* OVERALL SUMMARY BLOCKS */}
            <section className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stark-muted">Overall Financials Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Orders Card */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-stark-muted">Total Sales & Orders</span>
                    <h4 className="text-2xl font-black text-stark-text mt-1">
                      ${overallKPIs.orderAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h4>
                    <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                      {overallKPIs.ordersCount} Successful Orders
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-stark-primary/10 rounded-xl flex items-center justify-center text-stark-primary">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                </div>

                {/* Refunds Card */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-stark-muted">Total Refunds</span>
                    <h4 className="text-2xl font-black text-red-600 mt-1">
                      ${overallKPIs.refundAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h4>
                    <p className="text-xs text-red-500 font-medium mt-1 flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                      {overallKPIs.refundCount} Refunded Orders
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                </div>

                {/* Profit Card */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-stark-muted">Total Stark Profit (10% Comm.)</span>
                    <h4 className="text-2xl font-black text-indigo-700 mt-1">
                      ${overallKPIs.profit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h4>
                    <p className="text-xs text-indigo-500 font-medium mt-1 flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                      Marketplace Commissions
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                </div>

              </div>
            </section>

            {/* MONTHLY SUMMARY BLOCKS */}
            <section className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stark-muted">
                This Month ({CURRENT_MONTH_LONG})
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Orders Card */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-stark-muted">Monthly Sales & Orders</span>
                    <h4 className="text-2xl font-black text-stark-text mt-1">
                      ${monthlyKPIs.orderAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h4>
                    <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                      {monthlyKPIs.ordersCount} Successful Orders
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-stark-primary/10 rounded-xl flex items-center justify-center text-stark-primary">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                </div>

                {/* Refunds Card */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-stark-muted">Monthly Refunds</span>
                    <h4 className="text-2xl font-black text-red-600 mt-1">
                      ${monthlyKPIs.refundAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h4>
                    <p className="text-xs text-red-500 font-medium mt-1 flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                      {monthlyKPIs.refundCount} Refunded Orders
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                </div>

                {/* Profit Card */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-stark-muted">Monthly Stark Profit</span>
                    <h4 className="text-2xl font-black text-indigo-700 mt-1">
                      ${monthlyKPIs.profit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h4>
                    <p className="text-xs text-indigo-500 font-medium mt-1 flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                      Marketplace Commissions
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                </div>

              </div>
            </section>

            {/* FILTER TOOLBAR */}
            <section className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                
                {/* Vendor Dropdown */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-stark-muted">Vendor:</span>
                  <select
                    value={vendorFilter}
                    onChange={(e) => setVendorFilter(e.target.value)}
                    className="border border-gray-200 text-xs px-3 py-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-stark-primary/20"
                  >
                    <option value="all">All Vendors</option>
                    {VENDORS.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>

                {/* Month Dropdown */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-stark-muted">Month:</span>
                  <select
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    className="border border-gray-200 text-xs px-3 py-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-stark-primary/20"
                  >
                    <option value="all">All Time</option>
                    {uniqueMonths.map(m => (
                      <option key={m} value={m}>
                        {m === "Jun/2026" ? "June 2026" : m === "May/2026" ? "May 2026" : m}
                      </option>
                    ))}
                  </select>
                </div>

              </div>
              <p className="text-xs text-stark-muted font-medium">
                Showing aggregates for {monthFilter === "all" ? "All Time" : monthFilter}
              </p>
            </section>

            {/* VENDORS BILLING LIST */}
            <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base">Latest Vendors Billing Records</h3>
                  <p className="text-xs text-stark-muted">Calculated on non-cancelled orders.</p>
                </div>
                <span className="text-xs bg-stark-primary/10 text-stark-primary px-3 py-1.5 rounded-lg font-bold">
                  {latestVendorsList.length} Businesses
                </span>
              </div>

              {latestVendorsList.length === 0 ? (
                <div className="flex flex-col items-center justify-center bg-white rounded-xl border border-gray-150 p-12 shadow-sm text-center">
                  <img
                    src="/empty-state.png"
                    alt="Empty state illustration"
                    className="w-64 h-64 object-contain mb-6 rounded-2xl"
                  />
                  <h3 className="text-lg font-black text-stark-text mb-2">No Billing Records Found</h3>
                  <p className="text-sm text-stark-muted max-w-sm">
                    There are currently no records available to display.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-stark-accent border-b border-gray-100 text-[10px] uppercase font-bold text-stark-muted tracking-wider">
                        <th className="px-6 py-4">Vendor Business</th>
                        <th className="px-6 py-4 text-center">Orders Count</th>
                        <th className="px-6 py-4 text-right">Order Amount</th>
                        <th className="px-6 py-4 text-right">Refund Totals</th>
                        <th className="px-6 py-4 text-right">Vendor Payout (90%)</th>
                        <th className="px-6 py-4 text-right text-indigo-700">Stark Profit (10%)</th>
                        <th className="px-6 py-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150 text-xs">
                      {latestVendorsList.map(({ vendor, ordersCount, orderAmount, refundCount, refundAmount, quotedAmount, profit }) => (
                        <tr key={vendor.id} className="hover:bg-stark-accent/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              {vendor.logoUrl ? (
                                <img
                                  className="w-9 h-9 rounded-lg object-cover border border-gray-200"
                                  src={vendor.logoUrl}
                                  alt={vendor.name}
                                />
                              ) : (
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold ${vendor.color || "bg-stark-primary"}`}>
                                  {vendor.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <div className="font-bold text-stark-text">{vendor.name}</div>
                                <div className="text-[10px] text-stark-muted mt-0.5">{vendor.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center font-semibold text-stark-text">
                            {ordersCount} orders
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-stark-text">
                            ${orderAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-4 text-right font-medium text-red-600">
                            ${refundAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            <span className="text-[10px] text-stark-muted block">({refundCount} items)</span>
                          </td>
                          <td className="px-6 py-4 text-right font-semibold text-emerald-700">
                            ${quotedAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-4 text-right font-black text-indigo-700 bg-indigo-50/20">
                            ${profit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => {
                                setSelectedVendorId(vendor.id);
                                setDetailMonthFilter(CURRENT_MONTH_SHORT); // default to June 2026
                              }}
                              className="bg-stark-primary/10 text-stark-primary hover:bg-stark-primary hover:text-white px-3 py-1.5 rounded-lg font-bold transition-all text-[11px] cursor-pointer"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

          </div>
        ) : (
          /* ========================================================
             VIEW 2: VENDOR BILLING DETAILED SUB-VIEW
             ======================================================== */
          selectedVendor && (
            <div className="space-y-6">
              
              {/* BACK BUTTON AND HEADER */}
              <div className="flex items-center space-x-3 mb-2">
                <button
                  onClick={() => setSelectedVendorId(null)}
                  className="bg-white hover:bg-stark-accent text-stark-muted p-2 rounded-lg border border-gray-200 flex items-center justify-center transition-all cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </button>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stark-muted">Billing Records</span>
                  <h2 className="text-xl font-bold flex items-center space-x-2">
                    <span>{selectedVendor.name}</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${selectedVendor.status === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"}`}>
                      {selectedVendor.status || "Active"}
                    </span>
                  </h2>
                </div>
              </div>

              {/* VENDOR METADATA HEADER */}
              <section className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <span className="text-[10px] text-stark-muted uppercase font-bold block">Contact Person</span>
                  <span className="text-sm font-bold text-stark-text block mt-1">
                    {selectedVendor.contactPerson || "Albert Flores"}
                  </span>
                  <span className="text-xs text-stark-muted block">
                    {selectedVendor.position || "Manager"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stark-muted uppercase font-bold block">Phone Number</span>
                  <span className="text-sm font-bold text-stark-text block mt-1">
                    {selectedVendor.phone || "+1 (555) 019-2834"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stark-muted uppercase font-bold block">Email Address</span>
                  <span className="text-sm font-bold text-stark-text block mt-1">
                    {selectedVendor.email || "info@alphatech.com"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stark-muted uppercase font-bold block">GST Registration</span>
                  <span className="text-sm font-bold text-stark-text block mt-1">
                    {selectedVendor.gst || "27AADCA1234F1Z5"}
                  </span>
                </div>
              </section>

              {/* FILTERS AND EXPORT CONTROLS */}
              <section className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-semibold text-stark-muted">Select Month:</span>
                  <select
                    value={detailMonthFilter}
                    onChange={(e) => setDetailMonthFilter(e.target.value)}
                    className="border border-gray-200 text-xs px-3 py-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-stark-primary/20"
                  >
                    <option value="all">All Time</option>
                    {uniqueMonths.map(m => (
                      <option key={m} value={m}>
                        {m === "Jun/2026" ? "June 2026" : m === "May/2026" ? "May 2026" : m}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button
                  onClick={handleExportCSV}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all font-medium text-xs shadow-sm shrink-0 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                  <span>Export to Excel (CSV)</span>
                </button>
              </section>

              {/* DETAILED TRANSACTIONS TABLE */}
              <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-5 border-b border-gray-100">
                  <h3 className="font-bold text-base">Order Sales Breakdown</h3>
                  <p className="text-xs text-stark-muted">Detailed records of order items matching this vendor.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-stark-accent border-b border-gray-100 text-[10px] uppercase font-bold text-stark-muted tracking-wider">
                        <th className="px-6 py-4">Order ID</th>
                        <th className="px-6 py-4">Placed Date</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Items Purchased</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-right">Order Amount</th>
                        <th className="px-6 py-4 text-right">Vendor Quoted (90%)</th>
                        <th className="px-6 py-4 text-right text-indigo-700">Stark Profit (10%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150 text-xs">
                      {filteredVendorOrders.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="text-center py-10 text-stark-muted font-medium">
                            No orders found for this vendor in the selected period.
                          </td>
                        </tr>
                      ) : (
                        filteredVendorOrders.map(order => {
                          const stats = getVendorOrderStats(order, selectedVendor.id);
                          const dateObj = new Date(order.placedDate);
                          const formattedDate = dateObj.toLocaleString("en-US", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true
                          });

                          return (
                            <tr key={order.id} className="hover:bg-stark-accent/50 transition-colors">
                              <td className="px-6 py-4 font-bold text-stark-primary">
                                {order.id}
                              </td>
                              <td className="px-6 py-4 text-stark-muted">
                                {formattedDate}
                              </td>
                              <td className="px-6 py-4 font-medium text-stark-text">
                                {order.customer.name}
                              </td>
                              <td className="px-6 py-4 text-stark-muted italic max-w-xs truncate" title={stats.itemsDescription}>
                                {stats.itemsDescription}
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  order.orderStatus === "Delivered" ? "bg-emerald-100 text-emerald-800" :
                                  order.orderStatus === "Refunded" ? "bg-red-100 text-red-800" :
                                  order.orderStatus === "Cancelled" ? "bg-gray-150 text-gray-600" :
                                  "bg-blue-100 text-blue-800"
                                }`}>
                                  {order.orderStatus}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right font-bold text-stark-text">
                                ${stats.orderAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="px-6 py-4 text-right font-semibold text-emerald-700">
                                ${stats.quotedAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="px-6 py-4 text-right font-black text-indigo-700 bg-indigo-50/20">
                                ${stats.profit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                            </tr>
                          );
                        })
                      )}
                      
                      {/* SUMMARY TOTAL ROW */}
                      {filteredVendorOrders.length > 0 && (
                        <tr className="bg-gray-50 font-black border-t-2 border-gray-200 text-stark-text">
                          <td colSpan={5} className="px-6 py-5 text-right uppercase text-[10px] tracking-wider text-stark-muted font-bold">
                            Summary Total Row
                          </td>
                          <td className="px-6 py-5 text-right text-sm">
                            ${detailTotals.totalOrder.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-5 text-right text-emerald-700 text-sm border-l border-gray-150">
                            ${detailTotals.totalQuoted.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-5 text-right text-indigo-700 text-sm bg-indigo-50/30 border-l border-gray-150">
                            ${detailTotals.totalProfit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

            </div>
          )
        )}

      </main>
      )}
      {/* END: MainContent */}

    </div>
  );
}
