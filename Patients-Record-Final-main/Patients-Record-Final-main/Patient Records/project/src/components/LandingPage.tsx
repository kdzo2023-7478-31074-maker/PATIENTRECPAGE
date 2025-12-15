import React from 'react';
import { 
  Shield, 
  Clock, 
  Users, 
  Search, 
  FileText, 
  BarChart3, 
  Database, 
  Zap, 
  Lock,
  Phone,
  Mail,
  MessageCircle,
  ArrowRight,
  CheckCircle,
  Star,
  Award
} from 'lucide-react';
import BackToTop from './BackToTop';

interface LandingPageProps {
  onAccessRecords: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onAccessRecords }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 font-sans">
      {/* Header */}
      <header className="bg-gray-900/90 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white font-display">Claude Ink Co.</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-300 hover:text-primary-400 transition-colors duration-200 font-medium">Features</a>
              <a href="#security" className="text-gray-300 hover:text-primary-400 transition-colors duration-200 font-medium">Security</a>
              <a href="#support" className="text-gray-300 hover:text-primary-400 transition-colors duration-200 font-medium">Support</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-800 via-blue-800 to-indigo-800">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            animation: 'gridScroll 20s linear infinite'
          }}></div>
        </div>

        {/* Floating animated cards */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-32 h-24 bg-gradient-to-br from-primary-500/40 to-secondary-500/40 rounded-lg backdrop-blur-sm animate-float" style={{ animationDelay: '0s', animationDuration: '6s' }}></div>
          <div className="absolute top-40 right-20 w-40 h-28 bg-gradient-to-br from-accent-500/40 to-primary-500/40 rounded-lg backdrop-blur-sm animate-float" style={{ animationDelay: '2s', animationDuration: '7s' }}></div>
          <div className="absolute bottom-32 left-1/4 w-36 h-26 bg-gradient-to-br from-secondary-500/40 to-accent-500/40 rounded-lg backdrop-blur-sm animate-float" style={{ animationDelay: '4s', animationDuration: '8s' }}></div>
          <div className="absolute top-1/3 right-1/3 w-28 h-20 bg-gradient-to-br from-primary-500/40 to-accent-500/40 rounded-lg backdrop-blur-sm animate-float" style={{ animationDelay: '1s', animationDuration: '6.5s' }}></div>
        </div>

        {/* Animated pulse elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
          <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-secondary-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="text-center lg:text-left animate-fade-in">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6 font-display">
                Patient Records
                <span className="block text-primary-400">Management System</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
                Streamline your healthcare practice with our comprehensive 
                patient record management system. Secure, efficient, and built for healthcare professionals.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center lg:justify-start">
                <button 
                  onClick={onAccessRecords}
                  className="group bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2 shadow-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Access Records</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button className="border-2 border-primary-400 text-primary-400 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-primary-400 hover:text-white transition-all duration-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                  Learn More
                </button>
              </div>
            </div>
            
            <div className="relative order-first lg:order-last animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-all duration-500 hover:shadow-3xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white font-display">Patient ID: P-001</h3>
                    <span className="text-sm text-gray-400">Dec 15, 2024</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded animate-pulse"></div>
                    <div className="h-2 bg-gradient-to-r from-primary-400 to-secondary-400 rounded w-4/5 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="h-2 bg-gradient-to-r from-primary-300 to-secondary-300 rounded w-3/5 animate-pulse" style={{ animationDelay: '1s' }}></div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <Shield className="w-4 h-4 text-accent-500" />
                    <span>HIPAA Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="group animate-fade-in">
              <div className="text-3xl sm:text-4xl font-bold text-primary-600 mb-2 group-hover:scale-110 transition-transform duration-300 font-display">24/7</div>
              <div className="text-sm sm:text-base text-gray-300">Support Available</div>
            </div>
            <div className="group animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-3xl sm:text-4xl font-bold text-primary-600 mb-2 group-hover:scale-110 transition-transform duration-300 font-display">100%</div>
              <div className="text-sm sm:text-base text-gray-300">HIPAA Compliant</div>
            </div>
            <div className="group animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl sm:text-4xl font-bold text-primary-600 mb-2 group-hover:scale-110 transition-transform duration-300 font-display">50K+</div>
              <div className="text-sm sm:text-base text-gray-300">Records Managed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-display">Advanced Patient Record Features</h2>
            <p className="text-lg sm:text-xl text-gray-300 px-4">Everything you need to manage patient records efficiently and securely</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group hover:border-primary-500 hover:-translate-y-2 animate-fade-in">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 font-display">Digital Records Management</h3>
              <p className="text-sm sm:text-base text-gray-300">Organize and access patient records with advanced search and filtering capabilities.</p>
            </div>
            
            <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group hover:border-primary-500 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 bg-gradient-to-r from-accent-500 to-primary-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 font-display">Advanced Search</h3>
              <p className="text-sm sm:text-base text-gray-300">Quickly find patient information with intelligent search and smart filtering.</p>
            </div>
            
            <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group hover:border-accent-500 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 font-display">HIPAA Compliant</h3>
              <p className="text-sm sm:text-base text-gray-300">Full compliance with healthcare regulations and data protection standards.</p>
            </div>
            
            <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group hover:border-warning-500 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="w-12 h-12 bg-gradient-to-r from-warning-500 to-warning-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Database className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 font-display">Multi-Site Access</h3>
              <p className="text-sm sm:text-base text-gray-300">Access patient records across multiple locations with seamless synchronization.</p>
            </div>
            
            <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group hover:border-secondary-500 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="w-12 h-12 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 font-display">Real-Time Updates</h3>
              <p className="text-sm sm:text-base text-gray-300">Instant synchronization of patient data across all connected devices.</p>
            </div>
            
            <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group hover:border-primary-500 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 font-display">Analytics Dashboard</h3>
              <p className="text-sm sm:text-base text-gray-300">Comprehensive reporting and analytics for informed decision making.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center animate-fade-in">
            <div className="animate-slide-up">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 font-display">Security & Privacy</h2>
              <p className="text-lg sm:text-xl text-gray-300 mb-8">
                Your patient data is protected with enterprise-grade security measures and full HIPAA compliance.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 group">
                  <div className="w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Lock className="w-3 h-3" />
                  </div>
                  <span className="text-sm sm:text-base">256-bit SSL encryption</span>
                </div>
                <div className="flex items-center space-x-3 group">
                  <div className="w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-3 h-3" />
                  </div>
                  <span className="text-sm sm:text-base">HIPAA compliant infrastructure</span>
                </div>
                <div className="flex items-center space-x-3 group">
                  <div className="w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Database className="w-3 h-3" />
                  </div>
                  <span className="text-sm sm:text-base">Secure cloud storage with automatic backups</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl p-8 text-center shadow-2xl hover:shadow-3xl transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Shield className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4 font-display">HIPAA Compliant</h3>
              <p className="text-primary-100 mb-6">
                Our platform meets all healthcare industry security and privacy requirements.
              </p>
              <div className="text-4xl font-bold font-display">99.9%</div>
              <div className="text-primary-200">Uptime Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" className="py-20 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-display">Get Support</h2>
            <p className="text-lg sm:text-xl text-gray-300 px-4">Our technical support team is here to help with any questions or issues.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 p-8 rounded-xl shadow-lg text-center group hover:shadow-2xl transition-all duration-300 hover:border-primary-500 hover:-translate-y-2 animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 font-display">Phone Support</h3>
              <p className="text-sm sm:text-base text-gray-300 mb-4">Get immediate help from our support specialists</p>
              <p className="text-primary-400 font-semibold">1-800-HEALTH</p>
            </div>
            
            <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 p-8 rounded-xl shadow-lg text-center group hover:shadow-2xl transition-all duration-300 hover:border-accent-500 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 font-display">Email Support</h3>
              <p className="text-sm sm:text-base text-gray-300 mb-4">Send us your questions and we'll respond within 24 hours</p>
              <p className="text-accent-400 font-semibold">support@cloudh.it</p>
            </div>
            
            <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 p-8 rounded-xl shadow-lg text-center group hover:shadow-2xl transition-all duration-300 hover:border-warning-500 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-gradient-to-r from-warning-500 to-warning-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 font-display">Live Chat</h3>
              <p className="text-sm sm:text-base text-gray-300 mb-4">Chat with our support team in real-time</p>
              <p className="text-warning-400 font-semibold">Available 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-display">Claude Ink Co.</span>
            </div>
            <p className="text-gray-400">© 2024 Claude Ink Co. All rights reserved. HIPAA Compliant Healthcare Solutions.</p>
          </div>
        </div>
      </footer>
      
      <BackToTop />
    </div>
  );
};

export default LandingPage;