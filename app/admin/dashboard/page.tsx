"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import LeftSidebar from "@/components/LeftSidebar";
import { INITIAL_ADMINS } from "./admins/data";

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pagePermission, setPagePermission] = useState<string | null>("create");

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
        setPagePermission(selectedAdmin.permissions.dashboard || null);
      }
    }
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-[#F9FAFB] text-[#1F2937] overflow-x-hidden">
      <LeftSidebar activePage="dashboard" isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

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
            <span className="font-bold text-sm">Stark Dashboard</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded hover:bg-gray-100 text-stark-muted"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
        </div>
        <header
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
          data-purpose="page-header"
        >
          <div>
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <p className="text-sm text-stark-muted">Monitor your sales revenue here.</p>
          </div>
          <button className="bg-stark-primary hover:bg-opacity-90 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all shadow-sm shrink-0">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 4v16m8-8H4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span className="text-sm font-medium">Add Widget</span>
          </button>
        </header>
        {/* END: ContentHeader */}

        {/* BEGIN: SummaryCards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6" data-purpose="summary-stats">
          {/* Total Income Card */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-stark-accent flex items-center justify-center text-stark-primary">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-stark-muted">Total Income</p>
                <h3 className="text-xl font-bold">$129,230</h3>
              </div>
            </div>
            {/* Tiny Sparkline Placeholder */}
            <div className="w-16 h-8 text-stark-primary">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                <path d="M0 35 Q 20 10, 40 25 T 80 5 T 100 15" fill="none" stroke="currentColor" strokeWidth="3" />
              </svg>
            </div>
          </div>

          {/* Total Sales Card */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-stark-accent flex items-center justify-center text-stark-primary">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-stark-muted">Total Sales</p>
                <h3 className="text-xl font-bold">2,456</h3>
              </div>
            </div>
            <div className="w-16 h-8 text-stark-primary/60">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                <path d="M0 20 Q 20 30, 40 10 T 80 35 T 100 5" fill="none" stroke="currentColor" strokeWidth="3" />
              </svg>
            </div>
          </div>

          {/* Total Expenses Card */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-stark-accent flex items-center justify-center text-stark-primary">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-stark-muted">Total Expenses</p>
                <h3 className="text-xl font-bold">$5,354</h3>
              </div>
            </div>
            <div className="w-16 h-8 text-red-400">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                <path d="M0 5 Q 20 15, 40 35 T 80 15 T 100 30" fill="none" stroke="currentColor" strokeWidth="3" />
              </svg>
            </div>
          </div>
        </div>
        {/* END: SummaryCards */}

        {/* BEGIN: RevenueChartCard */}
        <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-6" data-purpose="revenue-analysis">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-stark-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              <h4 className="font-bold">Sales Revenue</h4>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-1.5 rounded-full bg-stark-primary"></span>
                  <span className="text-xs text-stark-muted">Recurring Revenue</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-1.5 rounded-full bg-gray-200"></span>
                  <span className="text-xs text-stark-muted">One-time Revenue</span>
                </div>
              </div>
              <div className="flex bg-stark-accent p-1 rounded-lg">
                <button className="px-3 py-1 text-xs font-semibold bg-white rounded-md shadow-sm">Monthly</button>
                <button className="px-3 py-1 text-xs font-semibold text-stark-muted hover:text-stark-text">Quarterly</button>
                <button className="px-3 py-1 text-xs font-semibold text-stark-muted hover:text-stark-text">Yearly</button>
              </div>
            </div>
          </div>

          {/* Mock Chart Visualization */}
          <div className="relative h-[250px] w-full" data-purpose="revenue-chart">
            {/* Chart Axis Lines */}
            <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-stark-muted py-2 border-b border-l border-gray-100">
              <div className="w-full flex items-center"><span className="w-10">$150k</span><div className="flex-1 border-b border-gray-50 border-dashed"></div></div>
              <div className="w-full flex items-center"><span className="w-10">$125k</span><div className="flex-1 border-b border-gray-50 border-dashed"></div></div>
              <div className="w-full flex items-center"><span className="w-10">$100k</span><div className="flex-1 border-b border-gray-50 border-dashed"></div></div>
              <div className="w-full flex items-center"><span className="w-10">$75k</span><div className="flex-1 border-b border-gray-50 border-dashed"></div></div>
              <div className="w-full flex items-center"><span className="w-10">$50k</span><div className="flex-1 border-b border-gray-50 border-dashed"></div></div>
              <div className="w-full flex items-center"><span className="w-10">$0</span><div className="flex-1 border-b border-gray-50 border-dashed"></div></div>
            </div>

            {/* Image Placeholder for Chart Content to match the fidelity of the request */}
            <div className="absolute inset-0 ml-10 mb-6 flex items-end">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="purpleGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#7C83D7"></stop>
                    <stop offset="100%" stopColor="#FFFFFF"></stop>
                  </linearGradient>
                </defs>
                {/* Shaded Area */}
                <path d="M0,200 C150,190 300,170 450,140 C600,110 750,70 900,40 L900,220 L0,220 Z" fill="url(#purpleGradient)" opacity="0.1"></path>
                {/* Main Line */}
                <path d="M0,200 C150,190 300,170 450,140 C600,110 750,70 900,40" fill="none" stroke="#7C83D7" strokeWidth="3"></path>
                {/* Secondary Line */}
                <path d="M0,220 C150,215 300,205 450,190 C600,170 750,140 900,100" fill="none" stroke="#E5E7EB" strokeWidth="2"></path>
                {/* Callout Marker */}
                <line opacity="0.3" stroke="#1F2937" strokeDasharray="4" x1="650" x2="650" y1="20" y2="240"></line>
                <circle cx="650" cy="115" fill="#1F2937" r="4"></circle>
                <rect fill="#1F2937" height="24" rx="6" width="80" x="610" y="85"></rect>
                <text fill="white" fontSize="10" fontWeight="600" textAnchor="middle" x="650" y="101">$77,938.22</text>
              </svg>
            </div>

            {/* Bottom Dates */}
            <div className="absolute bottom-0 left-10 right-0 flex justify-between text-[10px] text-stark-muted px-4">
              <span>10/10/2023</span>
              <span>20/10/2023</span>
              <span>30/10/2023</span>
              <span>10/11/2023</span>
              <span className="font-bold text-stark-primary">20/11/2023</span>
              <span>30/11/2023</span>
              <span>10/12/2023</span>
            </div>
          </div>
        </section>
        {/* END: RevenueChartCard */}

        {/* BEGIN: TransactionsTable */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden" data-purpose="transaction-list">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-stark-muted uppercase tracking-wider">Customer Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-stark-muted uppercase tracking-wider hidden sm:table-cell">Tag</th>
                  <th className="px-6 py-4 text-xs font-semibold text-stark-muted uppercase tracking-wider hidden md:table-cell">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-stark-muted uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-stark-muted uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-semibold text-stark-muted uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {/* Row 1: Stripe */}
                <tr className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded bg-[#635BFF] flex items-center justify-center text-white font-bold text-[10px]">S</div>
                      <span className="text-sm font-medium">Stripe</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stark-muted hidden sm:table-cell">One-Time</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stark-muted hidden md:table-cell">12 Aug, 2024</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-semibold">Completed</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">$5,234.33</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-300">
                    <button className="hover:text-stark-primary"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg></button>
                  </td>
                </tr>
                {/* Row 2: Shopify */}
                <tr className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded bg-[#96BF48] flex items-center justify-center text-white font-bold text-[10px]">S</div>
                      <span className="text-sm font-medium">Shopify</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stark-muted hidden sm:table-cell">One-Time</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stark-muted hidden md:table-cell">12 Aug, 2024</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-600 text-xs font-semibold">Pending</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">$5,234.33</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-300">
                    <button className="hover:text-stark-primary"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg></button>
                  </td>
                </tr>
                {/* Row 3: Reddit */}
                <tr className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded bg-[#FF4500] flex items-center justify-center text-white font-bold text-[10px]">R</div>
                      <span className="text-sm font-medium">Reddit</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stark-muted hidden sm:table-cell">One-Time</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stark-muted hidden md:table-cell">12 Aug, 2024</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold">Initiated</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">$5,234.33</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-300">
                    <button className="hover:text-stark-primary"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg></button>
                  </td>
                </tr>
                {/* Row 4: Adobe */}
                <tr className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded bg-[#FF0000] flex items-center justify-center text-white font-bold text-[10px]">A</div>
                      <span className="text-sm font-medium">Adobe</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stark-muted hidden sm:table-cell">One-Time</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stark-muted hidden md:table-cell">12 Aug, 2024</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-semibold">Completed</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">$5,234.33</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-300">
                    <button className="hover:text-stark-primary"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        {/* END: TransactionsTable */}
        </main>
      )}
      {/* END: MainContent */}
    </div>
  );
}
