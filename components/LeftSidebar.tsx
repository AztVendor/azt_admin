"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { INITIAL_ADMINS, Admin, MODULES_LIST } from "@/app/admin/dashboard/admins/data";

interface LeftSidebarProps {
  activePage: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

// SVG Preset Icons
const renderIcon = (key: string, className = "w-5 h-5") => {
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
    case "hsn":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
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
    case "admins":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m16-10a4 4 0 11-8 0 4 4 0 018 0zm6 10v-2a4 4 0 00-3-3.87m-4-12a4 4 0 110-8M21 12a4 4 0 110-8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
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

export default function LeftSidebar({ activePage, isSidebarOpen, setIsSidebarOpen }: LeftSidebarProps) {
  const [activeAdmin, setActiveAdmin] = useState<Admin | null>(null);
  const [adminsList, setAdminsList] = useState<Admin[]>(INITIAL_ADMINS);

  // Change Password Modal States
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [modalError, setModalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Account Details Modal State
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  useEffect(() => {
    // 1. Sync custom admins list from localStorage if edited/created
    const storedAdmins = localStorage.getItem("stark_admins_list");
    let currentAdmins = INITIAL_ADMINS;
    if (storedAdmins) {
      try {
        currentAdmins = JSON.parse(storedAdmins);
        setAdminsList(currentAdmins);
      } catch (e) {
        console.error("Failed parsing admins list", e);
      }
    }

    // 2. Load active admin
    const storedActiveId = localStorage.getItem("stark_active_admin_id");
    let selectedAdmin = currentAdmins.find(a => a.id === storedActiveId && a.status === "Active");
    
    if (!selectedAdmin) {
      // Fallback to first active admin
      selectedAdmin = currentAdmins.find(a => a.status === "Active") || currentAdmins[0];
      if (selectedAdmin) {
        localStorage.setItem("stark_active_admin_id", selectedAdmin.id);
      }
    }

    setActiveAdmin(selectedAdmin || null);
  }, []);

  const handleAdminSwitch = (adminId: string) => {
    const selected = adminsList.find(a => a.id === adminId);
    if (selected) {
      localStorage.setItem("stark_active_admin_id", adminId);
      window.location.reload();
    }
  };

  const isModuleVisible = (moduleKey: string) => {
    if (!activeAdmin) return false;
    // Super Admin has all access
    if (activeAdmin.id === "adm1") return true;
    return !!activeAdmin.permissions[moduleKey as keyof typeof activeAdmin.permissions];
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    setSuccessMessage("");

    if (!activeAdmin) {
      setModalError("No active admin session found.");
      return;
    }

    const trimmedPassword = newPassword.trim();
    if (!trimmedPassword) {
      setModalError("New password cannot be empty.");
      return;
    }

    if (trimmedPassword.length < 6) {
      setModalError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setModalError("Passwords do not match.");
      return;
    }

    // Update the admin list in localStorage
    const updatedList = adminsList.map(a => {
      if (a.id === activeAdmin.id) {
        return {
          ...a,
          password: trimmedPassword
        };
      }
      return a;
    });

    setAdminsList(updatedList);
    localStorage.setItem("stark_admins_list", JSON.stringify(updatedList));

    setSuccessMessage("Password updated successfully!");
    
    setTimeout(() => {
      setIsSettingsModalOpen(false);
    }, 1500);
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`w-64 bg-stark-sidebar border-r border-gray-200 flex flex-col fixed inset-y-0 left-0 z-40 transition-transform duration-300 md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        data-purpose="navigation-sidebar"
      >
        {/* Logo Section */}
        <div className="p-6 flex items-center space-x-3 border-b border-gray-100">
          <div className="w-8 h-8 bg-stark-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
            S
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Stark</h1>
            <p className="text-xs text-stark-muted">Management Panel</p>
          </div>
        </div>

        {/* Dynamic Admin profile switcher */}
        <div className="px-4 py-4 border-b border-gray-150 bg-stark-accent/40">
          <label className="block text-[9px] font-black uppercase text-stark-muted mb-1.5 tracking-wider">
            Active Admin Session
          </label>
          <div className="relative">
            <select
              value={activeAdmin?.id || ""}
              onChange={(e) => handleAdminSwitch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-stark-primary focus:border-stark-primary appearance-none cursor-pointer"
            >
              {adminsList.map((adm) => (
                <option key={adm.id} value={adm.id} disabled={adm.status === "Inactive"}>
                  {adm.name} {adm.status === "Inactive" ? "(Inactive)" : ""}
                </option>
              ))}
            </select>
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stark-muted pointer-events-none">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11.571V11a4 4 0 118 0v.571c0 1.925.243 3.78.697 5.548M21 21v-2a4 4 0 00-3-3.87m-11 12a4 4 0 01-2.077-7.87" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stark-muted pointer-events-none">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
          </div>
          {activeAdmin && (
            <div className="mt-1.5 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-stark-muted truncate font-medium">
                Role: {activeAdmin.id === "adm1" ? "Super Admin" : "Custom Permissions"}
              </span>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto pb-4">
          <p className="text-[10px] uppercase font-semibold text-stark-muted px-2 mb-2 tracking-wider">
            Main Menu
          </p>

          {/* Dashboard (key: dashboard) */}
          {isModuleVisible("dashboard") && (
            <Link
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                activePage === "dashboard"
                  ? "bg-stark-primary/10 text-stark-primary font-bold shadow-sm"
                  : "text-stark-muted hover:bg-stark-accent font-semibold"
              }`}
              href="/admin/dashboard"
            >
              {renderIcon("dashboard", activePage === "dashboard" ? "w-5 h-5 text-stark-primary" : "w-5 h-5")}
              <span>Dashboard</span>
            </Link>
          )}

          {/* Orders (key: orders) */}
          {isModuleVisible("orders") && (
            <Link
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                activePage === "orders"
                  ? "bg-stark-primary/10 text-stark-primary font-bold shadow-sm"
                  : "text-stark-muted hover:bg-stark-accent font-semibold"
              }`}
              href="/admin/dashboard/orders"
            >
              {renderIcon("orders", activePage === "orders" ? "w-5 h-5 text-stark-primary" : "w-5 h-5")}
              <span>Orders</span>
            </Link>
          )}

          {/* Categories (key: categories) */}
          {isModuleVisible("categories") && (
            <Link
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                activePage === "categories"
                  ? "bg-stark-primary/10 text-stark-primary font-bold shadow-sm"
                  : "text-stark-muted hover:bg-stark-accent font-semibold"
              }`}
              href="/admin/dashboard/categories"
            >
              {renderIcon("categories", activePage === "categories" ? "w-5 h-5 text-stark-primary" : "w-5 h-5")}
              <span>Categories</span>
            </Link>
          )}

          {/* Sub Categories (key: subcategories) */}
          {isModuleVisible("subcategories") && (
            <Link
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                activePage === "subcategories"
                  ? "bg-stark-primary/10 text-stark-primary font-bold shadow-sm"
                  : "text-stark-muted hover:bg-stark-accent font-semibold"
              }`}
              href="/admin/dashboard/subcategories"
            >
              {renderIcon("subcategories", activePage === "subcategories" ? "w-5 h-5 text-stark-primary" : "w-5 h-5")}
              <span>Sub Categories</span>
            </Link>
          )}

          {/* Mini Categories (key: minicategories) */}
          {isModuleVisible("minicategories") && (
            <Link
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                activePage === "minicategories"
                  ? "bg-stark-primary/10 text-stark-primary font-bold shadow-sm"
                  : "text-stark-muted hover:bg-stark-accent font-semibold"
              }`}
              href="/admin/dashboard/minicategories"
            >
              {renderIcon("minicategories", activePage === "minicategories" ? "w-5 h-5 text-stark-primary" : "w-5 h-5")}
              <span>Mini Categories</span>
            </Link>
          )}

          {/* Macro Categories (key: macrocategories) */}
          {isModuleVisible("macrocategories") && (
            <Link
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                activePage === "macrocategories"
                  ? "bg-stark-primary/10 text-stark-primary font-bold shadow-sm"
                  : "text-stark-muted hover:bg-stark-accent font-semibold"
              }`}
              href="/admin/dashboard/macrocategories"
            >
              {renderIcon("macrocategories", activePage === "macrocategories" ? "w-5 h-5 text-stark-primary" : "w-5 h-5")}
              <span>Macro Categories</span>
            </Link>
          )}

          {/* Products (key: products) */}
          {isModuleVisible("products") && (
            <Link
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                activePage === "products"
                  ? "bg-stark-primary/10 text-stark-primary font-bold shadow-sm"
                  : "text-stark-muted hover:bg-stark-accent font-semibold"
              }`}
              href="/admin/dashboard/products"
            >
              {renderIcon("products", activePage === "products" ? "w-5 h-5 text-stark-primary" : "w-5 h-5")}
              <span>Products</span>
            </Link>
          )}

          {/* HSN Master (key: hsn) */}
          {isModuleVisible("hsn") && (
            <Link
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                activePage === "hsn"
                  ? "bg-stark-primary/10 text-stark-primary font-bold shadow-sm"
                  : "text-stark-muted hover:bg-stark-accent font-semibold"
              }`}
              href="/admin/dashboard/hsn"
            >
              {renderIcon("hsn", activePage === "hsn" ? "w-5 h-5 text-stark-primary" : "w-5 h-5")}
              <span>HSN Master</span>
            </Link>
          )}

          {/* Billing (key: billing) */}
          {isModuleVisible("billing") && (
            <Link
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                activePage === "billing"
                  ? "bg-stark-primary/10 text-stark-primary font-bold shadow-sm"
                  : "text-stark-muted hover:bg-stark-accent font-semibold"
              }`}
              href="/admin/dashboard/billing"
            >
              {renderIcon("billing", activePage === "billing" ? "w-5 h-5 text-stark-primary" : "w-5 h-5")}
              <span>Billing</span>
            </Link>
          )}

          {/* Customers (key: customers) */}
          {isModuleVisible("customers") && (
            <Link
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                activePage === "customers"
                  ? "bg-stark-primary/10 text-stark-primary font-bold shadow-sm"
                  : "text-stark-muted hover:bg-stark-accent font-semibold"
              }`}
              href="/admin/dashboard/customers"
            >
              {renderIcon("customers", activePage === "customers" ? "w-5 h-5 text-stark-primary" : "w-5 h-5")}
              <span>Customers</span>
            </Link>
          )}

          {/* Vendors (key: vendors) */}
          {isModuleVisible("vendors") && (
            <Link
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                activePage === "vendors"
                  ? "bg-stark-primary/10 text-stark-primary font-bold shadow-sm"
                  : "text-stark-muted hover:bg-stark-accent font-semibold"
              }`}
              href="/admin/dashboard/vendors"
            >
              {renderIcon("vendors", activePage === "vendors" ? "w-5 h-5 text-stark-primary" : "w-5 h-5")}
              <span>Vendors</span>
            </Link>
          )}

          {/* Notifications (key: notifications) */}
          {isModuleVisible("notifications") && (
            <Link
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                activePage === "notifications"
                  ? "bg-stark-primary/10 text-stark-primary font-bold shadow-sm"
                  : "text-stark-muted hover:bg-stark-accent font-semibold"
              }`}
              href="/admin/dashboard/notifications"
            >
              {renderIcon("notifications", activePage === "notifications" ? "w-5 h-5 text-stark-primary" : "w-5 h-5")}
              <span>Notifications</span>
            </Link>
          )}

          {/* Emails (key: emails) */}
          {isModuleVisible("emails") && (
            <Link
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                activePage === "emails"
                  ? "bg-stark-primary/10 text-stark-primary font-bold shadow-sm"
                  : "text-stark-muted hover:bg-stark-accent font-semibold"
              }`}
              href="/admin/dashboard/emails"
            >
              {renderIcon("emails", activePage === "emails" ? "w-5 h-5 text-stark-primary" : "w-5 h-5")}
              <span>Emails</span>
            </Link>
          )}

          {/* Admins (key: admins) */}
          {isModuleVisible("admins") && (
            <Link
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                activePage === "admins"
                  ? "bg-stark-primary/10 text-stark-primary font-bold shadow-sm"
                  : "text-stark-muted hover:bg-stark-accent font-semibold"
              }`}
              href="/admin/dashboard/admins"
            >
              {renderIcon("admins", activePage === "admins" ? "w-5 h-5 text-stark-primary" : "w-5 h-5")}
              <span>Admins</span>
            </Link>
          )}

          {/* Account section */}
          <p className="text-[10px] uppercase font-semibold text-stark-muted px-2 pt-6 mb-2 tracking-wider">
            Account
          </p>
          <button
            onClick={() => setIsAccountModalOpen(true)}
            className="w-full text-left flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors font-semibold cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <span>My Account</span>
          </button>
          <button
            onClick={() => {
              setNewPassword("");
              setConfirmPassword("");
              setModalError("");
              setSuccessMessage("");
              setShowNewPassword(false);
              setShowConfirmPassword(false);
              setIsSettingsModalOpen(true);
            }}
            className="w-full text-left flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors font-semibold cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <span>Settings</span>
          </button>

          <div className="mt-4 pb-4">
            <Link
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors font-bold"
              href="/admin/login"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <span>Logout</span>
            </Link>
          </div>
        </nav>
      </aside>
      {/* CHANGE PASSWORD SETTINGS MODAL */}
      {isSettingsModalOpen && activeAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl border border-gray-150 shadow-2xl p-6 text-xs animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-150 mb-4">
              <h3 className="text-sm font-black text-gray-950">Security Settings</h3>
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="text-gray-400 hover:text-gray-650 text-base font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="mb-4 text-left">
              <p className="text-stark-muted">
                Change password for account: <strong className="text-stark-text">{activeAdmin.email}</strong>
              </p>
            </div>

            {/* Error banner */}
            {modalError && (
              <div className="bg-red-50 text-red-700 border border-red-200 p-2.5 rounded-lg font-semibold flex items-center space-x-2 mb-4 text-left">
                <svg className="w-4.5 h-4.5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                <span>{modalError}</span>
              </div>
            )}

            {/* Success banner */}
            {successMessage && (
              <div className="bg-green-50 text-green-700 border border-green-200 p-2.5 rounded-lg font-semibold flex items-center space-x-2 mb-4 text-left">
                <svg className="w-4.5 h-4.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSavePassword} className="space-y-4 text-left">
              {/* New Password */}
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-gray-750 uppercase tracking-wider">
                  New Password*
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min. 6 characters)"
                    className="w-full pl-3 pr-9 py-2 border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showNewPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-gray-750 uppercase tracking-wider">
                  Re-enter Password*
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-3 pr-9 py-2 border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsSettingsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg font-bold text-gray-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stark-primary hover:bg-stark-dark text-white rounded-lg font-bold shadow-md transition-colors cursor-pointer"
                >
                  Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ACCOUNT DETAILS MODAL */}
      {isAccountModalOpen && activeAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl border border-gray-150 shadow-2xl p-6 text-xs animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-150 mb-4">
              <h3 className="text-sm font-black text-gray-950">Account Profile</h3>
              <button
                onClick={() => setIsAccountModalOpen(false)}
                className="text-gray-400 hover:text-gray-650 text-base font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Profile Avatar Card */}
            <div className="flex items-center space-x-4 p-4 bg-stark-accent/40 rounded-xl border border-gray-100 mb-5 text-left">
              <div className="w-12 h-12 bg-stark-primary/10 border border-stark-primary/20 rounded-xl flex items-center justify-center font-bold text-stark-primary text-base uppercase">
                {activeAdmin.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <h4 className="font-black text-sm text-stark-text leading-tight">{activeAdmin.name}</h4>
                <p className="text-[10px] text-stark-muted mt-0.5">Admin ID: {activeAdmin.id}</p>
              </div>
            </div>

            {/* Details Fields */}
            <div className="space-y-3.5 mb-6 text-left">
              <div>
                <span className="block text-[9px] font-black uppercase text-stark-muted tracking-wider">Full Name</span>
                <span className="text-xs font-semibold text-stark-text block mt-0.5">{activeAdmin.name}</span>
              </div>

              <div>
                <span className="block text-[9px] font-black uppercase text-stark-muted tracking-wider">Email Address</span>
                <span className="text-xs font-semibold text-stark-text block mt-0.5">{activeAdmin.email}</span>
              </div>

              <div>
                <span className="block text-[9px] font-black uppercase text-stark-muted tracking-wider">Mobile Number</span>
                <span className="text-xs font-semibold text-stark-text block mt-0.5">{activeAdmin.mobile}</span>
              </div>

              <div>
                <span className="block text-[9px] font-black uppercase text-stark-muted tracking-wider">Role Type</span>
                <span className="text-xs font-semibold text-stark-text block mt-0.5">
                  {activeAdmin.id === "adm1" ? "Super Admin (Full Platform Access)" : "Custom Manager Profile"}
                </span>
              </div>

              <div>
                <span className="block text-[9px] font-black uppercase text-stark-muted tracking-wider">Account Status</span>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${activeAdmin.status === "Active" ? "bg-green-500" : "bg-gray-400"}`}></span>
                  <span className="text-xs font-semibold text-stark-text uppercase">{activeAdmin.status}</span>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-3 border-t border-gray-150 flex items-center justify-end">
              <button
                onClick={() => setIsAccountModalOpen(false)}
                className="px-5 py-2 bg-stark-primary hover:bg-stark-dark text-white rounded-lg font-bold shadow-md transition-colors cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
