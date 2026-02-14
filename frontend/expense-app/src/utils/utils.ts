export const parsedDate = (date: string) => {
  const [day, month, year] = date.split("-");
  return new Date(`${year}-${month}-${day}`).getTime();
};

export const sanity = (word: string) => {
  return word.toLowerCase().trim();
};

export const capitalizeFirstLetter = (word: string) => {
  if (!word) return word;
  return word[0].toUpperCase() + word.slice(1);
};
