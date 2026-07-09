import { ReactNode } from "react";

export default function PhoneMockup({
  children,
  className = "",
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  size?: "default" | "small";
}) {
  const dims = size === "small" ? "w-[250px] h-[510px]" : "w-[300px] h-[612px] sm:w-[320px] sm:h-[653px]";

  return (
    <div className={`relative ${dims} ${className}`}>
      {/* ambient shadow */}
      <div
        className="absolute -bottom-8 left-1/2 h-16 w-[85%] -translate-x-1/2 rounded-full blur-2xl"
        style={{ background: "radial-gradient(ellipse, rgba(47,36,64,0.35), transparent 70%)" }}
      />

      {/* metallic rose-gold frame */}
      <div
        className="relative h-full w-full rounded-[3.1rem] p-[3px] shadow-2xl"
        style={{
          background:
            "linear-gradient(155deg, #f6d9d0 0%, #eab3ae 18%, #d98fa0 38%, #e8c2c9 52%, #c98697 68%, #f2d6cf 85%, #e0a8ac 100%)",
          boxShadow:
            "0 30px 60px -15px rgba(47,36,64,0.45), inset 0 0 0 1px rgba(255,255,255,0.4)",
        }}
      >
        {/* buttons */}
        <div className="absolute -left-[3px] top-[108px] h-6 w-[3px] rounded-l-sm bg-[#c98697]" />
        <div className="absolute -left-[3px] top-[150px] h-10 w-[3px] rounded-l-sm bg-[#c98697]" />
        <div className="absolute -left-[3px] top-[196px] h-10 w-[3px] rounded-l-sm bg-[#c98697]" />
        <div className="absolute -right-[3px] top-[160px] h-16 w-[3px] rounded-r-sm bg-[#c98697]" />

        {/* inner bezel (black) */}
        <div className="relative h-full w-full rounded-[2.9rem] bg-[#0d0a11] p-[9px]">
          {/* screen */}
          <div className="relative h-full w-full overflow-hidden rounded-[2.35rem] bg-white">
            {children}

            {/* Dynamic Island */}
            <div className="absolute left-1/2 top-[14px] z-30 h-[26px] w-[92px] -translate-x-1/2 rounded-full bg-black" />

            {/* glass reflection */}
            <div
              className="pointer-events-none absolute inset-0 z-20"
              style={{
                background:
                  "linear-gradient(115deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.03) 22%, transparent 40%)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
