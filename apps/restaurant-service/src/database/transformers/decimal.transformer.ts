/**
 * TypeORM transformer for decimal columns.
 * PostgreSQL returns decimal values as strings to preserve precision.
 * This transformer converts them to numbers for easier handling in the application.
 */
export const DecimalTransformer = {
  to: (value: number | null | undefined): number | null | undefined => value,
  from: (value: string | null | undefined): number | null | undefined => {
    if (value === null || value === undefined) {
      return value;
    }
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  },
};
