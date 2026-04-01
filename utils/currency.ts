export function convertToINR(price: number) {
  const inrValue = Math.round(price * 83);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(inrValue);
}
