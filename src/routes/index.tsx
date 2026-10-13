import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import {
  Analysis,
  Ritual,
  Science,
  Testimonials,
  Pricing,
  CTA,
} from "@/components/landing/Sections";
import { InteractiveLiquidBackground } from "@/components/landing/InteractiveLiquidBackground";
import { Loader } from "@/components/landing/Loader";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <main className="relative bg-background text-foreground">
        <InteractiveLiquidBackground />
        <Loader />
        <Nav />
        <Hero />
        <Analysis />
        <Ritual />
        <Science />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>
    </>
  );
}
