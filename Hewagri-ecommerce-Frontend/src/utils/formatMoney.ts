// utils/formatMoney.ts

/**
 * Format a number as currency with a space as the thousands separator.
 *
 * @param amount - The amount of money to format.
 * @param currency - The currency code (e.g., 'USD', 'EUR'). Defaults to 'USD'.
 * @param rate - The exchange rate to convert the amount. Defaults to 1 (no conversion).
 * @param locale - The locale to use for formatting. Defaults to 'en-US'.
 * @returns The formatted currency string.
 */

export const formatMoney = (
  amount: number,
  currency: string,
  rate: number,
  locale: string = "en-US"
): string => {
  const effectiveRate = currency === "CDF" ? 1 : rate;
  const convertedAmount = amount / effectiveRate;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  })
    .format(convertedAmount)
    .replace(/,/g, " ");
};
