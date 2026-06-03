"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { VENDORS as INITIAL_VENDORS, Vendor } from "../orders/data";

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

export default function VendorsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Vendors State
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileQuery, setMobileQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Inactive">("all");
  const [gstFilter, setGstFilter] = useState<"all" | "registered" | "unregistered">("all");

  // Modals States
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [pendingDeleteVendor, setPendingDeleteVendor] = useState<Vendor | null>(null);

  // Form States
  const [formName, setFormName] = useState("");
  const [formContactPerson, setFormContactPerson] = useState("");
  const [formPosition, setFormPosition] = useState("");
  const [formMobile, setFormMobile] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formGst, setFormGst] = useState("");
  const [formLogoUrl, setFormLogoUrl] = useState("");
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");
  const [formError, setFormError] = useState("");

  // Helper: New Vendor within last 30 days
  const isNewVendor = (createdAtStr?: string) => {
    if (!createdAtStr) return false;
    const createdDate = new Date(createdAtStr);
    const currentDate = new Date("2026-06-02T00:00:00Z"); // matching simulated date
    const diffTime = Math.abs(currentDate.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  };

  // Filtered & Search-applied Vendors
  const filteredVendors = useMemo(() => {
    return vendors
      .filter((vend) => {
        const matchesSearch =
          vend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (vend.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          vend.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesMobile =
          !mobileQuery || 
          (vend.phone || "").replace(/[^0-9+]/g, "").includes(mobileQuery.replace(/[^0-9+]/g, ""));

        const matchesStatus = statusFilter === "all" || vend.status === statusFilter;

        const matchesGst =
          gstFilter === "all" ||
          (gstFilter === "registered" && !!vend.gst) ||
          (gstFilter === "unregistered" && !vend.gst);

        return matchesSearch && matchesMobile && matchesStatus && matchesGst;
      })
      .sort((a, b) => {
        // Sort newest first
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }, [vendors, searchQuery, mobileQuery, statusFilter, gstFilter]);

  // Derived Metrics
  const metrics = useMemo(() => {
    const total = vendors.length;
    const active = vendors.filter((v) => v.status === "Active").length;
    const inactive = vendors.filter((v) => v.status === "Inactive").length;
    const gstRegistered = vendors.filter((v) => !!v.gst).length;
    const newCount = vendors.filter((v) => isNewVendor(v.createdAt)).length;

    return { total, active, inactive, gstRegistered, newCount };
  }, [vendors]);

  // Paginated Vendors
  const paginatedVendors = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredVendors.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredVendors, currentPage]);

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage) || 1;

  // File Upload Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add/Edit Handlers
  const handleOpenAddModal = () => {
    setEditingVendor(null);
    setFormName("");
    setFormContactPerson("");
    setFormPosition("");
    setFormMobile("");
    setFormEmail("");
    setFormGst("");
    setFormLogoUrl("");
    setFormStatus("Active");
    setFormError("");
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (vend: Vendor) => {
    setEditingVendor(vend);
    setFormName(vend.name);
    setFormContactPerson(vend.contactPerson || "");
    setFormPosition(vend.position || "");
    setFormMobile(vend.phone || "");
    setFormEmail(vend.email || "");
    setFormGst(vend.gst || "");
    setFormLogoUrl(vend.logoUrl || "");
    setFormStatus(vend.status || "Active");
    setFormError("");
    setIsAddEditModalOpen(true);
  };

  // Submit Handler
  const handleSaveVendor = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const cleanName = formName.trim();
    const cleanContactPerson = formContactPerson.trim();
    const cleanPosition = formPosition.trim();
    const cleanMobile = formMobile.trim();
    const cleanEmail = formEmail.trim().toLowerCase();
    const cleanGst = formGst.trim().toUpperCase();

    // 1. Validation checks
    if (!cleanName) {
      setFormError("Vendor/Business Name is required.");
      return;
    }
    if (!cleanContactPerson) {
      setFormError("Contact Person Name is required.");
      return;
    }
    if (!cleanPosition) {
      setFormError("Contact Person Position is required.");
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
    const emailExists = vendors.some(
      (v) => (v.email || "").toLowerCase() === cleanEmail && (!editingVendor || v.id !== editingVendor.id)
    );
    if (emailExists) {
      setFormError(`A vendor with the email "${cleanEmail}" already exists.`);
      return;
    }

    if (editingVendor) {
      // Edit mode
      setVendors(
        vendors.map((v) =>
          v.id === editingVendor.id
            ? {
                ...v,
                name: cleanName,
                phone: cleanMobile,
                email: cleanEmail,
                contactPerson: cleanContactPerson,
                position: cleanPosition,
                gst: cleanGst || undefined,
                logoUrl: formLogoUrl || undefined,
                status: formStatus,
              }
            : v
        )
      );
    } else {
      // Add mode
      // Assign a random color class for avatar badge if no logo uploaded
      const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500", "bg-amber-500", "bg-red-500", "bg-teal-500"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const newVendor: Vendor = {
        id: `v_${Date.now()}`,
        name: cleanName,
        color: randomColor,
        phone: cleanMobile,
        email: cleanEmail,
        contactPerson: cleanContactPerson,
        position: cleanPosition,
        gst: cleanGst || undefined,
        logoUrl: formLogoUrl || undefined,
        status: formStatus,
        createdAt: new Date().toISOString(),
      };
      setVendors([newVendor, ...vendors]);
    }

    setIsAddEditModalOpen(false);
  };

  // Toggle status inline
  const handleToggleStatus = (vend: Vendor) => {
    const updatedStatus = vend.status === "Active" ? "Inactive" : "Active";
    setVendors(
      vendors.map((v) => (v.id === vend.id ? { ...v, status: updatedStatus } : v))
    );
  };

  // Delete handlers
  const handleDeleteClick = (vend: Vendor) => {
    setPendingDeleteVendor(vend);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (pendingDeleteVendor) {
      setVendors(vendors.filter((v) => v.id !== pendingDeleteVendor.id));
    }
    setIsDeleteConfirmOpen(false);
    setPendingDeleteVendor(null);
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
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors"
            data-purpose="nav-item"
            href="/admin/dashboard/customers"
          >
            {renderSidebarIcon("customers")}
            <span>Customers</span>
          </Link>

          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-stark-primary/10 text-stark-primary font-medium"
            data-purpose="nav-item-active"
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
            <span className="font-bold text-sm">Stark Vendors</span>
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
            <h2 className="text-2xl font-bold">Vendor Management</h2>
            <p className="text-sm text-stark-muted">
              Manage vendor businesses, configure contact persons, browse icons, and toggle account activation.
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
              <span>Add Vendor</span>
            </button>
          </div>
        </header>
        {/* END: ContentHeader */}

        {/* WORKSPACE AREA */}
        <div className="space-y-6">
          
          {/* Summary statistics cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-stark-muted tracking-wider">Total Vendors</p>
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
              <p className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">GST Registered</p>
              <h4 className="text-xl font-black text-blue-700 mt-1">{metrics.gstRegistered}</h4>
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
                  placeholder="Search by Business Name/Email/ID..."
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

              {/* GST select */}
              <div>
                <select
                  value={gstFilter}
                  onChange={(e) => { setGstFilter(e.target.value as any); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                >
                  <option value="all">All GST Policies</option>
                  <option value="registered">GST Registered</option>
                  <option value="unregistered">No GST Number</option>
                </select>
              </div>
            </div>
          </section>

          {/* Vendor Table List */}
          <section className="bg-white border border-gray-150 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto w-full">
              <table className="min-w-full divide-y divide-gray-100 text-left text-xs">
                <thead className="bg-gray-50 text-[10px] font-bold text-stark-muted uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Business / Vendor Info</th>
                    <th className="px-6 py-4">Contact Person</th>
                    <th className="px-6 py-4">Mobile</th>
                    <th className="px-6 py-4">GST Number</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-stark-text">
                  {paginatedVendors.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-stark-muted">
                        No vendor records match your filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedVendors.map((vend) => {
                      const isNew = isNewVendor(vend.createdAt);
                      return (
                        <tr key={vend.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              {vend.logoUrl ? (
                                <img
                                  src={vend.logoUrl}
                                  alt={vend.name}
                                  className="w-9 h-9 rounded-lg object-cover bg-stark-accent border border-gray-200"
                                />
                              ) : (
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white uppercase text-sm ${vend.color || "bg-stark-primary"}`}>
                                  {vend.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                </div>
                              )}
                              <div>
                                <div className="font-bold flex items-center space-x-1.5">
                                  <span>{vend.name}</span>
                                  {isNew && (
                                    <span className="bg-purple-100 text-purple-700 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full tracking-wider scale-90">
                                      New
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-stark-muted font-normal mt-0.5">{vend.email || "no-email@example.com"}</div>
                                <div className="text-[8px] text-gray-400 font-mono mt-0.5">{vend.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-stark-text">{vend.contactPerson || "—"}</div>
                            <div className="text-[10px] text-stark-muted font-normal mt-0.5">{vend.position || "—"}</div>
                          </td>
                          <td className="px-6 py-4 font-mono text-[11px] text-gray-600">
                            {vend.phone || "—"}
                          </td>
                          <td className="px-6 py-4">
                            {vend.gst ? (
                              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-mono text-[10px] font-bold">
                                {vend.gst}
                              </span>
                            ) : (
                              <span className="text-gray-400 italic text-[11px]">Not Provided</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleToggleStatus(vend)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold inline-flex items-center space-x-1.5 cursor-pointer transition-all ${
                                vend.status === "Active"
                                  ? "bg-green-50 text-green-700 hover:bg-green-100/80"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                              title="Click to toggle account status"
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${vend.status === "Active" ? "bg-green-500" : "bg-gray-400"}`}></span>
                              <span>{vend.status || "Active"}</span>
                            </button>
                          </td>
                          <td className="px-6 py-4 text-right space-x-1">
                            <button
                              onClick={() => handleOpenEditModal(vend)}
                              className="p-1 text-gray-400 hover:text-stark-primary rounded hover:bg-stark-accent transition-all cursor-pointer"
                              title="Edit Vendor"
                            >
                              <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(vend)}
                              className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition-all cursor-pointer"
                              title="Delete Vendor Record"
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

      {/* BEGIN: Add/Edit Vendor Modal */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsAddEditModalOpen(false)}></div>
          
          <form 
            onSubmit={handleSaveVendor}
            className="bg-white rounded-2xl max-w-lg w-full relative z-10 flex flex-col shadow-2xl border border-gray-100 overflow-hidden animate-fade-in"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <div>
                <h3 className="font-black text-lg text-stark-text">
                  {editingVendor ? "Edit Vendor" : "Add Vendor"}
                </h3>
                <p className="text-xs text-stark-muted">
                  Configure corporate parameters, contact persons, business logo, and legal taxation entries.
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
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {formError && (
                <div className="bg-red-50 border border-red-100 text-red-700 text-xs px-3 py-2 rounded-lg font-semibold">
                  {formError}
                </div>
              )}

              {/* Vendor Name */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-stark-muted">Vendor / Business Name*</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Acme Corporation"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                />
              </div>

              {/* Contact Person Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-stark-muted">Contact Person Name*</label>
                  <input
                    type="text"
                    required
                    value={formContactPerson}
                    onChange={(e) => setFormContactPerson(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-stark-muted">Position / Designation*</label>
                  <input
                    type="text"
                    required
                    value={formPosition}
                    onChange={(e) => setFormPosition(e.target.value)}
                    placeholder="e.g. Owner, Managing Director"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                  />
                </div>
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
                    placeholder="e.g. +1 (555) 019-2834"
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
                    placeholder="e.g. support@acme.com"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                  />
                </div>
              </div>

              {/* GST (optional) & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-stark-muted">GST Number (Optional)</label>
                  <input
                    type="text"
                    value={formGst}
                    onChange={(e) => setFormGst(e.target.value)}
                    placeholder="e.g. 22AAAAA1111A1Z1"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-stark-muted">Account Status*</label>
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

              {/* Business Icon upload */}
              <div className="flex flex-col gap-1 pt-2">
                <label className="text-xs font-bold text-stark-muted">Business Icon / Logo</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-stark-accent rounded-xl flex items-center justify-center border border-gray-200 overflow-hidden shrink-0">
                    {formLogoUrl ? (
                      <img src={formLogoUrl} alt="Business Icon Preview" className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-grow">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="vendor-logo-file"
                    />
                    <label
                      htmlFor="vendor-logo-file"
                      className="px-4 py-2 border border-gray-250 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-all font-semibold text-xs cursor-pointer inline-block shadow-sm"
                    >
                      Browse Image...
                    </label>
                    <p className="text-[10px] text-stark-muted mt-1">Accepts PNG, JPG, or GIF up to 2MB.</p>
                    {formLogoUrl && (
                      <button
                        type="button"
                        onClick={() => setFormLogoUrl("")}
                        className="text-xs text-red-500 hover:text-red-700 font-semibold mt-1 block"
                      >
                        Remove logo
                      </button>
                    )}
                  </div>
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
                {editingVendor ? "Save Changes" : "Create Record"}
              </button>
            </div>
          </form>
        </div>
      )}
      {/* END: Add/Edit Vendor Modal */}

      {/* BEGIN: Confirm Delete Modal */}
      {isDeleteConfirmOpen && pendingDeleteVendor && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs" onClick={() => setIsDeleteConfirmOpen(false)}></div>
          
          <div className="bg-white rounded-2xl max-w-sm w-full relative z-10 p-6 flex flex-col shadow-2xl border border-gray-100 animate-scale-up">
            <div className="text-red-500 mb-2">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
            <h3 className="font-black text-base text-stark-text">Delete Vendor Record</h3>
            <p className="text-xs text-stark-muted mt-2">
              Are you sure you want to delete <strong className="text-stark-text">"{pendingDeleteVendor.name}"</strong>? This action is irreversible and deletes their profile, logo, and active parameters.
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
