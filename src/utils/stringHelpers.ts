export function isValidUrl(string) {
  const urlRegex =
    /^(https?:\/\/)?([\w\-]+(\.[\w\-]+)+)(:[0-9]{1,5})?(\/[^\s]*)?$/i;
  return urlRegex.test(string);
}

export function isValidUrlOrEmail(value) {
  const urlPattern = new RegExp(
    /^(https?:\/\/[^\s]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/
  );
  return urlPattern.test(value);
}
