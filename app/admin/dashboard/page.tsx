"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-[#F9FAFB] text-[#1F2937] overflow-x-hidden">
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
            className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-stark-primary/10 text-stark-primary font-medium"
            data-purpose="nav-item-active"
            href="/admin/dashboard"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>Dashboard</span>
          </Link>
          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors"
            data-purpose="nav-item"
            href="/admin/dashboard/orders"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>Orders</span>
          </Link>
          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors"
            data-purpose="nav-item"
            href="/admin/dashboard/categories"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>Categories</span>
          </Link>

          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors"
            data-purpose="nav-item"
            href="/admin/dashboard/subcategories"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M4 6h16M7 10h13M7 14h13M4 18h16"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
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
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>Products</span>
          </Link>

          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors"
            data-purpose="nav-item"
            href="/admin/dashboard/billing"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>Billing</span>
          </Link>
          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors"
            data-purpose="nav-item"
            href="/admin/dashboard/customers"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
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
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>My Account</span>
          </Link>
          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-stark-muted hover:bg-stark-accent transition-colors"
            href="#"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
              <path
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>Settings</span>
          </Link>
          
          <div className="mt-4 pb-4">
            <Link
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
              href="/admin/login"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
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
      {/* END: MainContent */}
    </div>
  );
}
