import StatusBar from "./StatusBar";
import BottomTabBar from "./BottomTabBar";

export default function AIChatScreen({ showTabBar = false }: { showTabBar?: boolean }) {
  return (
    <div className="flex h-full w-full flex-col bg-[#fffaf8]">
      <StatusBar />
      <div className="flex items-center gap-2 border-b border-lavender-100/60 px-5 pb-3 pt-3">
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
          Why am I tired today?
        </div>

        <div
          className="ml-auto max-w-[82%] rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-[12px] leading-snug text-white"
          style={{ background: "var(--gradient-primary)" }}
        >
          You&apos;re in your luteal phase, and your logs show shorter sleep
          the past two nights — that combination often shows up as lower
          energy. A short walk and an earlier bedtime tonight may help.
        </div>

        <div
          className="ml-auto max-w-[82%] rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-[12px] leading-snug text-white"
          style={{ background: "var(--gradient-primary)" }}
        >
          This is general guidance from your own patterns, not a diagnosis —
          if the fatigue feels severe or doesn&apos;t improve, please check in
          with a healthcare professional. 💜
        </div>
      </div>

      <div className="px-4">
        <p className="text-center text-[9px] leading-snug text-plum-faint">
          🩺 Educational guidance only — not a medical diagnosis
        </p>
      </div>

      <div className="mx-4 my-3 flex shrink-0 items-center gap-2 rounded-full border border-lavender-100 bg-white px-4 py-2.5 shadow-sm">
        <span className="flex-1 text-[12px] text-plum-faint">Ask CycleAI anything…</span>
        <span
          className="grid h-6 w-6 place-items-center rounded-full text-[11px] text-white"
          style={{ background: "var(--gradient-primary)" }}
        >
          ↑
        </span>
      </div>

      {showTabBar && <BottomTabBar active="coach" />}
    </div>
  );
}
