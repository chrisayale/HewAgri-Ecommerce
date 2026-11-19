function formatNumberWithSpaces(number: number | any) {
  // Convert the number to a string and use a regular expression to add spaces
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
export default formatNumberWithSpaces;
