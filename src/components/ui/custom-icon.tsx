import Image from 'next/image';

interface CustomIconProps {
  name: 'skill' | 'knowledge' | 'work-activity' | 'work-style' | 'tool' | 'strong-confidence' | 'moderate-confidence' | 'emerging-confidence';
  size?: number;
  className?: string;
}

export function CustomIcon({ name, size = 24, className = '' }: CustomIconProps) {
  return (
    <Image
      src={`/icons/${name}.svg`}
      alt={name}
      width={size}
      height={size}
      className={className}
    />
  );
}