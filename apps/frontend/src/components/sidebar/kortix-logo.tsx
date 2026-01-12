interface KortixLogoProps {
  size?: number;
  variant?: 'default' | 'logomark';
  className?: string;
}

export function KortixLogo({ size = 24, variant = 'default', className = '' }: KortixLogoProps) {
  if (variant === 'logomark') {
    return (
      <div className={`font-bold text-black ${className}`} style={{ fontSize: size }}>
        Kortix
      </div>
    );
  }

  return (
    <div className={`font-bold text-black ${className}`} style={{ fontSize: size }}>
      Kortix
    </div>
  );
}
