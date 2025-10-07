import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button, Dialog, Portal, Provider } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { deleteBook, updateBook } from "../services/bookService";
import * as ImagePicker from "expo-image-picker";

const EBooksDetails = ({ bookId }) => {
  const route = useRoute();
  const navigation = useNavigation();
  const { book: initialBook } = route.params;
  const [bookData, setBookData] = useState(initialBook);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatedBook, setUpdatedBook] = useState({ ...bookData });
  const [modalVisible, setModalVisible] = useState(false);

  const openPdfInApp = () => {
    if (bookData.pdf_url) {
      navigation.navigate("PDFViewer", { pdfUrl: bookData.pdf_url });
    } else {
      Alert.alert("No PDF", "This book does not have a PDF file.");
    }
  };

  const handleDelete = async () => {
    const result = await deleteBook(bookData.book_id);
    if (result.success) {
      hideDialog();
      setTimeout(() => {
        navigation.goBack();
      }, 500);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const result = await updateBook(bookData.book_id, updatedBook);
      setLoading(false);
      if (result.success) {
        setBookData({ ...bookData, ...updatedBook });
        setModalVisible(false);
      } else {
        console.log("Update failed:", result.message);
      }
    } catch (error) {
      console.error("Update error:", error);
      setLoading(false);
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
      console.log("Selected Image URI:", asset.uri);
      setUpdatedBook({ ...updatedBook, cover_image_url: asset.uri });
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
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
          {/* Hero Section with Cover */}
          <View style={styles.heroSection}>
            <View style={styles.coverWrapper}>
              {bookData.cover_image_url ? (
                <Image
                  source={{ uri: bookData.cover_image_url }}
                  style={styles.coverImage}
                />
              ) : (
                <View style={styles.placeholderCover}>
                  <Ionicons name="book" size={64} color="#9CA3AF" />
                </View>
              )}
              <View style={styles.coverShadow} />
            </View>
          </View>

          {/* Content Section */}
          <View style={styles.contentSection}>
            {/* Genre Badge */}
            <View style={styles.genreBadge}>
              <Text style={styles.genreText}>{bookData.genre}</Text>
            </View>

            {/* Title & Author */}
            <Text style={styles.bookTitle}>{bookData.title}</Text>
            <View style={styles.authorRow}>
              <Ionicons name="person-circle-outline" size={18} color="#6B7280" />
              <Text style={styles.authorText}>{bookData.author}</Text>
            </View>

            {/* Description Card */}
            {bookData.description && (
              <View style={styles.descriptionCard}>
                <Text style={styles.descriptionTitle}>Description</Text>
                <Text style={styles.descriptionText}>{bookData.description}</Text>
              </View>
            )}

            {/* Info Grid */}
            <View style={styles.infoGrid}>
              <View style={styles.infoBox}>
                <View style={styles.infoIconCircle}>
                  <Ionicons name="calendar-outline" size={22} color="#8B5CF6" />
                </View>
                <Text style={styles.infoLabel}>Duration</Text>
                <Text style={styles.infoValue}>{bookData.rental_duration} days</Text>
              </View>

              <View style={styles.infoBox}>
                <View style={[styles.infoIconCircle, { backgroundColor: "#D1FAE5" }]}>
                  <Ionicons name="cash-outline" size={22} color="#10B981" />
                </View>
                <Text style={styles.infoLabel}>Rental Price</Text>
                <Text style={[styles.infoValue, styles.priceText]}>₹{bookData.rental_price}</Text>
              </View>
            </View>

            {/* Action Button */}
            <TouchableOpacity onPress={openPdfInApp} style={styles.actionButton}>
              <View style={styles.buttonContent}>
                <Ionicons name="reader-outline" size={22} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Read PDF</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Edit Modal */}
        <Modal visible={modalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            {/* Modal Header */}
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
                    placeholder="Write a brief description about the book..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={4}
                    value={updatedBook.description}
                    onChangeText={(text) =>
                      setUpdatedBook({ ...updatedBook, description: text })
                    }
                  />
                </View>

                <View style={styles.rowInputs}>
                  <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.inputLabel}>Price (₹)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="0"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      value={String(updatedBook.rental_price)}
                      onChangeText={(text) =>
                        setUpdatedBook({
                          ...updatedBook,
                          rental_price: Number(text),
                        })
                      }
                    />
                  </View>

                  <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.inputLabel}>Days</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="0"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      value={String(updatedBook.rental_duration)}
                      onChangeText={(text) =>
                        setUpdatedBook({
                          ...updatedBook,
                          rental_duration: Number(text),
                        })
                      }
                    />
                  </View>
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
              This action cannot be undone. The book will be permanently removed from your library.
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
  container: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  headerIconButton: {
    padding: 8,
    marginLeft: 4,
  },
  heroSection: {
    backgroundColor: "#F9FAFB",
    paddingTop: 20,
    paddingBottom: 60,
    alignItems: "center",
  },
  coverWrapper: {
    position: "relative",
  },
  coverImage: {
    width: 150,
    height: 220,
    borderRadius: 16,
    resizeMode: "cover",
  },
  placeholderCover: {
    width: 180,
    height: 260,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  coverShadow: {
    position: "absolute",
    bottom: -20,
    left: 20,
    right: 20,
    height: 20,
    backgroundColor: "#000",
    opacity: 0.1,
    borderRadius: 100,
    transform: [{ scaleX: 1.2 }],
  },
  contentSection: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -40,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  genreBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  genreText: {
    color: "#8B5CF6",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827df",
    marginBottom: 8,
    lineHeight: 32,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    gap: 6,
  },
  authorText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  descriptionCard: {
    backgroundColor: "#F9FAFB",
    padding: 20,
    borderRadius: 16,
    marginBottom: 14,
  },
  descriptionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  descriptionText: {
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 24,
  },
  infoGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 14,
  },
  infoBox: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  infoIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 28,
    backgroundColor: "#EDE9FE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  infoLabel: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "700",
  },
  priceText: {
    color: "#10B981",
    fontSize: 16,
  },
  actionButton: {
    flexDirection: "row",
    backgroundColor: "#111827",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
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
  rowInputs: {
    flexDirection: "row",
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
    fontSize: 15,
    fontWeight: "700",
  },
  dialogText: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 22,
  },
});

export default EBooksDetails;