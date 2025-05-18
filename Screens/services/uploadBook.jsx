// utils/uploadBook.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { BASE_URLS } from "../../Utils/config";

const uploadBook = async (formData, serviceType) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("No auth token");

    const form = new FormData();

    // Common fields
    form.append("title", formData.title);
    form.append("author", formData.author);
    form.append("genre", formData.genre);
    form.append("description", formData.description);
    form.append("availability", formData.availability || "available");
    form.append("service_type", serviceType);

    // Conditional fields
    if (serviceType === "resale") {
      form.append("price", formData.price);
      form.append("status", formData.status || "available");
    } else if (serviceType === "rental") {
      form.append("rental_price", formData.rental_price);
      form.append("rental_duration", formData.rental_duration);

      if (formData.pdf) {
        const fileUri = formData.pdf.uri;
        const fileName = formData.pdf.name || fileUri.split("/").pop();

        form.append("pdf", {
          uri: fileUri,
          name: fileName,
          type: "application/pdf",
        });
      }
    }

    // Cover image
    if (formData.cover_image) {
      const fileUri = formData.cover_image.uri;
      const fileName = fileUri.split("/").pop();
      const fileType = fileName.split(".").pop();

      form.append("cover_image", {
        uri: fileUri,
        name: fileName,
        type: `image/${fileType}`,
      });
    }

    await axios.post(`${BASE_URLS}/api/books`, form, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    Alert.alert("Success", "Book added successfully");
    return true;
  } catch (err) {
    console.error("Upload error:", err.response?.data || err.message);
    Alert.alert("Error", "Failed to add book");
    return false;
  }
};

export default uploadBook;
