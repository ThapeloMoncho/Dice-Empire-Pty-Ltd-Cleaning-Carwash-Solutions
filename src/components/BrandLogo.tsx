import { MEDIA_ASSETS } from '../data/media';

interface BrandLogoProps {
  variant: 'light-bg' | 'dark-bg';
  size?: 'sm' | 'md' | 'lg';
}

export function BrandLogo({ variant, size = 'md' }: BrandLogoProps) {
  const src = variant === 'light-bg' ? MEDIA_ASSETS.logoBlue : MEDIA_ASSETS.logoWhite;

  // Both source PNGs place the artwork in ~32% width x ~21% height of a square canvas,
  // so sizing the inner square image larger than the clipped container zooms the mark
  // cleanly to fill the header and footer without whitespace padding.
  const boxClasses =
    size === 'sm'
      ? 'h-14 w-28'
      : size === 'lg'
        ? 'h-24 w-48'
        : 'h-20 w-40';

  const imgClasses =
    size === 'sm'
      ? variant === 'light-bg'
        ? 'w-[240px] h-[240px] -translate-y-[3.9%]'
        : 'w-[250px] h-[250px]'
      : size === 'lg'
        ? variant === 'light-bg'
          ? 'w-[380px] h-[380px] -translate-y-[3.9%]'
          : 'w-[400px] h-[400px]'
        : variant === 'light-bg'
          ? 'w-[310px] h-[310px] -translate-y-[3.9%]'
          : 'w-[320px] h-[320px]';

  return (
    <span className={`relative inline-flex items-center justify-center overflow-hidden shrink-0 ${boxClasses}`}>
      <img
        src={src}
        alt="Dice Empire (Pty) Ltd Est. 2022"
        referrerPolicy="no-referrer"
        className={`max-w-none shrink-0 object-contain select-none pointer-events-none ${imgClasses}`}
      />
    </span>
  );
}
