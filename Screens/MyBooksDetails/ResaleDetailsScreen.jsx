import React, { useState } from "react";
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
import { Button, Dialog, Portal, Provider } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
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
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const [visible, setVisible] = useState(false);
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
      console.log("Selected Image URI:", asset.uri);
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
        <>
          <Button
            icon="delete"
            textColor="red"
            onPress={showDialog}
            contentStyle={{ flexDirection: "row-reverse" }}
          >
            Delete
          </Button>

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{ marginRight: 15 }}
          >
            <Text style={{ color: "#007BFF", fontSize: 16, fontWeight: "600" }}>
              Edit
            </Text>
          </TouchableOpacity>
        </>
      ),
    });
  }, [navigation]);

  return (
    <Provider>
      <Portal>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Book Cover */}
          <View style={styles.imageContainer}>
            {bookData.cover_image_url ? (
              <Image
                source={{ uri: bookData.cover_image_url }}
                style={styles.image}
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Text>No Image Available</Text>
              </View>
            )}
          </View>

          {/* Genre Tag */}
          <View style={styles.genreTag}>
            <Text style={styles.genreText}>
              {bookData.genre || "Unknown Genre"}
            </Text>
          </View>

          {/* Book Info */}
          <View style={styles.infoSection}>
            <Text style={styles.title}>{bookData.title}</Text>
            <Text style={styles.author}>
              by {bookData.author || "Unknown Author"}
            </Text>
            <Text style={styles.description}>
              {bookData.description ||
                "No description available for this book."}
            </Text>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Price:</Text>
              <Text style={styles.priceValue}>
                ₹{bookData.price != null ? bookData.price : "Not for sale"}
              </Text>
            </View>
          </View>

          {/* Modal for editing */}
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={false}
          >
            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Book Information</Text>

              {/* Grouped Fields */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter book title"
                  value={updatedBook.title}
                  onChangeText={(text) =>
                    setUpdatedBook({ ...updatedBook, title: text })
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Author</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter author's name"
                  value={updatedBook.author}
                  onChangeText={(text) =>
                    setUpdatedBook({ ...updatedBook, author: text })
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Write a brief description..."
                  multiline
                  value={updatedBook.description}
                  onChangeText={(text) =>
                    setUpdatedBook({ ...updatedBook, description: text })
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Price (₹)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={String(updatedBook.price)}
                  onChangeText={(text) =>
                    setUpdatedBook({ ...updatedBook, price: Number(text) })
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Genre</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Fiction, Science"
                  value={updatedBook.genre}
                  onChangeText={(text) =>
                    setUpdatedBook({ ...updatedBook, genre: text })
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Cover Image</Text>

                {updatedBook.cover_image_url ? (
                  <Image
                    source={{ uri: updatedBook.cover_image_url }}
                    style={{
                      width: 100,
                      height: 140,
                      marginBottom: 10,
                      borderRadius: 8,
                    }}
                  />
                ) : (
                  <Text style={{ color: "#888", marginBottom: 10 }}>
                    No image selected
                  </Text>
                )}

                <TouchableOpacity
                  onPress={pickImage}
                  style={[styles.button, { backgroundColor: "#6C63FF" }]}
                >
                  <Text style={styles.buttonText}>Select Image</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleUpdate}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? "Updating..." : "Update"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={[styles.buttonText, { color: "#555" }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Modal>
        </ScrollView>

        <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialog}>
          <Dialog.Title>Are you sure?</Dialog.Title>
          <Dialog.Content>
            <Text>Do you really want to delete this book ?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog} textColor="#3E494A">
              Cancel
            </Button>
            <Button onPress={handleDelete} textColor="red">
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  imageContainer: {
    width: "100%",
    height: 250,
    backgroundColor: "#E1E4E8",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 220,
    borderRadius: 10,
    resizeMode: "cover",
  },
  placeholderImage: {
    width: 150,
    height: 220,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  genreTag: {
    backgroundColor: "#EEF1F1",
    alignSelf: "flex-start",
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 10,
  },
  genreText: {
    color: "#607D8B",
    fontSize: 13,
    fontWeight: "500",
  },
  infoSection: {
    paddingHorizontal: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 4,
  },
  author: {
    fontSize: 16,
    color: "#6C757D",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: "#3E494A",
    lineHeight: 22,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#495057",
    marginRight: 6,
  },
  priceValue: {
    fontSize: 16,
    color: "#28a745",
    fontWeight: "bold",
  },
  buyButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  buyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContent: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#2C3E50",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  formGroup: {
    marginBottom: 10,
  },
  label: {
    fontSize: 15,
    color: "#333",
    marginBottom: 6,
    fontWeight: "600",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 1,
    marginBottom: 50,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 6,
  },
  saveButton: {
    backgroundColor: "#007BFF",
  },
  cancelButton: {
    backgroundColor: "#EAEAEA",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

export default ResaleBooksDetails;
