export const formatValueWithCurrency = (value: number | string, currency: string) => {
    return currency === 'лв.'
        ? `${value}${currency}`
        : `${currency}${value}`
}