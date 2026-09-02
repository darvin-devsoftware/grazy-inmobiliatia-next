import React from 'react';
import { brand } from '../../config/site';

interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light' | 'greige';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  layout?: 'horizontal' | 'vertical';
}

/**
 * Logo oficial de Greizy González.
 * El isotipo es el archivo real de la marca (PNG con transparencia);
 * el texto se compone al lado para poder escalarlo sin perder nitidez.
 */
export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'dark',
  size = 'md',
  showText = true,
  layout = 'horizontal'
}) => {
  const isLight = variant === 'light';
  const textColor = isLight ? '#FFFFFF' : brand.colors.deep;
  const subtextColor = isLight ? '#B0D6F0' : brand.colors.muted;

  const dimensions = {
    sm: { icon: 34, textMain: 'text-sm', textSub: 'text-[7px]' },
    md: { icon: 48, textMain: 'text-lg', textSub: 'text-[8px]' },
    lg: { icon: 76, textMain: 'text-2xl', textSub: 'text-[10px]' }
  }[size];

  return (
    <div
      className={`inline-flex ${layout === 'vertical' ? 'flex-col items-center text-center gap-2' : 'items-center gap-2.5'} select-none ${className}`}
    >
      <img
        src={isLight ? brand.logo.markLight : brand.logo.mark}
        alt={brand.name}
        width={Math.round(dimensions.icon * brand.logo.markRatio)}
        height={dimensions.icon}
        style={{ height: dimensions.icon, width: 'auto' }}
        className="flex-shrink-0 transition-transform duration-300 hover:scale-105"
      />

      {showText && (
        <div className={`flex flex-col justify-center leading-none ${layout === 'vertical' ? 'items-center' : ''}`}>
          <span
            className={`font-poppins font-semibold tracking-tight ${dimensions.textMain}`}
            style={{ color: textColor }}
          >
            GREIZY <span className="font-normal">GONZÁLEZ</span>
          </span>
          <span
            className={`font-montserrat font-medium tracking-[0.18em] uppercase mt-1.5 ${dimensions.textSub}`}
            style={{ color: subtextColor }}
          >
            {brand.tagline}
          </span>
        </div>
      )}
    </div>
  );
};
