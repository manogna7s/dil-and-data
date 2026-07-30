import styles from "./Button.module.css";

/**
 * Button family — primary, outline, ghost, icon.
 * Editorial serif labels; soft radius; quiet hover lift.
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  fullWidth = false,
  className = "",
  onClick,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        styles.btn,
        styles[variant],
        styles[size],
        fullWidth ? styles.fullWidth : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}

export function OutlineButton(props) {
  return <Button {...props} variant="outline" />;
}

export function IconButton({
  children,
  label,
  className = "",
  ...rest
}) {
  return (
    <Button
      variant="icon"
      size="icon"
      aria-label={label}
      className={className}
      {...rest}
    >
      {children}
    </Button>
  );
}

export default Button;
