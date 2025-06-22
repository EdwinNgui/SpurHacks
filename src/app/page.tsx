'use client'
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#221e29] flex items-center justify-center relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#652db4]/20 via-[#3f2a61]/10 to-[#221e29]"></div>
      
      {/* Firefly-style animated background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#652db4]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#3f2a61]/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      {/* Firefly circles with movement animations */}
      <div className="absolute top-1/6 left-1/6 w-4 h-4 bg-[#652db4]/60 rounded-full animate-firefly-1"></div>
      <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-[#652db4]/50 rounded-full animate-firefly-2"></div>
      <div className="absolute bottom-1/3 left-1/3 w-5 h-5 bg-[#3f2a61]/70 rounded-full animate-firefly-3"></div>
      <div className="absolute top-2/3 right-1/6 w-2 h-2 bg-[#652db4]/40 rounded-full animate-firefly-4"></div>
      <div className="absolute bottom-1/4 left-1/2 w-4 h-4 bg-[#3f2a61]/60 rounded-full animate-firefly-5"></div>
      <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-[#652db4]/55 rounded-full animate-firefly-6"></div>
      <div className="absolute bottom-1/6 right-1/2 w-5 h-5 bg-[#3f2a61]/50 rounded-full animate-firefly-7"></div>
      <div className="absolute top-1/4 left-2/3 w-2 h-2 bg-[#652db4]/45 rounded-full animate-firefly-8"></div>
      <div className="absolute bottom-2/3 right-1/5 w-4 h-4 bg-[#3f2a61]/65 rounded-full animate-firefly-9"></div>
      <div className="absolute top-3/4 left-1/5 w-3 h-3 bg-[#652db4]/70 rounded-full animate-firefly-10"></div>
      <div className="absolute top-1/5 right-1/5 w-5 h-5 bg-[#3f2a61]/55 rounded-full animate-firefly-11"></div>
      <div className="absolute bottom-1/5 left-1/4 w-2 h-2 bg-[#652db4]/50 rounded-full animate-firefly-12"></div>
      <div className="absolute top-2/5 right-2/3 w-4 h-4 bg-[#3f2a61]/60 rounded-full animate-firefly-13"></div>
      <div className="absolute bottom-3/4 right-1/4 w-3 h-3 bg-[#652db4]/65 rounded-full animate-firefly-14"></div>
      <div className="absolute top-1/3 left-1/5 w-5 h-5 bg-[#3f2a61]/45 rounded-full animate-firefly-15"></div>
      <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-[#652db4]/55 rounded-full animate-firefly-16"></div>
      <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-[#3f2a61]/70 rounded-full animate-firefly-17"></div>
      <div className="absolute bottom-1/2 right-1/5 w-3 h-3 bg-[#652db4]/40 rounded-full animate-firefly-18"></div>
      <div className="absolute top-2/5 left-2/3 w-5 h-5 bg-[#3f2a61]/50 rounded-full animate-firefly-19"></div>
      <div className="absolute bottom-2/5 left-1/6 w-2 h-2 bg-[#652db4]/60 rounded-full animate-firefly-20"></div>
      
      {/* Larger floating orbs */}
      <div className="absolute top-1/4 right-1/6 w-8 h-8 bg-[#652db4]/30 rounded-full animate-float-1"></div>
      <div className="absolute bottom-1/4 left-1/6 w-6 h-6 bg-[#3f2a61]/40 rounded-full animate-float-2"></div>
      <div className="absolute top-3/4 right-1/3 w-10 h-10 bg-[#652db4]/25 rounded-full animate-float-3"></div>
      <div className="absolute bottom-1/3 right-2/3 w-7 h-7 bg-[#3f2a61]/35 rounded-full animate-float-4"></div>
      
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
          Cursor for Quantum Computing
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
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes firefly-1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          25% { transform: translate(100px, -50px) scale(1.2); opacity: 0.8; }
          50% { transform: translate(200px, 50px) scale(0.8); opacity: 0.4; }
          75% { transform: translate(50px, 100px) scale(1.1); opacity: 0.7; }
        }
        @keyframes firefly-2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          33% { transform: translate(-80px, -80px) scale(1.3); opacity: 0.9; }
          66% { transform: translate(-150px, 30px) scale(0.7); opacity: 0.3; }
        }
        @keyframes firefly-3 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
          20% { transform: translate(120px, -30px) scale(1.1); opacity: 0.8; }
          40% { transform: translate(60px, -120px) scale(0.9); opacity: 0.5; }
          60% { transform: translate(-60px, -60px) scale(1.2); opacity: 0.9; }
          80% { transform: translate(-120px, 60px) scale(0.8); opacity: 0.4; }
        }
        @keyframes firefly-4 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          50% { transform: translate(90px, 90px) scale(1.4); opacity: 0.8; }
        }
        @keyframes firefly-5 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          25% { transform: translate(-70px, -70px) scale(1.1); opacity: 0.8; }
          50% { transform: translate(-140px, 0px) scale(0.9); opacity: 0.4; }
          75% { transform: translate(-70px, 70px) scale(1.2); opacity: 0.7; }
        }
        @keyframes firefly-6 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.55; }
          33% { transform: translate(100px, 50px) scale(1.2); opacity: 0.8; }
          66% { transform: translate(50px, -100px) scale(0.8); opacity: 0.3; }
        }
        @keyframes firefly-7 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          20% { transform: translate(-80px, -40px) scale(1.1); opacity: 0.7; }
          40% { transform: translate(-160px, 40px) scale(0.9); opacity: 0.4; }
          60% { transform: translate(-80px, 120px) scale(1.3); opacity: 0.8; }
          80% { transform: translate(80px, 80px) scale(0.8); opacity: 0.3; }
        }
        @keyframes firefly-8 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.45; }
          50% { transform: translate(-60px, -60px) scale(1.3); opacity: 0.7; }
        }
        @keyframes firefly-9 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.65; }
          25% { transform: translate(70px, -70px) scale(1.1); opacity: 0.8; }
          50% { transform: translate(140px, 0px) scale(0.9); opacity: 0.4; }
          75% { transform: translate(70px, 70px) scale(1.2); opacity: 0.7; }
        }
        @keyframes firefly-10 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
          33% { transform: translate(-90px, 90px) scale(1.2); opacity: 0.9; }
          66% { transform: translate(-180px, 0px) scale(0.8); opacity: 0.3; }
        }
        @keyframes firefly-11 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.55; }
          20% { transform: translate(80px, -40px) scale(1.1); opacity: 0.7; }
          40% { transform: translate(160px, 40px) scale(0.9); opacity: 0.4; }
          60% { transform: translate(80px, 120px) scale(1.3); opacity: 0.8; }
          80% { transform: translate(-80px, 80px) scale(0.8); opacity: 0.3; }
        }
        @keyframes firefly-12 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          50% { transform: translate(50px, 50px) scale(1.4); opacity: 0.8; }
        }
        @keyframes firefly-13 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          25% { transform: translate(-60px, -60px) scale(1.1); opacity: 0.8; }
          50% { transform: translate(-120px, 0px) scale(0.9); opacity: 0.4; }
          75% { transform: translate(-60px, 60px) scale(1.2); opacity: 0.7; }
        }
        @keyframes firefly-14 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.65; }
          33% { transform: translate(70px, 70px) scale(1.2); opacity: 0.8; }
          66% { transform: translate(140px, -70px) scale(0.8); opacity: 0.3; }
        }
        @keyframes firefly-15 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.45; }
          20% { transform: translate(-70px, -35px) scale(1.1); opacity: 0.6; }
          40% { transform: translate(-140px, 35px) scale(0.9); opacity: 0.3; }
          60% { transform: translate(-70px, 105px) scale(1.3); opacity: 0.7; }
          80% { transform: translate(70px, 70px) scale(0.8); opacity: 0.2; }
        }
        @keyframes firefly-16 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.55; }
          50% { transform: translate(-40px, -40px) scale(1.3); opacity: 0.7; }
        }
        @keyframes firefly-17 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
          25% { transform: translate(60px, -60px) scale(1.1); opacity: 0.8; }
          50% { transform: translate(120px, 0px) scale(0.9); opacity: 0.4; }
          75% { transform: translate(60px, 60px) scale(1.2); opacity: 0.7; }
        }
        @keyframes firefly-18 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          33% { transform: translate(-50px, 50px) scale(1.2); opacity: 0.6; }
          66% { transform: translate(-100px, 0px) scale(0.8); opacity: 0.2; }
        }
        @keyframes firefly-19 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          20% { transform: translate(60px, -30px) scale(1.1); opacity: 0.7; }
          40% { transform: translate(120px, 30px) scale(0.9); opacity: 0.4; }
          60% { transform: translate(60px, 90px) scale(1.3); opacity: 0.8; }
          80% { transform: translate(-60px, 60px) scale(0.8); opacity: 0.3; }
        }
        @keyframes firefly-20 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          50% { transform: translate(30px, 30px) scale(1.4); opacity: 0.8; }
        }
        
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          50% { transform: translate(50px, -30px) scale(1.1); opacity: 0.5; }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          50% { transform: translate(-40px, 40px) scale(1.2); opacity: 0.6; }
        }
        @keyframes float-3 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.25; }
          50% { transform: translate(60px, 20px) scale(1.1); opacity: 0.4; }
        }
        @keyframes float-4 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.35; }
          50% { transform: translate(-30px, -50px) scale(1.2); opacity: 0.5; }
        }
        
        .animate-firefly-1 { animation: firefly-1 8s ease-in-out infinite; }
        .animate-firefly-2 { animation: firefly-2 10s ease-in-out infinite; }
        .animate-firefly-3 { animation: firefly-3 12s ease-in-out infinite; }
        .animate-firefly-4 { animation: firefly-4 6s ease-in-out infinite; }
        .animate-firefly-5 { animation: firefly-5 9s ease-in-out infinite; }
        .animate-firefly-6 { animation: firefly-6 11s ease-in-out infinite; }
        .animate-firefly-7 { animation: firefly-7 13s ease-in-out infinite; }
        .animate-firefly-8 { animation: firefly-8 7s ease-in-out infinite; }
        .animate-firefly-9 { animation: firefly-9 10s ease-in-out infinite; }
        .animate-firefly-10 { animation: firefly-10 8s ease-in-out infinite; }
        .animate-firefly-11 { animation: firefly-11 12s ease-in-out infinite; }
        .animate-firefly-12 { animation: firefly-12 6s ease-in-out infinite; }
        .animate-firefly-13 { animation: firefly-13 9s ease-in-out infinite; }
        .animate-firefly-14 { animation: firefly-14 11s ease-in-out infinite; }
        .animate-firefly-15 { animation: firefly-15 13s ease-in-out infinite; }
        .animate-firefly-16 { animation: firefly-16 7s ease-in-out infinite; }
        .animate-firefly-17 { animation: firefly-17 10s ease-in-out infinite; }
        .animate-firefly-18 { animation: firefly-18 8s ease-in-out infinite; }
        .animate-firefly-19 { animation: firefly-19 12s ease-in-out infinite; }
        .animate-firefly-20 { animation: firefly-20 6s ease-in-out infinite; }
        
        .animate-float-1 { animation: float-1 15s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 18s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 20s ease-in-out infinite; }
        .animate-float-4 { animation: float-4 16s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
