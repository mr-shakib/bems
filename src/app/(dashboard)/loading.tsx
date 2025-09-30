"use client";

const LoadingPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-8 h-8 border-2 border-slate-200 rounded-full"></div>
        <div className="absolute inset-0 w-8 h-8 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-sm text-slate-600 font-medium mt-4">
        Loading...
      </p>
    </div>
  );
}

export default LoadingPage;