"use client";

import React, { useState, useEffect, useMemo } from "react";
import LeftSidebar from "@/components/LeftSidebar";
import { INITIAL_ADMINS, Admin, AdminPermissions, MODULES_LIST, PermissionLevel } from "./data";

export default function AdminsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Admins state sync'ed with localStorage
  const [admins, setAdmins] = useState<Admin[]>(INITIAL_ADMINS);
  
  // Logged-in admin check
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Inactive">("all");

  // Modal State
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formMobile, setFormMobile] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");
  const [formPermissions, setFormPermissions] = useState<AdminPermissions>({});
  const [formError, setFormError] = useState("");

  // Deletion modals
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [pendingDeleteAdmin, setPendingDeleteAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    // 1. Sync custom admins list from localStorage
    const storedAdmins = localStorage.getItem("stark_admins_list");
    let currentAdmins = INITIAL_ADMINS;
    if (storedAdmins) {
      try {
        currentAdmins = JSON.parse(storedAdmins);
        setAdmins(currentAdmins);
      } catch (e) {
        console.error("Failed parsing localStorage admins list", e);
      }
    } else {
      localStorage.setItem("stark_admins_list", JSON.stringify(INITIAL_ADMINS));
    }

    // 2. Load active admin for permission checks on this page
    const storedActiveId = localStorage.getItem("stark_active_admin_id");
    let selectedAdmin = currentAdmins.find(a => a.id === storedActiveId && a.status === "Active");
    if (!selectedAdmin) {
      selectedAdmin = currentAdmins.find(a => a.status === "Active") || currentAdmins[0];
    }
    setCurrentAdmin(selectedAdmin || null);
  }, []);

  // Write changes to localStorage
  const saveAdminsToStorage = (updatedList: Admin[]) => {
    setAdmins(updatedList);
    localStorage.setItem("stark_admins_list", JSON.stringify(updatedList));
  };

  // Permission level for Admins page
  const pagePermission = useMemo(() => {
    if (!currentAdmin) return "view"; // default
    if (currentAdmin.id === "adm1") return "create"; // Super Admin
    return currentAdmin.permissions.admins || null; // Access level or null
  }, [currentAdmin]);

  // Derived metrics
  const metrics = useMemo(() => {
    const total = admins.length;
    const active = admins.filter(a => a.status === "Active").length;
    const inactive = admins.filter(a => a.status === "Inactive").length;
    
    // Average permissions count per admin
    const totalPermissions = admins.reduce((sum, a) => {
      const keys = Object.keys(a.permissions);
      return sum + keys.length;
    }, 0);
    const avgPermissions = total > 0 ? (totalPermissions / total).toFixed(1) : "0.0";

    return { total, active, inactive, avgPermissions };
  }, [admins]);

  // Filtered and searched admins list
  const filteredAdmins = useMemo(() => {
    return admins.filter(a => {
      const matchesSearch = 
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.mobile.replace(/[^0-9]/g, "").includes(searchQuery.replace(/[^0-9]/g, ""));
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [admins, searchQuery, statusFilter]);

  // Form validation & Save
  const handleOpenAddModal = () => {
    if (pagePermission !== "create") return;
    setEditingAdmin(null);
    setFormName("");
    setFormMobile("");
    setFormEmail("");
    setFormStatus("Active");
    setFormPermissions({
      dashboard: "view" // default view permission for dashboard
    });
    setFormError("");
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (admin: Admin) => {
    if (pagePermission === "view" || (pagePermission === "update" && admin.id === "adm1")) {
      // Cannot edit Super Admin if not Super Admin
      return;
    }
    setEditingAdmin(admin);
    setFormName(admin.name);
    setFormMobile(admin.mobile);
    setFormEmail(admin.email);
    setFormStatus(admin.status);
    setFormPermissions({ ...admin.permissions });
    setFormError("");
    setIsAddEditModalOpen(true);
  };

  const handleToggleModulePermission = (key: string) => {
    setFormPermissions(prev => {
      const updated = { ...prev };
      const typedKey = key as keyof AdminPermissions;
      if (updated[typedKey]) {
        delete updated[typedKey];
      } else {
        // Default to "view" when checked
        updated[typedKey] = "view";
      }
      return updated;
    });
  };

  const handleSetModulePermissionLevel = (key: string, level: PermissionLevel) => {
    setFormPermissions(prev => {
      const updated = { ...prev };
      const typedKey = key as keyof AdminPermissions;
      updated[typedKey] = level;
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const trimmedName = formName.trim();
    const trimmedMobile = formMobile.trim();
    const trimmedEmail = formEmail.trim();

    if (!trimmedName || !trimmedMobile || !trimmedEmail) {
      setFormError("All fields are mandatory.");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    // Duplicate Check
    const duplicateEmail = admins.some(
      a => a.email.toLowerCase() === trimmedEmail.toLowerCase() && (!editingAdmin || a.id !== editingAdmin.id)
    );
    if (duplicateEmail) {
      setFormError("An admin with this email already exists.");
      return;
    }

    const duplicateMobile = admins.some(
      a => a.mobile.replace(/[^0-9]/g, "") === trimmedMobile.replace(/[^0-9]/g, "") && (!editingAdmin || a.id !== editingAdmin.id)
    );
    if (duplicateMobile) {
      setFormError("An admin with this mobile number already exists.");
      return;
    }

    if (editingAdmin) {
      // Edit mode
      // Prevent disabling Super Admin
      if (editingAdmin.id === "adm1" && formStatus === "Inactive") {
        setFormError("The primary Super Admin cannot be deactivated.");
        return;
      }

      const updated = admins.map(a => {
        if (a.id === editingAdmin.id) {
          return {
            ...a,
            name: trimmedName,
            mobile: trimmedMobile,
            email: trimmedEmail,
            status: formStatus,
            permissions: formPermissions
          };
        }
        return a;
      });
      saveAdminsToStorage(updated);

      // If editing current logged in admin, sync header
      if (currentAdmin && currentAdmin.id === editingAdmin.id) {
        localStorage.setItem("stark_active_admin_id", editingAdmin.id);
      }
    } else {
      // Add mode
      const newAdmin: Admin = {
        id: "adm_" + Date.now(),
        name: trimmedName,
        mobile: trimmedMobile,
        email: trimmedEmail,
        status: formStatus,
        permissions: formPermissions,
        createdAt: new Date().toISOString()
      };
      saveAdminsToStorage([...admins, newAdmin]);
    }

    setIsAddEditModalOpen(false);
  };

  const handleToggleStatus = (admin: Admin) => {
    if (pagePermission === "view") return;
    if (admin.id === "adm1") return; // Super admin cannot be toggled

    const updated = admins.map(a => {
      if (a.id === admin.id) {
        return {
          ...a,
          status: (a.status === "Active" ? "Inactive" : "Active") as "Active" | "Inactive"
        };
      }
      return a;
    });
    saveAdminsToStorage(updated);
  };

  const handleDeleteClick = (admin: Admin) => {
    if (pagePermission !== "create") return;
    if (admin.id === "adm1") return; // Super admin cannot be deleted
    setPendingDeleteAdmin(admin);
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (pendingDeleteAdmin) {
      const updated = admins.filter(a => a.id !== pendingDeleteAdmin.id);
      saveAdminsToStorage(updated);
      setIsConfirmDeleteOpen(false);
      setPendingDeleteAdmin(null);
    }
  };

  // Access control check
  if (pagePermission === null) {
    return (
      <div className="flex min-h-screen bg-[#F9FAFB]">
        <LeftSidebar activePage="admins" isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <main className="flex-1 p-6 md:ml-64 flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-2xl border border-gray-150 p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h3>
            <p className="text-sm text-gray-500 mb-6">
              You do not have permissions to access the Admins Management panel. Please switch to a Super Admin profile using the role selector.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] text-[#1F2937] overflow-x-hidden font-sans">
      <LeftSidebar activePage="admins" isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <main className="flex-1 md:ml-64 p-4 md:p-8 min-h-screen flex flex-col space-y-6">
        {/* Header Bar */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900">Admins Management</h1>
            <p className="text-xs text-stark-muted mt-1">Configure administrator accounts and their module permissions.</p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 border border-gray-200 rounded-lg md:hidden bg-white text-gray-600 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>

            {pagePermission === "create" && (
              <button
                onClick={handleOpenAddModal}
                className="bg-stark-primary text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md hover:bg-stark-dark transition-all cursor-pointer inline-flex items-center space-x-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                </svg>
                <span>Create Admin</span>
              </button>
            )}
          </div>
        </header>

        {/* Metrics Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-sm">
            <span className="text-[10px] font-black text-stark-muted uppercase tracking-wider block">Total Admins</span>
            <h4 className="text-xl font-black text-stark-text mt-1">{metrics.total}</h4>
          </div>
          <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-sm">
            <span className="text-[10px] font-black text-green-600 uppercase tracking-wider block">Active Accounts</span>
            <h4 className="text-xl font-black text-green-700 mt-1">{metrics.active}</h4>
          </div>
          <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-sm">
            <span className="text-[10px] font-black text-stark-muted uppercase tracking-wider block">Inactive Accounts</span>
            <h4 className="text-xl font-black text-stark-text mt-1">{metrics.inactive}</h4>
          </div>
          <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-sm">
            <span className="text-[10px] font-black text-purple-600 uppercase tracking-wider block">Avg Modules / Admin</span>
            <h4 className="text-xl font-black text-purple-700 mt-1">{metrics.avgPermissions}</h4>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-gray-150 shadow-sm">
          <div className="flex-1 relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stark-muted pointer-events-none">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by name, email, or mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
            />
          </div>
          <div className="w-full sm:w-44">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>
        </section>

        {/* Admins Table */}
        {filteredAdmins.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-xl border border-gray-150 p-12 shadow-sm text-center">
            <img
              src="/empty-state.png"
              alt="Empty state illustration"
              className="w-64 h-64 object-contain mb-6 rounded-2xl"
            />
            <h3 className="text-lg font-black text-stark-text mb-2">No Admins Found</h3>
            <p className="text-sm text-stark-muted max-w-sm">
              There are currently no records available to display.
            </p>
          </div>
        ) : (
          <section className="bg-white rounded-xl border border-gray-150 shadow-sm overflow-hidden flex-1">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-150">
                    <th className="px-5 py-4 text-[10px] font-black text-stark-muted uppercase tracking-wider">Admin Profile</th>
                    <th className="px-5 py-4 text-[10px] font-black text-stark-muted uppercase tracking-wider hidden sm:table-cell">Mobile Number</th>
                    <th className="px-5 py-4 text-[10px] font-black text-stark-muted uppercase tracking-wider">Status</th>
                    <th className="px-5 py-4 text-[10px] font-black text-stark-muted uppercase tracking-wider hidden md:table-cell">Module Permissions</th>
                    <th className="px-5 py-4 w-32 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {filteredAdmins.map((adm) => {
                    const statusBadgeClass =
                      adm.status === "Active"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-gray-100 text-gray-600 border-gray-250";

                    const allowedModules = Object.entries(adm.permissions)
                      .filter(([_, level]) => !!level);

                    return (
                      <tr key={adm.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 bg-stark-primary/10 border border-stark-primary/20 rounded-lg flex items-center justify-center font-bold text-stark-primary text-sm uppercase">
                              {adm.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </div>
                            <div>
                              <div className="font-bold text-stark-text">{adm.name}</div>
                              <div className="text-[10px] text-stark-muted mt-0.5">{adm.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-3 font-semibold text-stark-text hidden sm:table-cell">
                          {adm.mobile}
                        </td>

                        <td className="px-5 py-3">
                          <button
                            onClick={() => handleToggleStatus(adm)}
                            disabled={adm.id === "adm1" || pagePermission === "view"}
                            className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black transition-all ${
                              adm.id === "adm1" ? "opacity-70 cursor-not-allowed " : "cursor-pointer "
                            }${statusBadgeClass}`}
                          >
                            {adm.status}
                          </button>
                        </td>

                        <td className="px-5 py-3 hidden md:table-cell max-w-xs">
                          {adm.id === "adm1" ? (
                            <span className="bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded text-[10px] border border-purple-200">
                              All Access (Super Admin)
                            </span>
                          ) : allowedModules.length === 0 ? (
                            <span className="text-gray-400 italic">No modules selected</span>
                          ) : (
                            <div className="flex flex-wrap gap-1.5">
                              {allowedModules.map(([mKey, level]) => {
                                let badgeColor = "bg-blue-50 text-blue-700 border-blue-200";
                                if (level === "create") badgeColor = "bg-purple-50 text-purple-700 border-purple-200";
                                if (level === "update") badgeColor = "bg-amber-50 text-amber-700 border-amber-200";

                                const label = MODULES_LIST.find(m => m.key === mKey)?.label || mKey;

                                return (
                                  <span
                                    key={mKey}
                                    className={`px-2 py-0.5 rounded border text-[9px] font-bold ${badgeColor}`}
                                  >
                                    {label}: <span className="uppercase">{level}</span>
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </td>

                        <td className="px-5 py-3 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditModal(adm)}
                              disabled={pagePermission === "view" || (pagePermission === "update" && adm.id === "adm1")}
                              className={`p-1 rounded text-stark-muted transition-all ${
                                pagePermission === "view" || (pagePermission === "update" && adm.id === "adm1")
                                  ? "opacity-40 cursor-not-allowed"
                                  : "hover:bg-gray-100 hover:text-stark-primary cursor-pointer"
                              }`}
                              title="Edit Admin Account"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(adm)}
                              disabled={pagePermission !== "create" || adm.id === "adm1"}
                              className={`p-1 rounded text-stark-muted transition-all ${
                                pagePermission !== "create" || adm.id === "adm1"
                                  ? "opacity-40 cursor-not-allowed"
                                  : "hover:bg-red-50 hover:text-red-650 cursor-pointer"
                              }`}
                              title="Delete Admin Account"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* CREATE & EDIT ADMIN MODAL */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-gray-150 shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-150 flex items-center justify-between">
              <h3 className="text-base font-black text-gray-900">
                {editingAdmin ? "Edit Admin Settings" : "Create Admin"}
              </h3>
              <button
                onClick={() => setIsAddEditModalOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-stark-muted hover:text-stark-text transition-all cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </button>
            </div>

            {/* Modal Body (Scrollable Form) */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              {formError && (
                <div className="bg-red-50 text-red-700 border border-red-200 p-3.5 rounded-lg font-semibold flex items-center space-x-2">
                  <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                  <span>{formError}</span>
                </div>
              )}

              {/* Identity Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-750 uppercase tracking-wider mb-1">
                    Name*
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="E.g. Albert Flores"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-750 uppercase tracking-wider mb-1">
                    Mobile Number*
                  </label>
                  <input
                    type="text"
                    required
                    value={formMobile}
                    onChange={(e) => setFormMobile(e.target.value)}
                    placeholder="E.g. +1 (555) 019-2834"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-750 uppercase tracking-wider mb-1">
                    Email ID*
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="E.g. albert@stark.com"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-750 uppercase tracking-wider mb-1">
                    Status*
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary font-medium"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Module Permissions Grid */}
              <div className="border-t border-gray-150 pt-4">
                <label className="block text-[10px] font-black text-gray-750 uppercase tracking-wider mb-3">
                  Module Permissions Control
                </label>

                {editingAdmin?.id === "adm1" ? (
                  <div className="bg-purple-50 text-purple-700 border border-purple-200 p-4 rounded-lg font-bold">
                    This is the default primary Super Admin. It is granted all access on all modules by default and its permissions cannot be modified.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {MODULES_LIST.map((mod) => {
                      const isChecked = !!formPermissions[mod.key as keyof AdminPermissions];
                      const level = formPermissions[mod.key as keyof AdminPermissions] || "view";

                      return (
                        <div
                          key={mod.key}
                          className={`border rounded-lg p-3 transition-all ${
                            isChecked
                              ? "bg-[#FCFCFD] border-stark-primary/30 shadow-sm"
                              : "border-gray-200 bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleModulePermission(mod.key)}
                                className="w-4.5 h-4.5 rounded text-stark-primary border-gray-300 focus:ring-stark-primary cursor-pointer"
                              />
                              <span className={`font-bold text-xs ${isChecked ? "text-stark-text" : "text-stark-muted"}`}>
                                {mod.label}
                              </span>
                            </label>

                            {isChecked && (
                              <div className="text-[10px] text-stark-muted italic">
                                Enabled
                              </div>
                            )}
                          </div>

                          {/* Reveal permission radio buttons if checkbox checked */}
                          {isChecked && (
                            <div className="mt-3 pl-7 pt-3 border-t border-dashed border-gray-150 grid grid-cols-3 gap-2">
                              <label className="flex items-center space-x-2 p-2 rounded-lg border border-gray-200 bg-white cursor-pointer hover:border-stark-primary/50">
                                <input
                                  type="radio"
                                  name={`perm_level_${mod.key}`}
                                  checked={level === "view"}
                                  onChange={() => handleSetModulePermissionLevel(mod.key, "view")}
                                  className="w-3.5 h-3.5 text-stark-primary border-gray-300 focus:ring-stark-primary cursor-pointer"
                                />
                                <span className="font-bold text-gray-700 scale-95 origin-left">View Only</span>
                              </label>

                              <label className="flex items-center space-x-2 p-2 rounded-lg border border-gray-200 bg-white cursor-pointer hover:border-stark-primary/50">
                                <input
                                  type="radio"
                                  name={`perm_level_${mod.key}`}
                                  checked={level === "update"}
                                  onChange={() => handleSetModulePermissionLevel(mod.key, "update")}
                                  className="w-3.5 h-3.5 text-stark-primary border-gray-300 focus:ring-stark-primary cursor-pointer"
                                />
                                <span className="font-bold text-gray-700 scale-95 origin-left">Update / Edit</span>
                              </label>

                              <label className="flex items-center space-x-2 p-2 rounded-lg border border-gray-200 bg-white cursor-pointer hover:border-stark-primary/50">
                                <input
                                  type="radio"
                                  name={`perm_level_${mod.key}`}
                                  checked={level === "create"}
                                  onChange={() => handleSetModulePermissionLevel(mod.key, "create")}
                                  className="w-3.5 h-3.5 text-stark-primary border-gray-300 focus:ring-stark-primary cursor-pointer"
                                />
                                <span className="font-bold text-gray-700 scale-95 origin-left">Create (All)</span>
                              </label>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="border-t border-gray-150 pt-5 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg font-bold text-gray-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stark-primary hover:bg-stark-dark text-white rounded-lg font-bold shadow-md transition-colors cursor-pointer"
                >
                  {editingAdmin ? "Save Changes" : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {isConfirmDeleteOpen && pendingDeleteAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl border border-gray-150 shadow-2xl p-6 text-xs animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-base font-black text-gray-950 mb-2">Delete Admin Account</h3>
            <p className="text-stark-muted leading-relaxed mb-6">
              Are you sure you want to delete the admin record for <strong className="text-stark-text">{pendingDeleteAdmin.name}</strong>? This action is permanent and cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setIsConfirmDeleteOpen(false);
                  setPendingDeleteAdmin(null);
                }}
                className="px-4 py-2 border border-gray-200 rounded-lg font-bold text-gray-750 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-md transition-colors cursor-pointer"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
