import { Pill } from "../Badge/Badge";

/**
 * FilterChip — selectable filter pill for categories / tags.
 * Thin wrapper so filter UX stays consistent.
 */
function FilterChip({ label, active = false, onClick, className = "" }) {
  return (
    <Pill active={active} onClick={onClick} className={className}>
      {label}
    </Pill>
  );
}

export default FilterChip;
