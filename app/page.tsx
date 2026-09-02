import { About } from "@/components/About";
import { Blog } from "@/components/Blog";
import { Hero } from "@/components/Hero";
import { Skill } from "@/components/Skill";
import { Work } from "@/components/Work";

export default function Home() {
  return (
    <>
      <Hero />
      <Work />
      <About />
      <Skill />
      <Blog />
    </>
  );
}
