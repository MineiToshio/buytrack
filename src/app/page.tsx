import Hero from "@/modules/Hero";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "BuyTrack | Inicio",
  description: "Una app para el seguimiento de tus compras.",
};

export default function Home() {
  return (
    <main>
      <Hero />
    </main>
  );
}
