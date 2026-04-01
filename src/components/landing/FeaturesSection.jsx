import { motion } from "framer-motion";
import FeatureCard from "./FeatureCard";
import { staggerContainer, fadeUp } from "../../lib/motion";

function FeaturesSection() {
  return (
    <motion.section
      id="features"
      className="mx-auto w-full max-w-7xl px-6 py-14"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div variants={fadeUp} className="mb-10">
        <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">
          Lorem ipsum.
        </p>
        <h3 className="mt-4 text-3xl font-semibold tracking-tight text-white">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h3>
        <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-400">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </motion.div>

      <motion.div variants={staggerContainer} className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <FeatureCard
          title="Lorem ipsum."
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          buttonText="Open Dashboard"
          to="/dashboard"
        />
        <FeatureCard
          title="Lorem ipsum."
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          buttonText="View Workspace"
          to="/dashboard"
        />
        <FeatureCard
          title="Lorem ipsum."
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          buttonText="Manage Ideas"
          to="/dashboard"
        />
        <FeatureCard
          title="Lorem ipsum."
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          buttonText="Open App"
          to="/dashboard"
        />
      </motion.div>
    </motion.section>
  );
}

export default FeaturesSection;