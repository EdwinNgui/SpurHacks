import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#221e29] flex items-center justify-center relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#652db4]/20 via-[#3f2a61]/10 to-[#221e29]"></div>
      
      {/* Animated background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#652db4]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#3f2a61]/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="text-center space-y-12 px-6 relative z-10">
        {/* Main Title */}
        <div className="space-y-4">
          <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-black text-white tracking-tighter leading-none">
            <span className="bg-gradient-to-r from-[#652db4] via-purple-400 to-[#652db4] bg-clip-text text-transparent animate-pulse">
              Qubit Quacker
            </span>
          </h1>
          
          {/* Glow effect behind title */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
            <div className="w-[40rem] h-[40rem] bg-[#652db4]/30 rounded-full blur-3xl animate-pulse"></div>
          </div>
        </div>
        
        {/* Slogan */}
        <p className="text-2xl md:text-3xl lg:text-4xl text-gray-300 font-light tracking-wider">
          Quantum Computing & AI Innovation
        </p>
        
        {/* Apple Liquid Glass Style Button */}
        <div className="pt-12">
          <Link
            href="/quantassist"
            className="group relative inline-flex items-center px-12 py-6 text-xl font-semibold text-white rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, rgba(101, 45, 180, 0.8) 0%, rgba(63, 42, 97, 0.6) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(101, 45, 180, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
          >
            {/* Liquid glass shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            {/* Button content */}
            <span className="relative z-10 flex items-center">
              <span className="mr-3 text-2xl">🚀</span>
              Start Quantum Journey
            </span>
          </Link>
        </div>
        
      </div>
    </div>
  );
}
