import {
  BriefcaseBusiness,
  FileText,
  UserRound,
  Settings,
  CreditCard,
  CirclePlus,
  Laptop,
} from "lucide-react";

const menuItems = [
  {
    icon: BriefcaseBusiness,
    label: "Jobs",
    active: true,
  },
  {
    icon: Laptop,
    label: "AI Mock Interview",
  },
  {
    icon: FileText,
    label: "Resume",
  },
  {
    icon: UserRound,
    label: "Profile",
  },
  {
    icon: Settings,
    label: "Setting",
  },
  {
    icon: CreditCard,
    label: "Subscription",
  },
  {
    icon: CirclePlus,
    label: "Extra Credits",
  },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-[215px] shrink-0 border-r bg-white px-4 py-5 md:flex md:flex-col">

      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#172033] text-sm font-bold text-white">
          J
        </div>

        <span className="text-2xl font-bold text-[#172033]">
          JobNova
        </span>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
                item.active
                  ? "bg-[#9c78f7] text-white"
                  : "text-[#333] hover:bg-gray-100"
              }`}
            >
              <Icon size={17} strokeWidth={1.8} />

              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl bg-gradient-to-br from-[#8d5cf6] to-[#caa7ff] p-4 text-white">
        <p className="font-semibold">
          Upgrade Your Plan
        </p>

        <p className="mt-2 text-xs opacity-80">
          Boost your success rate now!
        </p>

        <button className="mt-5 rounded-xl bg-white px-4 py-2 text-xs text-gray-900">
          Subscription
        </button>
      </div>

    </aside>
  );
}