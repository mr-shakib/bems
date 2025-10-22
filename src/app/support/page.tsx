import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BemsLogo } from "@/components/bems-logo";
import { ArrowLeft, Mail, MessageCircle, Phone, Clock, HelpCircle } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <BemsLogo size="lg" className="transition-transform hover:scale-105" />
            </Link>
            <Button asChild variant="ghost" className="text-slate-600 hover:text-slate-900">
              <Link href="/" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Support Center</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            We're here to help! Find answers to your questions or get in touch with our support team.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Options */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Email Support</h3>
                  <p className="text-slate-600 mb-2">Get help via email within 24 hours</p>
                  <a href="mailto:contactshakibhere@gmail.com" className="text-blue-600 hover:text-blue-700 font-medium">
                    contactshakibhere@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Live Chat</h3>
                  <p className="text-slate-600 mb-2">Chat with our support team in real-time</p>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Start Chat
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Phone className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Phone Support</h3>
                  <p className="text-slate-600 mb-2">Speak directly with our support team</p>
                  <p className="text-slate-900 font-medium">+880 18345-13095</p>
                </div>
              </div>

              
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Quick Actions</h2>
            
            <div className="space-y-4">
              <Button asChild variant="outline" className="w-full justify-start h-auto p-4">
                <Link href="/docs" className="flex items-center">
                  <HelpCircle className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Documentation</div>
                    <div className="text-sm text-slate-600">Browse our comprehensive guides</div>
                  </div>
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full justify-start h-auto p-4">
                <Link href="/tutorials" className="flex items-center">
                  <HelpCircle className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Video Tutorials</div>
                    <div className="text-sm text-slate-600">Watch step-by-step tutorials</div>
                  </div>
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full justify-start h-auto p-4">
                <Link href="/status" className="flex items-center">
                  <HelpCircle className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">System Status</div>
                    <div className="text-sm text-slate-600">Check our service status</div>
                  </div>
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full justify-start h-auto p-4">
                <Link href="/community" className="flex items-center">
                  <HelpCircle className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Community Forum</div>
                    <div className="text-sm text-slate-600">Connect with other users</div>
                  </div>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">How do I get started with BEMS?</h3>
              <p className="text-slate-700 leading-relaxed">
                Getting started is easy! Simply sign up for a free account, create your first workspace, and invite your team members. Our onboarding guide will walk you through the essential features to get you up and running quickly.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Can I import data from other project management tools?</h3>
              <p className="text-slate-700 leading-relaxed">
                Currently, BEMS does not support importing data from other project management tools. However, this feature is on our roadmap and we're working to add import capabilities for popular tools like Trello, Asana, and Monday.com in future updates.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Is my data secure with BEMS?</h3>
              <p className="text-slate-700 leading-relaxed">
                Absolutely. We use enterprise-grade security measures including end-to-end encryption, regular security audits, and SOC 2 compliance. Your data is stored securely and backed up regularly.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">What payment methods do you accept?</h3>
              <p className="text-slate-700 leading-relaxed">
                BEMS is currently completely free to use! We're in our early access phase and all features are available at no cost. We may introduce premium plans in the future, but for now, enjoy full access to all BEMS features without any payment required.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Can I delete my account and data?</h3>
              <p className="text-slate-700 leading-relaxed">
                Yes, you can delete your account at any time from your account settings. Before deletion, you can export all your data including projects, tasks, and team information. Once deleted, your data will be permanently removed from our servers within 30 days.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Do you offer training for teams?</h3>
              <p className="text-slate-700 leading-relaxed">
                Yes! We offer personalized training sessions for teams of 10 or more users. Contact our support team to schedule a training session tailored to your organization's needs.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-8 md:p-12 mt-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Still Need Help?</h2>
          <div className="max-w-2xl mx-auto">
            <p className="text-slate-600 text-center mb-8">
              Can't find what you're looking for? Send us a message and we'll get back to you as soon as possible.
            </p>
            <div className="text-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link href="mailto:support@bems.com">
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Support
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-slate-900 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-400">© 2025 BEMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}