export function getValidArray<T>(array?: T[]): T[] {
  if (array === undefined) {
    return [];
  }
  return Array.isArray(array) ? array : [];
}

export function isEmptyArray<T>(array?: T[]): boolean {
  return getValidArray(array).length === 0;
}
