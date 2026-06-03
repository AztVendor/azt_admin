"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  INITIAL_CATEGORIES, 
  INITIAL_SUB_CATEGORIES,
  INITIAL_MINI_CATEGORIES,
  INITIAL_MACRO_CATEGORIES,
  PRESET_ICONS, 
  MainCategory,
  SubCategory,
  MiniCategory,
  MacroCategory
} from "../categories/data";
import { 
  PRODUCTS as INITIAL_PRODUCTS, 
  VENDORS, 
  Vendor,
  Product 
} from "../orders/data";

// Helper function to render category icon (for sidebar / general display)
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
    default:
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      );
  }
};

export default function ProductsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Database States
  const [mainCategories] = useState<MainCategory[]>(INITIAL_CATEGORIES);
  const [subCategories] = useState<SubCategory[]>(INITIAL_SUB_CATEGORIES);
  const [miniCategories] = useState<MiniCategory[]>(INITIAL_MINI_CATEGORIES);
  const [macroCategories] = useState<MacroCategory[]>(INITIAL_MACRO_CATEGORIES);
  const [vendors] = useState<Vendor[]>(VENDORS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [vendorFilter, setVendorFilter] = useState("all");
  const [mainCategoryFilter, setMainCategoryFilter] = useState("all");
  const [subCategoryFilter, setSubCategoryFilter] = useState("all");
  const [miniCategoryFilter, setMiniCategoryFilter] = useState("all");
  const [macroCategoryFilter, setMacroCategoryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all"); // all, 7days, 30days, thismonth
  const [stockStatusFilter, setStockStatusFilter] = useState("all"); // all, instock, lowstock, outofstock
  const [activeStatusFilter, setActiveStatusFilter] = useState("all"); // all, Active, Inactive

  // Modals States
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockProduct, setStockProduct] = useState<Product | null>(null);
  const [stockInput, setStockInput] = useState(0);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [pendingDeleteProduct, setPendingDeleteProduct] = useState<Product | null>(null);

  // Add/Edit Form States
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState(0);
  const [formVendorId, setFormVendorId] = useState("");
  const [formMainId, setFormMainId] = useState("");
  const [formSubId, setFormSubId] = useState("");
  const [formMiniId, setFormMiniId] = useState("");
  const [formMacroId, setFormMacroId] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formStock, setFormStock] = useState(0);
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");
  const [formError, setFormError] = useState("");

  // Helper to resolve category hierarchy breadcrumbs
  const getCategoryBreadcrumb = (product: Product) => {
    const main = mainCategories.find((c) => c.id === product.mainCategoryId)?.name || "";
    const sub = product.subCategoryId ? (subCategories.find((s) => s.id === product.subCategoryId)?.name || "") : "";
    const mini = product.miniCategoryId ? (miniCategories.find((m) => m.id === product.miniCategoryId)?.name || "") : "";
    const macro = product.macroCategoryId ? (macroCategories.find((mr) => mr.id === product.macroCategoryId)?.name || "") : "";
    
    const crumbs = [main, sub, mini, macro].filter(Boolean);
    return crumbs.length > 0 ? crumbs.join(" > ") : "Uncategorized";
  };

  // Helper to calculate date filtering
  const matchesDateFilter = (createdAtStr?: string) => {
    if (dateFilter === "all" || !createdAtStr) return true;
    
    const createdDate = new Date(createdAtStr);
    const currentDate = new Date("2026-06-02T00:00:00Z"); // current simulation context
    const diffTime = Math.abs(currentDate.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (dateFilter === "7days") {
      return diffDays <= 7;
    } else if (dateFilter === "30days") {
      return diffDays <= 30;
    } else if (dateFilter === "thismonth") {
      // Created in the same month (June 2026 / May 2026 context)
      return createdDate.getMonth() === currentDate.getMonth() && createdDate.getFullYear() === currentDate.getFullYear();
    }
    return true;
  };

  // Helper to calculate stock status filtering
  const matchesStockStatusFilter = (stock?: number) => {
    if (stockStatusFilter === "all") return true;
    const stockVal = stock ?? 0;
    if (stockStatusFilter === "outofstock") {
      return stockVal === 0;
    } else if (stockStatusFilter === "lowstock") {
      return stockVal > 0 && stockVal <= 10;
    } else if (stockStatusFilter === "instock") {
      return stockVal > 10;
    }
    return true;
  };

  // Cascading Select lists for filter bar
  const filteredSubCategoriesForFilter = useMemo(() => {
    if (mainCategoryFilter === "all") return subCategories;
    return subCategories.filter((s) => s.parentId === mainCategoryFilter);
  }, [subCategories, mainCategoryFilter]);

  const filteredMiniCategoriesForFilter = useMemo(() => {
    if (subCategoryFilter === "all") return miniCategories;
    return miniCategories.filter((m) => m.parentId === subCategoryFilter);
  }, [miniCategories, subCategoryFilter]);

  const filteredMacroCategoriesForFilter = useMemo(() => {
    if (miniCategoryFilter === "all") return macroCategories;
    return macroCategories.filter((mr) => mr.parentId === miniCategoryFilter);
  }, [macroCategories, miniCategoryFilter]);

  // Adjust Filters dynamically (reset children if parent changes)
  const handleMainFilterChange = (val: string) => {
    setMainCategoryFilter(val);
    setSubCategoryFilter("all");
    setMiniCategoryFilter("all");
    setMacroCategoryFilter("all");
    setCurrentPage(1);
  };

  const handleSubFilterChange = (val: string) => {
    setSubCategoryFilter(val);
    setMiniCategoryFilter("all");
    setMacroCategoryFilter("all");
    setCurrentPage(1);
  };

  const handleMiniFilterChange = (val: string) => {
    setMiniCategoryFilter(val);
    setMacroCategoryFilter("all");
    setCurrentPage(1);
  };

  // Filtered & Search-applied Products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        product.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesVendor = vendorFilter === "all" || product.vendorId === vendorFilter;
      const matchesMain = mainCategoryFilter === "all" || product.mainCategoryId === mainCategoryFilter;
      
      // Category inheritance checks
      const matchesSub = subCategoryFilter === "all" || product.subCategoryId === subCategoryFilter;
      const matchesMini = miniCategoryFilter === "all" || product.miniCategoryId === miniCategoryFilter;
      const matchesMacro = macroCategoryFilter === "all" || product.macroCategoryId === macroCategoryFilter;
      
      const matchesDate = matchesDateFilter(product.createdAt);
      const matchesStock = matchesStockStatusFilter(product.stock);
      const matchesActive = activeStatusFilter === "all" || product.status === activeStatusFilter;

      return matchesSearch && matchesVendor && matchesMain && matchesSub && matchesMini && matchesMacro && matchesDate && matchesStock && matchesActive;
    }).sort((a, b) => {
      // Sort newest created first
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [products, searchQuery, vendorFilter, mainCategoryFilter, subCategoryFilter, miniCategoryFilter, macroCategoryFilter, dateFilter, stockStatusFilter, activeStatusFilter]);

  // Derived Metrics
  const metrics = useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => p.status === "Active").length;
    const inactive = products.filter((p) => p.status === "Inactive").length;
    const lowStock = products.filter((p) => (p.stock ?? 0) <= 10).length;
    return { total, active, inactive, lowStock };
  }, [products]);

  // Paginated Products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;

  // Add/Edit Form Available Sub Categories
  const formAvailableSubs = useMemo(() => {
    if (!formMainId) return [];
    return subCategories.filter((s) => s.parentId === formMainId);
  }, [subCategories, formMainId]);

  const formAvailableMinis = useMemo(() => {
    if (!formSubId) return [];
    return miniCategories.filter((m) => m.parentId === formSubId);
  }, [miniCategories, formSubId]);

  const formAvailableMacros = useMemo(() => {
    if (!formMiniId) return [];
    return macroCategories.filter((mr) => mr.parentId === formMiniId);
  }, [macroCategories, formMiniId]);

  // Form Cascading Triggers
  const handleFormMainChange = (val: string) => {
    setFormMainId(val);
    setFormSubId("");
    setFormMiniId("");
    setFormMacroId("");
  };

  const handleFormSubChange = (val: string) => {
    setFormSubId(val);
    setFormMiniId("");
    setFormMacroId("");
  };

  const handleFormMiniChange = (val: string) => {
    setFormMiniId(val);
    setFormMacroId("");
  };

  // Actions Handlers
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormName("");
    setFormPrice(0);
    setFormVendorId(vendors[0]?.id || "");
    setFormMainId(mainCategories[0]?.id || "");
    setFormSubId("");
    setFormMiniId("");
    setFormMacroId("");
    setFormImageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&q=80&fit=crop");
    setFormStock(50);
    setFormStatus("Active");
    setFormError("");
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormPrice(product.price);
    setFormVendorId(product.vendorId);
    setFormMainId(product.mainCategoryId || "");
    setFormSubId(product.subCategoryId || "");
    setFormMiniId(product.miniCategoryId || "");
    setFormMacroId(product.macroCategoryId || "");
    setFormImageUrl(product.imageUrl);
    setFormStock(product.stock ?? 0);
    setFormStatus(product.status ?? "Active");
    setFormError("");
    setIsAddEditModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = formName.trim();
    if (!cleanName) {
      setFormError("Product Name is required.");
      return;
    }
    if (formPrice < 0) {
      setFormError("Price must be 0 or greater.");
      return;
    }
    if (formStock < 0) {
      setFormError("Stock must be 0 or greater.");
      return;
    }
    if (!formMainId) {
      setFormError("Main Category is required.");
      return;
    }
    if (!formVendorId) {
      setFormError("Vendor is required.");
      return;
    }

    const resolvedCategory = mainCategories.find(c => c.id === formMainId)?.name || "General";

    if (editingProduct) {
      // Edit
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? { 
                ...p, 
                name: cleanName, 
                price: formPrice,
                vendorId: formVendorId,
                mainCategoryId: formMainId,
                subCategoryId: formSubId,
                miniCategoryId: formMiniId,
                macroCategoryId: formMacroId,
                imageUrl: formImageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&q=80&fit=crop",
                stock: formStock,
                status: formStatus,
                category: resolvedCategory
              }
            : p
        )
      );
    } else {
      // Add
      const newProduct: Product = {
        id: `p_${Date.now()}`,
        name: cleanName,
        price: formPrice,
        vendorId: formVendorId,
        mainCategoryId: formMainId,
        subCategoryId: formSubId,
        miniCategoryId: formMiniId,
        macroCategoryId: formMacroId,
        imageUrl: formImageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&q=80&fit=crop",
        stock: formStock,
        status: formStatus,
        category: resolvedCategory,
        createdAt: new Date().toISOString()
      };
      setProducts([newProduct, ...products]);
    }

    setIsAddEditModalOpen(false);
  };

  // Toggle active/inactive function directly
  const handleToggleStatus = (product: Product) => {
    const nextStatus = product.status === "Active" ? "Inactive" : "Active";
    setProducts(
      products.map((p) => (p.id === product.id ? { ...p, status: nextStatus } : p))
    );
  };

  // Stock Quick Modal Handlers
  const handleOpenStockModal = (product: Product) => {
    setStockProduct(product);
    setStockInput(product.stock ?? 0);
    setIsStockModalOpen(true);
  };

  const handleSaveStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (stockProduct) {
      const adjusted = Math.max(0, stockInput);
      setProducts(
        products.map((p) => (p.id === stockProduct.id ? { ...p, stock: adjusted } : p))
      );
    }
    setIsStockModalOpen(false);
    setStockProduct(null);
  };

  // Delete Handlers
  const handleDeleteClick = (product: Product) => {
    setPendingDeleteProduct(product);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (pendingDeleteProduct) {
      setProducts(products.filter((p) => p.id !== pendingDeleteProduct.id));
    }
    setIsDeleteConfirmOpen(false);
    setPendingDeleteProduct(null);
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
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors"
            data-purpose="nav-item"
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
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h16M7 10h13M10 14h10M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <span>Mini Categories</span>
          </Link>

          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors"
            data-purpose="nav-item"
            href="/admin/dashboard/macrocategories"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h16M7 10h13M10 14h10M13 18h7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <span>Macro Categories</span>
          </Link>

          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-stark-primary/10 text-stark-primary font-medium"
            data-purpose="nav-item-active"
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
            <span className="font-bold text-sm">Stark Products</span>
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
            <h2 className="text-2xl font-bold">Product Management</h2>
            <p className="text-sm text-stark-muted">
              Add new catalog products, update current inventory counts, and assign hierarchies.
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
              <span>Add Product</span>
            </button>
          </div>
        </header>
        {/* END: ContentHeader */}

        {/* WORKSPACE AREA */}
        <div className="space-y-6">
          
          {/* Summary statistics cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-stark-muted tracking-wider">Total Products</p>
              <h4 className="text-xl font-black text-stark-text mt-1">{metrics.total}</h4>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-green-600 tracking-wider">Active Products</p>
              <h4 className="text-xl font-black text-green-700 mt-1">{metrics.active}</h4>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Inactive Products</p>
              <h4 className="text-xl font-black text-gray-600 mt-1">{metrics.inactive}</h4>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-amber-600 tracking-wider">Low Stock Products</p>
              <h4 className="text-xl font-black text-amber-700 mt-1">{metrics.lowStock}</h4>
            </div>
          </div>

          {/* Advanced Filtering Grid */}
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
                  placeholder="Search products by Name/ID..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                />
              </div>

              {/* Vendor */}
              <div>
                <select
                  value={vendorFilter}
                  onChange={(e) => { setVendorFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                >
                  <option value="all">All Vendors</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              {/* Main Category */}
              <div>
                <select
                  value={mainCategoryFilter}
                  onChange={(e) => handleMainFilterChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                >
                  <option value="all">All Main Categories</option>
                  {mainCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Sub Category */}
              <div>
                <select
                  value={subCategoryFilter}
                  onChange={(e) => handleSubFilterChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                >
                  <option value="all">All Sub Categories</option>
                  {filteredSubCategoriesForFilter.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
              {/* Mini Category */}
              <div>
                <select
                  value={miniCategoryFilter}
                  onChange={(e) => handleMiniFilterChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                >
                  <option value="all">All Mini Categories</option>
                  {filteredMiniCategoriesForFilter.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              {/* Macro Category */}
              <div>
                <select
                  value={macroCategoryFilter}
                  onChange={(e) => { setMacroCategoryFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                >
                  <option value="all">All Macro Categories</option>
                  {filteredMacroCategoriesForFilter.map((mr) => (
                    <option key={mr.id} value={mr.id}>{mr.name}</option>
                  ))}
                </select>
              </div>

              {/* Date created filter */}
              <div>
                <select
                  value={dateFilter}
                  onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                >
                  <option value="all">All Created Dates</option>
                  <option value="7days">Created in Last 7 Days</option>
                  <option value="30days">Created in Last 30 Days</option>
                  <option value="thismonth">Created This Month</option>
                </select>
              </div>

              {/* Stock Status filter */}
              <div>
                <select
                  value={stockStatusFilter}
                  onChange={(e) => { setStockStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                >
                  <option value="all">All Stock Levels</option>
                  <option value="instock">In Stock (&gt;10)</option>
                  <option value="lowstock">Low Stock (1-10)</option>
                  <option value="outofstock">Out of Stock (0)</option>
                </select>
              </div>

              {/* Active/Inactive filter */}
              <div>
                <select
                  value={activeStatusFilter}
                  onChange={(e) => { setActiveStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                >
                  <option value="all">All Statuses</option>
                  <option value="Active">Active Products</option>
                  <option value="Inactive">Inactive Products</option>
                </select>
              </div>
            </div>
          </section>

          {/* Product list table */}
          <section className="bg-white rounded-xl border border-gray-150 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-150">
                    <th className="px-5 py-4 w-16 text-[10px] font-black text-stark-muted uppercase tracking-wider">Image</th>
                    <th className="px-5 py-4 text-[10px] font-black text-stark-muted uppercase tracking-wider">Product Details</th>
                    <th className="px-5 py-4 text-[10px] font-black text-stark-muted uppercase tracking-wider hidden sm:table-cell">Vendor</th>
                    <th className="px-5 py-4 text-[10px] font-black text-stark-muted uppercase tracking-wider hidden md:table-cell">Category Path</th>
                    <th className="px-5 py-4 text-[10px] font-black text-stark-muted uppercase tracking-wider">Stock</th>
                    <th className="px-5 py-4 text-[10px] font-black text-stark-muted uppercase tracking-wider">Status</th>
                    <th className="px-5 py-4 w-32 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {paginatedProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-stark-muted font-medium">
                        No products found matching the filter criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedProducts.map((product) => {
                      const resolvedVendor = vendors.find((v) => v.id === product.vendorId);
                      
                      // Stock badge
                      const stockVal = product.stock ?? 0;
                      let stockBadgeClass = "bg-green-50 text-green-700 border-green-200";
                      let stockLabel = `In Stock (${stockVal})`;
                      if (stockVal === 0) {
                        stockBadgeClass = "bg-red-50 text-red-700 border-red-200";
                        stockLabel = "Out of Stock";
                      } else if (stockVal <= 10) {
                        stockBadgeClass = "bg-amber-50 text-amber-700 border-amber-200";
                        stockLabel = `Low Stock (${stockVal})`;
                      }

                      // Active status badge
                      const activeBadgeClass =
                        product.status === "Active"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-100 text-gray-600 border-gray-250";

                      return (
                        <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-3">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded bg-white border border-gray-150 shrink-0"
                            />
                          </td>

                          <td className="px-5 py-3">
                            <div className="font-bold text-stark-text leading-tight">{product.name}</div>
                            <div className="text-[10px] text-stark-muted font-mono mt-0.5">ID: {product.id}</div>
                            <div className="text-[10px] text-stark-primary font-bold mt-0.5">${product.price.toFixed(2)}</div>
                          </td>

                          <td className="px-5 py-3 hidden sm:table-cell">
                            <div className="flex items-center space-x-2">
                              <span className={`w-2.5 h-2.5 rounded-full ${resolvedVendor?.color || "bg-gray-400"}`}></span>
                              <span className="font-semibold text-stark-text">{resolvedVendor?.name || "Unknown"}</span>
                            </div>
                          </td>

                          <td className="px-5 py-3 text-stark-muted font-medium hidden md:table-cell text-[10px]">
                            {getCategoryBreadcrumb(product)}
                          </td>

                          <td className="px-5 py-3">
                            <div className="flex items-center gap-1.5">
                              <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black ${stockBadgeClass}`}>
                                {stockLabel}
                              </span>
                              <button
                                onClick={() => handleOpenStockModal(product)}
                                className="p-1 rounded text-stark-muted hover:text-stark-primary hover:bg-gray-100 cursor-pointer"
                                title="Update Stock"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                </svg>
                              </button>
                            </div>
                          </td>

                          <td className="px-5 py-3">
                            <button
                              onClick={() => handleToggleStatus(product)}
                              className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black cursor-pointer ${activeBadgeClass}`}
                            >
                              {product.status ?? "Active"}
                            </button>
                          </td>

                          <td className="px-5 py-3 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditModal(product)}
                                className="p-1 rounded hover:bg-gray-100 text-stark-muted hover:text-stark-primary cursor-pointer"
                                title="Edit"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteClick(product)}
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

            {/* Pagination Controls Footer */}
            <div className="px-5 py-4 bg-gray-50 border-t border-gray-150 flex items-center justify-between">
              <span className="text-[10px] text-stark-muted font-semibold">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
              </span>
              <div className="flex gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-[10px] font-bold bg-white text-stark-text hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed cursor-pointer"
                >
                  Previous
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-[10px] font-bold bg-white text-stark-text hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </section>

        </div>
        {/* END: WORKSPACE AREA */}

      </main>
      {/* END: MainContent */}

      {/* BEGIN: Add/Edit Product Modal */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsAddEditModalOpen(false)}></div>
          
          <form 
            onSubmit={handleSaveProduct}
            className="bg-white rounded-2xl max-w-lg w-full relative z-10 flex flex-col shadow-2xl border border-gray-100 overflow-hidden animate-fade-in"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <div>
                <h3 className="font-black text-lg text-stark-text">
                  {editingProduct ? "Edit Product" : "Add Product"}
                </h3>
                <p className="text-xs text-stark-muted">
                  Configure details for this catalog product item.
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

              {/* Product Name */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-stark-muted">Product Name*</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Wireless Noise Cancelling Earbuds"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                />
              </div>

              {/* General Settings Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Vendor select */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-stark-muted">Vendor*</label>
                  <select
                    value={formVendorId}
                    onChange={(e) => setFormVendorId(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                  >
                    <option value="" disabled>Select...</option>
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-stark-muted">Price ($)*</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step="0.01"
                    value={formPrice}
                    onChange={(e) => setFormPrice(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                  />
                </div>

                {/* Stock */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-stark-muted">Stock Count*</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formStock}
                    onChange={(e) => setFormStock(parseInt(e.target.value) || 0)}
                    placeholder="10"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                  />
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-stark-muted">Status*</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                  >
                    <option value="Active">Active (Visible)</option>
                    <option value="Inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Category Hierarchy Container */}
              <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-150 space-y-3">
                <div className="text-xs font-bold text-stark-text">Category Hierarchy</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Main Category select */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-stark-muted uppercase tracking-wider">Main Category*</label>
                    <select
                      value={formMainId}
                      onChange={(e) => handleFormMainChange(e.target.value)}
                      required
                      className="w-full px-2 py-1.5 border border-gray-200 bg-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                    >
                      <option value="" disabled>Select...</option>
                      {mainCategories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} {c.status === "Inactive" ? "(Inactive)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sub Category select (optional) */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-stark-muted uppercase tracking-wider">Sub Category</label>
                    <select
                      value={formSubId}
                      onChange={(e) => handleFormSubChange(e.target.value)}
                      disabled={!formMainId || formAvailableSubs.length === 0}
                      className="w-full px-2 py-1.5 border border-gray-200 bg-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">None / N.A.</option>
                      {formAvailableSubs.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} {s.status === "Inactive" ? "(Inactive)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Mini Category select (optional) */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-stark-muted uppercase tracking-wider">Mini Category</label>
                    <select
                      value={formMiniId}
                      onChange={(e) => handleFormMiniChange(e.target.value)}
                      disabled={!formSubId || formAvailableMinis.length === 0}
                      className="w-full px-2 py-1.5 border border-gray-200 bg-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">None / N.A.</option>
                      {formAvailableMinis.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} {m.status === "Inactive" ? "(Inactive)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Macro Category select (optional) */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-stark-muted uppercase tracking-wider">Macro Category</label>
                    <select
                      value={formMacroId}
                      onChange={(e) => setFormMacroId(e.target.value)}
                      disabled={!formMiniId || formAvailableMacros.length === 0}
                      className="w-full px-2 py-1.5 border border-gray-200 bg-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">None / N.A.</option>
                      {formAvailableMacros.map((mr) => (
                        <option key={mr.id} value={mr.id}>
                          {mr.name} {mr.status === "Inactive" ? "(Inactive)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Product Image Selection & Upload */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-stark-muted">Product Image*</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-gray-50/50 p-4 rounded-xl border border-gray-150">
                  
                  {/* Visual Preview / Local File Selector Card */}
                  <div className="sm:col-span-1 flex flex-col items-center justify-center w-full">
                    <input
                      type="file"
                      accept="image/*"
                      id="product-image-upload"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="product-image-upload"
                      className="group relative w-24 h-24 bg-white border-2 border-dashed border-gray-300 hover:border-stark-primary rounded-xl overflow-hidden cursor-pointer flex flex-col items-center justify-center gap-1.5 transition-all text-center p-1.5 shadow-sm"
                    >
                      {formImageUrl ? (
                        <>
                          <img
                            src={formImageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[9px] font-black rounded-lg transition-opacity">
                            Change Image
                          </div>
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6 text-gray-400 group-hover:text-stark-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                          </svg>
                          <span className="text-[9px] font-black text-gray-500 group-hover:text-stark-primary transition-colors uppercase tracking-wider">Browse File</span>
                        </>
                      )}
                    </label>
                  </div>

                  {/* Online URL Input Section */}
                  <div className="sm:col-span-2 flex flex-col justify-center w-full space-y-2">
                    <div className="text-[11px] text-stark-muted leading-relaxed">
                      Click the card on the left to upload a local file, or paste a web link below.
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                      <label className="text-[10px] font-bold text-stark-muted uppercase tracking-wider">Image Web Address</label>
                      <input
                        type="url"
                        value={formImageUrl}
                        onChange={(e) => setFormImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full px-3 py-2 border border-gray-200 bg-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                      />
                    </div>
                  </div>

                </div>
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
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}
      {/* END: Add/Edit Product Modal */}

      {/* BEGIN: Quick Stock Update Modal */}
      {isStockModalOpen && stockProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsStockModalOpen(false)}></div>
          
          <form 
            onSubmit={handleSaveStock}
            className="bg-white rounded-2xl max-w-sm w-full relative z-10 flex flex-col shadow-2xl border border-gray-100 overflow-hidden animate-fade-in"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm text-stark-text">Adjust Stock Level</h3>
                <p className="text-[10px] text-stark-muted">Quick inventory adjustments for &quot;{stockProduct.name}&quot;</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsStockModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold p-1 cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stark-muted">Current Stock:</span>
                <span className="text-xs font-mono font-bold text-stark-text bg-gray-100 px-2 py-0.5 rounded">{stockProduct.stock ?? 0}</span>
              </div>

              {/* Adjustment buttons */}
              <div className="flex gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => setStockInput((s) => Math.max(0, s - 10))}
                  className="px-3 py-1.5 border border-gray-250 rounded text-xs font-bold text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  -10
                </button>
                <button
                  type="button"
                  onClick={() => setStockInput((s) => Math.max(0, s - 5))}
                  className="px-3 py-1.5 border border-gray-250 rounded text-xs font-bold text-red-500 hover:bg-red-50 cursor-pointer"
                >
                  -5
                </button>
                <button
                  type="button"
                  onClick={() => setStockInput((s) => s + 5)}
                  className="px-3 py-1.5 border border-gray-250 rounded text-xs font-bold text-green-600 hover:bg-green-50 cursor-pointer"
                >
                  +5
                </button>
                <button
                  type="button"
                  onClick={() => setStockInput((s) => s + 10)}
                  className="px-3 py-1.5 border border-gray-250 rounded text-xs font-bold text-green-700 hover:bg-green-50 cursor-pointer"
                >
                  +10
                </button>
              </div>

              {/* Explicit stock input */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-stark-muted">New Stock Count</label>
                <input
                  type="number"
                  min={0}
                  required
                  value={stockInput}
                  onChange={(e) => setStockInput(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary text-center font-mono font-bold text-lg"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsStockModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-stark-muted hover:text-stark-text cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-stark-primary hover:bg-stark-dark text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm cursor-pointer"
              >
                Save Stock
              </button>
            </div>
          </form>
        </div>
      )}
      {/* END: Quick Stock Update Modal */}

      {/* BEGIN: Confirm Delete Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsDeleteConfirmOpen(false)}></div>
          
          <div className="bg-white rounded-2xl max-w-sm w-full relative z-10 p-6 flex flex-col shadow-2xl border border-gray-100 text-center animate-fade-in">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4 border border-red-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </div>
            
            <h3 className="text-base font-black text-stark-text mb-2">Delete Product?</h3>
            <p className="text-xs text-stark-muted leading-relaxed mb-6">
              Are you sure you want to permanently delete the Product &quot;{pendingDeleteProduct?.name}&quot; from the catalog? This action cannot be undone.
            </p>
            
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
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
