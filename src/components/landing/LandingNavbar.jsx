import { Link } from "react-router-dom";

function LandingNavbar() {
  return (
    <header className="border-b border-white/10">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-400">
            Music-App
          </p>
          <h1 className="text-xl font-semibold text-white">Music Storage</h1>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="#developer"
            className="text-sm text-zinc-300 transition hover:text-indigo-200"
          >
            Developer
          </a>
          <a
            href="#features"
            className="text-sm text-zinc-300 transition hover:text-indigo-200"
          >
            Features
          </a>
          <Link
            to="/dashboard"
            className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:shadow-[0_0_0_1px_rgba(129,140,248,0.35)]"
          >
            Enter App
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default LandingNavbar;
