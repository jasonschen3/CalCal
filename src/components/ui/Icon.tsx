"use client";

export type IconName =
  | "calendar"
  | "map-pin"
  | "sparkles"
  | "flame"
  | "dumbbell"
  | "egg"
  | "bolt"
  | "scale"
  | "utensils"
  | "home"
  | "refresh"
  | "camera"
  | "pencil"
  | "table"
  | "coins"
  | "compass"
  | "wave";

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

// All icons use a 20×20 viewBox, filled with currentColor.
// Style matches a cozy flat-design game aesthetic — chunky silhouettes,
// rounded shapes, readable at 16–24px.
const icons: Record<IconName, React.ReactNode> = {
  // Heroicons Solid — calendar
  calendar: (
    <path
      fillRule="evenodd"
      d="M5 3a2 2 0 00-2 2v2h14V5a2 2 0 00-2-2H5zM3 9v8a2 2 0 002 2h10a2 2 0 002-2V9H3zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
      clipRule="evenodd"
    />
  ),

  // Heroicons Solid — location-marker
  "map-pin": (
    <path
      fillRule="evenodd"
      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
      clipRule="evenodd"
    />
  ),

  // Heroicons Solid — sparkles
  sparkles: (
    <path
      fillRule="evenodd"
      d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
      clipRule="evenodd"
    />
  ),

  // Heroicons Solid — fire
  flame: (
    <path
      fillRule="evenodd"
      d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
      clipRule="evenodd"
    />
  ),

  // Custom — horizontal dumbbell
  dumbbell: (
    <>
      <rect x="1" y="7.5" width="2" height="5" rx="1" />
      <rect x="3" y="6" width="2.5" height="8" rx="1" />
      <rect x="5.5" y="9" width="9" height="2" rx="1" />
      <rect x="14.5" y="6" width="2.5" height="8" rx="1" />
      <rect x="17" y="7.5" width="2" height="5" rx="1" />
    </>
  ),

  // Custom — simple egg shape
  egg: (
    <path d="M10 2C6.5 2 4 6 4 10.5 4 15 6.5 18 10 18s6-3 6-7.5C16 6 13.5 2 10 2z" />
  ),

  // Heroicons Solid — lightning-bolt
  bolt: (
    <path
      fillRule="evenodd"
      d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
      clipRule="evenodd"
    />
  ),

  // Heroicons Solid — scale
  scale: (
    <path
      fillRule="evenodd"
      d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 14a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L10 5.477 6.237 6.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 14a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L9 3.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z"
      clipRule="evenodd"
    />
  ),

  // Custom — fork + knife silhouette
  utensils: (
    <>
      {/* Fork: three tines merging into handle */}
      <path d="M5 2a.75.75 0 0 0-.75.75v3c0 .69.56 1.25 1.25 1.25v10.25a.75.75 0 0 0 1.5 0V7c.69 0 1.25-.56 1.25-1.25v-3A.75.75 0 0 0 7.5 2h-.75v3h-.5V2H5z" />
      {/* Knife: tapered blade with handle */}
      <path d="M13 2c-1.1 0-2 1.57-2 4v1.5a.5.5 0 0 0 .5.5H13v9.25a.75.75 0 0 0 1.5 0V2H13z" />
    </>
  ),

  // Heroicons Solid — home
  home: (
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  ),

  // Heroicons Solid — refresh
  refresh: (
    <path
      fillRule="evenodd"
      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
      clipRule="evenodd"
    />
  ),

  // Heroicons Solid — camera
  camera: (
    <path
      fillRule="evenodd"
      d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
      clipRule="evenodd"
    />
  ),

  // Heroicons Solid — pencil
  pencil: (
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  ),

  // Custom — horizontal lines (sit-down table)
  table: (
    <>
      <rect x="2" y="4" width="16" height="2.5" rx="1.25" />
      <rect x="4.5" y="7.5" width="2" height="9" rx="1" />
      <rect x="13.5" y="7.5" width="2" height="9" rx="1" />
    </>
  ),

  // Heroicons Solid — currency-dollar (budget)
  coins: (
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
      clipRule="evenodd"
    />
  ),

  // Heroicons Solid — globe (convenience/anywhere)
  compass: (
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
      clipRule="evenodd"
    />
  ),

  // Custom — friendly wave hand
  wave: (
    <path
      fillRule="evenodd"
      d="M9.5 2a1 1 0 0 1 1 1v4.5h1V4a1 1 0 1 1 2 0v3.5h.5a2 2 0 0 1 2 2v1c0 3.314-2.686 6-6 6a6 6 0 0 1-6-6V9a2 2 0 0 1 2-2h.5V4a1 1 0 0 1 1-1V2a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1z"
      clipRule="evenodd"
    />
  ),
};

export function Icon({ name, size = 20, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}
