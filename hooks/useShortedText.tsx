const useShortenText = (text: string, limit: number) => {
  if (text.length >= limit) {
    return `${text.slice(0, limit)}...`;
  }
  return text;
};
export default useShortenText;
