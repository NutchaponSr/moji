import { useQueryStates, parseAsString } from "nuqs";

const params = {
  year: parseAsString.withDefault(String(new Date().getFullYear())).withOptions({ clearOnDefault: true })
}

export const useGroupQuery = () => {
  return useQueryStates(params);
}