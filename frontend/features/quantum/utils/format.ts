const STABLE_INTEGER_FORMATTER = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

export function formatStableInteger(value: number): string {
  return STABLE_INTEGER_FORMATTER.format(value);
}
