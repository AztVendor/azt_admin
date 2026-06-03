import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      {/* BEGIN: MainContainer */}
      <main className="w-full max-w-md md:max-w-6xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[700px]">
        {/* BEGIN: SidebarSection */}
        <section
          className="hidden md:flex md:w-1/2 bg-stark-light relative flex-col justify-between p-8 md:p-12 overflow-hidden"
          data-purpose="marketing-sidebar"
        >
          {/* 3D Character Illustration Area */}
          <div className="relative z-10 flex flex-col items-center justify-center flex-grow">
            <img
              alt="Company Owner using laptop"
              className="w-full h-auto object-contain max-h-[400px]"
              src="https://lh3.googleusercontent.com/aida/ADBb0ujXMw8loUGSVJBh7kY1uk7hVjFIcyZjVPE1dms8RdqS8RJ1ZsIxcDr-qMYLyGuMtXbzUhPbJ-sdedsj2v9ECDl8oEvv6hE3xG_jq5D2bmg0W342ecEPp8-bLjk0we0F3v0j8zkct0rOGQaVIkOZ9euecO64oWOS4ZsJd2xmlq4RbIP5j0k_5CfKscg40UXSvP38V45BCP370SFTEAnqdnH4IMrvNEx-1Qw8Xl5BIJj4LiuqB59lkfoIEh6f6XE-9yUp-qb9sMyCYw"
            />
          </div>
          {/* Feature Card */}
          <div
            className="bg-stark-dark/90 backdrop-blur-sm rounded-xl p-8 text-white relative z-20"
            data-purpose="feature-highlight"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
              Made for Company Owner and Admins
            </h2>
            <p className="text-white/80 text-sm md:text-base leading-relaxed">
              If you run a Organization, Stark helps you stay on top of things
              from employers and employees to companies business. Everything stays
              in one place.
            </p>
          </div>
          {/* Abstract shapes for background visual interest */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>
        </section>
        {/* END: SidebarSection */}

        {/* BEGIN: LoginSection */}
        <section
          className="w-full md:w-1/2 bg-white flex flex-col justify-center p-8 md:p-16 lg:p-24"
          data-purpose="login-form-container"
        >
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="text-2xl font-bold mb-4" data-purpose="logo">
              Star<span className="text-stark-primary">k...</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
            <p className="text-gray-500 text-sm">
              Please provide your details to log into your account.
            </p>
          </div>

          {/* Social Login */}
          <button
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2.5 px-4 hover:bg-gray-50 transition-colors mb-6"
            data-purpose="google-login"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              ></path>
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              ></path>
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              ></path>
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              ></path>
            </svg>
            <span className="text-gray-700 font-medium text-sm">
              Continue with Google
            </span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center mb-6" data-purpose="divider">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-xs">Or with</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Form Fields */}
          <form action="#" className="space-y-4" method="POST">
            {/* Email Input */}
            <div className="space-y-1">
              <label
                className="block text-sm font-semibold text-gray-700"
                htmlFor="email"
              >
                Email*
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    ></path>
                  </svg>
                </span>
                <input
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary transition-all"
                  id="email"
                  name="email"
                  placeholder="Enter Your email"
                  type="email"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label
                className="block text-sm font-semibold text-gray-700"
                htmlFor="password"
              >
                Password*
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    ></path>
                  </svg>
                </span>
                <input
                  className="block w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-stark-primary/20 focus:border-stark-primary transition-all"
                  id="password"
                  name="password"
                  placeholder="Enter Password"
                  type="password"
                />
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  type="button"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    ></path>
                    <path
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                className="text-xs text-gray-500 hover:text-stark-primary"
                href="#"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <Link href="/admin/dashboard" className="w-full bg-stark-primary text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-between hover:bg-stark-dark transition-colors group mt-4">
              <span>Login</span>
              <svg
                className="h-5 w-5 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                ></path>
              </svg>
            </Link>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center text-sm">
            <p className="text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                className="text-stark-primary font-bold hover:underline"
                href="/admin/register"
              >
                Register
              </Link>
            </p>
          </div>

          {/* Copyright Notice */}
          <div className="mt-12 text-gray-400 text-xs text-left">
            © 2026 Stark
          </div>
        </section>
        {/* END: LoginSection */}
      </main>
      {/* END: MainContainer */}
    </div>
  );
}
