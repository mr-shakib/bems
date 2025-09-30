"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BemsLogo } from "@/components/bems-logo";
import { 
  Users, 
  CheckSquare, 
  BarChart3, 
  Folder,
  ArrowRight,
  Star,
  Menu,
  X
} from "lucide-react";

export const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: Folder,
      title: "Workspace & Project Management",
      description: "Organize your business with intuitive workspace and project management tools."
    },
    {
      icon: CheckSquare,
      title: "Smart Task Tracking",
      description: "Track tasks with Kanban boards, calendars, and advanced filtering options."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamlessly collaborate with team members across projects and workspaces."
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Get insights into productivity, progress, and team performance metrics."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Header */}
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/50" 
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <BemsLogo size="lg" className="transition-transform hover:scale-105" />
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Button 
                asChild 
                variant="ghost" 
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 transition-all duration-200"
              >
                <Link href="/sign-in">Login</Link>
              </Button>
              <Button 
                asChild 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200/50 bg-white/95 backdrop-blur-md">
              <div className="flex flex-col space-y-3">
                <Button asChild variant="ghost" className="justify-start">
                  <Link href="/sign-in">Login</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                  Manage Your Business,{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Projects, and Teams
                  </span>{" "}
                  in One Place
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
                  BEMS helps you simplify workspace management, streamline collaboration, 
                  and track progress effortlessly.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 group"
                >
                  <Link href="/sign-up" className="flex items-center">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg"
                  className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
                >
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>

            {/* Right Content - Dashboard Mockup */}
            <div className="relative animate-slide-in-right">
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/50 overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <svg viewBox="0 0 600 400" className="w-full h-auto">
                  {/* Browser Header */}
                  <rect width="600" height="48" fill="url(#headerGradient)" />
                  <circle cx="24" cy="24" r="6" fill="rgba(255,255,255,0.3)" />
                  <circle cx="48" cy="24" r="6" fill="rgba(255,255,255,0.3)" />
                  <circle cx="72" cy="24" r="6" fill="rgba(255,255,255,0.3)" />
                  <text x="120" y="28" fill="white" fontSize="14" fontWeight="500">BEMS Dashboard</text>
                  
                  {/* Main Content Area */}
                  <rect x="0" y="48" width="600" height="352" fill="#fafafa" />
                  
                  {/* Sidebar */}
                  <rect x="0" y="48" width="200" height="352" fill="white" />
                  <rect x="0" y="48" width="200" height="1" fill="#e2e8f0" />
                  
                  {/* Sidebar Items */}
                  <rect x="16" y="72" width="168" height="32" rx="6" fill="#f1f5f9" />
                  <rect x="24" y="80" width="16" height="16" rx="2" fill="#3b82f6" />
                  <text x="48" y="92" fill="#1e293b" fontSize="12" fontWeight="500">Dashboard</text>
                  
                  <rect x="24" y="120" width="16" height="16" rx="2" fill="#64748b" />
                  <text x="48" y="132" fill="#64748b" fontSize="12">Projects</text>
                  
                  <rect x="24" y="152" width="16" height="16" rx="2" fill="#64748b" />
                  <text x="48" y="164" fill="#64748b" fontSize="12">Tasks</text>
                  
                  <rect x="24" y="184" width="16" height="16" rx="2" fill="#64748b" />
                  <text x="48" y="196" fill="#64748b" fontSize="12">Team</text>
                  
                  {/* Main Content */}
                  <rect x="200" y="48" width="1" height="352" fill="#e2e8f0" />
                  
                  {/* Header */}
                  <text x="224" y="88" fill="#1e293b" fontSize="20" fontWeight="600">Project Overview</text>
                  
                  {/* Stats Cards */}
                  <rect x="224" y="104" width="120" height="80" rx="8" fill="white" stroke="#e2e8f0" />
                  <text x="240" y="128" fill="#3b82f6" fontSize="24" fontWeight="700">24</text>
                  <text x="240" y="148" fill="#64748b" fontSize="12">Active Tasks</text>
                  <rect x="240" y="156" width="88" height="4" rx="2" fill="#e2e8f0" />
                  <rect x="240" y="156" width="66" height="4" rx="2" fill="#3b82f6" />
                  
                  <rect x="360" y="104" width="120" height="80" rx="8" fill="white" stroke="#e2e8f0" />
                  <text x="376" y="128" fill="#8b5cf6" fontSize="24" fontWeight="700">8</text>
                  <text x="376" y="148" fill="#64748b" fontSize="12">Team Members</text>
                  <circle cx="392" cy="160" r="8" fill="#3b82f6" />
                  <circle cx="408" cy="160" r="8" fill="#8b5cf6" />
                  <circle cx="424" cy="160" r="8" fill="#10b981" />
                  
                  <rect x="496" y="104" width="80" height="80" rx="8" fill="white" stroke="#e2e8f0" />
                  <text x="512" y="128" fill="#10b981" fontSize="20" fontWeight="700">92%</text>
                  <text x="512" y="148" fill="#64748b" fontSize="11">Complete</text>
                  <circle cx="536" cy="160" r="12" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                  <circle cx="536" cy="160" r="12" fill="none" stroke="#10b981" strokeWidth="3" 
                          strokeDasharray="69.1" strokeDashoffset="5.5" transform="rotate(-90 536 160)" />
                  
                  {/* Task List */}
                  <text x="224" y="224" fill="#1e293b" fontSize="16" fontWeight="600">Recent Tasks</text>
                  
                  <rect x="224" y="240" width="352" height="40" rx="6" fill="white" stroke="#e2e8f0" />
                  <rect x="240" y="252" width="12" height="12" rx="2" fill="#10b981" />
                  <text x="264" y="264" fill="#1e293b" fontSize="12">Design System Update</text>
                  <text x="520" y="264" fill="#64748b" fontSize="11">Completed</text>
                  
                  <rect x="224" y="288" width="352" height="40" rx="6" fill="white" stroke="#e2e8f0" />
                  <rect x="240" y="300" width="12" height="12" rx="2" fill="#3b82f6" />
                  <text x="264" y="312" fill="#1e293b" fontSize="12">API Integration</text>
                  <text x="520" y="312" fill="#64748b" fontSize="11">In Progress</text>
                  
                  <rect x="224" y="336" width="352" height="40" rx="6" fill="white" stroke="#e2e8f0" />
                  <rect x="240" y="348" width="12" height="12" rx="2" fill="#f59e0b" />
                  <text x="264" y="360" fill="#1e293b" fontSize="12">User Testing</text>
                  <text x="520" y="360" fill="#64748b" fontSize="11">Pending</text>
                  
                  {/* Gradients */}
                  <defs>
                    <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Succeed
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Powerful features designed to streamline your workflow and boost productivity
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-6 bg-white rounded-xl shadow-sm border border-slate-200/50 hover:shadow-lg hover:border-slate-300/50 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Showcase Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              See BEMS in Action
            </h2>
            <p className="text-xl text-slate-600">
              Experience the power of integrated workspace management
            </p>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/50 overflow-hidden">
              <svg viewBox="0 0 800 500" className="w-full h-auto">
                {/* Browser Header */}
                <rect width="800" height="60" fill="url(#showcaseHeaderGradient)" />
                <circle cx="32" cy="30" r="8" fill="rgba(255,255,255,0.3)" />
                <circle cx="56" cy="30" r="8" fill="rgba(255,255,255,0.3)" />
                <circle cx="80" cy="30" r="8" fill="rgba(255,255,255,0.3)" />
                <text x="120" y="36" fill="white" fontSize="16" fontWeight="600">BEMS Analytics Dashboard</text>
                
                {/* Main Background */}
                <rect x="0" y="60" width="800" height="440" fill="#f8fafc" />
                
                {/* Top Navigation */}
                <rect x="0" y="60" width="800" height="64" fill="white" />
                <rect x="0" y="124" width="800" height="1" fill="#e2e8f0" />
                <text x="32" y="96" fill="#1e293b" fontSize="18" fontWeight="600">Analytics Overview</text>
                
                {/* Key Metrics Row */}
                <rect x="32" y="148" width="180" height="100" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="1" />
                <text x="48" y="172" fill="#64748b" fontSize="12">Total Projects</text>
                <text x="48" y="200" fill="#3b82f6" fontSize="32" fontWeight="700">42</text>
                <text x="48" y="220" fill="#10b981" fontSize="12">↗ +12% this month</text>
                
                <rect x="228" y="148" width="180" height="100" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="1" />
                <text x="244" y="172" fill="#64748b" fontSize="12">Active Tasks</text>
                <text x="244" y="200" fill="#8b5cf6" fontSize="32" fontWeight="700">156</text>
                <text x="244" y="220" fill="#10b981" fontSize="12">↗ +8% this week</text>
                
                <rect x="424" y="148" width="180" height="100" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="1" />
                <text x="440" y="172" fill="#64748b" fontSize="12">Team Members</text>
                <text x="440" y="200" fill="#f59e0b" fontSize="32" fontWeight="700">24</text>
                <text x="440" y="220" fill="#10b981" fontSize="12">↗ +3 new members</text>
                
                <rect x="620" y="148" width="148" height="100" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="1" />
                <text x="636" y="172" fill="#64748b" fontSize="12">Completion Rate</text>
                <text x="636" y="200" fill="#10b981" fontSize="28" fontWeight="700">94%</text>
                <circle cx="720" cy="190" r="20" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                <circle cx="720" cy="190" r="20" fill="none" stroke="#10b981" strokeWidth="4" 
                        strokeDasharray="118" strokeDashoffset="7" transform="rotate(-90 720 190)" />
                
                {/* Charts Section */}
                <rect x="32" y="268" width="360" height="200" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="1" />
                <text x="48" y="292" fill="#1e293b" fontSize="16" fontWeight="600">Project Progress</text>
                
                {/* Bar Chart */}
                <rect x="60" y="320" width="24" height="80" rx="4" fill="#3b82f6" />
                <rect x="96" y="340" width="24" height="60" rx="4" fill="#8b5cf6" />
                <rect x="132" y="310" width="24" height="90" rx="4" fill="#10b981" />
                <rect x="168" y="350" width="24" height="50" rx="4" fill="#f59e0b" />
                <rect x="204" y="330" width="24" height="70" rx="4" fill="#ef4444" />
                <rect x="240" y="315" width="24" height="85" rx="4" fill="#06b6d4" />
                <rect x="276" y="345" width="24" height="55" rx="4" fill="#8b5cf6" />
                
                <text x="66" y="420" fill="#64748b" fontSize="10">Jan</text>
                <text x="102" y="420" fill="#64748b" fontSize="10">Feb</text>
                <text x="138" y="420" fill="#64748b" fontSize="10">Mar</text>
                <text x="174" y="420" fill="#64748b" fontSize="10">Apr</text>
                <text x="210" y="420" fill="#64748b" fontSize="10">May</text>
                <text x="246" y="420" fill="#64748b" fontSize="10">Jun</text>
                <text x="282" y="420" fill="#64748b" fontSize="10">Jul</text>
                
                {/* Team Activity */}
                <rect x="408" y="268" width="360" height="200" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="1" />
                <text x="424" y="292" fill="#1e293b" fontSize="16" fontWeight="600">Team Activity</text>
                
                {/* Activity Items */}
                <circle cx="440" cy="320" r="16" fill="#3b82f6" />
                <text x="432" y="326" fill="white" fontSize="12" fontWeight="600">SH</text>
                <text x="468" y="318" fill="#1e293b" fontSize="12" fontWeight="500">Shakib Howlader</text>
                <text x="468" y="332" fill="#64748b" fontSize="11">Completed "API Integration"</text>
                <text x="700" y="325" fill="#64748b" fontSize="10">2 min ago</text>
                
                <circle cx="440" cy="360" r="16" fill="#8b5cf6" />
                <text x="432" y="366" fill="white" fontSize="12" fontWeight="600">SA</text>
                <text x="468" y="358" fill="#1e293b" fontSize="12" fontWeight="500">Md. Sabbir Ahamed</text>
                <text x="468" y="372" fill="#64748b" fontSize="11">Updated project timeline</text>
                <text x="700" y="365" fill="#64748b" fontSize="10">5 min ago</text>
                
                <circle cx="440" cy="400" r="16" fill="#10b981" />
                <text x="432" y="406" fill="white" fontSize="12" fontWeight="600">SR</text>
                <text x="468" y="398" fill="#1e293b" fontSize="12" fontWeight="500">Sakib Mahmud Rahat</text>
                <text x="468" y="412" fill="#64748b" fontSize="11">Added new team member</text>
                <text x="700" y="405" fill="#64748b" fontSize="10">12 min ago</text>
                
                <circle cx="440" cy="440" r="16" fill="#f59e0b" />
                <text x="432" y="446" fill="white" fontSize="12" fontWeight="600">SS</text>
                <text x="468" y="438" fill="#1e293b" fontSize="12" fontWeight="500">Syed Sabbir</text>
                <text x="468" y="452" fill="#64748b" fontSize="11">Created new workspace</text>
                <text x="700" y="445" fill="#64748b" fontSize="10">18 min ago</text>
                
                {/* Gradients */}
                <defs>
                  <linearGradient id="showcaseHeaderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-8 md:p-12">
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-2xl md:text-3xl font-medium text-slate-900 mb-8 leading-relaxed">
              "BEMS transformed how our team collaborates. We've seen a 40% increase in 
              productivity since switching to this platform."
            </blockquote>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">JS</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-slate-900">Jane Smith</div>
                <div className="text-slate-600">Project Manager, TechCorp</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Start Managing Smarter with BEMS — It's Free!
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of teams who trust BEMS to streamline their workflow 
            and boost productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-slate-50 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 group"
            >
              <Link href="/sign-up" className="flex items-center">
                Sign Up Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-200"
            >
              <Link href="/sign-in">Login</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <BemsLogo size="lg" className="mb-2" />
              <p className="text-slate-400">© 2025 BEMS. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};