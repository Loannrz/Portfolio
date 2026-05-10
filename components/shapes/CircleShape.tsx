import type { ShapeProps } from './types'

export default function CircleShape({
  color = '#2B2B2B',
  size = 200,
  rotation = 0,
  className = '',
  opacity = 0.3,
  strokeWidth = 1,
}: ShapeProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-hidden="true"
    >
      {/* Slightly imperfect circle */}
      <ellipse
        cx="100"
        cy="100"
        rx="88"
        ry="91"
        stroke={color}
        strokeWidth={strokeWidth}
        opacity={opacity}
      />
      <ellipse
        cx="100"
        cy="100"
        rx="70"
        ry="72"
        stroke={color}
        strokeWidth={strokeWidth * 0.4}
        opacity={opacity * 0.4}
        strokeDasharray="4 8"
      />
      <circle cx="100" cy="100" r="3" fill={color} opacity={opacity * 0.6} />
    </svg>
  )
}
