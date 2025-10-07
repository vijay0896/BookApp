import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";
import { TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import pickImage from "./Components/pickImage";
import uploadBook from "../services/uploadBook";

const AddResaleBookScreen = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    cover_image: null,
    price: "",
    availability: "available",
    status: "available",
  });

  const navigation = useNavigation();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const success = await uploadBook(formData, "resale");
    if (success) navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Upload Section */}
        <View style={styles.uploadSection}>
          <Text style={styles.sectionTitle}>Book Cover</Text>
          <TouchableOpacity
            style={styles.uploadBox}
            onPress={() =>
              pickImage((image) => handleChange("cover_image", image))
            }
          >
            {formData.cover_image ? (
              <Image
                source={{ uri: formData.cover_image.uri }}
                style={styles.uploadedImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <View style={styles.uploadIconCircle}>
                  <Ionicons name="image-outline" size={32} color="#6366F1" />
                </View>
                <Text style={styles.uploadText}>Tap to upload cover</Text>
                <Text style={styles.uploadSubtext}>PNG, JPG up to 10MB</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Book Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Title</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="book-outline"
                size={18}
                color="#9CA3AF"
                style={styles.inputIcon}
              />
              <TextInput
                mode="flat"
                value={formData.title}
                onChangeText={(text) => handleChange("title", text)}
                style={styles.input}
                placeholder="Enter book title"
                placeholderTextColor="#9CA3AF"
                underlineColor="transparent"
                activeUnderlineColor="transparent"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Author</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={18}
                color="#9CA3AF"
                style={styles.inputIcon}
              />
              <TextInput
                mode="flat"
                value={formData.author}
                onChangeText={(text) => handleChange("author", text)}
                style={styles.input}
                placeholder="Enter author name"
                placeholderTextColor="#9CA3AF"
                underlineColor="transparent"
                activeUnderlineColor="transparent"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Genre</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="pricetags-outline"
                size={18}
                color="#9CA3AF"
                style={styles.inputIcon}
              />
              <TextInput
                mode="flat"
                value={formData.genre}
                onChangeText={(text) => handleChange("genre", text)}
                style={styles.input}
                placeholder="e.g., Fiction, Science"
                placeholderTextColor="#9CA3AF"
                underlineColor="transparent"
                activeUnderlineColor="transparent"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
              <TextInput
                mode="flat"
                value={formData.description}
                onChangeText={(text) => handleChange("description", text)}
                style={[styles.input, styles.textArea]}
                placeholder="Write a brief description..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Price (₹)</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="cash-outline"
                size={18}
                color="#9CA3AF"
                style={styles.inputIcon}
              />
              <TextInput
                mode="flat"
                value={formData.price}
                onChangeText={(text) => handleChange("price", text)}
                style={styles.input}
                placeholder="Enter price"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                underlineColor="transparent"
                activeUnderlineColor="transparent"
              />
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>Add Book</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  uploadSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  uploadBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
  },
  uploadedImage: {
    width: "100%",
    height: 220,
  },
  uploadPlaceholder: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  uploadIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  uploadText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  formSection: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingLeft: 12,
  },
  textAreaWrapper: {
    alignItems: "flex-start",
    paddingTop: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    fontSize: 15,
    color: "#111827",
    paddingHorizontal: 0,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  actionsContainer: {
    gap: 12,
  },
  submitButton: {
    flexDirection: "row",
    backgroundColor: "#6366F1",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  cancelButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cancelButtonText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AddResaleBookScreen;