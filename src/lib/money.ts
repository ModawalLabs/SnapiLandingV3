/**
 * Money is an integer in minor units plus a currency.
 *
 * Never a float, and never a bare number: `19.99` in JS is not 19.99, and a
 * number with no currency is a bug waiting for the first non-USD market. Ported
 * from the platform's `Money` type so the two properties agree about what a
 * price is.
 *
 * Overkill for a page of hardcoded strings, and exactly the kind of thing that
 * stops being overkill the moment these lists come from an API.
 */
export interface Money {
  amount: number;
  currency: string;
}

/**
 * The formatter is built once per currency rather than per call.
 *
 * `Intl.NumberFormat` construction is the expensive part — roughly an order of
 * magnitude more than the format itself — and the hero re-renders this on every
 * frame of the typewriter.
 */
const formatters = new Map<string, Intl.NumberFormat>();

function formatterFor(currency: string) {
  let formatter = formatters.get(currency);

  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      // Luxury prices are whole numbers; trailing `.00` on a five-figure sum is
      // noise that also widens every column it sits in.
      maximumFractionDigits: 0,
    });
    formatters.set(currency, formatter);
  }

  return formatter;
}

export function formatMoney({ amount, currency }: Money) {
  return formatterFor(currency).format(amount / 100);
}
