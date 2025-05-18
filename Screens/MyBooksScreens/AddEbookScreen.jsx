import React, { useState } from "react";
import { sharedStyles as styles } from "./Styles/AddBooksScreenStyles";
import {
  View,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";

import { TextInput, Button, Text } from "react-native-paper";

import { useNavigation } from "@react-navigation/native";
import pickImage from "./Components/pickImage";

import uploadBook from "../services/uploadBook";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const AddEbookScreen = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    cover_image: null,
    availability: "available",
    rental_price: "",
    rental_duration: "",
    pdf: null,
  });
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  
  const pickPdf = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

      if (result?.assets && result.assets.length > 0) {
        handleChange("pdf", result.assets[0]);
      }
    } catch (error) {
      console.error("PDF Pick Error:", error);
      Alert.alert("Error", "Failed to pick PDF file");
    }
  };
  const handleSubmit = async () => {
    const success = await uploadBook(formData, "rental");
    if (success) navigation.goBack();
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F5F7FA" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.imageUpload} onPress={() => pickImage((image) => handleChange("cover_image", image))}>
          {formData.cover_image ? (
            <Image
              source={{ uri: formData.cover_image.uri }}
              style={styles.coverImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <MaterialCommunityIcons name="upload" size={34} color="#777" />
              <Text style={styles.uploadText}>Upload Book Cover</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.pdfUpload} onPress={pickPdf}>
          <View style={styles.uploadPlaceholder}>
            <MaterialCommunityIcons
              name="file-pdf-box"
              size={34}
              color="#d32f2f"
            />
            <Text style={styles.uploadText}>
              {formData.pdf ? formData.pdf.name : "Upload PDF File"}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.card}>
          <TextInput
            mode="outlined"
            label="Book Name"
            value={formData.title}
            onChangeText={(text) => handleChange("title", text)}
            style={styles.input}
          />

          <TextInput
            mode="outlined"
            label="Author"
            value={formData.author}
            onChangeText={(text) => handleChange("author", text)}
            style={styles.input}
          />

          <TextInput
            mode="outlined"
            label="Category"
            value={formData.genre}
            onChangeText={(text) => handleChange("genre", text)}
            style={styles.input}
          />

          <TextInput
            mode="outlined"
            label="Description"
            value={formData.description}
            onChangeText={(text) => handleChange("description", text)}
            style={styles.input}
            multiline
            numberOfLines={4}
          />

          <TextInput
            mode="outlined"
            label="Ebook rent Price (in ₹)"
            value={formData.rental_price}
            onChangeText={(text) => handleChange("rental_price", text)}
            style={styles.input}
            keyboardType="numeric"
          />
          <TextInput
            mode="outlined"
            label="Rent Duration"
            value={formData.rental_duration}
            onChangeText={(text) => handleChange("rental_duration", text)}
            style={styles.input}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.buttonRow}>
          <Button
            mode="outlined"
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            style={[styles.button, styles.addButton]}
            onPress={handleSubmit}
          >
            Add Book
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddEbookScreen;
