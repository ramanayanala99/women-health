import StatusBar from "./StatusBar";

export default function AIChatScreen() {
  return (
    <div className="flex h-full w-full flex-col bg-[#fffaf8]">
      <StatusBar />
      <div className="flex items-center gap-2 px-5 pt-3 pb-3 border-b border-lavender-100/60">
        <span
          className="grid h-7 w-7 place-items-center rounded-full text-[11px] text-white"
          style={{ background: "var(--gradient-primary)" }}
        >
          ✦
        </span>
        <div>
          <p className="text-[13px] font-semibold text-plum">CycleAI Coach</p>
          <p className="text-[9.5px] text-plum-faint">Private &amp; encrypted</p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-hidden px-4 py-4">
        <div className="max-w-[78%] rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 text-[12px] leading-snug text-plum shadow-sm">
          I&apos;ve had low energy and headaches for two days. Is this normal?
        </div>

        <div
          className="ml-auto max-w-[82%] rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-[12px] leading-snug text-white"
          style={{ background: "var(--gradient-primary)" }}
        >
          That can be common in the days before your period as estrogen dips.
          Your logs show similar patterns last two cycles. Hydration and
          magnesium-rich foods often help.
        </div>

        <div
          className="ml-auto max-w-[82%] rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-[12px] leading-snug text-white"
          style={{ background: "var(--gradient-primary)" }}
        >
          If it becomes severe or lasts more than a few days, it&apos;s worth
          checking in with your doctor — I&apos;m here for patterns, not
          diagnoses. 💜
        </div>

        <div className="max-w-[78%] rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 text-[12px] leading-snug text-plum shadow-sm">
          Thank you, that&apos;s reassuring 🌸
        </div>
      </div>

      <div className="mx-4 mb-4 flex items-center gap-2 rounded-full border border-lavender-100 bg-white px-4 py-2.5 shadow-sm">
        <span className="flex-1 text-[12px] text-plum-faint">Ask CycleAI anything…</span>
        <span
          className="grid h-6 w-6 place-items-center rounded-full text-[11px] text-white"
          style={{ background: "var(--gradient-primary)" }}
        >
          ↑
        </span>
      </div>
    </div>
  );
}
