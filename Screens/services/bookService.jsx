import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { BASE_URLS } from "../../Utils/config";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
// 🔁 Custom Hook: Fetch books (GET)
export const useFetchBooks = (endpoint) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const FetchBooks = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("No auth token found");

      const response = await axios.get(`${BASE_URLS}/api/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBooks(response.data);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      FetchBooks();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    FetchBooks();
  };

  return { books, loading, refreshing, handleRefresh };
};

// 🗑️ Delete book (DELETE)
export const deleteBook = async (bookId) => {
  try {
    // console.log("🗑️ Deleting book with ID:", bookId);
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("No auth token found");

    const url = `${BASE_URLS}/api/books/${bookId}`;
    // console.log("🔗 DELETE API URL:", url);

    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // console.log("📡 DELETE response status:", response.status);
    // console.log("📡 DELETE response data:", response.data);

    Alert.alert("Success", "Book deleted successfully");

    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    Alert.alert("Error", "Failed to delete book. Please try again.");
    return { success: false };
  }
};

// ✏️ Update book (PUT)
export const updateBook = async (bookId, updatedBook) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("No auth token found");

    const formData = new FormData();
    formData.append("title", updatedBook.title);
    formData.append("author", updatedBook.author);
    formData.append("description", updatedBook.description);
    formData.append("price", updatedBook.price);
    formData.append("genre", updatedBook.genre);

    if (
      updatedBook.cover_image_url &&
      updatedBook.cover_image_url.startsWith("file")
    ) {
      const filename = updatedBook.cover_image_url.split("/").pop();
      const match = /\.(\w+)$/.exec(filename || "");
      const type = match ? `image/${match[1]}` : `image`;

      formData.append("cover_image", {
        uri: updatedBook.cover_image_url,
        name: filename,
        type,
      });
    }

    const url = `${BASE_URLS}/api/books/${bookId}`;

    const response = await axios.put(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        // "Content-Type": "multipart/form-data", // let axios handle it
      },
    });

    Alert.alert("Success", "Book updated successfully");
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Update error:", error);
    Alert.alert("Error", "Failed to update book. Please try again.");
    return { success: false };
  }
};