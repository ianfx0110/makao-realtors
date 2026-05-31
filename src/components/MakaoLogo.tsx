import React from "react";

interface MakaoLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  strokeColor?: string;
  className?: string;
  showBoxBg?: boolean;
}

export default function MakaoLogo({
  size = 28,
  strokeColor = "#F5A623",
  className = "",
  showBoxBg = false,
  ...props
}: MakaoLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-all duration-300 drop-shadow-sm`}
      {...props}
    >
      {showBoxBg && (
        <rect
          width="512"
          height="512"
          rx="128"
          fill="url(#makaoGreenGrad)"
          className="shadow-inner"
        />
      )}
      
      <defs>
        <linearGradient id="makaoGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE082" />
          <stop offset="50%" stopColor="#F5A623" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="makaoGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E824C" />
          <stop offset="100%" stopColor="#114B29" />
        </linearGradient>
      </defs>

      {/* Luxury enclosing thin line detailing representing safety and security */}
      <circle
        cx="256"
        cy="256"
        r="230"
        stroke="url(#makaoGoldGrad)"
        strokeWidth="12"
        strokeDasharray="16 12"
        className="opacity-40 animate-[spin_120s_linear_infinite]"
      />
      <circle
        cx="256"
        cy="256"
        r="218"
        stroke="url(#makaoGoldGrad)"
        strokeWidth="4"
        className="opacity-20"
      />

      {/* Decorative premium star details in the top corners */}
      <path
        d="M 256 50 L 260 62 L 272 66 L 260 70 L 256 82 L 252 70 L 240 66 L 252 62 Z"
        fill="url(#makaoGoldGrad)"
        className="opacity-80"
      />

      {/* 
        Integrated Monogram M & R:
        - M Starts at (115, 385) -> High (115, 125)
        - M Valleys down to (210, 290)
        - M Climbs back to (305, 125)
        - M Right-leg descends to (305, 385)
        - R bulb starts at (305, 125) and arcs gracefully to (435, 235) then pulls back to (305, 315)
        - R leg extends beautifully from (305, 315) to (425, 385)
      */}
      <path
        d="M 120 385 L 120 125 L 210 290 L 300 125 L 300 385 M 300 125 C 390 125 435 170 435 235 C 435 300 390 315 300 315 M 300 315 L 420 385"
        stroke="url(#makaoGoldGrad)"
        strokeWidth="44"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Premium overlay point to highlight interlocking perfection */}
      <circle
        cx="210"
        cy="290"
        r="10"
        fill="#FFFFFF"
        className="shadow-sm opacity-90"
      />
    </svg>
  );
}
