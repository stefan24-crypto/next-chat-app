const useShortenText = (text: string, limit: number) => {
  return `${text.slice(0, limit)}...`;
};
export default useShortenText;
