
import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Plane, 
  Hotel, 
  Clock, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Download, 
  Info, 
  ShieldAlert, 
  X, 
  Users, 
  Heart, 
  Utensils, 
  Wallet, 
  Plus, 
  Linkedin,
  Globe,
  Milestone,
  AlertCircle,
  Printer
} from 'lucide-react';
import { UserPreferences, TravelType, PaceType, CompleteItinerary } from './types';
import { INTEREST_OPTIONS, DIETARY_OPTIONS, STEPS } from './constants';
import { generateItinerary } from './services/geminiService';
import BudgetChart from './components/BudgetChart';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'onboarding' | 'loading' | 'result'>('landing');
  const [currentStep, setCurrentStep] = useState(1);
  const [customInterest, setCustomInterest] = useState('');
  
  const [prefs, setPrefs] = useState<UserPreferences>({
    origin: '',
    destination: '',
    startDate: '2026-01-14',
    endDate: '2026-01-21',
    travelers: 2,
    travelType: TravelType.COUPLE,
    luxuryLevel: 3,
    pace: PaceType.BALANCED,
    interests: [],
    dietary: ['No restrictions'],
    budget: 50000,
    email: '',
    additionalRequests: ''
  });

  const [itinerary, setItinerary] = useState<CompleteItinerary | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'dining' | 'tips' | 'budget'>('overview');
  const [showError, setShowError] = useState<string | null>(null);

  const getCurrency = (dest: string) => {
    const d = dest.toLowerCase();
    if (d.includes('india') || d.includes('mumbai') || d.includes('chennai') || d.includes('jaipur') || d.includes('delhi') || d.includes('goa')) return '₹';
    if (d.includes('usa') || d.includes('york') || d.includes('bali') || d.includes('thailand')) return '$';
    if (d.includes('france') || d.includes('paris') || d.includes('italy') || d.includes('europe') || d.includes('germany')) return '€';
    if (d.includes('london') || d.includes('uk')) return '£';
    if (d.includes('japan') || d.includes('tokyo')) return '¥';
    return '$';
  };

  const currencySymbol = getCurrency(prefs.destination);

  const getLuxuryLabel = (level: number) => {
    const isIndia = currencySymbol === '₹';
    if (isIndia) {
      if (level === 1) return 'Backpacker (~₹2k/day)';
      if (level === 2) return 'Essential (~₹5k/day)';
      if (level === 3) return 'Comfort (~₹15k/day)';
      if (level === 4) return 'Premium (~₹35k/day)';
      return 'Exclusive (~₹75k+/day)';
    } else {
      if (level === 1) return 'Backpacker (~$50/day)';
      if (level === 2) return 'Essential (~$150/day)';
      if (level === 3) return 'Comfort (~$350/day)';
      if (level === 4) return 'Premium (~$800/day)';
      return 'Exclusive (~$1,800+/day)';
    }
  };

  useEffect(() => {
    if (currentView === 'loading') {
      const statuses = [
        "Initializing High-Level Neural Agents...",
        "Scanning hyperscale flight networks...",
        "Selecting premium sanctuary spots...",
        "Extracting local secrets with Deep AI...",
        "Calibrating taste-bud preferences...",
        "Finalizing your masterpiece..."
      ];
      let i = 0;
      setLoadingStatus([]);
      const interval = setInterval(() => {
        if (i < statuses.length) {
          setLoadingStatus(prev => [...prev, statuses[i]]);
          i++;
        } else { clearInterval(interval); }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentView]);

  const handleNext = () => {
    setShowError(null);
    if (currentStep === 1) {
      if (!prefs.destination.trim()) {
        setShowError("Hold on! We need to know where you're going first.");
        return;
      }
    }
    if (currentStep === 2) {
      const start = new Date(prefs.startDate);
      const end = new Date(prefs.endDate);
      if (end < start) {
        setShowError("Wait a minute... Are you trying to time travel? Your return date can't be before your departure!");
        return;
      }
    }
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else {
      handleGenerate();
    }
  };

  const handleGenerate = async () => {
    setCurrentView('loading');
    try {
      const result = await generateItinerary(prefs);
      setItinerary(result);
      setCurrentView('result');
    } catch (error) {
      alert("Neural sync error. Please retry your request.");
      setCurrentView('onboarding');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleInterest = (id: string) => {
    setPrefs(prev => ({
      ...prev,
      interests: prev.interests.includes(id) 
        ? prev.interests.filter(i => i !== id) 
        : [...prev.interests, id]
    }));
  };

  const addCustomInterest = () => {
    if (customInterest.trim() && !prefs.interests.includes(customInterest.trim())) {
      setPrefs(prev => ({
        ...prev,
        interests: [...prev.interests, customInterest.trim()]
      }));
      setCustomInterest('');
    }
  };

  const toggleDietary = (val: string) => {
    setPrefs(prev => ({
      ...prev,
      dietary: prev.dietary.includes(val) 
        ? prev.dietary.filter(i => i !== val) 
        : [...prev.dietary, val]
    }));
  };

  const renderLanding = () => (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <nav className="z-10 px-8 h-24 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-teal-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight">AuraQuest AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => setCurrentView('onboarding')} className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-bold transition-all">Sign In</button>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-teal-400 text-xs font-bold tracking-widest uppercase mb-8 animate-bounce">
          <Globe className="w-3 h-3" /> Redefining Global Exploration
        </div>
        <h1 className="text-6xl md:text-8xl font-black mb-6 max-w-5xl leading-tight tracking-tighter bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
          JOURNEYS WOVEN WITH <br/> INTELLIGENCE
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl leading-relaxed">
          Escape the chaos of planning. Our multi-agent AI synthesizes your desires into the ultimate odyssey in under five minutes.
        </p>
        <button 
          onClick={() => setCurrentView('onboarding')}
          className="group bg-white text-black px-10 py-5 rounded-full font-black text-xl transition-all hover:scale-105 flex items-center gap-3 shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)]"
        >
          Forge Your Quest <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      <footer className="z-10 p-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-slate-500 text-sm">© 2026 AuraQuest AI. Transcend Boundaries.</div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col md:items-end mr-4 border-r border-white/10 pr-6">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Architect & Creator</span>
            <div className="flex items-center gap-3">
              <a href="https://rahulshyam-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-teal-400 transition-colors flex items-center gap-1.5 font-bold text-sm">
                <Globe className="w-4 h-4" /> Portfolio
              </a>
              <a href="https://www.linkedin.com/in/rahulshyamcivil/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-indigo-400 transition-colors flex items-center gap-1.5 font-bold text-sm">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            </div>
          </div>
          <span className="text-xs text-slate-600 font-medium">Rahul Shyam</span>
        </div>
      </footer>
    </div>
  );

  const renderOnboarding = () => (
    <div className="min-h-screen bg-[#f1f5f9] py-12 px-4 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-[2.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.1)] border border-white/20 overflow-hidden flex flex-col md:flex-row min-h-[700px]">
        
        <div className="md:w-[280px] bg-[#0f172a] p-10 text-white flex flex-col justify-between shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-12">
              <Sparkles className="w-6 h-6 text-teal-400" />
              <span className="font-bold tracking-tight text-lg">AuraQuest</span>
            </div>
            <div className="space-y-8">
              {STEPS.map((step, idx) => (
                <div key={step} className="flex items-center gap-4 group cursor-default">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${idx + 1 === currentStep ? 'border-teal-400 bg-teal-400 text-slate-900 shadow-[0_0_15px_rgba(45,212,191,0.3)]' : idx + 1 < currentStep ? 'border-teal-400/50 text-teal-400/50' : 'border-slate-700 text-slate-500'}`}>
                    {idx + 1 < currentStep ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span className={`text-sm font-bold transition-colors ${idx + 1 === currentStep ? 'text-white' : 'text-slate-500'}`}>{step}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Technical Core</p>
            <p className="text-xs text-slate-400 leading-relaxed">Our system uses extreme high-level AI systems to synthesize global logistics in real-time.</p>
          </div>
        </div>

        <div className="flex-1 p-10 md:p-14 flex flex-col justify-between bg-white relative">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 capitalize">
               {currentStep === 1 && <MapPin className="text-teal-500" />}
               {currentStep === 2 && <Calendar className="text-indigo-500" />}
               {currentStep === 3 && <Users className="text-pink-500" />}
               {currentStep === 4 && <Milestone className="text-orange-500" />}
               {currentStep === 5 && <Heart className="text-red-500" />}
               {currentStep === 6 && <Utensils className="text-amber-500" />}
               {currentStep === 7 && <Wallet className="text-green-500" />}
               {STEPS[currentStep - 1]}
            </h3>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Phase {currentStep}/07</span>
          </div>

          <div className="flex-1">
            {showError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-in fade-in zoom-in-95 duration-300">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {showError}
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="group">
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Starting City</label>
                  <input 
                    type="text" 
                    placeholder="Where are you starting from?" 
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-teal-400 focus:bg-white focus:outline-none transition-all font-medium"
                    value={prefs.origin}
                    onChange={(e) => setPrefs({...prefs, origin: e.target.value})}
                  />
                </div>
                <div className="group">
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Where to? *</label>
                  <input 
                    type="text" 
                    placeholder="Your dream destination..." 
                    className={`w-full p-4 bg-slate-50 border-2 rounded-2xl focus:bg-white focus:outline-none transition-all font-medium ${prefs.destination ? 'border-teal-400' : 'border-slate-100'}`}
                    value={prefs.destination}
                    onChange={(e) => {
                      setPrefs({...prefs, destination: e.target.value});
                      if (e.target.value.trim()) setShowError(null);
                    }}
                  />
                  {!prefs.destination && <p className="mt-2 text-[10px] text-teal-600 font-bold uppercase tracking-widest">Destination is required to proceed</p>}
                </div>
                <div className="pt-4">
                  <p className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-widest">Quick Choices:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Jaipur', 'Goa', 'Paris', 'Tokyo', 'Bali'].map(dest => (
                      <button 
                        key={dest}
                        onClick={() => {
                          setPrefs({...prefs, destination: dest});
                          setShowError(null);
                        }}
                        className="px-4 py-2 bg-slate-50 border-2 border-slate-100 rounded-full hover:border-teal-400 hover:text-teal-600 transition-all text-xs font-bold text-slate-600"
                      >
                        {dest}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Travel Date</label>
                  <input 
                    type="date" 
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-400 focus:outline-none font-medium"
                    value={prefs.startDate}
                    onChange={(e) => setPrefs({...prefs, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Return Date</label>
                  <input 
                    type="date" 
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-400 focus:outline-none font-medium"
                    value={prefs.endDate}
                    onChange={(e) => setPrefs({...prefs, endDate: e.target.value})}
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest">Number of People</label>
                  <div className="flex items-center gap-6">
                    <button onClick={() => setPrefs(p => ({...p, travelers: Math.max(1, p.travelers - 1)}))} className="w-12 h-12 rounded-2xl border-2 border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-all text-xl font-bold">-</button>
                    <span className="text-4xl font-black text-slate-900">{prefs.travelers}</span>
                    <button onClick={() => setPrefs(p => ({...p, travelers: p.travelers + 1}))} className="w-12 h-12 rounded-2xl border-2 border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-all text-xl font-bold">+</button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest">Trip Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(TravelType).map(type => (
                      <button
                        key={type}
                        onClick={() => setPrefs({...prefs, travelType: type})}
                        className={`p-4 rounded-2xl text-xs font-bold border-2 transition-all ${prefs.travelType === type ? 'border-pink-400 bg-pink-50 text-pink-700' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Comfort Tier</label>
                    <span className="text-orange-600 font-black text-sm">{getLuxuryLabel(prefs.luxuryLevel)}</span>
                  </div>
                  <input 
                    type="range" min="1" max="5" 
                    className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-orange-500"
                    value={prefs.luxuryLevel}
                    onChange={(e) => setPrefs({...prefs, luxuryLevel: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">Trip Pace</label>
                  <div className="space-y-3">
                    {Object.values(PaceType).map(p => (
                      <button
                        key={p}
                        onClick={() => setPrefs({...prefs, pace: p})}
                        className={`w-full p-4 rounded-2xl text-left flex items-center justify-between border-2 transition-all ${prefs.pace === p ? 'border-orange-400 bg-orange-50 text-orange-900' : 'border-slate-100 hover:border-slate-200 text-slate-500'}`}
                      >
                        <span className="font-bold text-sm">{p}</span>
                        {prefs.pace === p && <CheckCircle2 className="w-5 h-5 text-orange-500" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-2 gap-2 mb-8">
                  {INTEREST_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => toggleInterest(opt.id)}
                      className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${prefs.interests.includes(opt.id) ? 'border-red-400 bg-red-50 text-red-900' : 'border-slate-100 hover:border-slate-200 text-slate-500'}`}
                    >
                      <div className={`${prefs.interests.includes(opt.id) ? 'text-red-500' : 'text-slate-400'}`}>
                        {opt.icon}
                      </div>
                      <span className="font-bold text-[11px] uppercase tracking-wide">{opt.label}</span>
                    </button>
                  ))}
                </div>
                <div className="pt-6 border-t border-slate-100">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Any specific activities?" 
                      className="flex-1 p-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-red-400 focus:outline-none text-sm font-medium"
                      value={customInterest}
                      onChange={(e) => setCustomInterest(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomInterest()}
                    />
                    <button onClick={addCustomInterest} className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-400 transition-all"><Plus className="w-5 h-5" /></button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {prefs.interests.filter(i => !INTEREST_OPTIONS.find(opt => opt.id === i)).map(interest => (
                      <span key={interest} className="px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100 flex items-center gap-2">
                        {interest}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => toggleInterest(interest)} />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Dietary Needs</label>
                <div className="flex flex-wrap gap-2">
                  {DIETARY_OPTIONS.map(diet => (
                    <button
                      key={diet}
                      onClick={() => toggleDietary(diet)}
                      className={`px-5 py-3 rounded-full border-2 transition-all font-bold text-xs uppercase tracking-widest ${prefs.dietary.includes(diet) ? 'border-amber-400 bg-amber-400 text-white shadow-lg shadow-amber-200' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
                    >
                      {diet}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 7 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Total Budget ({currencySymbol})</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-xl">{currencySymbol}</span>
                    <input 
                      type="number" 
                      className="w-full p-5 pl-12 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-green-400 focus:outline-none font-black text-2xl text-slate-900"
                      value={prefs.budget}
                      onChange={(e) => setPrefs({...prefs, budget: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Special Requests</label>
                  <textarea 
                    rows={3}
                    placeholder="E.g. I need a quiet workspace, sunrise spots..."
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-green-400 focus:outline-none font-medium text-sm"
                    value={prefs.additionalRequests}
                    onChange={(e) => setPrefs({...prefs, additionalRequests: e.target.value})}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-12 flex justify-between gap-4">
            <button 
              onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : setCurrentView('landing')}
              className="px-8 py-4 text-slate-400 font-bold hover:text-slate-900 transition-all text-sm uppercase tracking-widest"
            >
              Back
            </button>
            <button 
              onClick={handleNext}
              className="px-10 py-4 bg-[#0f172a] hover:bg-slate-800 text-white rounded-2xl font-black transition-all flex items-center gap-3 shadow-xl uppercase tracking-tighter text-sm"
            >
              {currentStep === 7 ? 'Generate My Trip' : 'Continue'} <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-white text-center">
      <div className="relative w-32 h-32 mb-12">
        <div className="absolute inset-0 border-[6px] border-teal-500/10 rounded-full"></div>
        <div className="absolute inset-0 border-[6px] border-teal-400 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-teal-400 animate-pulse" />
        </div>
      </div>
      <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase italic">Crafting Masterpiece...</h2>
      <p className="text-slate-500 text-sm max-w-sm mb-12 tracking-widest font-bold uppercase">Synthesizing ultra-intelligent data streams for {prefs.destination}</p>
      
      <div className="space-y-4 max-w-xs w-full">
        {loadingStatus.map((status, idx) => (
          <div key={idx} className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="w-1.5 h-1.5 bg-teal-400 rounded-full"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{status}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderResult = () => {
    if (!itinerary) return null;
    return (
      <div className="min-h-screen bg-white">
        <header className="h-20 glass sticky top-0 z-[100] border-b border-slate-100 flex items-center px-8 justify-between no-print">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('landing')}>
            <Sparkles className="w-5 h-5 text-teal-500" />
            <span className="font-black text-xl tracking-tighter uppercase">AuraQuest AI</span>
          </div>
          <div className="flex items-center gap-4">
             <button 
                onClick={handlePrint}
                className="px-5 py-2 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-widest transition-transform hover:scale-105 flex items-center gap-2"
             >
                <Printer className="w-4 h-4" /> Save as PDF
             </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-6 md:p-12">
          <div className="h-[500px] rounded-[3rem] overflow-hidden relative shadow-2xl mb-12 group">
            <img src={`https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2000`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[5s] group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            <div className="absolute bottom-16 left-16 right-16 text-white">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="px-4 py-1 bg-teal-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">{itinerary.dates}</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-4 italic">{itinerary.destination}</h1>
              <p className="text-xl text-slate-300 font-medium tracking-tight">{itinerary.tripTitle} for {prefs.travelers} explorers</p>
            </div>
          </div>

          <div className="flex overflow-x-auto no-scrollbar gap-12 border-b border-slate-100 mb-12 no-print">
             {['Overview', 'Itinerary', 'Dining', 'Safety & Tips', 'Budget'].map((tab, i) => {
               const id = ['overview', 'itinerary', 'dining', 'tips', 'budget'][i];
               return (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(id as any)}
                   className={`pb-4 text-xs font-black uppercase tracking-[0.2em] border-b-2 transition-all ${activeTab === id ? 'border-teal-500 text-teal-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                 >{tab}</button>
               )
             })}
          </div>

          <div className="animate-in fade-in duration-1000">
            {(activeTab === 'overview' || window.matchMedia('print').matches) && (
              <div className="grid lg:grid-cols-3 gap-8 mb-16">
                <div className="lg:col-span-2 space-y-8">
                   <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
                     <h3 className="text-2xl font-black uppercase italic mb-6">Stay: {itinerary.hotel.name}</h3>
                     <div className="flex flex-wrap gap-4 mb-8">
                        {itinerary.hotel.features.map(f => <span key={f} className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">{f}</span>)}
                     </div>
                     <p className="text-slate-600 leading-relaxed mb-10 font-medium">{itinerary.hotel.description}</p>
                     <div className="flex items-center justify-between border-t border-slate-200 pt-8">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nightly Cost</p>
                          <p className="text-3xl font-black">{currencySymbol}{itinerary.hotel.pricePerNight.toLocaleString()}</p>
                        </div>
                     </div>
                   </div>

                   <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-8 bg-teal-50 rounded-[2rem] border border-teal-100">
                        <Plane className="w-8 h-8 text-teal-600 mb-6" />
                        <h4 className="font-black uppercase tracking-tighter text-lg mb-2">Flight: {itinerary.outboundFlight.airline}</h4>
                        <p className="text-teal-700 text-sm font-bold">{itinerary.outboundFlight.departureTime} — {itinerary.outboundFlight.arrivalTime}</p>
                      </div>
                      <div className="p-8 bg-indigo-50 rounded-[2rem] border border-indigo-100">
                        <Sparkles className="w-8 h-8 text-indigo-600 mb-6" />
                        <h4 className="font-black uppercase tracking-tighter text-lg mb-2">Style</h4>
                        <p className="text-indigo-700 text-sm font-bold">{prefs.pace.split(' ')[0]} Exploration Pace.</p>
                      </div>
                   </div>
                </div>
                <div className="bg-[#0f172a] p-10 rounded-[2.5rem] text-white flex flex-col justify-between">
                   <div>
                     <h3 className="text-2xl font-black uppercase italic mb-10">Trip Summary</h3>
                     <div className="space-y-6">
                        <div className="flex justify-between border-b border-white/10 pb-4">
                          <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Target</span>
                          <span className="font-black text-sm uppercase">{itinerary.destination}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-4">
                          <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Duration</span>
                          <span className="font-black text-sm uppercase">07 Cycles</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-4">
                          <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total Cost</span>
                          <span className="font-black text-sm text-teal-400 uppercase">{currencySymbol}{itinerary.totalEstimate.toLocaleString()}</span>
                        </div>
                     </div>
                   </div>
                </div>
              </div>
            )}

            {(activeTab === 'itinerary' || window.matchMedia('print').matches) && (
              <div className="max-w-4xl mx-auto space-y-16 mb-16">
                 {itinerary.days.map((day, idx) => (
                   <div key={idx} className="relative group">
                      <div className="flex flex-col md:flex-row gap-12">
                        <div className="md:w-32 shrink-0">
                          <div className="text-5xl font-black text-slate-100 group-hover:text-teal-100 transition-colors uppercase italic leading-none">{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</div>
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-2">{day.date}</div>
                        </div>
                        <div className="flex-1 space-y-8">
                           <h3 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900 border-b-4 border-slate-900 pb-2 inline-block">{day.title}</h3>
                           <div className="space-y-6">
                             {day.activities.map((act, aIdx) => (
                               <div key={aIdx} className={`p-8 rounded-[2rem] border transition-all hover:translate-x-2 ${act.isTip ? 'bg-teal-50 border-teal-100' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-100'}`}>
                                  <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                      <Clock className="w-4 h-4 text-slate-400" />
                                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{act.time}</span>
                                    </div>
                                    {act.cost > 0 && <span className="px-3 py-1 bg-white rounded-lg text-[10px] font-black border border-slate-200">{currencySymbol}{act.cost.toLocaleString()}</span>}
                                  </div>
                                  <h4 className="text-xl font-black uppercase italic mb-2">{act.title}</h4>
                                  <p className="text-slate-600 text-sm leading-relaxed font-medium mb-4">{act.description}</p>
                                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <MapPin className="w-3 h-3" /> {act.location}
                                  </div>
                               </div>
                             ))}
                           </div>
                        </div>
                      </div>
                   </div>
                 ))}
              </div>
            )}

            {(activeTab === 'dining' || window.matchMedia('print').matches) && (
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                 {itinerary.diningRecommendations.map((rec, i) => (
                   <div key={i} className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 hover:shadow-2xl transition-all group">
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-white rounded-2xl shadow-sm"><Utensils className="w-6 h-6 text-slate-900" /></div>
                        <span className="text-teal-600 font-black tracking-[0.2em] text-xs">{rec.priceLevel}</span>
                      </div>
                      <h4 className="text-2xl font-black uppercase italic mb-2">{rec.name}</h4>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">{rec.cuisine} • {rec.type}</p>
                      <p className="text-slate-600 text-sm italic font-medium">"{rec.reason}"</p>
                   </div>
                 ))}
               </div>
            )}

            {(activeTab === 'tips' || window.matchMedia('print').matches) && (
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
                <div className="bg-[#0f172a] text-white p-12 rounded-[3rem]">
                   <ShieldAlert className="w-10 h-10 text-teal-400 mb-8" />
                   <h3 className="text-3xl font-black uppercase italic mb-8 tracking-tighter">Safety Rules</h3>
                   <ul className="space-y-6">
                     {itinerary.travelTips.slice(0, 4).map((t, i) => (
                       <li key={i} className="flex gap-4 text-sm font-medium text-slate-400">
                         <div className="w-2 h-2 rounded-full bg-teal-400 mt-1.5 shrink-0"></div>
                         {t}
                       </li>
                     ))}
                   </ul>
                </div>
                <div className="bg-slate-50 p-12 rounded-[3rem] border border-slate-100">
                   <Info className="w-10 h-10 text-teal-600 mb-8" />
                   <h3 className="text-3xl font-black uppercase italic mb-8 tracking-tighter">Local Info</h3>
                   <ul className="space-y-6">
                     {itinerary.travelTips.slice(4).map((t, i) => (
                       <li key={i} className="flex gap-4 text-sm font-medium text-slate-600">
                         <div className="w-2 h-2 rounded-full bg-teal-600 mt-1.5 shrink-0"></div>
                         {t}
                       </li>
                     ))}
                   </ul>
                </div>
              </div>
            )}

            {(activeTab === 'budget' || window.matchMedia('print').matches) && (
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                 <div className="bg-slate-50 p-12 rounded-[3rem] border border-slate-100">
                    <h3 className="text-3xl font-black uppercase italic mb-10 tracking-tighter">Cost Breakdown</h3>
                    <BudgetChart data={itinerary.budgetCategories} />
                    <div className="mt-12 space-y-3">
                       {itinerary.budgetCategories.map(c => (
                         <div key={c.name} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-slate-200">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full" style={{backgroundColor: c.color}}></div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{c.name}</span>
                            </div>
                            <span className="font-black text-sm">{currencySymbol}{c.amount.toLocaleString()}</span>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="space-y-8">
                    <div className="bg-[#0f172a] text-white p-12 rounded-[3rem] shadow-2xl">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Grand Total</p>
                       <h2 className="text-7xl font-black italic tracking-tighter mb-4">{currencySymbol}{itinerary.totalEstimate.toLocaleString()}</h2>
                       <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Optimized for {prefs.travelers} people in {prefs.destination}</p>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </main>
        
        <footer className="mt-20 py-16 px-8 border-t border-slate-100 bg-slate-50 relative overflow-hidden no-print">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-500" />
                <span className="font-black text-xl tracking-tighter uppercase">AuraQuest AI</span>
              </div>
              <p className="text-slate-400 max-w-xs text-sm font-medium leading-relaxed uppercase tracking-wide">Ultra-intelligent travel curation powered by advanced neural architecture.</p>
            </div>
            
            <div className="flex flex-col md:items-end gap-6 group">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-600 mb-2">Created by Rahul Shyam</div>
              <div className="flex flex-col md:items-end">
                <h4 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase group-hover:text-teal-600 transition-colors">Rahul Shyam</h4>
                <div className="flex items-center gap-4 mt-4">
                  <a href="https://rahulshyam-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-teal-500 hover:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                    <Globe className="w-4 h-4" /> Portfolio
                  </a>
                  <a href="https://www.linkedin.com/in/rahulshyamcivil/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-indigo-500 hover:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                    <Linkedin className="w-4 h-4" /> Connect
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  };

  return (
    <div>
      {currentView === 'landing' && renderLanding()}
      {currentView === 'onboarding' && renderOnboarding()}
      {currentView === 'loading' && renderLoading()}
      {currentView === 'result' && renderResult()}
    </div>
  );
};

export default App;
