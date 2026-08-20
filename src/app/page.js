import EbookGenres from "@/components/Home/EbookGenres";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 dark:bg-[#0d0d0f] transition-colors duration-200">
      <EbookGenres />
    </div>
  );
}

