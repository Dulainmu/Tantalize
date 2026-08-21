const checkerBg = {
  backgroundImage:
    "linear-gradient(45deg, #fff 25%, transparent 25%), linear-gradient(-45deg, #fff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #fff 75%), linear-gradient(-45deg, transparent 75%, #fff 75%)",
  backgroundSize: "24px 24px",
  backgroundPosition: "0 0, 0 12px, 12px -12px, -12px 0px",
};

export default function CheckerStripe({ className = "" }: { className?: string }) {
  return (
    <div className={`h-3 w-full overflow-hidden ${className}`} aria-hidden>
      <div className="ah-marquee-track">
        <div className="h-3 w-[200vw] flex-shrink-0" style={checkerBg} />
        <div className="h-3 w-[200vw] flex-shrink-0" style={checkerBg} />
      </div>
    </div>
  );
}
