import React from 'react';

interface ButtonProps {
  onClick: () => void;
  text?: string;
  size?: number;
  gradient?: string;
  textColour?: string;
  shadow?: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  title?: string; // <-- added
}

export default function CircularButton(props: ButtonProps) {
  const {
    onClick,
    text = '',
    size = 48,
    gradient,
    shadow,
    textColour = "white",
    icon,
    title, // <-- consume
    ...otherProps
  } = props;

  const shadowColor = shadow
    ? shadow.startsWith('#')
      ? shadow
      : `#${shadow}`
    : undefined;

  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);

  const boxShadow = shadowColor
    ? active
      ? `0 0 0 ${shadowColor}`
      : hover
      ? `0 2px 0 ${shadowColor}`
      : `0 4px 0 ${shadowColor}`
    : undefined;

  const baseClass =
    `flex items-center justify-center ` +
    `rounded-full ` +
    `bg-gradient-to-b ${gradient || ''} ` +
    `text-${textColour} font-semibold text-base ` +
    `transition-all duration-150 cursor-pointer`;

  return (
    <button
      {...otherProps}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        width: size,
        height: size,
        boxShadow,
        transition: 'transform .15s, box-shadow .15s',
        ...props.style,
      }}
      className={baseClass}
      title={title}               // <-- added title attribute (native tooltip)
      aria-label={title || (typeof text === 'string' ? text : undefined)} // accessible label
    >
      {icon ?? text}
    </button>
  );
}
