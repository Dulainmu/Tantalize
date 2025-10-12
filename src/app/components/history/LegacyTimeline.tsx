import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { legacyYears, LegacyYear } from "@/data/history";

type YearCardProps = {
  data: LegacyYear;
  index: number;
  active: boolean;
  onVisible: (year: number) => void;
};

function YearCard({ data, index, active, onVisible }: YearCardProps) {
  const { ref } = useInView({
    threshold: 0.6,
    triggerOnce: false,
    onChange: (inView) => {
      if (inView) onVisible(data.year);
    },
  });

  const galleryLayout = useMemo(() => {
    if (data.gallery.length <= 3) {
      return "grid-cols-1 sm:grid-cols-3";
    }
    return "grid-cols-2 md:grid-cols-3";
  }, [data.gallery.length]);

  return (
    <motion.article
      ref={ref}
      className="group relative overflow-hidden rounded-[30px] border border-white/5 bg-primary-950/80 p-6 shadow-[0_40px_120px_-60px_rgba(255,215,0,0.45)] backdrop-blur-lg md:p-10"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-15%" }}
      transition={{ duration: 0.6 }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,215,0,0.07),_transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <span className="text-4xl font-bold text-gold-400 md:text-5xl">{data.year}</span>
            <div>
              <p className="text-xs uppercase tracking-[0.36em] text-gold-500/70">Edition #{index + 1}</p>
              <p className="text-lg font-semibold text-white/90 md:text-2xl">{data.theme}</p>
            </div>
          </div>
          <motion.span
            className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-100"
            animate={{
              boxShadow: active
                ? "0 0 35px rgba(255,215,0,0.35)"
                : "0 0 0 rgba(255,215,0,0)",
            }}
          >
            {data.location}
          </motion.span>
        </div>

        <p className="text-xl font-medium text-white/90 md:text-2xl">{data.headline}</p>
        <p className="max-w-3xl text-sm leading-relaxed text-white/70">{data.highlight}</p>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {data.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center shadow-[0_12px_30px_rgba(10,14,39,0.45)]"
            >
              <p className="text-xs uppercase tracking-[0.32em] text-gold-500/60">{stat.label}</p>
              <p className="mt-2 text-lg font-semibold text-white/90">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="legacy-gallery grid gap-3 md:gap-4">
          <div className={`grid ${galleryLayout} gap-3 md:gap-4`}>
            {data.gallery.map((item, idx) => (
              <motion.div
                key={item.id}
                className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${item.palette} p-4 text-white shadow-[0_25px_60px_-35px_rgba(255,215,0,0.35)] ${item.orientation === "portrait" ? "md:row-span-2" : ""}`}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_65%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative flex h-32 flex-col justify-end space-y-1 md:h-40">
                  <span className="text-xs uppercase tracking-[0.3em] text-white/70">
                    Shot {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                  </span>
                  <p className="text-sm font-medium leading-snug">
                    {item.caption}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function LegacyTimeline() {
  const [activeYear, setActiveYear] = useState<number>(legacyYears[0]?.year ?? new Date().getFullYear());

  useEffect(() => {
    if (!legacyYears.some((year) => year.year === activeYear) && legacyYears.length > 0) {
      setActiveYear(legacyYears[0].year);
    }
  }, [activeYear]);

  return (
    <section id="legacy" className="relative overflow-hidden bg-gradient-to-b from-primary-950 via-primary-900/70 to-primary-950 py-24">
      <div className="absolute inset-0">
        <div className="legacy-starfield pointer-events-none" />
        <div className="absolute left-1/4 top-1/3 h-40 w-40 rounded-full bg-gold-500/10 blur-[110px]" />
        <div className="absolute right-1/5 top-1/4 h-40 w-40 rounded-full bg-indigo-500/10 blur-[110px]" />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-primary-950 via-primary-950/40 to-transparent" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.45em] text-gold-500/80">Tantalize Legacy</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl lg:text-5xl">
              Past editions that{" "}
              <span className="text-gradient-gold">kept the island buzzing</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden h-12 w-[2px] bg-gradient-to-b from-transparent via-gold-500/60 to-transparent md:block" />
            <p className="max-w-xs text-sm text-white/70">
              Scroll through year by year. Each milestone reimagined the Tantalize experience and set the stage for 2025.
            </p>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <div className="hidden lg:block">
            <div className="sticky top-28 flex flex-col items-start gap-6">
              <div className="relative w-full pl-6">
                <div className="absolute left-[11px] top-1 bottom-1 w-[2px] bg-gradient-to-b from-gold-500/20 via-gold-500/60 to-transparent" />
                {legacyYears.map((event) => {
                  const isActive = event.year === activeYear;
                  return (
                    <button
                      key={event.year}
                      type="button"
                      onClick={() => setActiveYear(event.year)}
                      className={`relative mb-2 flex w-full items-center gap-4 rounded-2xl border border-transparent px-4 py-3 text-left transition-all duration-300 ${
                        isActive
                          ? "border-gold-500/60 bg-gold-500/10 text-white shadow-[0_15px_35px_-20px_rgba(255,215,0,0.6)]"
                          : "text-white/50 hover:text-white/80"
                      }`}
                    >
                      <span
                        className={`absolute left-[-15px] h-5 w-5 rounded-full border border-gold-300/60 transition-all duration-300 ${
                          isActive ? "bg-gold-400 shadow-[0_0_20px_rgba(255,215,0,0.6)]" : "bg-primary-900"
                        }`}
                      />
                      <div>
                        <p className="text-xs uppercase tracking-[0.32em] text-white/50">Year</p>
                        <p className="text-lg font-semibold">{event.year}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-12">
            <div className="flex w-full items-center gap-4 overflow-x-auto pb-4 lg:hidden">
              {legacyYears.map((event) => {
                const isActive = event.year === activeYear;
                return (
                  <button
                    key={event.year}
                    type="button"
                    onClick={() => setActiveYear(event.year)}
                    className={`relative inline-flex min-w-[160px] flex-col items-start gap-2 rounded-2xl border px-4 py-3 transition-all duration-300 ${
                      isActive ? "border-gold-500/60 bg-gold-500/10 text-white" : "border-white/10 text-white/60"
                    }`}
                  >
                    <span className="text-xs uppercase tracking-[0.32em] text-white/50">Year</span>
                    <span className="text-lg font-semibold">{event.year}</span>
                    <span className="text-xs text-white/50">{event.theme}</span>
                  </button>
                );
              })}
            </div>

            {legacyYears.map((event, index) => (
              <YearCard
                key={event.year}
                data={event}
                index={index}
                active={event.year === activeYear}
                onVisible={setActiveYear}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
