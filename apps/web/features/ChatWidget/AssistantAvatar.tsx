interface Props {
  size?: number
}

export function AssistantAvatar({ size = 40 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Background */}
      <circle cx="20" cy="20" r="20" fill="#7c3aed" />

      {/* Body / shirt collar (clipped by circle naturally) */}
      <ellipse cx="20" cy="44" rx="16" ry="10" fill="#5b21b6" />

      {/* Neck */}
      <rect x="17" y="30" width="6" height="7" rx="2" fill="#F4C5A0" />

      {/* Hair back/sides */}
      <ellipse cx="20" cy="19" rx="11" ry="13" fill="#18181b" />

      {/* Face */}
      <ellipse cx="20" cy="22" rx="9" ry="10" fill="#F4C5A0" />

      {/* Hair top (overlaps face) */}
      <path d="M10 14 Q11 7 20 7 Q29 7 30 14 L29 19 Q20 15 11 19Z" fill="#18181b" />

      {/* Ears */}
      <ellipse cx="11" cy="23" rx="2" ry="2.5" fill="#F4C5A0" />
      <ellipse cx="29" cy="23" rx="2" ry="2.5" fill="#F4C5A0" />

      {/* Eyebrows */}
      <path d="M14.5 19 Q16.5 17.8 18.5 19" stroke="#18181b" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M21.5 19 Q23.5 17.8 25.5 19" stroke="#18181b" strokeWidth="1.1" strokeLinecap="round" />

      {/* Eyes */}
      <ellipse cx="16.5" cy="21.5" rx="1.8" ry="2" fill="#18181b" />
      <ellipse cx="23.5" cy="21.5" rx="1.8" ry="2" fill="#18181b" />

      {/* Eye shine */}
      <circle cx="17.2" cy="20.8" r="0.6" fill="white" />
      <circle cx="24.2" cy="20.8" r="0.6" fill="white" />

      {/* Nose */}
      <path d="M19.3 24.5 Q20 25.5 20.7 24.5" stroke="#B5785A" strokeWidth="0.9" strokeLinecap="round" />

      {/* Smile */}
      <path d="M16.5 27.5 Q20 30 23.5 27.5" stroke="#B5785A" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}
