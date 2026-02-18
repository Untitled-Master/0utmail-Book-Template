import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen,
  CalendarClock,
  PartyPopper,
  Loader2,
  Mail,
  Send,
  Terminal,
  Image as ImageIcon,
  Sparkles,
  Server,
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// --- CONFIGURATION ---
const API_BASE_URL = "https://0bookback.vercel.app/api/notify";

// --- REUSABLE COMPONENTS ---

const InputField = ({ label, value, onChange, placeholder, type = "text", icon: Icon }) => (
  <div className="mb-3">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm pl-4 pr-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
      />
      {Icon && (
        <div className="absolute right-3 top-2.5 text-slate-400 pointer-events-none">
          <Icon size={16} />
        </div>
      )}
    </div>
  </div>
);

const TextAreaField = ({ label, value, onChange, placeholder }) => (
  <div className="mb-3">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">
      {label}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows="3"
      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 resize-none"
    />
  </div>
);

const ActionCard = ({ title, endpoint, color, icon: Icon, description, loading, onSend, onFill, children }) => (
  <div className="flex flex-col bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden h-full">
    {/* Header */}
    <div className="p-5 border-b border-slate-100 bg-slate-50/50">
      <div className="flex justify-between items-start">
        <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center shadow-sm`}>
          <Icon size={20} className="text-white" />
        </div>
        <div className="flex gap-2">
           <button
            onClick={onFill}
            className="text-xs bg-white border border-slate-200 hover:border-indigo-300 text-slate-500 hover:text-indigo-600 px-2 py-1 rounded-md transition-colors flex items-center gap-1"
            title="Auto-fill with dummy data"
           >
             <Sparkles size={12} /> Fill
           </button>
           <div className="text-[10px] font-mono bg-slate-200 text-slate-600 px-2 py-1 rounded-md">
             POST {endpoint}
           </div>
        </div>
      </div>
      <h3 className="text-base font-bold text-slate-800 mt-3">{title}</h3>
      <p className="text-xs text-slate-500 mt-1">{description}</p>
    </div>

    {/* Body */}
    <div className="p-5 flex-1 flex flex-col">
      <div className="flex-1 space-y-1">
        {children}
      </div>

      <button
        onClick={onSend}
        disabled={loading}
        className={`mt-6 w-full ${loading ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 hover:bg-indigo-600 text-white'} text-sm font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95`}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={16} />
            <span>Sending...</span>
          </>
        ) : (
          <>
            <span>Send Request</span>
            <Send size={16} />
          </>
        )}
      </button>
    </div>
  </div>
);

// --- CONSOLE COMPONENT ---
const ConsoleLog = ({ logs, onClear }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col h-80 mt-8">
      <div className="bg-slate-950 px-4 py-2 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2 text-slate-400">
          <Terminal size={16} />
          <span className="text-xs font-mono font-bold tracking-wider">SYSTEM LOGS</span>
        </div>
        <button onClick={onClear} className="text-slate-500 hover:text-slate-300 transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-3">
        {logs.length === 0 && (
          <div className="text-slate-600 italic">Waiting for requests...</div>
        )}
        {logs.map((log, i) => (
          <div key={i} className="border-l-2 border-slate-700 pl-3">
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-1.5 rounded text-[10px] font-bold ${log.type === 'req' ? 'bg-blue-900 text-blue-300' : log.status === 200 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                {log.type === 'req' ? 'REQUEST' : 'RESPONSE'}
              </span>
              <span className="text-slate-500">{log.timestamp}</span>
            </div>
            <div className="text-slate-300">
              {log.message}
            </div>
            {log.payload && (
              <pre className="mt-1 text-[10px] text-slate-500 overflow-x-auto">
                {JSON.stringify(log.payload, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MAIN APP ---

export default function App() {
  // --- STATE ---
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(null);
  const [logs, setLogs] = useState([]);

  // Form States
  const [newBook, setNewBook] = useState({ bookName: '', imageUrl: '' });
  const [returnBook, setReturnBook] = useState({ bookName: '', date: '', imageUrl: '' });
  const [eventData, setEventData] = useState({ eventName: '', details: '', imageUrl: '' });

  // --- LOGIC ---

  const addLog = (type, message, payload = null, status = null) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { type, message, payload, status, timestamp }]);
  };

  const handleFill = (type) => {
    if (type === 'new') {
      setNewBook({
        bookName: 'The Design of Everyday Things',
        imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800'
      });
    } else if (type === 'return') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setReturnBook({
        bookName: 'Clean Code',
        date: tomorrow.toISOString().split('T')[0],
        imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800'
      });
    } else if (type === 'event') {
      setEventData({
        eventName: 'React Developers Meetup',
        details: 'Join us for pizza and code talk at the main hall. Bring your laptops!',
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800'
      });
    }
  };

  const sendRequest = async (actionId, endpoint, payload) => {
    if (!email || !email.includes('@')) {
      alert("Please enter a valid target email at the top.");
      return;
    }

    const fullPayload = { email, ...payload };
    const url = `${API_BASE_URL}/${endpoint}`;

    setLoading(actionId);
    addLog('req', `POST ${url}`, fullPayload);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullPayload),
      });

      const data = await response.json();

      addLog('res', response.ok ? 'Email Dispatched Successfully' : `Error: ${data.error || 'Unknown'}`, data, response.status);

      if (response.ok) {
        // Optional: Clear form on success
        // if (actionId === 'new') setNewBook({ bookName: '', imageUrl: '' });
      }

    } catch (err) {
      addLog('res', `Network Error: ${err.message}`, null, 500);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-600 bg-slate-100 pb-20">

      {/* NAVBAR */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-indigo-200 shadow-lg">
              <Server size={20} />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-800 tracking-tight block leading-none">Notify<span className="text-indigo-600">API</span></span>
              <span className="text-[10px] text-slate-400 font-mono">DEV PLAYGROUND</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-xs text-slate-400 font-mono hidden md:block">
               Server: <span className="text-green-600">https://0bookback.vercel.app (Yes hostable on vercel)</span>
             </div>
             <a href="https://docs.0utmail.me/" target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
               API Docs
             </a>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 md:p-8">

        {/* HEADER SECTION */}
        <div className="mb-8">
           <h1 className="text-2xl font-bold text-slate-900">Email Notification Dispatcher</h1>
           <p className="text-slate-500">Test your backend email templates and logic directly from this dashboard.</p>
        </div>

        {/* GLOBAL SETTINGS */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row items-center gap-6">
          <div className="p-3 bg-indigo-50 rounded-full text-indigo-600 shrink-0">
            <Mail size={24} />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-bold text-slate-700 mb-1">Recipient Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email to receive tests..."
              className="w-full text-lg bg-transparent border-b-2 border-slate-200 py-2 focus:border-indigo-600 outline-none transition-colors placeholder:text-slate-300 text-slate-800 font-medium"
            />
          </div>
          <div className="hidden md:block w-px h-12 bg-slate-100"></div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
             {email && email.includes('@') ? (
               <div className="flex items-center gap-1 text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                 <CheckCircle size={14} /> Ready to send
               </div>
             ) : (
                <div className="flex items-center gap-1 text-amber-600 font-medium bg-amber-50 px-3 py-1 rounded-full">
                 <AlertCircle size={14} /> Email required
               </div>
             )}
          </div>
        </div>

        {/* ACTION GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* 1. NEW BOOK */}
          <ActionCard
            title="New Arrival Notification"
            endpoint="/new-book"
            icon={BookOpen}
            color="bg-blue-500"
            description="Trigger the 'New Book Added' email template."
            loading={loading === 'new'}
            onFill={() => handleFill('new')}
            onSend={() => sendRequest('new', 'new-book', newBook)}
          >
            <InputField
              label="Book Title"
              placeholder="e.g. The Great Gatsby"
              value={newBook.bookName}
              onChange={(val) => setNewBook({...newBook, bookName: val})}
            />
            <InputField
              label="Cover Image URL (Optional)"
              placeholder="https://..."
              value={newBook.imageUrl}
              onChange={(val) => setNewBook({...newBook, imageUrl: val})}
              icon={ImageIcon}
            />
          </ActionCard>

          {/* 2. RETURN REMINDER */}
          <ActionCard
            title="Return Reminder"
            endpoint="/return"
            icon={CalendarClock}
            color="bg-amber-500"
            description="Trigger the 'Overdue/Return' warning email."
            loading={loading === 'return'}
            onFill={() => handleFill('return')}
            onSend={() => sendRequest('return', 'return', returnBook)}
          >
            <InputField
              label="Book Title"
              placeholder="e.g. 1984"
              value={returnBook.bookName}
              onChange={(val) => setReturnBook({...returnBook, bookName: val})}
            />
            <InputField
              label="Due Date"
              type="date"
              value={returnBook.date}
              onChange={(val) => setReturnBook({...returnBook, date: val})}
            />
             <InputField
              label="Cover Image URL (Optional)"
              placeholder="https://..."
              value={returnBook.imageUrl}
              onChange={(val) => setReturnBook({...returnBook, imageUrl: val})}
              icon={ImageIcon}
            />
          </ActionCard>

          {/* 3. EVENT INVITE */}
          <ActionCard
            title="Event Invitation"
            endpoint="/event"
            icon={PartyPopper}
            color="bg-rose-500"
            description="Trigger the 'Library Event' invitation email."
            loading={loading === 'event'}
            onFill={() => handleFill('event')}
            onSend={() => sendRequest('event', 'event', eventData)}
          >
            <InputField
              label="Event Name"
              placeholder="e.g. Summer Reading Club"
              value={eventData.eventName}
              onChange={(val) => setEventData({...eventData, eventName: val})}
            />
            <InputField
              label="Banner Image URL (Optional)"
              placeholder="https://..."
              value={eventData.imageUrl}
              onChange={(val) => setEventData({...eventData, imageUrl: val})}
              icon={ImageIcon}
            />
            <TextAreaField
              label="Event Details"
              placeholder="Time, location, and description..."
              value={eventData.details}
              onChange={(val) => setEventData({...eventData, details: val})}
            />
          </ActionCard>

        </div>

        {/* CONSOLE LOGS */}
        <ConsoleLog logs={logs} onClear={() => setLogs([])} />

      </div>
    </div>
  );
}
