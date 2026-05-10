import type { ShapeProps } from './types'

export default function OrbitShape({
  color = '#2D4BFF',
  size = 250,
  rotation = 0,
  className = '',
  opacity = 0.35,
  strokeWidth = 1,
}: ShapeProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 250 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-hidden="true"
    >
      {/* Outer orbit */}
      <ellipse
        cx="125"
        cy="125"
        rx="110"
        ry="45"
        stroke={color}
        strokeWidth={strokeWidth}
        opacity={opacity}
      />
      {/* Middle orbit */}
      <ellipse
        cx="125"
        cy="125"
        rx="75"
        ry="30"
        stroke={color}
        strokeWidth={strokeWidth * 0.6}
        opacity={opacity * 0.6}
        transform="rotate(60 125 125)"
      />
      {/* Inner orbit */}
      <ellipse
        cx="125"
        cy="125"
        rx="40"
        ry="16"
        stroke={color}
        strokeWidth={strokeWidth * 0.4}
        opacity={opacity * 0.4}
        transform="rotate(120 125 125)"
      />
      {/* Orbit dots */}
      <circle cx="235" cy="125" r="3" fill={color} opacity={opacity} />
      <circle cx="125" cy="80" r="2" fill={color} opacity={opacity * 0.7} />
      <circle cx="60" cy="140" r="2" fill={color} opacity={opacity * 0.5} />
    </svg>
  )
}
