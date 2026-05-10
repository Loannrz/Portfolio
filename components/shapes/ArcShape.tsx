import type { ShapeProps } from './types'

export default function ArcShape({
  color = '#FF6A3D',
  size = 300,
  rotation = 0,
  className = '',
  opacity = 0.5,
  strokeWidth = 1,
}: ShapeProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-hidden="true"
    >
      <path
        d="M30 270 Q150 20 270 270"
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        opacity={opacity}
      />
      <path
        d="M60 270 Q150 60 240 270"
        stroke={color}
        strokeWidth={strokeWidth * 0.4}
        fill="none"
        strokeLinecap="round"
        opacity={opacity * 0.35}
      />
    </svg>
  )
}
