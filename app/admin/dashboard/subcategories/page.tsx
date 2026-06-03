"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  INITIAL_CATEGORIES, 
  INITIAL_SUB_CATEGORIES,
  PRESET_ICONS, 
  MainCategory,
  SubCategory
} from "../categories/data";

// Helper function to render preset SVG icons
const renderCategoryIcon = (key: string, className = "w-5 h-5") => {
  switch (key) {
    case "devices":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      );
    case "apparel":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 8h-4.5a2.5 2.5 0 00-5 0H7a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2v-8a2 2 0 002-2z M12 6a1.5 1.5 0 011.5 1.5H10.5A1.5 1.5 0 0112 6z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      );
    case "groceries":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      );
    case "home":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      );
    case "sports":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10M12 2a15.3 15.3 0 00-4 10 15.3 15.3 0 004 10 M2 12h20" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      );
    case "automotive":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm11 0a2 2 0 11-4 0 2 2 0 014 0z M5 17h2m8 0h2m-12-3h14m1-4l-1.5-4h-11L2 10v4h20v-4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      );
    case "books":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      );
    case "toys":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      );
    case "beauty":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.6 15.17a2 2 0 01-1.577-1.96V8.2a2 2 0 012-2h12a2 2 0 012 2v7.228z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      );
    default:
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      );
  }
};

export default function SubCategoriesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Database States
  const [mainCategories] = useState<MainCategory[]>(INITIAL_CATEGORIES);
  const [subCategories, setSubCategories] = useState<SubCategory[]>(INITIAL_SUB_CATEGORIES);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Inactive">("all");

  // Add/Edit Modal States
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<SubCategory | null>(null);

  // Form States
  const [formName, setFormName] = useState("");
  const [formParentId, setFormParentId] = useState("");
  const [formIconKey, setFormIconKey] = useState("devices");
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");
  const [formError, setFormError] = useState("");

  // Confirmation/Warning Modals
  const [isStatusWarningOpen, setIsStatusWarningOpen] = useState(false);
  const [pendingStatusSub, setPendingStatusSub] = useState<SubCategory | null>(null);

  const [isParentInactiveBlockerOpen, setIsParentInactiveBlockerOpen] = useState(false);
  const [blockedParentName, setBlockedParentName] = useState("");

  const [isDeleteBlockerOpen, setIsDeleteBlockerOpen] = useState(false);
  const [blockedItemName, setBlockedItemName] = useState("");

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [pendingDeleteSub, setPendingDeleteSub] = useState<SubCategory | null>(null);

  // Sorting & Filtering Helper
  const filteredAndSortedSubCategories = useMemo(() => {
    return [...subCategories]
      .filter((sub) => {
        const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        // Group by parent Main Category sort order, then by Sub Category sort order
        const parentA = mainCategories.find((c) => c.id === a.parentId);
        const parentB = mainCategories.find((c) => c.id === b.parentId);
        const parentSortA = parentA ? parentA.sortOrder : 999;
        const parentSortB = parentB ? parentB.sortOrder : 999;
        
        if (parentSortA !== parentSortB) {
          return parentSortA - parentSortB;
        }
        return a.sortOrder - b.sortOrder;
      });
  }, [subCategories, mainCategories, searchQuery, statusFilter]);

  // Metrics derived from state
  const metrics = useMemo(() => {
    const total = subCategories.length;
    const active = subCategories.filter((s) => s.status === "Active").length;
    const inactive = subCategories.filter((s) => s.status === "Inactive").length;
    const totalChildren = subCategories.reduce((sum, s) => sum + (s.childCount || 0), 0);
    return { total, active, inactive, totalChildren };
  }, [subCategories]);

  // Modal Open Handlers
  const handleOpenAddModal = () => {
    setEditingSub(null);
    setFormName("");
    setFormParentId(mainCategories[0]?.id || "");
    setFormIconKey("devices");
    setFormStatus("Active");
    setFormError("");
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (sub: SubCategory) => {
    setEditingSub(sub);
    setFormName(sub.name);
    setFormParentId(sub.parentId);
    setFormIconKey(sub.iconName);
    setFormStatus(sub.status);
    setFormError("");
    setIsAddEditModalOpen(true);
  };

  // Form Submit Handler
  const handleSaveSubCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = formName.trim();
    if (!cleanName) {
      setFormError("Sub Category Name is required.");
      return;
    }

    if (!formParentId) {
      setFormError("Parent Main Category is required.");
      return;
    }

    // Validation: name is unique within selected parent Main Category
    const duplicate = subCategories.some(
      (s) =>
        s.parentId === formParentId &&
        s.name.toLowerCase() === cleanName.toLowerCase() &&
        (!editingSub || s.id !== editingSub.id)
    );
    if (duplicate) {
      const parentName = mainCategories.find((c) => c.id === formParentId)?.name || "Parent";
      setFormError(`A Sub Category named "${cleanName}" already exists under "${parentName}".`);
      return;
    }

    // Validation: status cannot be Active if the parent Main Category is Inactive
    const parentMain = mainCategories.find((c) => c.id === formParentId);
    if (formStatus === "Active" && parentMain && parentMain.status === "Inactive") {
      setFormError(`Cannot set Sub Category to Active because parent Main Category "${parentMain.name}" is Inactive.`);
      return;
    }

    if (editingSub) {
      // Edit
      setSubCategories(
        subCategories.map((s) =>
          s.id === editingSub.id
            ? { ...s, name: cleanName, parentId: formParentId, iconName: formIconKey, status: formStatus }
            : s
        )
      );
    } else {
      // Add
      const siblingSubs = subCategories.filter((s) => s.parentId === formParentId);
      const maxSortOrder = siblingSubs.reduce((max, s) => (s.sortOrder > max ? s.sortOrder : max), 0);
      const newSub: SubCategory = {
        id: `sc_${Date.now()}`,
        parentId: formParentId,
        name: cleanName,
        iconName: formIconKey,
        status: formStatus,
        sortOrder: maxSortOrder + 1,
        childCount: 0,
        createdAt: new Date().toISOString(),
      };
      setSubCategories([...subCategories, newSub]);
    }

    setIsAddEditModalOpen(false);
  };

  // Toggle Status Click
  const handleToggleStatusClick = (sub: SubCategory) => {
    if (sub.status === "Active") {
      // Active -> Inactive: Warn deactivation cascades to mini/macro children
      setPendingStatusSub(sub);
      setIsStatusWarningOpen(true);
    } else {
      // Inactive -> Active: Check parent status
      const parentMain = mainCategories.find((c) => c.id === sub.parentId);
      if (parentMain && parentMain.status === "Inactive") {
        setBlockedParentName(parentMain.name);
        setIsParentInactiveBlockerOpen(true);
      } else {
        setSubCategories(
          subCategories.map((s) => (s.id === sub.id ? { ...s, status: "Active" } : s))
        );
      }
    }
  };

  const confirmInactivation = () => {
    if (pendingStatusSub) {
      setSubCategories(
        subCategories.map((s) =>
          s.id === pendingStatusSub.id ? { ...s, status: "Inactive" } : s
        )
      );
    }
    setIsStatusWarningOpen(false);
    setPendingStatusSub(null);
  };

  // Delete Click
  const handleDeleteClick = (sub: SubCategory) => {
    if (sub.childCount > 0) {
      setBlockedItemName(sub.name);
      setIsDeleteBlockerOpen(true);
    } else {
      setPendingDeleteSub(sub);
      setIsConfirmDeleteOpen(true);
    }
  };

  const confirmDelete = () => {
    if (pendingDeleteSub) {
      setSubCategories(subCategories.filter((s) => s.id !== pendingDeleteSub.id));
    }
    setIsConfirmDeleteOpen(false);
    setPendingDeleteSub(null);
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
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <span>Dashboard</span>
          </Link>

          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors"
            data-purpose="nav-item"
            href="/admin/dashboard/orders"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <span>Orders</span>
          </Link>

          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors"
            data-purpose="nav-item"
            href="/admin/dashboard/categories"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h16M4 10h16M4 14h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <span>Categories</span>
          </Link>

          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-stark-primary/10 text-stark-primary font-medium"
            data-purpose="nav-item-active"
            href="/admin/dashboard/subcategories"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h16M7 10h13M7 14h13M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <span>Sub Categories</span>
          </Link>

          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors"
            data-purpose="nav-item"
            href="/admin/dashboard/minicategories"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M4 6h16M7 10h13M10 14h10M4 18h16"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>Mini Categories</span>
          </Link>

          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors"
            data-purpose="nav-item"
            href="/admin/dashboard/macrocategories"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M4 6h16M7 10h13M10 14h10M13 18h7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>Macro Categories</span>
          </Link>

          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors"
            data-purpose="nav-item"
            href="/admin/dashboard/products"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <span>Products</span>
          </Link>

          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors"
            data-purpose="nav-item"
            href="/admin/dashboard/billing"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <span>Billing</span>
          </Link>

          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors"
            data-purpose="nav-item"
            href="/admin/dashboard/customers"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <span>Customers</span>
          </Link>
          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors"
            data-purpose="nav-item"
            href="/admin/dashboard/vendors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>Vendors</span>
          </Link>

          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors"
            data-purpose="nav-item"
            href="/admin/dashboard/notifications"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>Notifications</span>
          </Link>

          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors"
            data-purpose="nav-item"
            href="/admin/dashboard/emails"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
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
            <span className="font-bold text-sm">Stark Sub Categories</span>
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
            <h2 className="text-2xl font-bold">Sub Category Management</h2>
            <p className="text-sm text-stark-muted">
              Configure and organize Sub Categories nested under Main Categories.
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
              <span>Add Sub Category</span>
            </button>
          </div>
        </header>
        {/* END: ContentHeader */}

        {/* WORKSPACE AREA */}
        <div className="space-y-6">
          
          {/* Summary statistics cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-stark-muted tracking-wider">Total Sub Categories</p>
              <h4 className="text-xl font-black text-stark-text mt-1">{metrics.total}</h4>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-green-600 tracking-wider">Active Sub Categories</p>
              <h4 className="text-xl font-black text-green-700 mt-1">{metrics.active}</h4>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Inactive Sub Categories</p>
              <h4 className="text-xl font-black text-gray-600 mt-1">{metrics.inactive}</h4>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-stark-primary tracking-wider">Total Mini/Macro Children</p>
              <h4 className="text-xl font-black text-stark-primary mt-1">{metrics.totalChildren}</h4>
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
                placeholder="Search sub categories..."
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

          {/* Categories Table View */}
          <section className="bg-white rounded-xl border border-gray-150 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-150">
                    <th className="px-5 py-4 w-20 text-[10px] font-black text-stark-muted uppercase tracking-wider">Icon</th>
                    <th className="px-5 py-4 text-[10px] font-black text-stark-muted uppercase tracking-wider">Sub Category Details</th>
                    <th className="px-5 py-4 text-[10px] font-black text-stark-muted uppercase tracking-wider hidden sm:table-cell">Parent Main Category</th>
                    <th className="px-5 py-4 text-[10px] font-black text-stark-muted uppercase tracking-wider hidden sm:table-cell">Mini/Macro Children</th>
                    <th className="px-5 py-4 text-[10px] font-black text-stark-muted uppercase tracking-wider">Status</th>
                    <th className="px-5 py-4 w-32 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {filteredAndSortedSubCategories.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-stark-muted font-medium">
                        No sub categories found matching the filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedSubCategories.map((sub) => {
                      const statusBadgeClass =
                        sub.status === "Active"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-100 text-gray-600 border-gray-250";

                      const parentName = mainCategories.find((c) => c.id === sub.parentId)?.name || "Unknown Parent";

                      return (
                        <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-3">
                            <div className="w-9 h-9 bg-stark-primary/10 border border-stark-primary/20 rounded-lg flex items-center justify-center text-stark-primary">
                              {renderCategoryIcon(sub.iconName, "w-4.5 h-4.5")}
                            </div>
                          </td>

                          <td className="px-5 py-3">
                            <div className="font-bold text-stark-text">{sub.name}</div>
                            <div className="text-[10px] text-stark-muted font-mono mt-0.5">ID: {sub.id}</div>
                          </td>

                          <td className="px-5 py-3 text-stark-text font-bold hidden sm:table-cell">
                            {parentName}
                          </td>

                          <td className="px-5 py-3 text-stark-text font-bold hidden sm:table-cell">
                            {sub.childCount}
                          </td>

                          <td className="px-5 py-3">
                            <button
                              onClick={() => handleToggleStatusClick(sub)}
                              className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black cursor-pointer ${statusBadgeClass}`}
                            >
                              {sub.status}
                            </button>
                          </td>

                          <td className="px-5 py-3 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditModal(sub)}
                                className="p-1 rounded hover:bg-gray-100 text-stark-muted hover:text-stark-primary cursor-pointer"
                                title="Edit"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteClick(sub)}
                                className="p-1 rounded hover:bg-red-50 text-stark-muted hover:text-red-600 cursor-pointer"
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
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </div>
        {/* END: WORKSPACE AREA */}

      </main>
      {/* END: MainContent */}

      {/* BEGIN: Add/Edit Sub Category Modal */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsAddEditModalOpen(false)}></div>
          
          <form 
            onSubmit={handleSaveSubCategory}
            className="bg-white rounded-2xl max-w-md w-full relative z-10 flex flex-col shadow-2xl border border-gray-100 overflow-hidden animate-fade-in"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <div>
                <h3 className="font-black text-lg text-stark-text">
                  {editingSub ? "Edit Sub Category" : "Add Sub Category"}
                </h3>
                <p className="text-xs text-stark-muted">
                  Configure details for your nested product category node.
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

              {/* Parent Main Category Dropdown Selector */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-stark-muted">Parent Main Category*</label>
                <select
                  value={formParentId}
                  onChange={(e) => setFormParentId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                >
                  <option value="" disabled>Select parent category...</option>
                  {mainCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.status === "Inactive" ? "(Inactive Parent)" : ""}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-stark-muted">
                  Determines which main category hierarchy this subcategory nests under.
                </p>
              </div>

              {/* Name Input */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-stark-muted">Sub Category Name*</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Smart Phones"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                />
              </div>

              {/* Icon preset list with visual preview block */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-stark-muted">Sub Category Icon*</label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-stark-primary/10 rounded-lg flex items-center justify-center border border-stark-primary/20 text-stark-primary shrink-0">
                    {renderCategoryIcon(formIconKey, "w-6 h-6")}
                  </div>
                  <select
                    value={formIconKey}
                    onChange={(e) => setFormIconKey(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                  >
                    {PRESET_ICONS.map((ico) => (
                      <option key={ico.key} value={ico.key}>
                        {ico.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status Selector */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-stark-muted">Status</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                >
                  <option value="Active">Active (Visible)</option>
                  <option value="Inactive">Inactive (Hidden)</option>
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
                Save Sub Category
              </button>
            </div>
          </form>
        </div>
      )}
      {/* END: Add/Edit Sub Category Modal */}

      {/* BEGIN: Status Warning Modal (Cascading Inactivation Warning) */}
      {isStatusWarningOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsStatusWarningOpen(false)}></div>
          
          <div className="bg-white rounded-2xl max-w-sm w-full relative z-10 p-6 flex flex-col shadow-2xl border border-gray-100 text-center animate-fade-in">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mx-auto mb-4 border border-amber-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
            
            <h3 className="text-base font-black text-stark-text mb-2">Inactivate Sub Category?</h3>
            <p className="text-xs text-stark-muted leading-relaxed mb-6">
              Inactivating this Sub Category will automatically inactivate all nested Mini/Macro categories under it. Do you wish to proceed?
            </p>
            
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setIsStatusWarningOpen(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-stark-text hover:bg-gray-50 cursor-pointer"
              >
                No, Keep Active
              </button>
              <button
                onClick={confirmInactivation}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold shadow-sm cursor-pointer"
              >
                Yes, Inactivate
              </button>
            </div>
          </div>
        </div>
      )}
      {/* END: Status Warning Modal */}

      {/* BEGIN: Parent Inactive Blocker Modal */}
      {isParentInactiveBlockerOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsParentInactiveBlockerOpen(false)}></div>
          
          <div className="bg-white rounded-2xl max-w-sm w-full relative z-10 p-6 flex flex-col shadow-2xl border border-gray-100 text-center animate-fade-in">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4 border border-red-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
            
            <h3 className="text-base font-black text-stark-text mb-2">Activation Blocked</h3>
            <p className="text-xs text-stark-muted leading-relaxed mb-6">
              Cannot activate Sub Category because parent Main Category &quot;{blockedParentName}&quot; is Inactive. Please activate the parent Main Category first.
            </p>
            
            <button
              onClick={() => setIsParentInactiveBlockerOpen(false)}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-stark-text rounded-lg text-xs font-bold cursor-pointer"
            >
              OK, Got it
            </button>
          </div>
        </div>
      )}
      {/* END: Parent Inactive Blocker Modal */}

      {/* BEGIN: Deletion Blocker Modal */}
      {isDeleteBlockerOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsDeleteBlockerOpen(false)}></div>
          
          <div className="bg-white rounded-2xl max-w-sm w-full relative z-10 p-6 flex flex-col shadow-2xl border border-gray-100 text-center animate-fade-in">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4 border border-red-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
            
            <h3 className="text-base font-black text-stark-text mb-2">Deletion Blocked</h3>
            <p className="text-xs text-stark-muted leading-relaxed mb-6">
              Cannot delete Sub Category &quot;{blockedItemName}&quot; because it contains nested Mini/Macro categories. Please delete or reassign them first.
            </p>
            
            <button
              onClick={() => setIsDeleteBlockerOpen(false)}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-stark-text rounded-lg text-xs font-bold cursor-pointer"
            >
              OK, Got it
            </button>
          </div>
        </div>
      )}
      {/* END: Deletion Blocker Modal */}

      {/* BEGIN: Confirm Delete Modal (item with 0 children) */}
      {isConfirmDeleteOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsConfirmDeleteOpen(false)}></div>
          
          <div className="bg-white rounded-2xl max-w-sm w-full relative z-10 p-6 flex flex-col shadow-2xl border border-gray-100 text-center animate-fade-in">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4 border border-red-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
            
            <h3 className="text-base font-black text-stark-text mb-2">Delete Sub Category?</h3>
            <p className="text-xs text-stark-muted leading-relaxed mb-6">
              Are you sure you want to permanently delete the Sub Category &quot;{pendingDeleteSub?.name}&quot;? This action cannot be undone.
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
