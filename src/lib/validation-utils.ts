import { ExpectedColumn, ImportError } from "../constants/general";


export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateNumeric = (value: any): boolean => {
  return !isNaN(Number(value)) && isFinite(Number(value));
};

export const validateBoolean = (value: any): boolean => {
  return ['true', 'false', '1', '0', 'yes', 'no'].includes(
    value?.toString().toLowerCase()
  );
};

export const transformBoolean = (value: any): boolean => {
  const val = value?.toString().toLowerCase();
  return ['true', '1', 'yes'].includes(val);
};

export const transformNumeric = (value: any): number => {
  return Number(value) || 0;
};

export const validateData = (
  data: any[],
  expectedColumns: ExpectedColumn[],
  columnMapping: Record<string, string>
): ImportError[] => {
  const errors: ImportError[] = [];

  data.forEach((row) => {
    expectedColumns.forEach((col) => {
      const mappedColumn = columnMapping[col.field];
      const value = mappedColumn ? row[mappedColumn] : undefined;
      
      // Required field validation
      if (col.required && (!value || value.toString().trim() === '')) {
        errors.push({
          row: row._rowIndex,
          field: col.field,
          message: `${col.field} is required`,
          value,
        });
      }
      
      // Custom validator
      if (value && col.validator && !col.validator(value)) {
        errors.push({
          row: row._rowIndex,
          field: col.field,
          message: `Invalid ${col.field} format`,
          value,
        });
      }
    });
  });

  return errors;
};