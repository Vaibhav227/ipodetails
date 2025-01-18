export const tranformIpos = (data: any) => {
  return data.map((ipo) => ({
    name: ipo.name,
    symbol: '-', // Add default value if not available
    type: ipo.type,
    status: ipo.status,
    offerDate: ipo.offerDate,
    lotSize: ipo.lotSize,
    gmp: ipo.premiumPercent ? `₹${ipo.premiumRange} (${ipo.premiumPercent})` : 'N/A',
    priceRange: `₹${ipo.offerPrice}`,
    subscription: ipo.subscription,
  }))
}
