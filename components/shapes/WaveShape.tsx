import type { ShapeProps } from './types'

export default function WaveShape({
  color = '#E7C9A9',
  size = 500,
  rotation = 0,
  className = '',
  opacity = 0.5,
  strokeWidth = 1,
}: ShapeProps) {
  return (
    <svg
      width={size}
      height={size * 0.3}
      viewBox="0 0 500 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-hidden="true"
    >
      <path
        d="M0 75 C80 20, 170 130, 250 75 S420 20, 500 75"
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        opacity={opacity}
      />
      <path
        d="M0 95 C80 40, 170 150, 250 95 S420 40, 500 95"
        stroke={color}
        strokeWidth={strokeWidth * 0.5}
        fill="none"
        strokeLinecap="round"
        opacity={opacity * 0.4}
      />
      <path
        d="M0 55 C80 0, 170 110, 250 55 S420 0, 500 55"
        stroke={color}
        strokeWidth={strokeWidth * 0.3}
        fill="none"
        strokeLinecap="round"
        opacity={opacity * 0.25}
      />
    </svg>
  )
}
