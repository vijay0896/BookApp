// utils/fetchBooks.js
import { BASE_URLS } from "../../Utils/config";

export const fetchBooksByType = async (userId, type) => {
    try {
      const response = await fetch(`${BASE_URLS}/api/books`);
      const data = await response.json();
      return data.filter(
        (book) => book.owner_id === userId && book.service_type === type
      );
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    }
  };
  