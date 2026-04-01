import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import bannerImage from "../../assets/headphones.png";
import { staggerContainer, fadeUp, scaleIn } from "../../lib/motion";

function HeroSection() {
  return (
    <section className="relative mx-auto grid w-full max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
      <div className="absolute right-0 top-8 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-fuchsia-500/20 via-violet-500/20 to-cyan-400/20 blur-[120px]" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        <motion.div
          variants={fadeUp}
          className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-zinc-300"
        >
          Local storage music workspace
        </motion.div>

        <motion.h2
          variants={fadeUp}
          className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl"
        >
          Capture recordings, attach cover art, and build your music library.
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg"
        >
          A React-based creative workspace for storing audio, artwork, and notes
          in one clean interface. Designed to help you capture and organise
          music ideas with persistent local storage.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-8 flex flex-row flex-wrap items-center gap-4"
        >
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/dashboard"
              className="rounded-2xl bg-white px-6 py-4 text-center text-sm font-medium text-black transition hover:shadow-[0_0_0_1px_rgba(129,140,248,0.35)]"
            >
              Open Dashboard
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
            <a
              href="#features"
              className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center text-sm font-medium text-zinc-100 transition hover:border-indigo-400/35 hover:bg-indigo-500/10"
            >
              Explore Features
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          className="mt-10 grid gap-4 sm:grid-cols-3"
        >
          <motion.div
            variants={fadeUp}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-indigo-400/30 hover:bg-indigo-500/[0.06]"
          >
            <p className="text-2xl font-semibold text-white">CRUD</p>
            <p className="mt-2 text-sm text-zinc-400">
              Create, update, manage, and delete songs.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-indigo-400/30 hover:bg-indigo-500/[0.06]"
          >
            <p className="text-2xl font-semibold text-white">Dexie</p>
            <p className="mt-2 text-sm text-zinc-400">
              Local persistence for richer media storage.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-indigo-400/30 hover:bg-indigo-500/[0.06]"
          >
            <p className="text-2xl font-semibold text-white">Media</p>
            <p className="mt-2 text-sm text-zinc-400">
              Built for audio clips, cover images, and notes.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        className="relative hidden items-center justify-center lg:flex"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 via-violet-500/10 to-cyan-400/10 blur-3xl" />

        <motion.img
          src={bannerImage}
          alt="Music Storage banner"
          className="relative z-10 w-[500px] max-w-full drop-shadow-[0_50px_100px_rgba(0,0,0,0.9)]"
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </section>
  );
}

export default HeroSection;