import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeUp } from "../../lib/motion";

function FeatureCard({ title, text, buttonText, to }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="rounded-[1.75rem] border border-white/10 bg-zinc-900/60 p-6 transition-colors hover:border-indigo-400/30 hover:bg-indigo-500/[0.06]"
    >
      <h4 className="text-xl font-semibold text-white">{title}</h4>
      <p className="mt-3 text-sm leading-7 text-zinc-400">{text}</p>
      <Link
        to={to}
        className="mt-6 inline-flex rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-zinc-100 transition hover:border-indigo-400/35 hover:bg-indigo-500/10"
      >
        {buttonText}
      </Link>
    </motion.div>
  );
}

export default FeatureCard;