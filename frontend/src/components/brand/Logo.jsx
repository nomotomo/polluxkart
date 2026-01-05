import React from 'react';

const Logo = ({ size = 'default', showText = true, className = '' }) => {
  const sizes = {
    small: { icon: 28, text: 'text-lg' },
    default: { icon: 36, text: 'text-xl' },
    large: { icon: 48, text: 'text-2xl' },
    xlarge: { icon: 64, text: 'text-3xl' },
  };

  const { icon: iconSize, text: textSize } = sizes[size] || sizes.default;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo Icon - Star + Cart fusion */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Background shape */}
        <rect
          x="2"
          y="2"
          width="44"
          height="44"
          rx="12"
          fill="url(#logoGradient)"
        />
        
        {/* Star shape - representing Pollux star */}
        <path
          d="M24 8L26.5 18.5H37L28.5 25L31 36L24 29L17 36L19.5 25L11 18.5H21.5L24 8Z"
          fill="white"
          fillOpacity="0.9"
        />
        
        {/* Shopping cart accent */}
        <circle cx="19" cy="38" r="2.5" fill="white" fillOpacity="0.8" />
        <circle cx="29" cy="38" r="2.5" fill="white" fillOpacity="0.8" />
        
        {/* Accent sparkle */}
        <circle cx="36" cy="12" r="3" fill="url(#accentGradient)" />
        <circle cx="38" cy="10" r="1.5" fill="white" fillOpacity="0.9" />

        {/* Gradients */}
        <defs>
          <linearGradient
            id="logoGradient"
            x1="2"
            y1="2"
            x2="46"
            y2="46"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="hsl(174, 72%, 45%)" />
            <stop offset="1" stopColor="hsl(174, 72%, 35%)" />
          </linearGradient>
          <linearGradient
            id="accentGradient"
            x1="33"
            y1="9"
            x2="39"
            y2="15"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="hsl(90, 60%, 55%)" />
            <stop offset="1" stopColor="hsl(90, 60%, 45%)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Logo Text */}
      {showText && (
        <span className={`font-heading font-bold ${textSize}`}>
          <span className="text-foreground">Pollux</span>
          <span className="text-primary">Kart</span>
        </span>
      )}
    </div>
  );
};

// Simplified icon-only version for favicon/small spaces
export const LogoIcon = ({ size = 32, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect
      x="2"
      y="2"
      width="44"
      height="44"
      rx="12"
      fill="url(#logoGradientIcon)"
    />
    <path
      d="M24 8L26.5 18.5H37L28.5 25L31 36L24 29L17 36L19.5 25L11 18.5H21.5L24 8Z"
      fill="white"
      fillOpacity="0.9"
    />
    <circle cx="19" cy="38" r="2.5" fill="white" fillOpacity="0.8" />
    <circle cx="29" cy="38" r="2.5" fill="white" fillOpacity="0.8" />
    <circle cx="36" cy="12" r="3" fill="url(#accentGradientIcon)" />
    <circle cx="38" cy="10" r="1.5" fill="white" fillOpacity="0.9" />
    <defs>
      <linearGradient
        id="logoGradientIcon"
        x1="2"
        y1="2"
        x2="46"
        y2="46"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#20B2AA" />
        <stop offset="1" stopColor="#178F89" />
      </linearGradient>
      <linearGradient
        id="accentGradientIcon"
        x1="33"
        y1="9"
        x2="39"
        y2="15"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#84CC16" />
        <stop offset="1" stopColor="#65A30D" />
      </linearGradient>
    </defs>
  </svg>
);

export default Logo;
