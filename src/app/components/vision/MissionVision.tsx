import { motion } from "framer-motion";
import { missionStatement, visionStatement, missionPillars, visionHighlights } from "@/data/missionVision";

export default function MissionVision() {
  return (
    <section id="mission" className="relative overflow-hidden border-y border-white/5">
      <div className="absolute inset-0 pointer-events-none">
        <div className="mission-grid-mask" />
        <motion.div
          className="absolute -top-48 -right-32 h-[420px] w-[420px] rounded-full bg-gold-500/10 blur-3xl"
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 h-[320px] w-[320px] rounded-full bg-indigo-500/20 blur-3xl"
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
        />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6 py-20 md:py-24 lg:py-28">
        <motion.div
          className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ staggerChildren: 0.08 }}
        >
          <motion.div 
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-xl"
          >
            <p className="text-sm uppercase tracking-[0.45em] text-gold-500/80">Mission &amp; Vision 2025</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl lg:text-5xl">
              Our legacy fuels{" "}
              <span className="text-gradient-gold">a new era of stagecraft</span>
            </h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative flex items-center gap-3"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold-500/30 bg-primary-950/60 font-semibold text-gold-400 shadow-[0_0_28px_rgba(255,215,0,0.25)]">
              2025
            </span>
            <p className="hidden max-w-xs text-sm text-white/70 md:block">
              We move with intention—every light beam, every drum, every voice orchestrated to deliver an unforgettable crescendo.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ staggerChildren: 0.08 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 px-8 py-10 shadow-[0_35px_120px_-35px_rgba(15,23,42,0.9)] backdrop-blur-xl md:px-10"
          >
            <motion.div
              aria-hidden
              className="mission-card-halo"
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            />
            <motion.p
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-xs uppercase tracking-[0.4em] text-gold-500/80"
            >
              Mission
            </motion.p>
            <motion.h3
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-2 text-2xl font-semibold text-white/95 md:text-3xl"
            >
              {missionStatement}
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3"
            >
              {missionPillars.map((pillar) => (
                <motion.div
                  key={pillar.id}
                  className="rounded-2xl border border-white/10 bg-primary-900/50 p-4 shadow-lg shadow-primary-950/30 transition-all duration-500 group-hover:translate-y-[-6px]"
                  whileHover={{ y: -6 }}
                >
                  <p className="text-xs uppercase tracking-[0.36em] text-gold-500/70">{pillar.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">{pillar.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-primary-900 via-primary-950 to-black px-8 py-10 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.9)] backdrop-blur-xl md:px-10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,215,0,0.18),_transparent_55%)]" />
            <div className="relative">
              <p className="text-xs uppercase tracking-[0.4em] text-amber-400/80">Vision</p>
              <h3 className="mt-2 text-2xl font-semibold text-white/95 md:text-3xl">
                {visionStatement}
              </h3>
              <div className="mt-8 flex flex-col divide-y divide-white/10">
                {visionHighlights.map((item) => (
                  <motion.div
                    key={item.id}
                    className="flex flex-col gap-3 py-5 first:pt-0 last:pb-0 md:flex-row md:items-center md:justify-between"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-4xl font-bold text-gold-500/80 md:text-5xl">
                        {item.numeral}
                      </span>
                      <p className="text-lg font-semibold text-white/90 md:text-xl">{item.title}</p>
                    </div>
                    <p className="text-sm leading-relaxed text-white/70 md:max-w-xs">{item.teaser}</p>
                  </motion.div>
                ))}
              </div>
              <motion.div
                className="mt-8 rounded-full border border-gold-500/40 bg-gradient-to-r from-gold-500/10 to-yellow-400/10 px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.32em] text-gold-300/80 shadow-[0_0_40px_rgba(255,215,0,0.12)]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
              >
                Join the 2025 journey
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative mt-4 overflow-hidden rounded-3xl border border-white/5 bg-black/20 px-8 py-10 shadow-[0_30px_100px_-50px_rgba(255,215,0,0.4)] backdrop-blur-lg md:px-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,215,0,0.05),_transparent_70%)]" />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.36em] text-white/50">Legacy Promise</p>
              <h3 className="mt-3 text-2xl font-semibold text-white/90">
                Every edition is a new chapter—yet unmistakably Tantalize.
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70">
                We capture the energy of a nation&apos;s creative pulse and turn it into a shared memory. From the wow-factor entrances to the final encore, the journey is an elevated tribute to everyone who makes Tantalize possible.
              </p>
            </div>
            <motion.div
              className="flex w-full flex-col gap-4 md:w-auto"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="flex h-20 items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-gold-500/70">Years</p>
                  <p className="text-xl font-semibold text-white/90">15 editions strong</p>
                </div>
                <span className="text-3xl font-bold text-gold-500/80">2009→2024</span>
              </div>
              <div className="flex h-20 items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-gold-500/70">Collective</p>
                  <p className="text-xl font-semibold text-white/90">650+ volunteers</p>
                </div>
                <span className="text-3xl font-bold text-gold-500/80">Driven</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
