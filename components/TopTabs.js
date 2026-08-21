export default function TopTabs() {
  return (
    <header className="flex h-[72px] items-center border-b bg-white px-8">

      <div className="flex items-center gap-8">

        <button className="rounded-full border border-[#9b75ff] px-6 py-2 text-sm">
          Matched
        </button>

        <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500">
          Liked

          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#a9f41b] text-[10px] text-black">
            1
          </span>
        </button>

        <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500">
          Applied

          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#a9f41b] text-[10px] text-black">
            1
          </span>
        </button>

      </div>

    </header>
  );
}