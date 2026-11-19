const formatPhoneNumber = (phoneNumber: string) => {
  const countryCode = phoneNumber.slice(0, 4);
  const mainNumber = phoneNumber.slice(4);
  const formattedMainNumber = mainNumber.replace(
    /(\d{3})(\d{3})(\d{3})/,
    "$1 $2 $3"
  );
  return `${countryCode} ${formattedMainNumber}`;
};

export default formatPhoneNumber;
