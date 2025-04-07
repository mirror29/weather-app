import { Weather } from "@/components/Weather";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
      <header className="py-6 border-b border-blue-200 dark:border-blue-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-300">
            Weather Forecast App
          </h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4">
        <Weather />
      </main>

      <footer className="py-4 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-blue-200 dark:border-blue-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
        <p>© 2025 Weather App - Built with React, TypeScript, and Shadcn UI</p>
      </footer>
    </div>
  );
}
