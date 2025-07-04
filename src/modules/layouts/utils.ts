import { 
  ColumnType, 
  dateSort,
  dateBy, 
  GroupingConfig, 
  GroupingProps, 
  GroupingSort, 
  NumericBy, 
  selectBy, 
  textBy, 
  textSort, 
  numericSort, 
  selectSort, 
  GroupingValue 
} from "@/modules/layouts/types";

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

export function getAlphabetGroup(value: string) {
  const firstChar = value.charAt(0).toUpperCase();
  return /[A-Z]/.test(firstChar) ? firstChar : "#";
}

export function getDateGroup(value: string, groupBy: string) {
  const date = new Date(value);
  
  if (isNaN(date.getTime())) return "Invalid Date";

  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  switch (groupBy) {
    case "relative":
      if (diffDays <= 1) return "Today";
      if (diffDays <= 7) return "This week";
      if (diffDays <= 30) return "This month";
      if (diffDays <= 365) return "This year";
      return "Older";
    case "day":
      return date.toLocaleDateString();
    case "week":
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      return `Week of ${weekStart.toLocaleDateString()}`;
    case "month":
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
    case "year":
      return date.getFullYear().toString();
    default:
      return value;
  }
}

/**
 * Get numeric group based on range
 */
const getNumericGroup = (value: string, range: NumericBy): string => {
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return "Invalid Number";
  
  if (numValue >= range.from && numValue <= range.to) {
    return `${range.from} - ${range.to}`;
  }
  
  // Create additional ranges for values outside the specified range
  const rangeSize = range.to - range.from;
  const lowerBound = Math.floor(numValue / rangeSize) * rangeSize;
  const upperBound = lowerBound + rangeSize;
  
  return `${lowerBound} - ${upperBound}`;
};

/**
 * Get select group based on grouping type
 */
const getSelectGroup = (value: string, groupBy: string): string => {
  if (groupBy === "group") {
    // Assuming select options have groups separated by ':'
    // You might need to adjust this based on your select data structure
    return value.split(':')[0] || value;
  } else {
    // option
    return value;
  }
};

/**
 * Get group value based on column type and grouping value
 */
const getGroupValue = (
  cellValue: string,
  columnType: ColumnType,
  groupingValue: GroupingValue
): string => {
  switch (columnType) {
    case "text":
      if (groupingValue === "alphabetical") {
        return getAlphabetGroup(cellValue);
      } else {
        // exact
        return cellValue;
      }
    case "date":
      return getDateGroup(cellValue, groupingValue as string);
    case "select":
      return getSelectGroup(cellValue, groupingValue as string);
    case "numeric":
      return getNumericGroup(cellValue, groupingValue as NumericBy);
    default:
      return cellValue;
  }
};

/**
 * Sort grouped data based on column type and sort option
 */
const sortGroupedData = <T>(
  GroupingProps: GroupingProps<T>[],
  columnType: ColumnType,
  groupingSort: GroupingSort
): GroupingProps<T>[] => {
  let sortedData = [...GroupingProps];
  
  switch (columnType) {
    case "text":
      switch (groupingSort) {
        case "alphabetical":
          sortedData = sortedData.sort((a, b) => {
            if (a.label === '#' && b.label !== '#') return 1;
            if (b.label === '#' && a.label !== '#') return -1;
            return a.label.localeCompare(b.label);
          });
          break;
        case "reverseAlphabetical":
          sortedData = sortedData.sort((a, b) => {
            if (a.label === '#' && b.label !== '#') return -1;
            if (b.label === '#' && a.label !== '#') return 1;
            return b.label.localeCompare(a.label);
          });
          break;
        case "manual":
          // Keep original order
          break;
      }
      break;
      
    case "date":
      switch (groupingSort) {
        case "oldestFirst":
          sortedData = sortedData.sort((a, b) => {
            // Handle relative dates
            const dateOrder = ["Today", "This week", "This month", "This year", "Older"];
            const indexA = dateOrder.indexOf(a.label);
            const indexB = dateOrder.indexOf(b.label);
            
            if (indexA !== -1 && indexB !== -1) {
              return indexA - indexB;
            }
            
            // For actual dates, parse and compare
            const dateA = new Date(a.label);
            const dateB = new Date(b.label);
            
            if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
              return dateA.getTime() - dateB.getTime();
            }
            
            return a.label.localeCompare(b.label);
          });
          break;
        case "newestFirst":
          sortedData = sortedData.sort((a, b) => {
            const dateOrder = ["Today", "This week", "This month", "This year", "Older"];
            const indexA = dateOrder.indexOf(a.label);
            const indexB = dateOrder.indexOf(b.label);
            
            if (indexA !== -1 && indexB !== -1) {
              return indexB - indexA;
            }
            
            const dateA = new Date(a.label);
            const dateB = new Date(b.label);
            
            if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
              return dateB.getTime() - dateA.getTime();
            }
            
            return b.label.localeCompare(a.label);
          });
          break;
      }
      break;
      
    case "select":
      switch (groupingSort) {
        case "ascending":
          sortedData = sortedData.sort((a, b) => a.label.localeCompare(b.label));
          break;
        case "descending":
          sortedData = sortedData.sort((a, b) => b.label.localeCompare(a.label));
          break;
        case "manual":
          // Keep original order
          break;
      }
      break;
      
    case "numeric":
      switch (groupingSort) {
        case "ascending":
          sortedData = sortedData.sort((a, b) => {
            const numA = parseFloat(a.label.split(' - ')[0]);
            const numB = parseFloat(b.label.split(' - ')[0]);
            return numA - numB;
          });
          break;
        case "descending":
          sortedData = sortedData.sort((a, b) => {
            const numA = parseFloat(a.label.split(' - ')[0]);
            const numB = parseFloat(b.label.split(' - ')[0]);
            return numB - numA;
          });
          break;
      }
      break;
  }
  
  // Update order after sorting
  return sortedData.map((group, idx) => ({
    ...group,
    order: idx,
  }));
};

/**
 * Group and sort data based on configuration
 */
export const groupAndSortData = <T>({
  column,
  columnType,
  groupingValue,
  groupingSort,
  data,
}: GroupingConfig<T>): GroupingProps<T>[] => {
  // Group the data
  const groupMap: Record<string, T[]> = data.reduce(
    (groups, row) => {
      const rowTyped = row as Record<string, unknown>;
      const cellValue = rowTyped[column.id]?.toString() || "Unknown";
      const groupValue = getGroupValue(cellValue, columnType, groupingValue);

      if (!groups[groupValue]) {
        groups[groupValue] = [];
      }
      groups[groupValue].push(row);
      return groups;
    },
    {} as Record<string, T[]>
  );

  // Convert to array format
  const GroupingProps = Object.entries(groupMap).map(([label, data], idx) => ({
    order: idx,
    label,
    data,
    hidden: false,
  }));

  // Apply sorting
  return sortGroupedData(GroupingProps, columnType, groupingSort);
};

/**
 * Create default "All data" group
 */
export const createDefaultGroup = <T>(data: T[]): GroupingProps<T>[] => {
  return [
    {
      order: 0,
      label: "All data",
      data,
      hidden: false,
    },
  ];
};

export const getGroupingOptions = (type: ColumnType) => {
  if (!type) return [];

  switch (type) {
    case "text":
      return textBy;
    case "date":
      return dateBy;
    case "select":
      return selectBy;
    case "numeric":
      return []; // Numeric uses custom range input
    default:
      return [];
  }
}

export const getSortOptions = (type: ColumnType) => {
  if (!type) return [];

  switch (type) {
    case "text":
      return textSort;
    case "date":
      return dateSort;
    case "select":
      return selectSort;
    case "numeric":
      return numericSort;
    default:
      return [];
  }
}

/**
 * Get group description for display
 */
export const getGroupingDescription = (
  groupingValue: GroupingValue | null,
  columnType: ColumnType | null
): string => {
  if (!groupingValue || !columnType) return "";
  
  switch (columnType) {
    case "numeric":
      const numericValue = groupingValue as NumericBy;
      return `${numericValue.from} to ${numericValue.to}`;
    case "text":
    case "date":
    case "select":
      return groupingValue.toString();
    default:
      return groupingValue.toString();
  }
};

/**
 * Validate if grouping configuration is valid
 */
export const isValidGroupingConfig = <T>(config: Partial<GroupingConfig<T>>): boolean => {
  return !!(
    config.column &&
    config.columnType &&
    config.groupingValue !== null &&
    config.groupingSort !== null &&
    config.data
  );
};