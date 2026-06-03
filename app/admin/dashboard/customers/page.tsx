"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { CUSTOMERS as INITIAL_CUSTOMERS, Customer } from "../orders/data";

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
    case "billing":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      );
    case "customers":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
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

export default function CustomersPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Customers State
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileQuery, setMobileQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Inactive">("all");
  const [codFilter, setCodFilter] = useState<"all" | "allowed" | "blocked">("all");

  // Modals States
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [pendingDeleteCustomer, setPendingDeleteCustomer] = useState<Customer | null>(null);

  // Form States
  const [formName, setFormName] = useState("");
  const [formMobile, setFormMobile] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formDob, setFormDob] = useState("");
  const [formGender, setFormGender] = useState<"Male" | "Female" | "Other">("Male");
  const [formCodAllowed, setFormCodAllowed] = useState<boolean>(true);
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");
  const [formError, setFormError] = useState("");

  // Helper: New Customer within last 30 days
  const isNewCustomer = (createdAtStr?: string) => {
    if (!createdAtStr) return false;
    const createdDate = new Date(createdAtStr);
    const currentDate = new Date("2026-06-02T00:00:00Z"); // matching simulated date
    const diffTime = Math.abs(currentDate.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  };

  // Filtered & Search-applied Customers
  const filteredCustomers = useMemo(() => {
    return customers
      .filter((cust) => {
        const matchesSearch =
          cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cust.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cust.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesMobile =
          !mobileQuery || cust.phone.replace(/[^0-9+]/g, "").includes(mobileQuery.replace(/[^0-9+]/g, ""));

        const matchesStatus = statusFilter === "all" || cust.status === statusFilter;

        const matchesCod =
          codFilter === "all" ||
          (codFilter === "allowed" && cust.isCodAllowed === true) ||
          (codFilter === "blocked" && cust.isCodAllowed === false);

        return matchesSearch && matchesMobile && matchesStatus && matchesCod;
      })
      .sort((a, b) => {
        // Sort newest first
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }, [customers, searchQuery, mobileQuery, statusFilter, codFilter]);

  // Derived Metrics
  const metrics = useMemo(() => {
    const total = customers.length;
    const active = customers.filter((c) => c.status === "Active").length;
    const inactive = customers.filter((c) => c.status === "Inactive").length;
    const codAllowed = customers.filter((c) => c.isCodAllowed === true).length;
    const newCount = customers.filter((c) => isNewCustomer(c.createdAt)).length;

    return { total, active, inactive, codAllowed, newCount };
  }, [customers]);

  // Paginated Customers
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCustomers, currentPage]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;

  // Add/Edit Handlers
  const handleOpenAddModal = () => {
    setEditingCustomer(null);
    setFormName("");
    setFormMobile("");
    setFormEmail("");
    setFormDob("");
    setFormGender("Male");
    setFormCodAllowed(true);
    setFormStatus("Active");
    setFormError("");
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (cust: Customer) => {
    setEditingCustomer(cust);
    setFormName(cust.name);
    setFormMobile(cust.phone);
    setFormEmail(cust.email);
    setFormDob(cust.dob || "");
    setFormGender(cust.gender || "Male");
    setFormCodAllowed(cust.isCodAllowed !== false); // default to true if undefined
    setFormStatus(cust.status || "Active");
    setFormError("");
    setIsAddEditModalOpen(true);
  };

  // Submit Handler
  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const cleanName = formName.trim();
    const cleanMobile = formMobile.trim();
    const cleanEmail = formEmail.trim().toLowerCase();

    // 1. Validation checks
    if (!cleanName) {
      setFormError("Customer Name is required.");
      return;
    }
    if (!cleanMobile) {
      setFormError("Mobile Number is required.");
      return;
    }
    if (!cleanEmail) {
      setFormError("Email is required.");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    // Email uniqueness check (case-insensitive)
    const emailExists = customers.some(
      (c) => c.email.toLowerCase() === cleanEmail && (!editingCustomer || c.id !== editingCustomer.id)
    );
    if (emailExists) {
      setFormError(`A customer with the email "${cleanEmail}" already exists.`);
      return;
    }

    if (editingCustomer) {
      // Edit mode
      setCustomers(
        customers.map((c) =>
          c.id === editingCustomer.id
            ? {
                ...c,
                name: cleanName,
                phone: cleanMobile,
                email: cleanEmail,
                dob: formDob || undefined,
                gender: formGender,
                isCodAllowed: formCodAllowed,
                status: formStatus,
              }
            : c
        )
      );
    } else {
      // Add mode
      const newCustomer: Customer = {
        id: `cust_${Date.now()}`,
        name: cleanName,
        phone: cleanMobile,
        email: cleanEmail,
        dob: formDob || undefined,
        gender: formGender,
        isCodAllowed: formCodAllowed,
        status: formStatus,
        createdAt: new Date().toISOString(),
      };
      setCustomers([newCustomer, ...customers]);
    }

    setIsAddEditModalOpen(false);
  };

  // Toggle status inline
  const handleToggleStatus = (cust: Customer) => {
    const updatedStatus = cust.status === "Active" ? "Inactive" : "Active";
    setCustomers(
      customers.map((c) => (c.id === cust.id ? { ...c, status: updatedStatus } : c))
    );
  };

  // Toggle COD status inline
  const handleToggleCod = (cust: Customer) => {
    setCustomers(
      customers.map((c) => (c.id === cust.id ? { ...c, isCodAllowed: !c.isCodAllowed } : c))
    );
  };

  // Delete handlers
  const handleDeleteClick = (cust: Customer) => {
    setPendingDeleteCustomer(cust);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (pendingDeleteCustomer) {
      setCustomers(customers.filter((c) => c.id !== pendingDeleteCustomer.id));
    }
    setIsDeleteConfirmOpen(false);
    setPendingDeleteCustomer(null);
  };

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
            className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-stark-primary/10 text-stark-primary font-medium"
            data-purpose="nav-item-active"
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
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors"
            data-purpose="nav-item"
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
            <span className="font-bold text-sm">Stark Customers</span>
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
            <h2 className="text-2xl font-bold">Customer Management</h2>
            <p className="text-sm text-stark-muted">
              Manage client records, toggle active status, and configure Cash on Delivery availability.
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleOpenAddModal}
              className="bg-stark-primary hover:bg-stark-dark text-white px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-all shadow-sm font-medium text-sm shrink-0 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <span>Add Customer</span>
            </button>
          </div>
        </header>
        {/* END: ContentHeader */}

        {/* WORKSPACE AREA */}
        <div className="space-y-6">
          
          {/* Summary statistics cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-stark-muted tracking-wider">Total Customers</p>
              <h4 className="text-xl font-black text-stark-text mt-1">{metrics.total}</h4>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-green-600 tracking-wider">Active</p>
              <h4 className="text-xl font-black text-green-700 mt-1">{metrics.active}</h4>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Inactive</p>
              <h4 className="text-xl font-black text-gray-600 mt-1">{metrics.inactive}</h4>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">COD Allowed</p>
              <h4 className="text-xl font-black text-blue-700 mt-1">{metrics.codAllowed}</h4>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-purple-600 tracking-wider">New (30 Days)</p>
              <h4 className="text-xl font-black text-purple-700 mt-1">{metrics.newCount}</h4>
            </div>
          </div>

          {/* Advanced Filtering Toolbar */}
          <section className="bg-white rounded-xl border border-gray-150 p-4 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search by Name/Email/ID..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                />
              </div>

              {/* Mobile Filter */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Filter by Phone..."
                  value={mobileQuery}
                  onChange={(e) => { setMobileQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                />
              </div>

              {/* Status Select */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value as any); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                >
                  <option value="all">All Statuses</option>
                  <option value="Active">Active Only</option>
                  <option value="Inactive">Inactive Only</option>
                </select>
              </div>

              {/* COD select */}
              <div>
                <select
                  value={codFilter}
                  onChange={(e) => { setCodFilter(e.target.value as any); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                >
                  <option value="all">COD: All Policies</option>
                  <option value="allowed">COD: Allowed Only</option>
                  <option value="blocked">COD: Blocked Only</option>
                </select>
              </div>
            </div>
          </section>

          {/* Customer Table List */}
          <section className="bg-white border border-gray-150 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto w-full">
              <table className="min-w-full divide-y divide-gray-100 text-left text-xs">
                <thead className="bg-gray-50 text-[10px] font-bold text-stark-muted uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Customer Info</th>
                    <th className="px-6 py-4">Mobile</th>
                    <th className="px-6 py-4">Date of Birth</th>
                    <th className="px-6 py-4">Gender</th>
                    <th className="px-6 py-4 text-center">COD Policy</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-stark-text">
                  {paginatedCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-stark-muted">
                        No customer records match your filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedCustomers.map((cust) => {
                      const isNew = isNewCustomer(cust.createdAt);
                      return (
                        <tr key={cust.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-stark-accent flex items-center justify-center font-bold text-stark-primary uppercase text-xs">
                                {cust.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                              </div>
                              <div>
                                <div className="font-bold flex items-center space-x-1.5">
                                  <span>{cust.name}</span>
                                  {isNew && (
                                    <span className="bg-purple-100 text-purple-700 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full tracking-wider scale-90">
                                      New
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-stark-muted font-normal mt-0.5">{cust.email}</div>
                                <div className="text-[8px] text-gray-400 font-mono mt-0.5">{cust.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-mono text-[11px] text-gray-600">
                            {cust.phone}
                          </td>
                          <td className="px-6 py-4 text-gray-500 font-normal">
                            {cust.dob ? new Date(cust.dob).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              cust.gender === "Male" 
                                ? "bg-blue-50 text-blue-700" 
                                : cust.gender === "Female" 
                                ? "bg-pink-50 text-pink-700" 
                                : "bg-gray-100 text-gray-700"
                            }`}>
                              {cust.gender || "Other"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleToggleCod(cust)}
                              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center space-x-1 cursor-pointer transition-all ${
                                cust.isCodAllowed !== false
                                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                  : "bg-red-50 text-red-700 hover:bg-red-100"
                              }`}
                              title="Click to toggle Cash on Delivery configuration"
                            >
                              <span>{cust.isCodAllowed !== false ? "Allowed" : "Blocked"}</span>
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleToggleStatus(cust)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold inline-flex items-center space-x-1.5 cursor-pointer transition-all ${
                                cust.status === "Active"
                                  ? "bg-green-50 text-green-700 hover:bg-green-100/80"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                              title="Click to toggle account status"
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${cust.status === "Active" ? "bg-green-500" : "bg-gray-400"}`}></span>
                              <span>{cust.status || "Active"}</span>
                            </button>
                          </td>
                          <td className="px-6 py-4 text-right space-x-1">
                            <button
                              onClick={() => handleOpenEditModal(cust)}
                              className="p-1 text-gray-400 hover:text-stark-primary rounded hover:bg-stark-accent transition-all cursor-pointer"
                              title="Edit Client"
                            >
                              <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(cust)}
                              className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition-all cursor-pointer"
                              title="Delete Client Record"
                            >
                              <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <span className="text-stark-muted">
                  Showing page <strong className="text-stark-text">{currentPage}</strong> of <strong className="text-stark-text">{totalPages}</strong>
                </span>
                <div className="flex gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
                    className="px-3 py-1.5 border border-gray-200 bg-white rounded-lg text-stark-text hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold cursor-pointer"
                  >
                    Previous
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
                    className="px-3 py-1.5 border border-gray-200 bg-white rounded-lg text-stark-text hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* BEGIN: Add/Edit Customer Modal */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsAddEditModalOpen(false)}></div>
          
          <form 
            onSubmit={handleSaveCustomer}
            className="bg-white rounded-2xl max-w-lg w-full relative z-10 flex flex-col shadow-2xl border border-gray-100 overflow-hidden animate-fade-in"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <div>
                <h3 className="font-black text-lg text-stark-text">
                  {editingCustomer ? "Edit Customer" : "Add Customer"}
                </h3>
                <p className="text-xs text-stark-muted">
                  Configure demographic settings and default billing constraints for this client.
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setIsAddEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1 cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {formError && (
                <div className="bg-red-50 border border-red-100 text-red-700 text-xs px-3 py-2 rounded-lg font-semibold">
                  {formError}
                </div>
              )}

              {/* Customer Name */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-stark-muted">Customer Name*</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Jane Cooper"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                />
              </div>

              {/* Mobile Number & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-stark-muted">Mobile Number*</label>
                  <input
                    type="text"
                    required
                    value={formMobile}
                    onChange={(e) => setFormMobile(e.target.value)}
                    placeholder="e.g. +1 (555) 011-2839"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-stark-muted">Email Address*</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="e.g. jane.cooper@example.com"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                  />
                </div>
              </div>

              {/* DOB & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-stark-muted">Date of Birth</label>
                  <input
                    type="date"
                    value={formDob}
                    onChange={(e) => setFormDob(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-stark-muted">Gender*</label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value as any)}
                    required
                    className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* COD Allowed & Active Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-stark-muted">Is COD Allowed?*</label>
                  <select
                    value={formCodAllowed ? "yes" : "no"}
                    onChange={(e) => setFormCodAllowed(e.target.value === "yes")}
                    className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary font-bold text-stark-text"
                  >
                    <option value="yes" className="text-green-700">Yes, Allowed</option>
                    <option value="no" className="text-red-700">No, Blocked</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-stark-muted">Status*</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary font-bold text-stark-text"
                  >
                    <option value="Active">Active Account</option>
                    <option value="Inactive">Inactive Account</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end space-x-2 shrink-0">
              <button 
                type="button"
                onClick={() => setIsAddEditModalOpen(false)}
                className="px-4 py-2 border border-gray-250 text-gray-600 rounded-lg hover:bg-gray-100 transition-all font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-5 py-2 bg-stark-primary hover:bg-stark-dark text-white rounded-lg transition-all shadow-sm font-semibold text-xs cursor-pointer"
              >
                {editingCustomer ? "Save Changes" : "Create Record"}
              </button>
            </div>
          </form>
        </div>
      )}
      {/* END: Add/Edit Customer Modal */}

      {/* BEGIN: Confirm Delete Modal */}
      {isDeleteConfirmOpen && pendingDeleteCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs" onClick={() => setIsDeleteConfirmOpen(false)}></div>
          
          <div className="bg-white rounded-2xl max-w-sm w-full relative z-10 p-6 flex flex-col shadow-2xl border border-gray-100 animate-scale-up">
            <div className="text-red-500 mb-2">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
            <h3 className="font-black text-base text-stark-text">Delete Customer Record</h3>
            <p className="text-xs text-stark-muted mt-2">
              Are you sure you want to delete <strong className="text-stark-text">"{pendingDeleteCustomer.name}"</strong>? This action is irreversible and deletes their default demographics history.
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-3.5 py-2 border border-gray-250 text-gray-600 rounded-lg hover:bg-gray-100 transition-all font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-semibold text-xs cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* END: Confirm Delete Modal */}

    </div>
  );
}
