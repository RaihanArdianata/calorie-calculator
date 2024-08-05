export const objectToForm = (input: Record<string, string | Blob>) => {
  const form = new FormData();
  for (const k in input) form.append(k, input[k]);
  return form;
}
