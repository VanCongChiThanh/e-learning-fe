export const formatDate = (input?: string | number) => {
  if (input == null || input === '') return 'N/A';

  // Chuyển về số
  const timestamp = Number(input);

  // Nếu là UNIX timestamp (dưới 1e12 thì đang tính theo giây)
  const date = new Date(timestamp < 1e12 ? timestamp * 1000 : timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
};
