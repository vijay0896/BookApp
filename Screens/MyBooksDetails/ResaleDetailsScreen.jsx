import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button, Dialog, Portal, Provider } from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { deleteBook, updateBook } from "../services/bookService";

const ResaleBooksDetails = () => {
  const route = useRoute();
  const { book: initialBook } = route.params;
  const [bookData, setBookData] = useState(initialBook);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [updatedBook, setUpdatedBook] = useState({ ...bookData });
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const handleUpdate = async () => {
    setLoading(true);
    const result = await updateBook(bookData.Book_id, updatedBook);
    setLoading(false);

    if (result.success) {
      setBookData({ ...bookData, ...updatedBook });
      setModalVisible(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setUpdatedBook({ ...updatedBook, cover_image_url: asset.uri });
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteBook(bookData.Book_id);
    setLoading(false);

    if (result.success) {
      hideDialog();
      navigation.goBack();
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.headerIconButton}>
            <Ionicons name="pencil" size={20} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity onPress={showDialog} style={styles.headerIconButton}>
            <Ionicons name="trash-outline" size={20} color="#111827" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <Provider>
      <Portal>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.coverWrapper}>
              {bookData.cover_image_url ? (
                <Image
                  source={{ uri: bookData.cover_image_url }}
                  style={styles.coverImage}
                />
              ) : (
                <View style={styles.placeholderCover}>
                  <Ionicons name="book" size={48} color="#9CA3AF" />
                </View>
              )}
              <View style={styles.coverShadow} />
            </View>
          </View>

          {/* Content Section */}
          <View style={styles.contentSection}>
            {/* Genre Badge */}
            <View style={styles.genreBadge}>
              <Text style={styles.genreText}>{bookData.genre || "Unknown"}</Text>
            </View>

            {/* Title & Author */}
            <Text style={styles.bookTitle}>{bookData.title}</Text>
            <View style={styles.authorRow}>
              <Ionicons name="person-circle-outline" size={16} color="#6B7280" />
              <Text style={styles.authorText}>{bookData.author || "Unknown Author"}</Text>
            </View>

            {/* Description Card */}
            {bookData.description && (
              <View style={styles.descriptionCard}>
                <Text style={styles.descriptionTitle}>Description</Text>
                <Text style={styles.descriptionText}>{bookData.description}</Text>
              </View>
            )}

            {/* Price Info */}
            <View style={styles.priceCard}>
              <View style={styles.priceIconCircle}>
                <Ionicons name="pricetag" size={22} color="#10B981" />
              </View>
              <View style={styles.priceContent}>
                <Text style={styles.priceLabel}>Sale Price</Text>
                <Text style={styles.priceValue}>
                  ₹{bookData.price != null ? bookData.price : "Not for sale"}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Edit Modal */}
        <Modal visible={modalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Book Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Ionicons name="close-circle" size={28} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {/* Cover Image Section */}
              <View style={styles.modalImageSection}>
                {updatedBook.cover_image_url ? (
                  <Image
                    source={{ uri: updatedBook.cover_image_url }}
                    style={styles.modalPreviewImage}
                  />
                ) : (
                  <View style={styles.modalPlaceholder}>
                    <Ionicons name="images" size={40} color="#D1D5DB" />
                  </View>
                )}
                <TouchableOpacity onPress={pickImage} style={styles.changeImageButton}>
                  <Ionicons name="camera" size={18} color="#FFFFFF" />
                  <Text style={styles.changeImageText}>Change Cover</Text>
                </TouchableOpacity>
              </View>

              {/* Form Fields */}
              <View style={styles.formSection}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Book Title</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter book title"
                    placeholderTextColor="#9CA3AF"
                    value={updatedBook.title}
                    onChangeText={(text) =>
                      setUpdatedBook({ ...updatedBook, title: text })
                    }
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Author Name</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter author name"
                    placeholderTextColor="#9CA3AF"
                    value={updatedBook.author}
                    onChangeText={(text) =>
                      setUpdatedBook({ ...updatedBook, author: text })
                    }
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Genre</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g., Fiction, Science, History"
                    placeholderTextColor="#9CA3AF"
                    value={updatedBook.genre}
                    onChangeText={(text) =>
                      setUpdatedBook({ ...updatedBook, genre: text })
                    }
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Description</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    placeholder="Write a brief description..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={4}
                    value={updatedBook.description}
                    onChangeText={(text) =>
                      setUpdatedBook({ ...updatedBook, description: text })
                    }
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Price (₹)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="0"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={String(updatedBook.price)}
                    onChangeText={(text) =>
                      setUpdatedBook({ ...updatedBook, price: Number(text) })
                    }
                  />
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleUpdate}
                  disabled={loading}
                >
                  <Text style={styles.saveButtonText}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>

        {/* Delete Dialog */}
        <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Delete this book?</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              This action cannot be undone. The book will be permanently removed.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog} textColor="#6B7280" labelStyle={{ fontWeight: "600" }}>
              Cancel
            </Button>
            <Button onPress={handleDelete} textColor="#EF4444" labelStyle={{ fontWeight: "600" }}>
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerIconButton: {
    padding: 8,
    marginLeft: 4,
  },
  heroSection: {
    backgroundColor: "#F9FAFB",
    paddingTop: 16,
    paddingBottom: 40,
    alignItems: "center",
  },
  coverWrapper: {
    position: "relative",
  },
  coverImage: {
    width: 130,
    height: 190,
    borderRadius: 12,
    resizeMode: "cover",
  },
  placeholderCover: {
    width: 130,
    height: 190,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  coverShadow: {
    position: "absolute",
    bottom: -15,
    left: 15,
    right: 15,
    height: 15,
    backgroundColor: "#000",
    opacity: 0.08,
    borderRadius: 100,
    transform: [{ scaleX: 1.2 }],
  },
  contentSection: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -30,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
  },
  genreBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  genreText: {
    color: "#8B5CF6",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
    lineHeight: 26,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 5,
  },
  authorText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  descriptionCard: {
    backgroundColor: "#F9FAFB",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  descriptionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  descriptionText: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 20,
  },
  priceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
  },
  priceIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  priceContent: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 16,
    color: "#10B981",
    fontWeight: "700",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  modalScroll: {
    flex: 1,
  },
  modalImageSection: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "#F9FAFB",
  },
  modalPreviewImage: {
    width: 140,
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  modalPlaceholder: {
    width: 140,
    height: 200,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  changeImageButton: {
    flexDirection: "row",
    backgroundColor: "#111827",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    alignItems: "center",
    gap: 8,
  },
  changeImageText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  formSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#111827",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
    paddingTop: 14,
  },
  modalActions: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  saveButton: {
    backgroundColor: "#111827",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  cancelButton: {
    backgroundColor: "#F9FAFB",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "700",
  },
  dialog: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  dialogText: {
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 22,
  },
});

export default ResaleBooksDetails;