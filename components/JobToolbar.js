import {
  RotateCcw,
  ListFilter,
} from "lucide-react";

export default function JobToolbar() {
  return (
    <div className="mb-4 flex items-center gap-3">

      <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#9d73f5] py-2 text-sm text-white">
        <RotateCcw size={14} />

        Change Job Reference
      </button>

      <button className="flex items-center gap-2 rounded-full border bg-white px-5 py-2 text-sm shadow-sm">
        <ListFilter size={14} />

        Top matched
      </button>

    </div>
  );
}