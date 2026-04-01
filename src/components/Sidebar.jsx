import { NavLink } from "react-router-dom";

function navClass({ isActive }) {
  return [
    "block w-full rounded-2xl border px-4 py-3 text-left text-sm transition",
    isActive
      ? "border-indigo-400/35 bg-indigo-500/10 font-medium text-indigo-100"
      : "border-transparent text-zinc-300 hover:border-indigo-400/20 hover:bg-indigo-500/5 hover:text-indigo-100",
  ].join(" ");
}

function Sidebar({ isOpen = false, onClose }) {
  return (
    <aside
      className={
        "fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-zinc-900/90 p-6 transition-transform duration-300 lg:static lg:translate-x-0 lg:flex lg:flex-col " +
        (isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")
      }
      aria-hidden={!isOpen && "true"}
    >
      <div className="mb-6 flex items-center justify-between lg:justify-start">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Music Storage
        </h1>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden rounded-xl border border-white/10 px-2 py-1 text-sm text-zinc-200 transition hover:border-indigo-400/35 hover:bg-indigo-500/10"
            aria-label="Close menu"
          >
            ✕
          </button>
        )}
      </div>
      <div className="border-b border-white/10 pb-6">
        <p className="mt-2 text-sm text-zinc-400"></p>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        <NavLink to="/landing" className={navClass}>
          Home
        </NavLink>

        <NavLink to="/dashboard" className={navClass}>
          Dashboard
        </NavLink>

        <NavLink to="/library" className={navClass}>
          Library
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;