import StatusBar from "./StatusBar";

const rows = [
  { icon: "🔐", label: "End-to-end encryption", on: true },
  { icon: "📤", label: "Export my data", on: false },
  { icon: "🚫", label: "Never sell my data", on: true },
  { icon: "🗑️", label: "Auto-delete after export", on: false },
];

export default function SettingsScreen() {
  return (
    <div className="h-full w-full bg-[#fffaf8]">
      <StatusBar />
      <div className="px-5 pt-4">
        <p className="text-[11px] font-medium text-plum-faint">Settings</p>
        <h1 className="font-display text-[19px] font-semibold text-plum">Privacy &amp; Data</h1>
      </div>

      <div className="mx-4 mt-3 rounded-[20px] bg-white p-3 shadow-sm">
        <p className="text-[10.5px] font-semibold text-plum-soft">Your promise</p>
        <p className="mt-1 text-[11px] leading-snug text-plum-soft">
          Your health data belongs to you. It&apos;s encrypted, never sold, and
          removable at any time.
        </p>
      </div>

      <div className="mx-4 mt-2.5 space-y-1.5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between rounded-2xl bg-white p-2.5 shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="text-sm">{r.icon}</span>
              <span className="text-[11px] font-medium text-plum">{r.label}</span>
            </div>
            <div
              className={`h-4.5 w-8 rounded-full p-0.5 transition-colors ${r.on ? "" : "bg-[#eee5f7]"}`}
              style={r.on ? { background: "var(--gradient-primary)" } : {}}
            >
              <div className={`h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${r.on ? "translate-x-3.5" : ""}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="mx-4 mt-3 rounded-2xl border border-rose-light bg-blush p-3 text-center text-[11px] font-semibold text-rose-deep">
        Delete all my data
      </div>
    </div>
  );
}
