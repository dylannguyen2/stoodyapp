import React from 'react';

interface ButtonProps {
  onClick: () => void;
  text: string;
  height?: number;
  width?: number;
  gradient?: string;
  textColour?: string;
  shadow?: string;
  style?: React.CSSProperties;
}

export default function Button(props: ButtonProps) {
  const {
    onClick,
    text,
    height=32,
    width=32,
    gradient,
    shadow,
    textColour="white",
    ...otherProps
  } = props;

  const shadowColor = props.shadow
    ? props.shadow.startsWith('#')
      ? props.shadow
      : `#${props.shadow}`
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

  const baseClass = `px-5 py-2 w-${width} h-${height} rounded-xl ` +
    `bg-gradient-to-b ${gradient} text-${textColour} font-semibold text-base ` +
    `shadow-[0_4px_0px_#${shadow}] hover:shadow-[0_2px_0px_#${shadow}] hover:translate-y-[2px]` +
    `active:shadow-[0_0px_0px_#${shadow}] active:translate-y-[4px] transition-all duration-150 cursor-pointer`;

  return (
    <button
      {...otherProps}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        boxShadow,
        transition: 'transform .15s, box-shadow .15s',
        ...props.style,
      }}
      className={`${baseClass}`}
    >
      {text}
    </button>
  );
}