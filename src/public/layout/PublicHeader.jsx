import { Link, NavLink } from "react-router-dom";
import { getUser } from "../../shared/auth";
import { useBranding } from "../../shared/hooks/useBranding";

export default function PublicHeader() {
  const user = getUser();
  const brand = useBranding();
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto p-3 md:px-6 md:h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-gray-900"
          style={{ fontWeight: "bold", color: brand.primaryColor }}>
          {brand.siteName?.toUpperCase() || "ELearn"}
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <NavLink to="/courses">Courses</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4 text-sm">
          {!user && (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link
                to="/register"
                className=" text-white px-4 py-2 rounded-lg"
                style={{ background: brand.colors.primary, color: brand.colors.accent }}
              >
                Get Started
              </Link>
            </>
          )}

          {user?.role === "student" && (
            <Link
              to="/student"
              className="bg-black text-white px-4 py-2 rounded-lg"
            >
              Dashboard
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="bg-black text-white px-4 py-2 rounded-lg"
            >
              Admin Panel
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
