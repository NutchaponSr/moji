import { createLoader, parseAsString } from "nuqs/server";

const params = {
  year: parseAsString.withDefault(String(new Date().getFullYear())).withOptions({ clearOnDefault: true })
}

export const loadGroupQuery = createLoader(params);