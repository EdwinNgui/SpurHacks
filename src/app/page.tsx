import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold mb-4 text-blue-600">SpurHacks</h1>
          <p className="text-xl text-gray-600 mb-8">Quantum Computing & AI Innovation</p>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/quantassist"
          >
            🚀 Quantum Circuit AI Assistant
          </Link>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 max-w-2xl">
          <h2 className="text-xl font-semibold text-purple-800 mb-3">Welcome to SpurHacks!</h2>
          <p className="text-purple-700 mb-4">
            Explore the fascinating world of quantum computing with our AI-powered circuit builder. 
            Create quantum algorithms, understand superposition, entanglement, and more!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
            <div>
              <h3 className="font-semibold mb-2">🤖 AI Assistant Features:</h3>
              <ul className="space-y-1">
                <li>• Natural language circuit building</li>
                <li>• Quantum algorithm templates</li>
                <li>• Real-time simulation</li>
                <li>• Interactive learning</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🔧 Manual Builder:</h3>
              <ul className="space-y-1">
                <li>• Drag & drop interface</li>
                <li>• Multiple quantum gates</li>
                <li>• Custom circuit design</li>
                <li>• Experiment freely</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/quantassist"
        >
          <span aria-hidden>⚛️</span>
          Quantum Assistant
        </Link>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
      </footer>
    </div>
  );
}
