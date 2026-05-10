import type { ShapeProps } from './types'

export default function AbstractShape({
  color = '#2D4BFF',
  size = 320,
  rotation = 0,
  className = '',
  opacity = 0.4,
  strokeWidth = 1,
}: ShapeProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 320 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-hidden="true"
    >
      {/* Organic abstract form — editorial quality */}
      <path
        d="M160 40
           C220 40 280 80 290 140
           C300 200 270 265 215 285
           C160 305 95 280 65 230
           C35 180 45 110 80 75
           C115 40 100 40 160 40Z"
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        opacity={opacity}
      />
      {/* Inner detail */}
      <path
        d="M160 80
           C205 82 248 108 255 155
           C262 202 238 248 200 263
           C162 278 112 260 90 220
           C68 180 78 128 108 102
           C138 76 115 78 160 80Z"
        stroke={color}
        strokeWidth={strokeWidth * 0.5}
        fill="none"
        opacity={opacity * 0.4}
        strokeDasharray="6 12"
      />
      {/* Accent line */}
      <path
        d="M100 160 Q160 120 220 160 Q160 200 100 160Z"
        stroke={color}
        strokeWidth={strokeWidth * 0.4}
        fill="none"
        opacity={opacity * 0.3}
      />
      {/* Corner marks */}
      <line x1="40" y1="40" x2="55" y2="40" stroke={color} strokeWidth={strokeWidth} opacity={opacity * 0.6} />
      <line x1="40" y1="40" x2="40" y2="55" stroke={color} strokeWidth={strokeWidth} opacity={opacity * 0.6} />
      <line x1="280" y1="280" x2="265" y2="280" stroke={color} strokeWidth={strokeWidth} opacity={opacity * 0.4} />
      <line x1="280" y1="280" x2="280" y2="265" stroke={color} strokeWidth={strokeWidth} opacity={opacity * 0.4} />
    </svg>
  )
}
