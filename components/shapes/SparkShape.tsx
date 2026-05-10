import type { ShapeProps } from './types'

export default function SparkShape({
  color = '#FF6A3D',
  size = 80,
  rotation = 0,
  className = '',
  opacity = 0.7,
  strokeWidth = 1.5,
}: ShapeProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-hidden="true"
    >
      {/* Cross spark */}
      <line x1="40" y1="5" x2="40" y2="30" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" opacity={opacity} />
      <line x1="40" y1="50" x2="40" y2="75" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" opacity={opacity} />
      <line x1="5" y1="40" x2="30" y2="40" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" opacity={opacity} />
      <line x1="50" y1="40" x2="75" y2="40" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" opacity={opacity} />
      {/* Diagonal */}
      <line x1="15" y1="15" x2="27" y2="27" stroke={color} strokeWidth={strokeWidth * 0.6} strokeLinecap="round" opacity={opacity * 0.5} />
      <line x1="53" y1="53" x2="65" y2="65" stroke={color} strokeWidth={strokeWidth * 0.6} strokeLinecap="round" opacity={opacity * 0.5} />
      <line x1="65" y1="15" x2="53" y2="27" stroke={color} strokeWidth={strokeWidth * 0.6} strokeLinecap="round" opacity={opacity * 0.5} />
      <line x1="15" y1="65" x2="27" y2="53" stroke={color} strokeWidth={strokeWidth * 0.6} strokeLinecap="round" opacity={opacity * 0.5} />
      {/* Center dot */}
      <circle cx="40" cy="40" r="2.5" fill={color} opacity={opacity} />
    </svg>
  )
}
