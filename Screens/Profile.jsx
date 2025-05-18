import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Button, Dialog, Portal, Provider } from "react-native-paper";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { BASE_URLS } from "../Utils/config";
import * as Location from "expo-location";
const ProfileScreen = ({ navigation, route }) => {
  const { setLoggedIn } = route.params; // Get setLoggedIn from HomeTabs
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUpdating, setImageUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  // const [editedUser, setEditedUser] = useState({});
  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const [editedUser, setEditedUser] = useState({ latitude: "", longitude: "" });

  useEffect(() => {
    fetchUserDetails();
  }, []);
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      route.params.setLoggedIn(false); // Update isLoggedIn in App.js
      hideDialog();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  const fetchUserDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("No auth token found");

      const response = await axios.get(`${BASE_URLS}/api/users/userDetails`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(response.data);
      setEditedUser(response.data);
      setLoading(false);
    } catch (error) {
      // console.error("Error fetching user details:", error);
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow access to your gallery."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUpdating(true);
      const imageUrl = result.assets[0].uri;
      setEditedUser({ ...editedUser, profileImage: imageUrl });
      setImageUpdating(false);
    }
  };
  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Location permission is required.");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    setEditedUser((prev) => ({
      ...prev,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    }));

    Alert.alert("Location Updated", `Lat: ${latitude}, Long: ${longitude}`);
    console.log(`Lat: ${latitude} And  Long: ${longitude}`);
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("No auth token found");

      const formData = new FormData();

      // Append only the fields that are being updated
      if (updatedData.name) formData.append("name", updatedData.name);
      if (updatedData.email) formData.append("email", updatedData.email);
      if (updatedData.phone) formData.append("phone", updatedData.phone);
      if (updatedData.address) formData.append("address", updatedData.address);
      if (updatedData.latitude)
        formData.append("latitude", updatedData.latitude);
      if (updatedData.longitude)
        formData.append("longitude", updatedData.longitude);

      // If a new profile image is uploaded
      if (
        updatedData.profileImage &&
        updatedData.profileImage.startsWith("file://")
      ) {
        formData.append("profileImage", {
          uri: updatedData.profileImage,
          name: "profile.jpg",
          type: "image/jpeg",
        });
      }

      const response = await axios.patch(
        `${BASE_URLS}/api/users/updateUser`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Alert.alert("Success", "Profile updated successfully");
      fetchUserDetails(); // Refresh user data
      setIsEditing(false);
    } catch (error) {
      console.error(
        "❌ Error updating profile:",
        error.response?.data || error.message
      );
      Alert.alert("Error", "Failed to update profile");
    }
  };

  const SkeletonProfile = () => (
    <View style={{ alignItems: "center", width: "100%" }}>
      <View
        style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: "#E1E9EE",
          marginBottom: 20,
        }}
      />
      {[...Array(4)].map((_, i) => (
        <View
          key={i}
          style={{
            width: "100%",
            height: 50,
            borderRadius: 10,
            backgroundColor: "#E1E9EE",
            marginBottom: 12,
          }}
        />
      ))}
      <View
        style={{
          width: "100%",
          height: 45,
          borderRadius: 8,
          backgroundColor: "#E1E9EE",
          marginTop: 20,
        }}
      />
      <View
        style={{
          width: "100%",
          height: 45,
          borderRadius: 8,
          backgroundColor: "#E1E9EE",
          marginTop: 10,
        }}
      />
    </View>
  );

  return (
    <Provider>
      <Portal>
        <View style={styles.container}>
          {loading ? (
            // <ActivityIndicator size="large" color="#007BFF" />
            <SkeletonProfile />
          ) : user ? (
            <>
              {/* Profile Image */}
              <View style={styles.profileContainer}>
                <Image
                  source={{
                    uri:
                      editedUser.profileImage ||
                      "https://via.placeholder.com/150/007BFF/FFFFFF?text=User",
                  }}
                  style={styles.profileImage}
                />
                {isEditing && ( // Show the edit icon only when editing mode is enabled
                  <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
                    <Feather name="edit" size={16} color="white" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Profile Fields */}
              <View style={styles.inputContainer}>
                <MaterialIcons name="person-outline" size={20} color="#999" />
                <TextInput
                  style={styles.input}
                  value={editedUser.name}
                  onChangeText={(text) =>
                    setEditedUser({ ...editedUser, name: text })
                  }
                  editable={isEditing}
                />
              </View>

              <View style={styles.inputContainer}>
                <MaterialIcons name="email" size={20} color="#999" />
                <TextInput
                  style={styles.input}
                  value={editedUser.email}
                  onChangeText={(text) =>
                    setEditedUser({ ...editedUser, email: text })
                  }
                  editable={isEditing}
                />
              </View>

              <View style={styles.inputContainer}>
                <Feather name="phone" size={20} color="#999" />
                <TextInput
                  style={styles.input}
                  value={editedUser.phone ? editedUser.phone : "N/A"}
                  onChangeText={(text) =>
                    setEditedUser({ ...editedUser, phone: text })
                  }
                  editable={isEditing}
                />
              </View>

              <View style={styles.inputContainer}>
                <Feather name="map-pin" size={20} color="#999" />
                <TextInput
                  style={styles.input}
                  value={editedUser.address ? editedUser.address : "N/A"}
                  onChangeText={(text) =>
                    setEditedUser({ ...editedUser, address: text })
                  }
                  editable={isEditing}
                />
              </View>
              <View style={styles.LocationContainer}>
                {isEditing && (
                  <>
                    <Button
                      mode="outlined"
                      onPress={getCurrentLocation}
                      style={styles.locationButton}
                      // icon="location-on"
                    >
                      Get Current Location
                    </Button>

                    {/* Displaying Latitude and Longitude */}
                    {editedUser.latitude && editedUser.longitude && (
                      <View style={styles.locationInfo}>
                        <Text style={styles.locationText}>
                          Latitude: {editedUser.latitude}
                        </Text>
                        <Text style={styles.locationText}>
                          Longitude: {editedUser.longitude}
                        </Text>
                      </View>
                    )}
                  </>
                )}
              </View>

              {/* Buttons */}
              {isEditing ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "80%",
                  }}
                >
                  <Button
                    mode="contained"
                    onPress={() => {
                      setEditedUser(user); // Reset changes
                      setIsEditing(false);
                    }}
                    style={[styles.cancelButton, { marginRight: 10 }]}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() => handleUpdateProfile(editedUser)}
                    style={styles.saveButton}
                  >
                    Save Changes
                  </Button>
                </View>
              ) : (
                <Button
                  mode="contained"
                  onPress={() => setIsEditing(true)}
                  style={styles.editButton}
                >
                  Edit Profile
                </Button>
              )}

              <Button
                mode="contained"
                onPress={showDialog}
                style={styles.logoutButton}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              {" "}
              <Text style={styles.errorText}>Failed to load user details.</Text>
              <Button
                mode="contained"
                onPress={showDialog}
                style={styles.logoutButton}
              >
                Logout
              </Button>
            </>
          )}
        </View>

        {/* Logout Confirmation Dialog */}
        <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialog}>
          <Dialog.Title>Are you sure?</Dialog.Title>
          <Dialog.Content>
            <Text>Do you really want to log out?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog} textColor="#3E494A">
              Cancel
            </Button>
            <Button onPress={handleLogout} textColor="#3E494A">
              Logout
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Provider>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  profileContainer: { position: "relative", marginBottom: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007BFF",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    width: "100%",
  },
  input: { flex: 1, fontSize: 16, color: "#333", marginLeft: 10 },
  editButton: { backgroundColor: "#007BFF", marginTop: 20 },
  saveButton: { backgroundColor: "#28A745", marginTop: 20 },
  logoutButton: { backgroundColor: "#FF4D4D", marginTop: 20 },
  cancelButton: {
    backgroundColor: "#6c757d", // Gray color for cancel button
    marginTop: 20,
    flex: 1,
  },
  locationButton: {
    marginTop: 10,
    width: "60%",
    borderColor: "#007BFF", // Optional: Change border color
  },
  locationInfo: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 5,
    width: "100%",
  },
  LocationContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    width: "100%",
  },
});

export default ProfileScreen;
