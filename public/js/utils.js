function getValidArray(array) {
  if (array === undefined) {
    return [];
  }
  return Array.isArray(array) ? array : [];
}
