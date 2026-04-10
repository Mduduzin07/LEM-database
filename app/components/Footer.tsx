"use client";

export default function Footer() {
  
  const messages = [
    "Welcome to LEM Ministries Database • Secure • Reliable • Modern Church Management System •",
    "2026 The year of establishment. Increasing capacity •",
    "© All rights reserved"
  ];

  
  const marqueeContent = [...messages, ...messages, ...messages];

  return (
    <footer className="w-full bg-slate-950 text-white border-t border-white/10">
      <div className="overflow-hidden py-1.5">
        <div className="w-max flex animate-marquee">
          {marqueeContent.map((message, index) => (
            <p key={index} className="text-xs content-center whitespace-nowrap px-4">
              {message}
            </p>
          ))}
        </div>
      </div>
    </footer>
  );
}