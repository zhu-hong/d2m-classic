import { useCallback } from "react";
import { createApi } from "./http.js";

export const useApi = (url, config) => useCallback(() => createApi(url, config), [url]) 
