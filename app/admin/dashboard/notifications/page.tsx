"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { VENDORS, CUSTOMERS, DELIVERY_PARTNERS, Vendor, Customer, DeliveryPartner } from "../orders/data";

interface SentNotification {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientRole: "Customer" | "Vendor" | "Delivery Partner";
  title: string;
  message: string;
  sentAt: string; // ISO String
  status: "Sent" | "Delivered";
}

// Initial mockup list of sent notifications
const INITIAL_NOTIFICATIONS: SentNotification[] = [
  {
    id: "NTF-1001",
    recipientId: "c1",
    recipientName: "Jane Cooper",
    recipientRole: "Customer",
    title: "Welcome to Stark Marketplace",
    message: "Hi Jane, thank you for joining Stark. Explore our wide range of products and enjoy exclusive deals!",
    sentAt: "2026-06-02T15:30:00Z",
    status: "Delivered"
  },
  {
    id: "NTF-1002",
    recipientId: "v1",
    recipientName: "Alpha Tech",
    recipientRole: "Vendor",
    title: "Billing Cycle Update",
    message: "Hello Alpha Tech team, please note that the billing payout cycle for the month of May has been completed. The payouts have been processed.",
    sentAt: "2026-06-01T11:20:00Z",
    status: "Delivered"
  },
  {
    id: "NTF-1003",
    recipientId: "dp1",
    recipientName: "Robert Fox",
    recipientRole: "Delivery Partner",
    title: "New Delivery Assigned",
    message: "Hi Robert, a new delivery job for order ORD-9283 is assigned to you. Please head to Alpha Tech warehouse to collect the package.",
    sentAt: "2026-06-01T08:30:00Z",
    status: "Delivered"
  },
  {
    id: "NTF-1004",
    recipientId: "c2",
    recipientName: "Wade Warren",
    recipientRole: "Customer",
    title: "Order Dispatched",
    message: "Your order ORD-9286 has been successfully packed and handed over to our delivery partner. It will arrive shortly.",
    sentAt: "2026-05-30T10:15:00Z",
    status: "Delivered"
  }
];

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

export default function NotificationsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // States
  const [notifications, setNotifications] = useState<SentNotification[]>(INITIAL_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "Customer" | "Vendor" | "Delivery Partner">("all");

  // Send Notification Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalRole, setModalRole] = useState<"Customer" | "Vendor" | "Delivery Partner">("Customer");
  const [recipientSearchQuery, setRecipientSearchQuery] = useState("");
  const [selectedRecipientId, setSelectedRecipientId] = useState("");
  const [selectedRecipientName, setSelectedRecipientName] = useState("");
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [formError, setFormError] = useState("");

  // KPI Metrics
  const metrics = useMemo(() => {
    return {
      total: notifications.length,
      customer: notifications.filter(n => n.recipientRole === "Customer").length,
      vendor: notifications.filter(n => n.recipientRole === "Vendor").length,
      deliveryPartner: notifications.filter(n => n.recipientRole === "Delivery Partner").length
    };
  }, [notifications]);

  // Recipient Options based on modalRole and search input inside modal
  const filteredRecipients = useMemo(() => {
    const query = recipientSearchQuery.toLowerCase();
    if (modalRole === "Customer") {
      return CUSTOMERS.filter(c => c.name.toLowerCase().includes(query) || c.email.toLowerCase().includes(query));
    } else if (modalRole === "Vendor") {
      return VENDORS.filter(v => v.name.toLowerCase().includes(query) || (v.email || "").toLowerCase().includes(query));
    } else {
      return DELIVERY_PARTNERS.filter(dp => dp.name.toLowerCase().includes(query));
    }
  }, [modalRole, recipientSearchQuery]);

  // Handle opening the send modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
    setModalRole("Customer");
    setRecipientSearchQuery("");
    setSelectedRecipientId("");
    setSelectedRecipientName("");
    setNotificationTitle("");
    setNotificationMessage("");
    setFormError("");
  };

  // Handle changing the selected role inside the modal
  const handleRoleChange = (role: "Customer" | "Vendor" | "Delivery Partner") => {
    setModalRole(role);
    setRecipientSearchQuery("");
    setSelectedRecipientId("");
    setSelectedRecipientName("");
    setFormError("");
  };

  // Handle selecting a recipient from the matching list
  const handleSelectRecipient = (id: string, name: string) => {
    setSelectedRecipientId(id);
    setSelectedRecipientName(name);
  };

  // Send Action
  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRecipientId || !selectedRecipientName) {
      setFormError("Please search and select a recipient.");
      return;
    }
    if (!notificationTitle.trim()) {
      setFormError("Please enter a notification title.");
      return;
    }
    if (!notificationMessage.trim()) {
      setFormError("Please enter the notification message.");
      return;
    }

    const newNtf: SentNotification = {
      id: `NTF-${Date.now()}`,
      recipientId: selectedRecipientId,
      recipientName: selectedRecipientName,
      recipientRole: modalRole,
      title: notificationTitle.trim(),
      message: notificationMessage.trim(),
      sentAt: new Date().toISOString(),
      status: "Sent"
    };

    setNotifications([newNtf, ...notifications]);
    setIsModalOpen(false);
  };

  // Sent Notification filter
  const filteredNotificationsList = useMemo(() => {
    return notifications.filter(n => {
      const matchesSearch =
        n.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === "all" || n.recipientRole === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [notifications, searchQuery, roleFilter]);

  return (
    <div className="flex min-h-screen w-full bg-[#F9FAFB] text-[#1F2937] font-sans overflow-x-hidden">
      
      {/* BEGIN: LeftSidebar */}
      <aside
        className={`w-64 bg-stark-sidebar border-r border-gray-200 flex flex-col fixed inset-y-0 left-0 z-40 transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        data-purpose="navigation-sidebar"
      >
        {/* Logo Section */}
        <div className="p-6 flex items-center space-x-3">
          <div className="w-8 h-8 bg-stark-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
            S
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Stark</h1>
            <p className="text-xs text-stark-muted">Analytics Dashboard</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          <p className="text-[10px] uppercase font-semibold text-stark-muted px-2 mb-2 tracking-wider">
            Main Menu
          </p>
          
          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors"
            data-purpose="nav-item"
            href="/admin/dashboard"
          >
            {renderSidebarIcon("dashboard")}
            <span>Dashboard</span>
          </Link>

          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors"
            data-purpose="nav-item"
            href="/admin/dashboard/orders"
          >
            {renderSidebarIcon("orders")}
            <span>Orders</span>
          </Link>

          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors"
            data-purpose="nav-item"
            href="/admin/dashboard/categories"
          >
            {renderSidebarIcon("categories")}
            <span>Categories</span>
          </Link>

          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors"
            data-purpose="nav-item"
            href="/admin/dashboard/subcategories"
          >
            {renderSidebarIcon("subcategories")}
            <span>Sub Categories</span>
          </Link>

          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors"
            data-purpose="nav-item"
            href="/admin/dashboard/minicategories"
          >
            {renderSidebarIcon("minicategories")}
            <span>Mini Categories</span>
          </Link>

          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors"
            data-purpose="nav-item"
            href="/admin/dashboard/macrocategories"
          >
            {renderSidebarIcon("macrocategories")}
            <span>Macro Categories</span>
          </Link>

          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors"
            data-purpose="nav-item"
            href="/admin/dashboard/products"
          >
            {renderSidebarIcon("products")}
            <span>Products</span>
          </Link>

          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors"
            data-purpose="nav-item"
            href="/admin/dashboard/billing"
          >
            {renderSidebarIcon("billing")}
            <span>Billing</span>
          </Link>

          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors"
            data-purpose="nav-item"
            href="/admin/dashboard/customers"
          >
            {renderSidebarIcon("customers")}
            <span>Customers</span>
          </Link>

          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors"
            data-purpose="nav-item"
            href="/admin/dashboard/vendors"
          >
            {renderSidebarIcon("vendors")}
            <span>Vendors</span>
          </Link>

          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-stark-primary/10 text-stark-primary font-medium"
            data-purpose="nav-item-active"
            href="/admin/dashboard/notifications"
          >
            {renderSidebarIcon("notifications")}
            <span>Notifications</span>
          </Link>

          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors"
            data-purpose="nav-item"
            href="/admin/dashboard/emails"
          >
            {renderSidebarIcon("emails")}
            <span>Emails</span>
          </Link>

          <p className="text-[10px] uppercase font-semibold text-stark-muted px-2 pt-6 mb-2 tracking-wider">
            Account
          </p>
          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors"
            href="#"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <span>My Account</span>
          </Link>
          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors"
            href="#"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <span>Settings</span>
          </Link>
          
          <div className="mt-4 pb-4">
            <Link
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
              href="/admin/login"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <span>Logout</span>
            </Link>
          </div>
        </nav>

        {/* User Profile at Bottom */}
        <div className="p-4 border-t border-gray-100 mt-auto" data-purpose="user-info">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-stark-accent overflow-hidden border-2 border-stark-primary/20">
              <img
                alt="Ronald Richards"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0E_P6EyLM3jbUWt532-6emYjDqrI5QO96-RdiPp2RL4ySK1ENEHNUe6vjTwDlhHoubp7jcnLqDV7oBm_LXeq1kzJ9QjorlgA-aEwuBH_3bnANUQ5I_CL1Ujt-F4EtW3MLRo3EFFoCYFh_vpeeqi6hNPw3-PYEOwxPWfAaY0jVvKcgDvnbc8ZilpJSvT16Li-88HvTRcqnHb2AlESYl3_48_qMyuaPkNjKXwO2C2C4q3Mt_BATrM_PpJYS35ckg9-NZY0P5L6Ypo0"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">Ronald Richards</p>
              <p className="text-[10px] text-stark-muted truncate">
                ronaldrichards@gmail.com
              </p>
            </div>
          </div>
        </div>
      </aside>
      {/* END: LeftSidebar */}

      {/* Sidebar Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/45 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* BEGIN: MainContent */}
      <main className="ml-0 md:ml-64 flex-1 min-w-0 w-full p-4 md:p-8 min-h-screen transition-all duration-300">
        
        {/* Mobile Header Bar */}
        <div className="flex md:hidden items-center justify-between bg-white border border-gray-200 p-4 rounded-xl mb-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-stark-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">S</div>
            <span className="font-bold text-sm">Stark Notifications</span>
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

        {/* BEGIN: ContentHeader */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8" data-purpose="page-header">
          <div>
            <h2 className="text-2xl font-bold">Notification Management</h2>
            <p className="text-sm text-stark-muted">
              Compose and send real-time system alerts to customers, vendors, and delivery partners.
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleOpenModal}
              className="bg-stark-primary hover:bg-stark-dark text-white px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-all shadow-sm font-medium text-sm shrink-0 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <span>Send Notification</span>
            </button>
          </div>
        </header>
        {/* END: ContentHeader */}

        {/* WORKSPACE AREA */}
        <div className="space-y-6">
          
          {/* KPI statistics cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-stark-muted tracking-wider">Total Sent</p>
              <h4 className="text-xl font-black text-stark-text mt-1">{metrics.total}</h4>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">To Customers</p>
              <h4 className="text-xl font-black text-blue-700 mt-1">{metrics.customer}</h4>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">To Vendors</p>
              <h4 className="text-xl font-black text-emerald-700 mt-1">{metrics.vendor}</h4>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-purple-600 tracking-wider">To Delivery Partners</p>
              <h4 className="text-xl font-black text-purple-700 mt-1">{metrics.deliveryPartner}</h4>
            </div>
          </div>

          {/* Filtering Toolbar */}
          <section className="bg-white rounded-xl border border-gray-150 p-4 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Search */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search by Recipient / Title / Content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                />
              </div>

              {/* Role filter */}
              <div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                >
                  <option value="all">All Roles</option>
                  <option value="Customer">Customers</option>
                  <option value="Vendor">Vendors</option>
                  <option value="Delivery Partner">Delivery Partners</option>
                </select>
              </div>
            </div>
          </section>

          {/* SENT NOTIFICATIONS LOG TABLE */}
          <section className="bg-white rounded-xl border border-gray-150 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-base">Notification Sent Logs</h3>
              <span className="text-xs bg-stark-primary/10 text-stark-primary px-3 py-1 rounded-lg font-bold">
                {filteredNotificationsList.length} Messages
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-stark-accent border-b border-gray-100 text-[10px] uppercase font-bold text-stark-muted tracking-wider">
                    <th className="px-6 py-4">Recipient</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Notification Title</th>
                    <th className="px-6 py-4">Message Context</th>
                    <th className="px-6 py-4">Sent Time</th>
                    <th className="px-6 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 text-xs">
                  {filteredNotificationsList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-stark-muted font-medium">
                        No notifications logs found matching the filters.
                      </td>
                    </tr>
                  ) : (
                    filteredNotificationsList.map((ntf) => {
                      const formattedDate = new Date(ntf.sentAt).toLocaleString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                      });

                      return (
                        <tr key={ntf.id} className="hover:bg-stark-accent/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-stark-text">
                            {ntf.recipientName}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              ntf.recipientRole === "Customer" ? "bg-blue-100 text-blue-800" :
                              ntf.recipientRole === "Vendor" ? "bg-emerald-100 text-emerald-800" :
                              "bg-purple-100 text-purple-800"
                            }`}>
                              {ntf.recipientRole}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-stark-text">
                            {ntf.title}
                          </td>
                          <td className="px-6 py-4 text-stark-muted max-w-sm truncate" title={ntf.message}>
                            {ntf.message}
                          </td>
                          <td className="px-6 py-4 text-stark-muted">
                            {formattedDate}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
                              {ntf.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </div>

      </main>
      {/* END: MainContent */}

      {/* POPUP MODAL: SEND NOTIFICATION */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity duration-300">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-150">
              <h3 className="font-bold text-lg text-stark-text">Send System Notification</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSendNotification} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-lg">
                  {formError}
                </div>
              )}

              {/* Recipient Role Selection */}
              <div>
                <label className="block text-xs font-bold text-stark-muted uppercase tracking-wider mb-2">
                  Recipient Role
                </label>
                <select
                  value={modalRole}
                  onChange={(e) => handleRoleChange(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-xs bg-gray-50 focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                >
                  <option value="Customer">Customer</option>
                  <option value="Vendor">Vendor</option>
                  <option value="Delivery Partner">Delivery Partner</option>
                </select>
              </div>

              {/* Search Recipient Name */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stark-muted uppercase tracking-wider">
                  Search & Select Recipient
                </label>
                <input
                  type="text"
                  placeholder={`Search ${modalRole.toLowerCase()}s by name...`}
                  value={recipientSearchQuery}
                  onChange={(e) => setRecipientSearchQuery(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                />

                {/* Recipient Selection Dropdown Menu */}
                <div className="border border-gray-150 rounded-lg max-h-36 overflow-y-auto bg-gray-50/50 divide-y divide-gray-100">
                  {filteredRecipients.length === 0 ? (
                    <div className="p-3 text-center text-xs text-stark-muted">
                      No matching {modalRole.toLowerCase()}s found.
                    </div>
                  ) : (
                    filteredRecipients.map((rec) => {
                      const isSelected = selectedRecipientId === rec.id;
                      return (
                        <button
                          key={rec.id}
                          type="button"
                          onClick={() => handleSelectRecipient(rec.id, rec.name)}
                          className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-stark-accent transition-colors ${
                            isSelected ? "bg-stark-primary/10 font-bold text-stark-primary" : ""
                          }`}
                        >
                          <div>
                            <span className="block font-medium">{rec.name}</span>
                            <span className="text-[9px] text-stark-muted block">
                              {"email" in rec ? rec.email : "Delivery Personnel"}
                            </span>
                          </div>
                          {isSelected && (
                            <svg className="w-4 h-4 text-stark-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                            </svg>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {selectedRecipientName && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-lg flex items-center justify-between">
                  <span>Selected: {selectedRecipientName} ({modalRole})</span>
                  <button
                    type="button"
                    onClick={() => { setSelectedRecipientId(""); setSelectedRecipientName(""); }}
                    className="text-emerald-700 hover:text-emerald-950 font-bold"
                  >
                    Clear
                  </button>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-stark-muted uppercase tracking-wider mb-2">
                  Notification Title
                </label>
                <input
                  type="text"
                  placeholder="Enter a descriptive title..."
                  value={notificationTitle}
                  onChange={(e) => setNotificationTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-stark-muted uppercase tracking-wider mb-2">
                  Message Content
                </label>
                <textarea
                  rows={3}
                  placeholder="Type the message to send..."
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary resize-none"
                />
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-stark-muted rounded-lg text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stark-primary hover:bg-stark-dark text-white rounded-lg text-xs font-bold shadow-sm cursor-pointer"
                >
                  Send Alert
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
