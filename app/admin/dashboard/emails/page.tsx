"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { VENDORS, CUSTOMERS, DELIVERY_PARTNERS, Vendor, Customer, DeliveryPartner } from "../orders/data";
import LeftSidebar from "@/components/LeftSidebar";
import { INITIAL_ADMINS } from "../admins/data";

interface SentEmail {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientEmail: string;
  recipientRole: "Customer" | "Vendor" | "Delivery Partner";
  subject: string;
  body: string;
  sentAt: string; // ISO String
  status: "Sent" | "Delivered";
}

// Initial mockup list of sent emails
const INITIAL_EMAILS: SentEmail[] = [
  {
    id: "EML-1001",
    recipientId: "c1",
    recipientName: "Jane Cooper",
    recipientEmail: "jane.cooper@example.com",
    recipientRole: "Customer",
    subject: "Welcome to Stark Marketplace",
    body: "Hi Jane, thank you for joining Stark. We are excited to have you on board! Explore our wide range of products and enjoy exclusive deals.",
    sentAt: "2026-06-02T15:30:00Z",
    status: "Delivered"
  },
  {
    id: "EML-1002",
    recipientId: "v1",
    recipientName: "Alpha Tech",
    recipientEmail: "info@alphatech.com",
    recipientRole: "Vendor",
    subject: "May Monthly Statement Ready",
    body: "Hello Alpha Tech team, your monthly statement for May 2026 is now available. Log in to your vendor panel to download the statement.",
    sentAt: "2026-06-01T11:20:00Z",
    status: "Delivered"
  },
  {
    id: "EML-1003",
    recipientId: "dp1",
    recipientName: "Robert Fox",
    recipientEmail: "+1 (555) 019-2834", // fallback since delivery partners have phone but no email, or use info@deliverypartner.com
    recipientRole: "Delivery Partner",
    subject: "Delivery Account Verified",
    body: "Hi Robert, your Stark delivery partner account has been verified successfully. You can now start accepting orders in your region.",
    sentAt: "2026-06-01T08:30:00Z",
    status: "Delivered"
  },
  {
    id: "EML-1004",
    recipientId: "c2",
    recipientName: "Wade Warren",
    recipientEmail: "wade.warren@example.com",
    recipientRole: "Customer",
    subject: "Your Order ORD-9286 Has Been Processed",
    body: "Your order ORD-9286 has been successfully processed and packed. You can track your shipment status from your account dashboard.",
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

export default function EmailsPage() {
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
        setPagePermission(selectedAdmin.permissions.emails || null);
      }
    }
  }, []);

const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // States
  const [emailsList, setEmailsList] = useState<SentEmail[]>(INITIAL_EMAILS);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "Customer" | "Vendor" | "Delivery Partner">("all");

  // Send Email Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalRole, setModalRole] = useState<"Customer" | "Vendor" | "Delivery Partner">("Customer");
  const [recipientSearchQuery, setRecipientSearchQuery] = useState("");
  const [selectedRecipientId, setSelectedRecipientId] = useState("");
  const [selectedRecipientName, setSelectedRecipientName] = useState("");
  const [selectedRecipientEmail, setSelectedRecipientEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [formError, setFormError] = useState("");

  // KPI Metrics
  const metrics = useMemo(() => {
    return {
      total: emailsList.length,
      customer: emailsList.filter(e => e.recipientRole === "Customer").length,
      vendor: emailsList.filter(e => e.recipientRole === "Vendor").length,
      deliveryPartner: emailsList.filter(e => e.recipientRole === "Delivery Partner").length
    };
  }, [emailsList]);

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
    setSelectedRecipientEmail("");
    setEmailSubject("");
    setEmailBody("");
    setFormError("");
  };

  // Handle changing the selected role inside the modal
  const handleRoleChange = (role: "Customer" | "Vendor" | "Delivery Partner") => {
    setModalRole(role);
    setRecipientSearchQuery("");
    setSelectedRecipientId("");
    setSelectedRecipientName("");
    setSelectedRecipientEmail("");
    setFormError("");
  };

  // Handle selecting a recipient from the matching list
  const handleSelectRecipient = (id: string, name: string, email: string) => {
    setSelectedRecipientId(id);
    setSelectedRecipientName(name);
    setSelectedRecipientEmail(email);
  };

  // Send Action
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRecipientId || !selectedRecipientName) {
      setFormError("Please search and select a recipient.");
      return;
    }
    if (!emailSubject.trim()) {
      setFormError("Please enter an email subject.");
      return;
    }
    if (!emailBody.trim()) {
      setFormError("Please enter the email body.");
      return;
    }

    const newEmail: SentEmail = {
      id: `EML-${Date.now()}`,
      recipientId: selectedRecipientId,
      recipientName: selectedRecipientName,
      recipientEmail: selectedRecipientEmail || "n/a",
      recipientRole: modalRole,
      subject: emailSubject.trim(),
      body: emailBody.trim(),
      sentAt: new Date().toISOString(),
      status: "Sent"
    };

    setEmailsList([newEmail, ...emailsList]);
    setIsModalOpen(false);
  };

  // Sent Email filter
  const filteredEmailsList = useMemo(() => {
    return emailsList.filter(e => {
      const matchesSearch =
        e.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.recipientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.body.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === "all" || e.recipientRole === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [emailsList, searchQuery, roleFilter]);

  return (
    <div className="flex min-h-screen w-full bg-[#F9FAFB] text-[#1F2937] font-sans overflow-x-hidden">
      
      <LeftSidebar activePage="emails" isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

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
            <span className="font-bold text-sm">Stark Emails</span>
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
            <h2 className="text-2xl font-bold">Email Management</h2>
            <p className="text-sm text-stark-muted">
              Draft and send official system emails to customers, vendors, and delivery partners.
            </p>
          </div>
          <div className="flex gap-2">
            {pagePermission === "create" && (<button 
              onClick={handleOpenModal}
              className="bg-stark-primary hover:bg-stark-dark text-white px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-all shadow-sm font-medium text-sm shrink-0 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <span>Send Email</span>
            </button>)}
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
                  placeholder="Search by Recipient / Email / Subject / Body..."
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

          {/* SENT EMAILS LOG TABLE */}
          {filteredEmailsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl border border-gray-150 p-12 shadow-sm text-center">
              <img
                src="/empty-state.png"
                alt="Empty state illustration"
                className="w-64 h-64 object-contain mb-6 rounded-2xl"
              />
              <h3 className="text-lg font-black text-stark-text mb-2">No Emails Found</h3>
              <p className="text-sm text-stark-muted max-w-sm">
                There are currently no records available to display.
              </p>
            </div>
          ) : (
            <section className="bg-white rounded-xl border border-gray-150 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-base">Emails Sent History</h3>
                <span className="text-xs bg-stark-primary/10 text-stark-primary px-3 py-1 rounded-lg font-bold">
                  {filteredEmailsList.length} Messages
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-stark-accent border-b border-gray-100 text-[10px] uppercase font-bold text-stark-muted tracking-wider">
                      <th className="px-6 py-4">Recipient Name</th>
                      <th className="px-6 py-4">Email Address</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Subject Line</th>
                      <th className="px-6 py-4">Sent Time</th>
                      <th className="px-6 py-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150 text-xs">
                    {filteredEmailsList.map((eml) => {
                      const formattedDate = new Date(eml.sentAt).toLocaleString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                      });

                      return (
                        <tr key={eml.id} className="hover:bg-stark-accent/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-stark-text">
                            {eml.recipientName}
                          </td>
                          <td className="px-6 py-4 text-stark-muted italic">
                            {eml.recipientEmail}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-stark-primary/10 text-stark-primary">
                              {eml.recipientRole}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-stark-text max-w-xs truncate" title={eml.subject}>
                            {eml.subject}
                          </td>
                          <td className="px-6 py-4 text-stark-muted">
                            {formattedDate}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
                              {eml.status}
                            </span>
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

      </main>
      )}
      {/* END: MainContent */}

      {/* POPUP MODAL: SEND EMAIL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity duration-300">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-150">
              <h3 className="font-bold text-lg text-stark-text">Send Official System Email</h3>
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
            <form onSubmit={handleSendEmail} className="p-6 space-y-4">
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
                  placeholder={`Search ${modalRole.toLowerCase()}s by name or email...`}
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
                      const emailVal = "email" in rec ? (rec.email || "info@stark-partner.com") : "delivery.personnel@stark.com";
                      return (
                        <button
                          key={rec.id}
                          type="button"
                          onClick={() => handleSelectRecipient(rec.id, rec.name, emailVal)}
                          className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-stark-accent transition-colors ${
                            isSelected ? "bg-stark-primary/10 font-bold text-stark-primary" : ""
                          }`}
                        >
                          <div>
                            <span className="block font-medium">{rec.name}</span>
                            <span className="text-[9px] text-stark-muted block">
                              {emailVal}
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
                  <div>
                    <span className="block font-bold">Selected: {selectedRecipientName}</span>
                    <span className="text-[10px] italic block">{selectedRecipientEmail}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setSelectedRecipientId(""); setSelectedRecipientName(""); setSelectedRecipientEmail(""); }}
                    className="text-emerald-700 hover:text-emerald-950 font-bold"
                  >
                    Clear
                  </button>
                </div>
              )}

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-stark-muted uppercase tracking-wider mb-2">
                  Email Subject
                </label>
                <input
                  type="text"
                  placeholder="Enter email subject line..."
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary"
                />
              </div>

              {/* Body */}
              <div>
                <label className="block text-xs font-bold text-stark-muted uppercase tracking-wider mb-2">
                  Email Body Content
                </label>
                <textarea
                  rows={4}
                  placeholder="Type email body content here..."
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
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
                  Send Email
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
