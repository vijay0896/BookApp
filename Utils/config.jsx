// export const BASE_URLS = "http://localhost:8080";
// http://192.168.255.43:8080
// export const BASE_URLS =  "http://192.168.255.113:8080";
import { Platform } from "react-native";

export const BASE_URLS =
  Platform.OS === "android"
    ? "http://192.168.162.43:8080"
    : "http://localhost:8080";



    // https://vijay-book-swap.up.railway.app"
    // : "https://vijay-book-swap.up.railway.app