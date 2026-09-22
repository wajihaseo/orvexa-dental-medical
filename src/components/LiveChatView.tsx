import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  AlertCircle,
  Clock,
  PhoneCall,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { ChatMessage, Doctor } from '../types';
import { api } from '../services/api';

interface LiveChatViewProps {
  doctors: Doctor[];
  initialDoctorId?: string;
  onNavigateBooking: (serviceName?: string) => void;
}

export const LiveChatView: React.FC<LiveChatViewProps> = ({
  doctors,
  initialDoctorId,
  onNavigateBooking
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(initialDoctorId || doctors[0]?.id || 'doc-1');
  const [isUrgent, setIsUrgent] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeDoctor = doctors.find(d => d.id === selectedDoctorId) || doctors[0];

  useEffect(() => {
    loadChatMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatMessages = async () => {
    const data = await api.getChatMessages();
    setMessages(data);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isSending) return;

    setInputValue('');
    setIsSending(true);

    // Optimistic patient bubble
    const optimisticMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      sender: 'patient',
      senderName: 'You (Patient)',
      doctorId: selectedDoctorId,
      message: text,
      timestamp: new Date().toISOString(),
      isRead: false,
      isUrgent
    };
    setMessages(prev => [...prev, optimisticMsg]);

    const res = await api.sendChatMessage({
      message: text,
      senderName: 'You (Patient)',
      doctorId: selectedDoctorId,
      isUrgent
    });

    if (res.success && res.doctorReply) {
      setMessages(prev => [...prev.filter(m => m.id !== optimisticMsg.id), res.patientMessage!, res.doctorReply!]);
    } else {
      await loadChatMessages();
    }

    setIsSending(false);
    setIsUrgent(false);
  };

  const quickTriagePrompts = [
    'Am I a candidate for All-on-4 dental implants?',
    'What is included in the Free 3D CT Scan consultation?',
    'I have severe sudden toothache and gum swelling',
    'Do you offer twilight IV sedation for dental surgery?',
    'How do the 0% APR financing payment plans work?'
  ];

  return (
    <section className="py-10 bg-slate-50 min-h-screen" id="live-chat">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Real-Time Clinical Consultation</span>
            </div>
            <h2 className="font-heading text-3xl font-extrabold text-slate-900">
              Live Surgical Consultation & Triage
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Direct chat with Orvexa surgeons and care coordinators. Ask surgical questions, verify candidacy, or receive immediate emergency dental guidance.
            </p>
          </div>

          {/* Attending Doctor selector */}
          <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-400 font-medium pl-1">Consulting with:</span>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none"
            >
              {doctors.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden flex flex-col h-[600px]">
          {/* Chat Room Top Bar */}
          <div className="p-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={activeDoctor.avatar}
                  alt={activeDoctor.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-teal-400"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950"></span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                  {activeDoctor.name}
                  <span className="text-[10px] font-semibold text-teal-300">Online & Verified</span>
                </h4>
                <p className="text-[11px] text-slate-400">{activeDoctor.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateBooking(`Consultation with ${activeDoctor.name}`)}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow transition"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book This Doctor</span>
              </button>
              <a
                href="tel:5559113368"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-400"
                title="Call Emergency Hotline"
              >
                <PhoneCall className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((msg) => {
              const isPatient = msg.sender === 'patient';
              const isSystem = msg.sender === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 text-center max-w-xl mx-auto space-y-1">
                    <div className="flex items-center justify-center gap-1 font-bold text-teal-800">
                      <ShieldCheck className="w-4 h-4" />
                      <span>{msg.senderName}</span>
                    </div>
                    <p className="leading-relaxed">{msg.message}</p>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 max-w-xl ${
                    isPatient ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    isPatient ? 'bg-slate-900 text-white' : 'bg-teal-700 text-white'
                  }`}>
                    {isPatient ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1">
                    <div className={`flex items-center gap-2 text-[10px] text-slate-400 ${
                      isPatient ? 'justify-end' : ''
                    }`}>
                      <span className="font-semibold text-slate-600">{msg.senderName}</span>
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {msg.isUrgent && (
                        <span className="px-1.5 py-0.2 rounded bg-rose-600 text-white font-bold text-[9px]">
                          URGENT
                        </span>
                      )}
                    </div>

                    <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isPatient
                        ? 'bg-slate-900 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}>
                      {msg.message}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Triage Prompts Bar */}
          <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-bold text-slate-400 shrink-0 pl-2">Quick Inquiries:</span>
            {quickTriagePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-600 text-[11px] font-medium border border-slate-200 transition shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3.5 bg-white border-t border-slate-200 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsUrgent(!isUrgent)}
              className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1 shrink-0 ${
                isUrgent
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
              title="Toggle Urgent Dental Emergency Flag"
            >
              <AlertCircle className="w-4 h-4" />
              <span className="hidden sm:inline">{isUrgent ? 'Urgent: ON' : 'Urgent'}</span>
            </button>

            <input
              type="text"
              placeholder={`Ask Dr. ${activeDoctor.name.split(' ')[1] || 'Sofia'} anything about implants, recovery, or pain...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />

            <button
              type="button"
              disabled={isSending || !inputValue.trim()}
              onClick={() => handleSendMessage()}
              className="p-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition disabled:opacity-40 shadow-xs flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
