import { ColumnType } from "@/modules/layouts/types";

export function compareValues(
  value: string | number,
  filterValue: string,
  operator: string,
  columnType: ColumnType,
): boolean {
  if (columnType === "text" && typeof value === "string") {
    const lowerValue = value.toLowerCase();
    const lowerFilterValue = filterValue.toLowerCase();

    switch (operator) {
      case "contains":
        return lowerValue.includes(lowerFilterValue);
      case "does not contain":
        return !lowerValue.includes(lowerFilterValue);
      default:
        return true;
    }
  } else if (columnType === "numeric") {
    const numValue = parseFloat(String(value));
    const numFilter = parseFloat(filterValue);

    if (isNaN(numValue) || isNaN(numFilter)) return false;

    switch (operator) {
      case ">": return numValue > numFilter;
      case "<": return numValue < numFilter;
      case "≤": return numValue <= numFilter;
      case "≥": return numValue >= numFilter;
      case "=": return numValue === numFilter;
      case "≠": return numValue !== numFilter;
      default: return true;
    }
  }

  return true;
}