export const today = (
  time = new Date(),
  hours = 4,
  min = 0,
  sec = 0,
  ms = 0,
) => {
  time.setUTCHours(hours, min, sec, ms);
  return time;
};

export const createUrl = (
  { url, query = {} }: { url: string; query?: object },
) => {
  const urlBuilder = new URL(url);

  Object.entries(query).forEach(([key, value]) => {
    if (value == null) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((val) => urlBuilder.searchParams.append(key, val));
      return;
    }

    urlBuilder.searchParams.append(key, value);
  });

  return urlBuilder.toString();
};
