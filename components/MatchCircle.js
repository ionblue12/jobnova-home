export default function MatchCircle({ value }) {
  const color =
    value >= 80
      ? "#9FEA25"
      : value >= 70
        ? "#B7E836"
        : "#F8C62D";

  return (
    <div
      className="flex h-[80px] w-[80px] shrink-0 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(${color} ${value}%, #eeeeee 0)`,
      }}
    >
      <div className="flex h-[68px] w-[68px] flex-col items-center justify-center rounded-full bg-white">
        <span className="text-xl font-semibold">
          {value}%
        </span>

        <span className="text-[11px]">
          Match
        </span>
      </div>
    </div>
  );
}