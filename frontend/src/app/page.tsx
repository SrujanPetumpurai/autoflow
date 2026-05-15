import { Appbar } from "@/components/Appbar";
import { Hero } from "@/components/HeroComponents";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Appbar />
      <Hero />
    </main>
  );
}