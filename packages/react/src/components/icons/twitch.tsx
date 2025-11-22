import type { ComponentPropsWithRef } from "react"

export function Twitch({
  className,
  ...props
}: ComponentPropsWithRef<"svg">) {
  return (
    <svg
      className={className}
      version="1.1"
      viewBox="0 0 2400 2800"
      x="0px"
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      y="0px"
      {...props}
    >
      <title>Twitch</title>
      <style type="text/css">
        {`
                .st0{fill:#FFFFFF}
                .st1{fill:#9146FF}
            `}
      </style>

      <g>
        <polygon
          className="st0"
          points="2200,1300 1800,1700 1400,1700 1050,2050 1050,1700 600,1700 600,200 2200,200"
        />

        <g>
          <g>
            <path
              className="st1"
              d="M500,0L0,500v1800h600v500l500-500h400l900-900V0H500z M2200,1300l-400,400h-400l-350,350v-350H600V200h1600V1300z"
            />

            <rect className="st1" height="600" width="200" x="1700" y="550" />
            <rect className="st1" height="600" width="200" x="1150" y="550" />
          </g>
        </g>
      </g>
    </svg>
  )
}

