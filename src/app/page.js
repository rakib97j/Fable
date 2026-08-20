import HeroSlider from "@/components/Home/HeroSlider";
import EbookGenres from "@/components/Home/EbookGenres";

export default function Home() {
  return (
    <div className="w-full bg-zinc-50 dark:bg-[#0d0d0f] transition-colors duration-200">
      <HeroSlider />
      <EbookGenres />
    </div>
  );
}

