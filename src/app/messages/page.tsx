"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

const MOCK_CONTACTS_FALLBACK = [
  { id: "mock-1", name: "Alex Johnson", location: "New York, USA", avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150" },
  { id: "mock-2", name: "Mariam Ali", location: "Cairo, Egypt", avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150" },
  { id: "mock-4", name: "Emma Dupont", location: "Paris, France", avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" }
];

function ChatInterface() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetChatId = searchParams.get("chat");

  const [chats, setChats] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [liveMessages, setLiveMessages] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeChatPage = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }
      setCurrentUserId(user.id);

      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, name, avatar_url, location")
        .neq("id", user.id);

      let combinedProfiles = [...MOCK_CONTACTS_FALLBACK];
      if (profiles && !error) {
        const realIds = new Set(profiles.map(p => p.id));
        combinedProfiles = [...profiles, ...MOCK_CONTACTS_FALLBACK.filter(m => !realIds.has(m.id))];
      }
      
      setChats(combinedProfiles);
        
      if (targetChatId) {
        const matchingContact = combinedProfiles.find((p) => p.id === targetChatId);
        if (matchingContact) {
          setActiveChat(matchingContact);
        } else {
          setActiveChat(combinedProfiles[0]);
        }
      } else if (combinedProfiles.length > 0) {
        setActiveChat(combinedProfiles[0]);
      }
      setLoading(false);
    };

    initializeChatPage();
  }, [router, targetChatId]);

  useEffect(() => {
    if (!activeChat || !currentUserId) return;

    if (activeChat.id.startsWith("mock-")) {
      setLiveMessages([
        { id: "m1", sender_id: activeChat.id, content: `Hey there! Thanks for reaching out about my skill listings. How can I help you?` }
      ]);
      return;
    }

    const fetchChatHistory = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${activeChat.id}),and(sender_id.eq.${activeChat.id},receiver_id.eq.${currentUserId})`)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setLiveMessages(data);
      }
    };

    fetchChatHistory();
  }, [activeChat, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [liveMessages]);

  useEffect(() => {
    if (!activeChat || !currentUserId || activeChat.id.startsWith("mock-")) return;

    const channel = supabase
      .channel(`realtime-messages-${activeChat.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new;
          const isRelevant =
            (msg.sender_id === currentUserId && msg.receiver_id === activeChat.id) ||
            (msg.sender_id === activeChat.id && msg.receiver_id === currentUserId);

          if (isRelevant) {
            setLiveMessages((prev) => {
              if (prev.some((existing) => existing.id === msg.id)) return prev;
              return [...prev, msg];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeChat, currentUserId]);

  const handleSendMessage = async () => {
    if (!message.trim() || !activeChat || !currentUserId) return;

    const currentText = message.trim();
    setMessage("");

    if (activeChat.id.startsWith("mock-")) {
      setLiveMessages((prev) => [
        ...prev,
        { id: Math.random().toString(), sender_id: currentUserId, content: currentText }
      ]);
      
      setTimeout(() => {
        setLiveMessages((prev) => [
          ...prev,
          { id: Math.random().toString(), sender_id: activeChat.id, content: "Sounds great! Let's arrange a time to trade skills." }
        ]);
      }, 1000);
      return;
    }

    const { error } = await supabase
      .from("messages")
      .insert([
        {
          sender_id: currentUserId,
          receiver_id: activeChat.id,
          content: currentText,
        },
      ]);

    if (error) {
      console.error("Error dispatching real-time event:", error.message);
      setMessage(currentText); 
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-2">
        <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-400 font-bold tracking-wider">Syncing Secure Channels...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row w-full">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 fixed h-full p-5 z-20">
        <div className="mb-8">
          <button onClick={() => router.push("/feed")} className="text-xl font-black text-emerald-700 tracking-tight focus:outline-none">
            📌 LocalLink
          </button>
        </div>
        <nav className="space-y-1">
          <button onClick={() => router.push("/feed")} className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">🏠 Home Feed</button>
          <button className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold bg-emerald-50 text-emerald-700">💬 Messages</button>
          <button onClick={() => router.push("/feed")} className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">👤 My Profile</button>
        </nav>
      </aside>

      {/* CORE WORKSPACE */}
      <main className="flex-1 md:ml-64 flex h-screen overflow-hidden relative">
        
        {/* CONTACT SELECTION PANEL */}
        <div className={`w-full md:w-80 bg-white border-r border-slate-200 flex flex-col ${activeChat ? "hidden md:flex" : "flex"}`}>
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h1 className="text-lg font-black text-slate-900 tracking-tight">Active Contacts</h1>
            <button onClick={() => router.push("/feed")} className="md:hidden text-xs font-bold text-emerald-600">← Exit</button>
          </div>
          
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={`w-full p-4 flex items-center gap-3 transition-colors text-left focus:outline-none ${activeChat?.id === chat.id ? "bg-slate-50" : "hover:bg-slate-50/50"}`}
              >
                <img src={chat.avatar_url} alt="" className="w-11 h-11 rounded-full object-cover border border-slate-100" />
                <div className="overflow-hidden flex-1">
                  <span className="font-bold text-sm text-slate-800 block truncate">{chat.name}</span>
                  <span className="text-xs text-slate-400 block truncate">📍 {chat.location}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* MESSAGING STREAM PANELS */}
        {activeChat ? (
          <div className="flex-1 flex flex-col bg-slate-50">
            
            <div className="bg-white p-4 border-b border-slate-200 flex items-center gap-3 z-10">
              <button onClick={() => setActiveChat(null)} className="md:hidden p-1 text-slate-500 font-bold text-lg mr-1 focus:outline-none">
                ←
              </button>
              <img src={activeChat.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover border" />
              <div>
                <h2 className="font-bold text-sm text-slate-800 leading-tight">{activeChat.name}</h2>
                <span className="text-[10px] text-emerald-600 font-bold tracking-wide block mt-0.5">🟢 Online Exchange Tunnel</span>
              </div>
            </div>

            <div className="flex-1 p-4 md:p-6 overflow-y-auto flex flex-col gap-3 bg-slate-100/40">
              {liveMessages.map((msg, index) => {
                const isMe = msg.sender_id === currentUserId;
                return (
                  <div 
                    key={msg.id || index} 
                    className={`max-w-[80%] md:max-w-md p-3 rounded-2xl text-xs md:text-sm shadow-sm font-medium ${
                      isMe 
                        ? "self-end bg-slate-900 text-white rounded-tr-none" 
                        : "self-start bg-white text-slate-800 rounded-tl-none border border-slate-200"
                    }`}
                  >
                    {msg.content}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-slate-200">
              <div className="flex gap-2 max-w-4xl mx-auto">
                <input 
                  type="text" 
                  placeholder={`Send message to ${activeChat.name}...`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} 
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs md:text-sm focus:outline-none focus:border-slate-400 focus:bg-white text-black font-medium transition-all"
                />
                <button 
                  onClick={handleSendMessage} 
                  className="bg-emerald-600 text-white px-5 py-2 rounded-xl text-xs md:text-sm font-bold hover:bg-emerald-700 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="hidden md:flex flex-1 flex-col items-center justify-center text-slate-400 bg-slate-50">
            <span className="text-2xl mb-1">💬</span>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Select a connection to begin talking</p>
          </div>
        )}
      </main>
    </div>
  );
}

// Fixed Default Page Export Container
export default function MessagesPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-400 font-bold tracking-wider">Loading Conversation Stream...</span>
        </div>
      }
    >
      <ChatInterface />
    </Suspense>
  );
}