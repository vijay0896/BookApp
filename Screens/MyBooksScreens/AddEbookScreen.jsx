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
  ActivityIndicator,
} from "react-native";
import { TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import pickImage from "./Components/pickImage";
import uploadBook from "../services/uploadBook";
import * as DocumentPicker from "expo-document-picker";

const AddEbookScreen = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    cover_image: null,
    pdf: null,
    rental_price: "",
    rental_duration: "",
    availability: "available",
  });

  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

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
    if (!formData.title || !formData.cover_image || !formData.pdf) {
      return Alert.alert("Error", "Please fill all required fields and upload files");
    }

    setLoading(true);

    try {
      const success = await uploadBook(formData, "rental");
      if (success) navigation.goBack();
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", "Failed to upload book. Please try again.");
    } finally {
      setLoading(false);
    }
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
        {/* Upload Sections */}
        <View style={styles.uploadsGrid}>
          {/* Cover Upload */}
          <View style={styles.uploadColumn}>
            <Text style={styles.sectionTitle}>Book Cover</Text>
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={() =>
                pickImage((image) => handleChange("cover_image", image))
              }
              disabled={loading}
            >
              {formData.cover_image ? (
                <Image
                  source={{ uri: formData.cover_image.uri }}
                  style={styles.uploadedCover}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <View style={[styles.uploadIconCircle, { backgroundColor: "#EEF2FF" }]}>
                    <Ionicons name="image-outline" size={28} color="#6366F1" />
                  </View>
                  <Text style={styles.uploadText}>Cover</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* PDF Upload */}
          <View style={styles.uploadColumn}>
            <Text style={styles.sectionTitle}>PDF File</Text>
            <TouchableOpacity 
              style={styles.uploadBox} 
              onPress={pickPdf}
              disabled={loading}
            >
              {formData.pdf ? (
                <View style={styles.pdfUploaded}>
                  <View style={styles.pdfIconBox}>
                    <Ionicons name="document-text" size={32} color="#FFFFFF" />
                  </View>
                  <Text style={styles.pdfFileName} numberOfLines={2}>
                    {formData.pdf.name}
                  </Text>
                  <View style={styles.pdfBadge}>
                    <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                    <Text style={styles.pdfBadgeText}>Uploaded</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <View style={[styles.uploadIconCircle, { backgroundColor: "#FEE2E2" }]}>
                    <Ionicons name="document-outline" size={28} color="#EF4444" />
                  </View>
                  <Text style={styles.uploadText}>PDF</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
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
                editable={!loading}
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
                editable={!loading}
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
                editable={!loading}
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
                editable={!loading}
              />
            </View>
          </View>

          {/* Rental Info Row */}
          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>Rental Price (₹)</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="cash-outline"
                  size={18}
                  color="#9CA3AF"
                  style={styles.inputIcon}
                />
                <TextInput
                  mode="flat"
                  value={formData.rental_price}
                  onChangeText={(text) => handleChange("rental_price", text)}
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  editable={!loading}
                />
              </View>
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.inputLabel}>Duration (days)</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color="#9CA3AF"
                  style={styles.inputIcon}
                />
                <TextInput
                  mode="flat"
                  value={formData.rental_duration}
                  onChangeText={(text) => handleChange("rental_duration", text)}
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  editable={!loading}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Submitting...</Text>
              </>
            ) : (
              <>
                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Add eBook</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={[styles.cancelButtonText, loading && styles.cancelButtonTextDisabled]}>
              Cancel
            </Text>
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
  uploadsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  uploadColumn: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },
  uploadBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    aspectRatio: 0.7,
  },
  uploadedCover: {
    width: "100%",
    height: "80%",
  },
  uploadPlaceholder: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  uploadIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  pdfUploaded: {
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F9FAFB",
  },
  pdfIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  pdfFileName: {
    fontSize: 11,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
    marginBottom: 8,
  },
  pdfBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  pdfBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#10B981",
  },
  formSection: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
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
    fontSize: 14,
    color: "#111827",
    paddingHorizontal: 0,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  rowInputs: {
    flexDirection: "row",
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
  submitButtonDisabled: {
    opacity: 0.7,
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
  cancelButtonTextDisabled: {
    opacity: 0.5,
  },
});

export default AddEbookScreen