// Multi-currency Formatter & Conversion Utility

export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', name: 'Dólares (USD)', rateFromUSD: 1.0 },
  MXN: { code: 'MXN', symbol: '$', name: 'Pesos Mexicanos (MXN)', rateFromUSD: 18.5 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euros (EUR)', rateFromUSD: 0.92 },
  COP: { code: 'COP', symbol: '$', name: 'Pesos Colombianos (COP)', rateFromUSD: 4100 },
  ARS: { code: 'ARS', symbol: '$', name: 'Pesos Argentinos (ARS)', rateFromUSD: 1250 }
};

export function formatCurrency(amount, currencyCode = 'USD') {
  const num = parseFloat(amount) || 0;
  const curr = CURRENCIES[currencyCode] || CURRENCIES.USD;

  if (currencyCode === 'COP' || currencyCode === 'ARS') {
    return `${curr.symbol} ${Math.round(num).toLocaleString('es-ES')}`;
  }

  return `${curr.symbol} ${num.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function convertFromUSD(amountInUSD, targetCurrency = 'USD') {
  const num = parseFloat(amountInUSD) || 0;
  const curr = CURRENCIES[targetCurrency] || CURRENCIES.USD;
  return num * curr.rateFromUSD;
}
