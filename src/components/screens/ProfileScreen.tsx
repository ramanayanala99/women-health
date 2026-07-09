import StatusBar from "./StatusBar";
import BottomTabBar from "./BottomTabBar";

const rows = [
  { icon: "🔒", label: "Privacy & Data", value: "" },
  { icon: "🔔", label: "Notifications", value: "On" },
  { icon: "✦", label: "Subscription", value: "Premium" },
  { icon: "📤", label: "Data Export", value: "" },
];

export default function ProfileScreen() {
  return (
    <div className="flex h-full w-full flex-col bg-[#fffaf8]">
      <StatusBar />
      <div className="px-5 pt-4">
        <h1 className="font-display text-[19px] font-semibold text-plum">Profile</h1>
      </div>

      <div className="mx-4 mt-3 flex items-center gap-3.5 rounded-[22px] bg-white p-4 shadow-sm">
        <span
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-base font-semibold text-white"
          style={{ background: "var(--gradient-primary)" }}
        >
          A
        </span>
        <div className="min-w-0">
          <p className="font-display text-[14px] font-semibold text-plum">Ava</p>
          <p className="truncate text-[11px] text-plum-faint">ava@example.com</p>
        </div>
      </div>

      <div className="mx-4 mt-3 space-y-2">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="text-sm">{r.icon}</span>
              <span className="text-[12px] font-medium text-plum">{r.label}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {r.value && (
                <span className="rounded-full bg-lavender-50 px-2 py-0.5 text-[9.5px] font-semibold text-lavender-600">
                  {r.value}
                </span>
              )}
              <span className="text-plum-faint">›</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1" />

      <div className="mx-4 mb-2 rounded-2xl border border-rose-light bg-blush/60 px-4 py-3 text-center text-[11px] font-semibold text-rose-deep">
        Delete account
      </div>

      <BottomTabBar active="you" />
    </div>
  );
}
