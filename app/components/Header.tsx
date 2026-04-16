import Image from "next/image";

export default function Header() {
  return (
    <header className="flex justify-center py-6">
      <a
        href="https://revtrack.com.br"
        target="_blank"
        rel="noopener noreferrer"
        className="opacity-80 hover:opacity-100 transition-opacity duration-300"
      >
        <Image
          src="/revtrack-logo.svg"
          alt="RevTrack"
          width={160}
          height={32}
          className="h-8 w-auto"
          priority
        />
      </a>
    </header>
  );
}
