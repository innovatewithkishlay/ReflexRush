"use client";

type TimerProps = {
  time: number;
};

function pad(n: number) {
  return n < 10 ? `0${n}` : n;
}

export default function Timer({ time }: TimerProps) {
  return (
    <div className="text-xl md:text-2xl font-mono text-pink-200 bg-black/40 px-4 py-2 rounded-lg shadow">
      {pad(time)}s
    </div>
  );
}
