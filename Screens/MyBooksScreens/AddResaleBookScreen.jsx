import React, { useState } from "react";
import { sharedStyles as styles } from "./Styles/AddBooksScreenStyles";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";
import { TextInput, Button, Text, Title } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import pickImage from "./Components/pickImage";
import { BASE_URLS } from "../../Utils/config";
import uploadBook from "../services/uploadBook";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
            label="Genre"
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
            label="Price (in ₹)"
            value={formData.price}
            onChangeText={(text) => handleChange("price", text)}
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



export default AddResaleBookScreen;
{/* <TextInput
            mode="outlined"
            label="Condition (e.g. Like New)"
            value={formData.status}
            onChangeText={(text) => handleChange("status", text)}
            style={styles.input}
          /> */}
