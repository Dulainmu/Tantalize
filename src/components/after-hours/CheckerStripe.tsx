export default function CheckerStripe({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`h-3 w-full ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(45deg, #fff 25%, transparent 25%), linear-gradient(-45deg, #fff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #fff 75%), linear-gradient(-45deg, transparent 75%, #fff 75%)",
        backgroundSize: "24px 24px",
        backgroundPosition: "0 0, 0 12px, 12px -12px, -12px 0px",
      }}
    />
  );
}
