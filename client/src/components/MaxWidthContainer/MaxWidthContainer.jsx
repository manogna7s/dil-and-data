import Container from "../Container/Container";

/**
 * MaxWidthContainer — alias for Container with default editorial width.
 * Kept as a named export so layouts read clearly.
 */
function MaxWidthContainer({ children, size = "lg", className = "", ...rest }) {
  return (
    <Container size={size} className={className} {...rest}>
      {children}
    </Container>
  );
}

export default MaxWidthContainer;
