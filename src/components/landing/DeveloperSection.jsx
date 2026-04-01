import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "../../lib/motion";

function DeveloperSection() {
  return (
    <motion.section
      id="developer"
      className="border-y border-white/10 bg-white/[0.02]"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-14 lg:grid-cols-2">
        <motion.div variants={fadeUp}>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">
            Lorem ipsum.
          </p>
          <h3 className="mt-4 text-3xl font-semibold tracking-tight text-white">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </h3>
          <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-400">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit.
          </p>
        </motion.div>

        <motion.div variants={staggerContainer} className="grid gap-4">
          <motion.div
            variants={fadeUp}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6 transition-colors hover:border-indigo-400/30 hover:bg-indigo-500/[0.06]"
          >
            <h4 className="text-lg font-medium text-white">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </h4>
            <p className="mt-3 text-sm leading-7 text-zinc-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6 transition-colors hover:border-indigo-400/30 hover:bg-indigo-500/[0.06]"
          >
            <h4 className="text-lg font-medium text-white">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </h4>
            <p className="mt-3 text-sm leading-7 text-zinc-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6 transition-colors hover:border-indigo-400/30 hover:bg-indigo-500/[0.06]"
          >
            <h4 className="text-lg font-medium text-white">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </h4>
            <p className="mt-3 text-sm leading-7 text-zinc-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default DeveloperSection;