import { useCallback } from "react";
import { createApi } from "./http.js";

export const useApi = (url) => useCallback(() => createApi(url), [url]) 
