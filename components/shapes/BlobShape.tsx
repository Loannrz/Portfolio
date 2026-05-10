import type { ShapeProps } from './types'

export default function BlobShape({
  color = '#E7C9A9',
  size = 400,
  rotation = 0,
  className = '',
  opacity = 0.6,
  strokeWidth = 1.5,
}: ShapeProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-hidden="true"
    >
      <path
        d="M320 160C360 200 370 260 340 300C310 340 250 360 200 355C150 350 100 325 75 285C50 245 55 185 85 150C115 115 165 100 210 100C255 100 280 120 320 160Z"
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        opacity={opacity}
      />
      <path
        d="M290 175C325 210 330 260 305 295C280 330 230 348 185 342C140 336 98 308 80 272C62 236 70 185 100 158C130 131 175 125 215 130C255 135 255 140 290 175Z"
        stroke={color}
        strokeWidth={strokeWidth * 0.5}
        fill="none"
        opacity={opacity * 0.4}
      />
    </svg>
  )
}
