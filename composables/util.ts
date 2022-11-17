function parseDatetime(datetime: string | undefined): string {
  if (datetime) {
    const date_obj = new Date(datetime);
    return date_obj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return "";
}

export { parseDatetime };
