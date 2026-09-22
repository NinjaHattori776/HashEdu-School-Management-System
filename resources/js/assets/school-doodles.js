// A tileable school-themed doodle pattern (books, pencil, graduation cap, apple,
// ruler) as an inline SVG data URI — used as the login page background.
// Kept as a JS export (not a .svg file) so it can be imported directly and
// dropped straight into a CSS backgroundImage without a separate asset request.

export const schoolDoodlesBackground = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <g fill="none" stroke="#1B2A4A" stroke-width="1.5" opacity="0.06">
    <g transform="translate(30,40)">
      <polygon points="0,10 30,0 60,10 30,20" />
      <line x1="30" y1="20" x2="30" y2="35" />
      <circle cx="30" cy="37" r="2" fill="#1B2A4A" />
      <path d="M10,13 v14 q20,10 40,0 v-14" />
    </g>
    <g transform="translate(220,30)">
      <path d="M0,10 q20,-10 40,0 v30 q-20,-8 -40,0 z" />
      <path d="M40,10 q20,-10 40,0 v30 q-20,-8 -40,0 z" />
      <line x1="40" y1="10" x2="40" y2="40" />
    </g>
    <g transform="translate(80,150) rotate(35)">
      <rect x="0" y="0" width="70" height="10" rx="2" />
      <polygon points="70,0 85,5 70,10" fill="#B8860B" stroke="none" />
      <line x1="10" y1="0" x2="10" y2="10" />
    </g>
    <g transform="translate(280,160)">
      <circle cx="20" cy="25" r="18" />
      <path d="M20,7 q3,-8 10,-6" />
    </g>
    <g transform="translate(40,260) rotate(-10)">
      <rect x="0" y="0" width="90" height="16" rx="2" />
      <line x1="10" y1="0" x2="10" y2="8" />
      <line x1="25" y1="0" x2="25" y2="8" />
      <line x1="40" y1="0" x2="40" y2="8" />
      <line x1="55" y1="0" x2="55" y2="8" />
      <line x1="70" y1="0" x2="70" y2="8" />
    </g>
    <g transform="translate(230,270)">
      <circle cx="20" cy="18" r="16" />
      <line x1="14" y1="34" x2="26" y2="34" />
      <line x1="15" y1="40" x2="25" y2="40" />
    </g>
    <g transform="translate(340,90)">
      <polygon points="10,0 13,7 20,7 14,12 16,19 10,15 4,19 6,12 0,7 7,7" fill="#B8860B" stroke="none" opacity="0.5" />
    </g>
  </g>
</svg>
`)}`;
