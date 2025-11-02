import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  return (
    <>
    <div className="bg-neutral-400 text-2xl font-bold flex">This is a protected route.</div>
    <ModeToggle/>
    </>
  );
}
