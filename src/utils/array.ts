export const removeItemWithId = (array, targetId) =>
  array.filter((item) => item.ID !== targetId);

export const removeItemById = (array, targetId) => {
  const index = array.findIndex((item) => item.ID === targetId);
  if (index === -1) return array; // If no item found, return the original array

  return [...array.slice(0, index), ...array.slice(index + 1)];
};

export const removeDuplicatesByID = <T extends { ID: string | number }>(
  array: T[]
): T[] => {
  const seen = new Set();
  return array.filter((item) => {
    if (seen.has(item.ID)) {
      return false;
    }
    seen.add(item.ID);
    return true;
  });
};

export const removeDuplicatesById = <T extends { id: string | number }>(
  array: T[]
): T[] => {
  const seen = new Set();
  return array.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
};

export const removeDuplicatesByValue = <T extends { value: string | number }>(
  array: T[]
): T[] => {
  const seen = new Set();
  return array.filter((item) => {
    if (seen.has(item.value)) {
      return false;
    }
    seen.add(item.value);
    return true;
  });
};
