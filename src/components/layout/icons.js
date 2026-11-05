function Icon({ children, className = "size-6" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export const SearchIcon = (props) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Icon>
);

export const HeartIcon = (props) => (
  <Icon {...props}>
    <path d="M12 20s-7.5-4.6-9-9.2C2 7.6 4 5 6.9 5c2 0 3.8 1 5.1 3 1.3-2 3.1-3 5.1-3C20 5 22 7.6 21 10.8 19.5 15.4 12 20 12 20Z" />
  </Icon>
);

export const CartIcon = (props) => (
  <Icon {...props}>
    <path d="M6 8h12l1.2 12H4.8L6 8Z" />
    <path d="M9 10V7a3 3 0 0 1 6 0v3" />
  </Icon>
);

export const UserIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c.8-4 4-6 8-6s7.2 2 8 6" />
  </Icon>
);

export const MenuIcon = (props) => (
  <Icon {...props}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </Icon>
);

export const CloseIcon = (props) => (
  <Icon {...props}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Icon>
);

export const HomeIcon = (props) => (
  <Icon {...props}>
    <path d="m3 11 9-8 9 8" />
    <path d="M5 9.5V21h14V9.5" />
  </Icon>
);

export const GridIcon = (props) => (
  <Icon {...props}>
    <rect x="4" y="4" width="7" height="7" rx="1" />
    <rect x="13" y="4" width="7" height="7" rx="1" />
    <rect x="4" y="13" width="7" height="7" rx="1" />
    <rect x="13" y="13" width="7" height="7" rx="1" />
  </Icon>
);

export const ChevronDownIcon = (props) => (
  <Icon {...props}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);

export const ChatIcon = (props) => (
  <Icon {...props}>
    <path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.4A8.5 8.5 0 1 1 21 12Z" />
  </Icon>
);
