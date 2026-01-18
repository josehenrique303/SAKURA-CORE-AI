
import React, { useEffect, useState } from 'react';
import { Theme } from '../../types';

interface Petal {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
  swayAmplitude: number;
  swayPeriod: number;
  opacity: number;
  blur: number;
  shape: number;
  rotationX: number;
  rotationY: number;
  color: string;
}

interface PetalAnimationProps {
  theme?: Theme;
}

export const PetalAnimation: React.FC<PetalAnimationProps> = ({ theme = Theme.Dark }) => {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const isMobile = window.innerWidth < 768;
    // UI Update: Denser petals
    const maxPetals = isMobile ? 60 : 120;
    const intervalTime = isMobile ? 300 : 200;

    const initialBatch = Array.from({ length: Math.floor(maxPetals * 0.7) }).map((_, i) => createPetal(-i, true));
    setPetals(initialBatch);

    const interval = setInterval(() => {
      setPetals(prev => {
        const newPetal = createPetal(Date.now(), false);
        return [...prev.slice(-(maxPetals - 1)), newPetal];
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [theme]);

  function createPetal(id: number, isInitial: boolean): Petal {
    const isDark = theme === Theme.Dark;
    
    // UI Update: Natural colors with soft variants
    const lightColors = ['#FB7185', '#F9A8D4', '#FDA4AF', '#FBCFE8'];
    const darkColors = ['#FDA4AF', '#F472B6', '#EC4899', '#DB2777'];
    
    const color = isDark 
      ? darkColors[Math.floor(Math.random() * darkColors.length)]
      : lightColors[Math.floor(Math.random() * lightColors.length)];

    return {
      id,
      left: Math.random() * 120 - 10,
      size: Math.random() * 6 + 4,
      duration: isDark ? (Math.random() * 25 + 18) : (Math.random() * 18 + 14),
      delay: isInitial ? Math.random() * -30 : 0,
      rotation: Math.random() * 360,
      rotationX: Math.random() * 360,
      rotationY: Math.random() * 360,
      swayAmplitude: Math.random() * 100 + 50,
      swayPeriod: Math.random() * 8 + 6,
      // UI Update: Subtle opacity for "Midnight Sakura" feel
      opacity: isDark ? (Math.random() * 0.3 + 0.4) : (Math.random() * 0.2 + 0.3),
      blur: Math.random() > 0.8 ? 1 : 0,
      shape: Math.floor(Math.random() * 4),
      color
    };
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden bg-background transition-colors duration-1000">
      {petals.map(petal => (
        <div
          key={petal.id}
          className="absolute will-change-transform"
          style={{
            left: `${petal.left}%`,
            top: '-10%',
            opacity: petal.opacity,
            filter: theme === Theme.Dark 
              ? `drop-shadow(0 0 10px hsla(330, 81%, 60%, 0.5)) blur(${petal.blur}px)` 
              : `drop-shadow(0 2px 4px hsla(330, 81%, 60%, 0.2)) blur(${petal.blur}px)`,
            animation: `
              fall-sakura-v3 ${petal.duration}s linear infinite,
              sway-sakura-v3 ${petal.swayPeriod}s ease-in-out infinite alternate
            `,
            animationDelay: `${petal.delay}s`,
          }}
        >
          <div
            style={{
              width: `${petal.size}px`,
              height: `${petal.size * 1.6}px`,
              backgroundColor: petal.color,
              borderRadius: petal.shape === 0 
                ? '50% 50% 50% 50% / 80% 80% 20% 20%' 
                : petal.shape === 1 
                ? '100% 0% 100% 0% / 100% 0% 100% 0%' 
                : petal.shape === 2
                ? '60% 40% 50% 50% / 100% 100% 0% 0%'
                : '100% 50% 100% 50% / 50% 100% 50% 100%',
              transform: `rotate(${petal.rotation}deg) rotateX(${petal.rotationX}deg) rotateY(${petal.rotationY}deg)`,
              animation: `flutter-sakura-v3 ${petal.duration * 0.4}s ease-in-out infinite`,
            }}
          />
        </div>
      ))}
      <style>{`
        @keyframes fall-sakura-v3 {
          0% { transform: translateY(-5vh) rotate(0deg); }
          100% { transform: translateY(110vh) rotate(360deg); }
        }
        @keyframes sway-sakura-v3 {
          0% { margin-left: -60px; }
          100% { margin-left: 60px; }
        }
        @keyframes flutter-sakura-v3 {
          0%, 100% { transform: rotate3d(1, 1, 1, 0deg) scale(1); }
          50% { transform: rotate3d(0.5, 1, 0.5, 180deg) scale(0.9); }
        }
      `}</style>
    </div>
  );
};
