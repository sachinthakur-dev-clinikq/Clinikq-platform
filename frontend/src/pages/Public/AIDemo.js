import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/public/PublicNavbar';
import PublicFooter from '../../components/public/PublicFooter';
import { 
  Phone, PhoneOff, Mic, MicOff, Bot, User, 
  CheckCircle, Clock, Calendar, MessageSquare, 
  ArrowRight, Play, RefreshCw
} from 'lucide-react';

const AIDemo = () => {
  const [demoState, setDemoState] = useState('idle'); // idle, ringing, active, ended
  const [currentScenario, setCurrentScenario] = useState(0);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const chatRef = useRef(null);

  const scenarios = [
    {
      title: 'New Appointment Booking',
      description: 'Patient calls to book a new appointment',
      conversation: [
        { speaker: 'ai', text: 'Good morning! Thank you for calling HealthCare Plus. I\'m your AI assistant. How may I help you today?' },
        { speaker: 'patient', text: 'Hi, I\'d like to book an appointment with Dr. Sharma.' },
        { speaker: 'ai', text: 'Of course! I\'d be happy to help you book with Dr. Sharma. May I have your name please?' },
        { speaker: 'patient', text: 'My name is Rajesh Kumar.' },
        { speaker: 'ai', text: 'Thank you, Mr. Kumar. I can see you\'ve visited us before. Dr. Sharma has the following slots available this week:\n\n• Tomorrow (Tuesday) - 10:30 AM, 2:00 PM\n• Wednesday - 11:00 AM, 4:30 PM\n• Thursday - 9:00 AM\n\nWhich would work best for you?' },
        { speaker: 'patient', text: 'Tomorrow at 2 PM works for me.' },
        { speaker: 'ai', text: 'Your appointment with Dr. Sharma is confirmed for tomorrow, Tuesday, at 2:00 PM. You\'ll receive a confirmation SMS shortly with all the details.\n\nIs there anything else I can help you with?' },
        { speaker: 'patient', text: 'No, that\'s all. Thank you!' },
        { speaker: 'ai', text: 'You\'re welcome, Mr. Kumar! We look forward to seeing you tomorrow. Have a great day!' },
      ]
    },
    {
      title: 'Appointment Rescheduling',
      description: 'Patient needs to change their existing appointment',
      conversation: [
        { speaker: 'ai', text: 'Good afternoon! HealthCare Plus AI assistant here. How can I help you?' },
        { speaker: 'patient', text: 'I need to reschedule my appointment. I have one tomorrow but something came up.' },
        { speaker: 'ai', text: 'I understand. Let me help you reschedule. Can you confirm your registered phone number or name?' },
        { speaker: 'patient', text: 'It\'s Meera Patel, phone 98765 43210.' },
        { speaker: 'ai', text: 'Thank you, Ms. Patel. I found your appointment with Dr. Singh tomorrow at 11:00 AM. When would you like to reschedule to?\n\nDr. Singh has availability on:\n• Friday - 10:00 AM, 3:00 PM\n• Saturday - 11:30 AM' },
        { speaker: 'patient', text: 'Saturday 11:30 AM please.' },
        { speaker: 'ai', text: 'Done! Your appointment has been rescheduled to Saturday at 11:30 AM with Dr. Singh. I\'ve sent you a confirmation SMS.\n\nWould you like me to set a reminder for Saturday morning?' },
        { speaker: 'patient', text: 'Yes, please. That would be helpful.' },
        { speaker: 'ai', text: 'I\'ve set a reminder for Saturday at 9:00 AM. You\'ll receive a WhatsApp message. Is there anything else?' },
      ]
    },
    {
      title: 'General Inquiry',
      description: 'Patient asks about clinic timings and services',
      conversation: [
        { speaker: 'ai', text: 'Hello! Welcome to HealthCare Plus. I\'m your AI assistant. What can I help you with today?' },
        { speaker: 'patient', text: 'What are your clinic timings? And do you have a dermatologist?' },
        { speaker: 'ai', text: 'Great questions! Here are the details:\n\n📍 Clinic Hours:\n• Monday to Saturday: 9:00 AM - 8:00 PM\n• Sunday: 10:00 AM - 2:00 PM\n\n👨‍⚕️ Yes, we have Dr. Anita Desai, our Dermatologist, available on:\n• Monday, Wednesday, Friday: 4:00 PM - 7:00 PM\n• Saturday: 10:00 AM - 1:00 PM\n\nWould you like to book an appointment with Dr. Desai?' },
        { speaker: 'patient', text: 'What does she charge for consultation?' },
        { speaker: 'ai', text: 'Dr. Desai\'s consultation fee is ₹800 for new patients and ₹500 for follow-ups within 15 days. \n\nWe accept cash, cards, and UPI payments. Should I book a slot for you?' },
        { speaker: 'patient', text: 'Let me check and call back. Thanks!' },
        { speaker: 'ai', text: 'No problem! Feel free to call back anytime, or you can also book directly through our WhatsApp. The number is 98765 43210. Have a wonderful day!' },
      ]
    },
  ];

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const startDemo = () => {
    setDemoState('ringing');
    setMessages([]);
    setTimeout(() => {
      setDemoState('active');
      playConversation();
    }, 2000);
  };

  const playConversation = () => {
    const conversation = scenarios[currentScenario].conversation;
    let index = 0;

    const playNext = () => {
      if (index < conversation.length) {
        setTyping(true);
        setTimeout(() => {
          setTyping(false);
          setMessages(prev => [...prev, conversation[index]]);
          index++;
          setTimeout(playNext, 1500);
        }, conversation[index].speaker === 'ai' ? 1500 : 800);
      } else {
        setTimeout(() => setDemoState('ended'), 2000);
      }
    };

    playNext();
  };

  const resetDemo = () => {
    setDemoState('idle');
    setMessages([]);
    setTyping(false);
  };

  const changeScenario = (index) => {
    setCurrentScenario(index);
    resetDemo();
  };

  const features = [
    { icon: Clock, title: '24/7 Availability', desc: 'Never miss a patient call, even after hours' },
    { icon: MessageSquare, title: 'Multi-language', desc: 'Handles Hindi, English, and regional languages' },
    { icon: Calendar, title: 'Smart Scheduling', desc: 'Books appointments directly into your system' },
    { icon: CheckCircle, title: 'Instant Confirmations', desc: 'Sends SMS/WhatsApp confirmations automatically' },
  ];

  return (
    <div className="public-page">
      <PublicNavbar />
      
      <section className="page-hero ai-demo-hero">
        <div className="page-hero-content">
          <span className="section-badge purple">AI Demo</span>
          <h1>Experience the AI Receptionist</h1>
          <p>See how our AI handles real patient calls — booking appointments, answering queries, and managing schedules.</p>
        </div>
      </section>

      <section className="ai-demo-section">
        <div className="section-container">
          <div className="demo-layout">
            <div className="demo-controls">
              <h3>Select a Scenario</h3>
              <div className="scenario-list">
                {scenarios.map((s, i) => (
                  <button
                    key={i}
                    className={`scenario-btn ${currentScenario === i ? 'active' : ''}`}
                    onClick={() => changeScenario(i)}
                    disabled={demoState === 'active'}
                  >
                    <span className="scenario-num">{i + 1}</span>
                    <div>
                      <strong>{s.title}</strong>
                      <span>{s.description}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="demo-features">
                <h4>AI Capabilities</h4>
                {features.map((f, i) => (
                  <div key={i} className="demo-feature">
                    <f.icon size={18} />
                    <div>
                      <strong>{f.title}</strong>
                      <span>{f.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="demo-phone">
              <div className="phone-frame">
                <div className="phone-notch"></div>
                <div className="phone-screen">
                  {demoState === 'idle' && (
                    <div className="phone-idle">
                      <div className="caller-info">
                        <Bot size={48} />
                        <h3>CliniKQ AI</h3>
                        <p>Tap to simulate a patient call</p>
                      </div>
                      <button className="call-btn answer" onClick={startDemo}>
                        <Phone size={28} />
                        <span>Start Demo Call</span>
                      </button>
                    </div>
                  )}

                  {demoState === 'ringing' && (
                    <div className="phone-ringing">
                      <div className="caller-info pulsing">
                        <User size={48} />
                        <h3>Incoming Call</h3>
                        <p>Patient calling...</p>
                      </div>
                      <div className="ringing-animation">
                        <span></span><span></span><span></span>
                      </div>
                    </div>
                  )}

                  {(demoState === 'active' || demoState === 'ended') && (
                    <div className="phone-active">
                      <div className="call-header">
                        <div className="call-status">
                          <span className="status-dot"></span>
                          {demoState === 'active' ? 'AI Handling Call' : 'Call Ended'}
                        </div>
                        <span className="call-duration">
                          {scenarios[currentScenario].title}
                        </span>
                      </div>

                      <div className="chat-container" ref={chatRef}>
                        {messages.map((msg, i) => (
                          <div key={i} className={`demo-message ${msg.speaker}`}>
                            <div className="message-avatar">
                              {msg.speaker === 'ai' ? <Bot size={16} /> : <User size={16} />}
                            </div>
                            <div className="message-bubble">
                              {msg.text.split('\n').map((line, j) => (
                                <React.Fragment key={j}>
                                  {line}
                                  {j < msg.text.split('\n').length - 1 && <br />}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        ))}
                        {typing && (
                          <div className="demo-message ai">
                            <div className="message-avatar"><Bot size={16} /></div>
                            <div className="message-bubble typing">
                              <span></span><span></span><span></span>
                            </div>
                          </div>
                        )}
                      </div>

                      {demoState === 'ended' && (
                        <div className="call-ended-actions">
                          <button className="reset-btn" onClick={resetDemo}>
                            <RefreshCw size={18} /> Try Another Scenario
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="phone-home-indicator"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Automate Your Front Desk?</h2>
          <p>The AI Receptionist can handle 80% of patient calls automatically. Book a demo to see it live.</p>
          <Link to="/contact" className="btn-white-large">
            Book Live Demo <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default AIDemo;
