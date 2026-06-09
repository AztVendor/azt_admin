"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { HsnRecord, INITIAL_HSN_RECORDS } from "./data";
import LeftSidebar from "@/components/LeftSidebar";
import { INITIAL_ADMINS } from "../admins/data";

export default function HsnPage() {
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
        setPagePermission(selectedAdmin.permissions.hsn || null);
      }
    }
  }, []);

const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Database States
  const [hsnRecords, setHsnRecords] = useState<HsnRecord[]>(INITIAL_HSN_RECORDS);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Inactive">("all");

  // Add/Edit Modal States
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingHsn, setEditingHsn] = useState<HsnRecord | null>(null);

  // Form States
  const [formHsnCode, setFormHsnCode] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formGstRate, setFormGstRate] = useState("");
  const [formEffectiveFrom, setFormEffectiveFrom] = useState("");
  const [formEffectiveTo, setFormEffectiveTo] = useState("");
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");
  const [formError, setFormError] = useState("");

  // Confirmation Modals
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [pendingDeleteHsn, setPendingDeleteHsn] = useState<HsnRecord | null>(null);

  // Dynamic Tomorrow Date String for date picker min constraint (local time)
  const tomorrowDateString = useMemo(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    // YYYY-MM-DD format
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  // Filtering Helper
  const filteredHsnRecords = useMemo(() => {
    return hsnRecords.filter((rec) => {
      const matchesSearch =
        rec.hsnCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || rec.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [hsnRecords, searchQuery, statusFilter]);

  // Metrics derived from state
  const metrics = useMemo(() => {
    const total = hsnRecords.length;
    const active = hsnRecords.filter((h) => h.status === "Active").length;
    const inactive = hsnRecords.filter((h) => h.status === "Inactive").length;
    const totalGst = hsnRecords.reduce((sum, h) => sum + h.gstRate, 0);
    const avgGst = total > 0 ? Math.round(totalGst / total) : 0;
    return { total, active, inactive, avgGst };
  }, [hsnRecords]);

  // Modal Open Handlers
  const handleOpenAddModal = () => {
    setEditingHsn(null);
    setFormHsnCode("");
    setFormDescription("");
    setFormGstRate("");
    setFormEffectiveFrom("");
    setFormEffectiveTo("");
    setFormStatus("Active");
    setFormError("");
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (hsn: HsnRecord) => {
    setEditingHsn(hsn);
    setFormHsnCode(hsn.hsnCode);
    setFormDescription(hsn.description);
    setFormGstRate(String(hsn.gstRate));
    setFormEffectiveFrom(hsn.effectiveFrom);
    setFormEffectiveTo(hsn.effectiveTo || "");
    setFormStatus(hsn.status);
    setFormError("");
    setIsAddEditModalOpen(true);
  };

  // Form Submit Handler with Validations
  const handleSaveHsn = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const cleanCode = formHsnCode.trim();
    const cleanDesc = formDescription.trim();

    if (!cleanCode) {
      setFormError("HSN Code is required.");
      return;
    }
    if (!cleanDesc) {
      setFormError("Description is required.");
      return;
    }

    // Constraint validation: Unique HSN Code case-insensitive
    const duplicate = hsnRecords.some(
      (h) => h.hsnCode.toLowerCase() === cleanCode.toLowerCase() && (!editingHsn || h.id !== editingHsn.id)
    );
    if (duplicate) {
      setFormError(`HSN Code "${cleanCode}" already exists.`);
      return;
    }

    // GST validation: Integer only
    const gstVal = Number(formGstRate);
    if (formGstRate === "" || isNaN(gstVal) || !Number.isInteger(gstVal) || gstVal < 0 || gstVal > 100) {
      setFormError("GST % must be an integer between 0 and 100.");
      return;
    }

    // Date validation: Effective From is mandatory and must be a future date
    if (!formEffectiveFrom) {
      setFormError("Effective From date is required.");
      return;
    }

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const parseLocalDate = (dateStr: string) => {
      const [yyyy, mm, dd] = dateStr.split("-").map(Number);
      return new Date(yyyy, mm - 1, dd, 0, 0, 0, 0);
    };

    const fromDate = parseLocalDate(formEffectiveFrom);

    if (fromDate <= todayDate) {
      setFormError("Effective From date must be a future date (starts tomorrow onwards).");
      return;
    }

    // Effective To validation: if provided, must be a future date, not same as Effective From, and after Effective From
    if (formEffectiveTo) {
      const toDate = parseLocalDate(formEffectiveTo);

      if (toDate <= todayDate) {
        setFormError("Effective To date must be a future date (starts tomorrow onwards).");
        return;
      }

      if (formEffectiveFrom === formEffectiveTo) {
        setFormError("Effective From and Effective To dates cannot be the same date.");
        return;
      }

      if (toDate < fromDate) {
        setFormError("Effective To date must be after Effective From date.");
        return;
      }
    }

    if (editingHsn) {
      // Edit
      setHsnRecords(
        hsnRecords.map((h) =>
          h.id === editingHsn.id
            ? {
                ...h,
                hsnCode: cleanCode,
                description: cleanDesc,
                gstRate: gstVal,
                effectiveFrom: formEffectiveFrom,
                effectiveTo: formEffectiveTo || undefined,
                status: formStatus
              }
            : h
        )
      );
    } else {
      // Add
      const newHsn: HsnRecord = {
        id: `hsn_${Date.now()}`,
        hsnCode: cleanCode,
        description: cleanDesc,
        gstRate: gstVal,
        effectiveFrom: formEffectiveFrom,
        effectiveTo: formEffectiveTo || undefined,
        status: formStatus,
        createdAt: new Date().toISOString()
      };
      setHsnRecords([...hsnRecords, newHsn]);
    }

    setIsAddEditModalOpen(false);
  };

  // Toggle Status directly
  const handleToggleStatusClick = (hsn: HsnRecord) => {
    setHsnRecords(
      hsnRecords.map((h) =>
        h.id === hsn.id ? { ...h, status: h.status === "Active" ? "Inactive" : "Active" } : h
      )
    );
  };

  // Delete Handlers
  const handleDeleteClick = (hsn: HsnRecord) => {
    setPendingDeleteHsn(hsn);
    setIsConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (pendingDeleteHsn) {
      setHsnRecords(hsnRecords.filter((h) => h.id !== pendingDeleteHsn.id));
    }
    setIsConfirmDeleteOpen(false);
    setPendingDeleteHsn(null);
  };

  return (
    <div className="flex min-h-screen w-full bg-[#F9FAFB] text-[#1F2937] font-sans overflow-x-hidden">
      
      <LeftSidebar activePage="hsn" isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

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
            <span className="font-bold text-sm">Stark HSN Master</span>
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
            <h2 className="text-2xl font-bold">HSN Master</h2>
            <p className="text-sm text-stark-muted">
              Configure Harmonized System of Nomenclature (HSN) codes and their applicable GST rates.
            </p>
          </div>
          <div className="flex gap-2">
            {pagePermission === "create" && (<button 
              onClick={handleOpenAddModal}
              className="bg-stark-primary hover:bg-stark-dark text-white px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-all shadow-sm font-medium text-sm shrink-0 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <span>Add HSN</span>
            </button>)}
          </div>
        </header>
        {/* END: ContentHeader */}

        {/* WORKSPACE AREA */}
        <div className="space-y-6">
          
          {/* Summary statistics cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-stark-muted tracking-wider">Total HSN Codes</p>
              <h4 className="text-xl font-black text-stark-text mt-1">{metrics.total}</h4>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-green-600 tracking-wider">Active HSN Codes</p>
              <h4 className="text-xl font-black text-green-700 mt-1">{metrics.active}</h4>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Inactive HSN Codes</p>
              <h4 className="text-xl font-black text-gray-600 mt-1">{metrics.inactive}</h4>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-stark-primary tracking-wider">Average GST Rate</p>
              <h4 className="text-xl font-black text-stark-primary mt-1">{metrics.avgGst}%</h4>
            </div>
          </div>

          {/* Toolbar Search & Status Filter */}
          <section className="bg-white rounded-xl border border-gray-150 p-4 shadow-sm flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search by HSN code or description..."
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

          {/* HSN Table View */}
          {filteredHsnRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl border border-gray-150 p-12 shadow-sm text-center">
              <img
                src="/empty-state.png"
                alt="Empty state illustration"
                className="w-64 h-64 object-contain mb-6 rounded-2xl"
              />
              <h3 className="text-lg font-black text-stark-text mb-2">No HSN Codes Found</h3>
              <p className="text-sm text-stark-muted max-w-sm">
                There are currently no records available to display.
              </p>
            </div>
          ) : (
            <section className="bg-white rounded-xl border border-gray-150 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-150">
                      <th className="px-5 py-4 text-[10px] font-black text-stark-muted uppercase tracking-wider w-32">HSN Code</th>
                      <th className="px-5 py-4 text-[10px] font-black text-stark-muted uppercase tracking-wider">Description</th>
                      <th className="px-5 py-4 text-[10px] font-black text-stark-muted uppercase tracking-wider w-24">GST %</th>
                      <th className="px-5 py-4 text-[10px] font-black text-stark-muted uppercase tracking-wider w-32 hidden md:table-cell">Effective From</th>
                      <th className="px-5 py-4 text-[10px] font-black text-stark-muted uppercase tracking-wider w-32 hidden md:table-cell">Effective To</th>
                      <th className="px-5 py-4 text-[10px] font-black text-stark-muted uppercase tracking-wider w-24">Status</th>
                      <th className="px-5 py-4 w-32 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {filteredHsnRecords.map((hsn) => {
                      const statusBadgeClass =
                        hsn.status === "Active"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-100 text-gray-600 border-gray-250";

                      return (
                        <tr key={hsn.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-3 font-bold text-stark-text tracking-wide">
                            {hsn.hsnCode}
                          </td>

                          <td className="px-5 py-3 text-stark-text leading-relaxed max-w-xs sm:max-w-md truncate">
                            {hsn.description}
                          </td>

                          <td className="px-5 py-3 font-bold text-stark-text">
                            {hsn.gstRate}%
                          </td>

                          <td className="px-5 py-3 text-stark-muted font-medium hidden md:table-cell">
                            {hsn.effectiveFrom}
                          </td>

                          <td className="px-5 py-3 text-stark-muted font-medium hidden md:table-cell">
                            {hsn.effectiveTo || <span className="text-gray-300">—</span>}
                          </td>

                          <td className="px-5 py-3">
                            <button
                              onClick={() => handleToggleStatusClick(hsn)}
                              disabled={pagePermission === "view"}
                              className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black cursor-pointer transition-all ${statusBadgeClass} ${pagePermission === "view" ? "opacity-70 cursor-not-allowed bg-gray-50 text-gray-400 border-gray-200" : "cursor-pointer hover:scale-105"}`}
                            >
                              {hsn.status}
                            </button>
                          </td>

                          <td className="px-5 py-3 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditModal(hsn)}
                                disabled={pagePermission === "view"}
                                className={`p-1 rounded hover:bg-gray-100 text-stark-muted hover:text-stark-primary cursor-pointer ${pagePermission === "view" ? "opacity-30 cursor-not-allowed text-stark-muted" : "hover:bg-gray-100 text-stark-muted hover:text-stark-primary cursor-pointer"}`}
                                title="Edit"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteClick(hsn)}
                                disabled={pagePermission !== "create"}
                                className={`p-1 rounded hover:bg-red-50 text-stark-muted hover:text-red-600 cursor-pointer ${pagePermission !== "create" ? "opacity-30 cursor-not-allowed text-stark-muted" : "hover:bg-red-50 text-stark-muted hover:text-red-600 cursor-pointer"}`}
                                title="Delete"
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

        </div>
        {/* END: WORKSPACE AREA */}

      </main>
      )}
      {/* END: MainContent */}

      {/* BEGIN: Add/Edit HSN Modal */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsAddEditModalOpen(false)}></div>
          
          <form 
            onSubmit={handleSaveHsn}
            className="bg-white rounded-2xl max-w-md w-full relative z-10 flex flex-col shadow-2xl border border-gray-100 overflow-hidden animate-fade-in"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <div>
                <h3 className="font-black text-lg text-stark-text">
                  {editingHsn ? "Edit HSN Code" : "Add HSN Code"}
                </h3>
                <p className="text-xs text-stark-muted">
                  Configure tax parameters, description and validity dates.
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
            <div className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-100 text-red-700 text-xs px-3 py-2 rounded-lg font-semibold">
                  {formError}
                </div>
              )}

              {/* HSN Code Input */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-stark-muted">HSN Code*</label>
                <input
                  type="text"
                  required
                  value={formHsnCode}
                  onChange={(e) => setFormHsnCode(e.target.value)}
                  placeholder="e.g. 84713010"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                />
              </div>

              {/* Description Input */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-stark-muted">Description*</label>
                <textarea
                  required
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detailed description of the goods/services..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary resize-none"
                />
              </div>

              {/* GST % Rate */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-stark-muted">GST % (Integer Only)*</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  required
                  value={formGstRate}
                  onChange={(e) => {
                    // Restrict input to integer digits only via UI input handling
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    setFormGstRate(val);
                  }}
                  placeholder="e.g. 18"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                />
              </div>

              {/* Effective From */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-stark-muted">Effective From (Future Date Only)*</label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    min={tomorrowDateString}
                    value={formEffectiveFrom}
                    onChange={(e) => setFormEffectiveFrom(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Effective To */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-stark-muted">Effective To (Future Date Only - Non-mandatory)</label>
                <div className="relative">
                  <input
                    type="date"
                    min={tomorrowDateString}
                    value={formEffectiveTo}
                    onChange={(e) => setFormEffectiveTo(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Status Selector */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-stark-muted">Status*</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddEditModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-stark-muted hover:text-stark-text cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-stark-primary hover:bg-stark-dark text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm cursor-pointer"
              >
                Save HSN
              </button>
            </div>
          </form>
        </div>
      )}
      {/* END: Add/Edit HSN Modal */}

      {/* BEGIN: Confirm Delete Modal */}
      {isConfirmDeleteOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsConfirmDeleteOpen(false)}></div>
          
          <div className="bg-white rounded-2xl max-w-sm w-full relative z-10 p-6 flex flex-col shadow-2xl border border-gray-100 text-center animate-fade-in">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4 border border-red-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
            
            <h3 className="text-base font-black text-stark-text mb-2">Delete HSN Code?</h3>
            <p className="text-xs text-stark-muted leading-relaxed mb-6">
              Are you sure you want to permanently delete HSN Code &quot;{pendingDeleteHsn?.hsnCode}&quot;? This action cannot be undone.
            </p>
            
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setIsConfirmDeleteOpen(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-stark-text hover:bg-gray-50 cursor-pointer"
              >
                No, Keep it
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-sm cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* END: Confirm Delete Modal */}

    </div>
  );
}
