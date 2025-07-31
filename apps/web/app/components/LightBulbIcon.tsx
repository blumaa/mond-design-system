
interface LightBulbIconProps {
  size?: number;
  className?: string;
  isLightOn?: boolean;
}

export const LightBulbIcon = ({ 
  size = 20, 
  className = '', 
  isLightOn = false 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={isLightOn ? "#eab308" : "none"}
      stroke={isLightOn ? "#eab308" : "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.336.56 2.542 1.5 3.5.76.76 1.23 1.52 1.41 2.5" />
    </svg>
  );
};