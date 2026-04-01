import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "../../lib/motion";

function LandingCta() {
  return (
    <motion.section
      className="px-6 pb-16"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
    >
      <motion.div
        variants={fadeUp}
        className="mx-auto w-full max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-r from-violet-600/20 via-fuchsia-500/15 to-cyan-400/20 p-8 sm:p-10"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <motion.div variants={fadeUp}>
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-300">
              Lorem ipsum.
            </p>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </h3>
            <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-300">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem
              ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/dashboard"
              className="rounded-2xl bg-white px-6 py-4 text-center text-sm font-medium text-black transition hover:shadow-[0_0_0_1px_rgba(129,140,248,0.35)]"
            >
              Enter Dashboard
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
}

export default LandingCta;