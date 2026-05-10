import type { ShapeProps } from './types'

export default function NoiseShape({
  color = '#E7C9A9',
  size = 350,
  rotation = 0,
  className = '',
  opacity = 0.5,
  strokeWidth = 1,
}: ShapeProps) {
  /* Organic noise-like path generated manually */
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 350 350"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-hidden="true"
    >
      <defs>
        <filter id="noiseFilter" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04"
            numOctaves="3"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="18"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
      <ellipse
        cx="175"
        cy="175"
        rx="140"
        ry="130"
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        opacity={opacity}
        filter="url(#noiseFilter)"
      />
      <ellipse
        cx="175"
        cy="175"
        rx="100"
        ry="90"
        stroke={color}
        strokeWidth={strokeWidth * 0.5}
        fill="none"
        opacity={opacity * 0.45}
        filter="url(#noiseFilter)"
      />
    </svg>
  )
}
