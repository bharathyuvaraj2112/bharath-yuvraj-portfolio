import React from "react";

interface SectionHeadingProps {
  badge: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}

export function SectionHeading({
  badge,
  title,
  subtitle,
  center = true,
}: SectionHeadingProps) {
  return (
    <div className={`mb-12 ${center ? "text-center" : "text-left"}`}>
      <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-medium tracking-wide uppercase bg-zinc-900 text-zinc-200 border border-zinc-700 mb-3 shadow-xs ${center ? "mx-auto" : ""}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        {badge}
      </div>

      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-3 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}

      <div className={`mt-4 h-1 w-16 bg-white rounded-full ${center ? "mx-auto" : ""}`} />
    </div>
  );
}
