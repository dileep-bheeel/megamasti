export function getUtcDateKey(date = new Date()) {
  return date.getUTCFullYear() + "-" + String(date.getUTCMonth() + 1).padStart(2,"0") + "-" + String(date.getUTCDate()).padStart(2,"0");
}

export function getDailyIndex(length, date = new Date()) {
  if (!length) return 0;
  const seed = Number(getUtcDateKey(date).replaceAll("-",""));
  return seed % length;
}

export function getDailyGame(list, date = new Date()) {
  return list[getDailyIndex(list.length,date)];
}
