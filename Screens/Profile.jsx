
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
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Button, Dialog, Portal, Provider } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { BASE_URLS } from "../Utils/config";
import * as Location from "expo-location";

const ProfileScreen = ({ navigation, route }) => {
  const { setLoggedIn } = route.params;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUpdating, setImageUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editedUser, setEditedUser] = useState({ latitude: "", longitude: "" });

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      route.params.setLoggedIn(false);
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
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Please allow access to your gallery.");
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
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("No auth token found");

      const formData = new FormData();

      if (updatedData.name) formData.append("name", updatedData.name);
      if (updatedData.email) formData.append("email", updatedData.email);
      if (updatedData.phone) formData.append("phone", updatedData.phone);
      if (updatedData.address) formData.append("address", updatedData.address);
      if (updatedData.latitude) formData.append("latitude", updatedData.latitude);
      if (updatedData.longitude) formData.append("longitude", updatedData.longitude);

      if (updatedData.profileImage && updatedData.profileImage.startsWith("file://")) {
        formData.append("profileImage", {
          uri: updatedData.profileImage,
          name: "profile.jpg",
          type: "image/jpeg",
        });
      }

      const response = await axios.patch(`${BASE_URLS}/api/users/updateUser`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert("Success", "Profile updated successfully");
      fetchUserDetails();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={64} color="#D1D5DB" />
        <Text style={styles.errorText}>Failed to load profile</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={showDialog}>
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Provider>
      <Portal>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: editedUser.profileImage || "https://via.placeholder.com/150/6366F1/FFFFFF?text=User",
                }}
                style={styles.avatar}
              />
              {isEditing && (
                <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
                  <Ionicons name="camera" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </View>

            {!isEditing && (
              <Text style={styles.userName}>{editedUser.name}</Text>
            )}
          </View>

          {/* Info Cards */}
          <View style={styles.cardsContainer}>
            {/* Name Card */}
            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <View style={styles.iconBox}>
                  <Ionicons name="person" size={18} color="#6366F1" />
                </View>
                <Text style={styles.cardLabel}>Name</Text>
              </View>
              <TextInput
                style={[styles.cardInput, !isEditing && styles.cardInputDisabled]}
                value={editedUser.name}
                onChangeText={(text) => setEditedUser({ ...editedUser, name: text })}
                editable={isEditing}
                placeholder="Enter your name"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Email Card */}
            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: "#DBEAFE" }]}>
                  <Ionicons name="mail" size={18} color="#3B82F6" />
                </View>
                <Text style={styles.cardLabel}>Email</Text>
              </View>
              <TextInput
                style={[styles.cardInput, !isEditing && styles.cardInputDisabled]}
                value={editedUser.email}
                onChangeText={(text) => setEditedUser({ ...editedUser, email: text })}
                editable={isEditing}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Phone Card */}
            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: "#D1FAE5" }]}>
                  <Ionicons name="call" size={18} color="#10B981" />
                </View>
                <Text style={styles.cardLabel}>Phone</Text>
              </View>
              <TextInput
                style={[styles.cardInput, !isEditing && styles.cardInputDisabled]}
                value={editedUser.phone || ""}
                onChangeText={(text) => setEditedUser({ ...editedUser, phone: text })}
                editable={isEditing}
                placeholder="Enter your phone"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Address Card */}
            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: "#FEF3C7" }]}>
                  <Ionicons name="location" size={18} color="#F59E0B" />
                </View>
                <Text style={styles.cardLabel}>Address</Text>
              </View>
              <TextInput
                style={[styles.cardInput, !isEditing && styles.cardInputDisabled]}
                value={editedUser.address || ""}
                onChangeText={(text) => setEditedUser({ ...editedUser, address: text })}
                editable={isEditing}
                placeholder="Enter your address"
                placeholderTextColor="#9CA3AF"
                multiline
              />
            </View>

            {/* Location Card (only in edit mode) */}
            {isEditing && (
              <View style={styles.infoCard}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconBox, { backgroundColor: "#FCE7F3" }]}>
                    <Ionicons name="navigate" size={18} color="#EC4899" />
                  </View>
                  <Text style={styles.cardLabel}>Location</Text>
                </View>

                <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
                  <Ionicons name="location" size={18} color="#6366F1" />
                  <Text style={styles.locationButtonText}>Get Current Location</Text>
                </TouchableOpacity>

                {editedUser.latitude && editedUser.longitude && (
                  <View style={styles.coordsContainer}>
                    <View style={styles.coordRow}>
                      <Text style={styles.coordLabel}>Lat:</Text>
                      <Text style={styles.coordValue}>{editedUser.latitude}</Text>
                    </View>
                    <View style={styles.coordRow}>
                      <Text style={styles.coordLabel}>Long:</Text>
                      <Text style={styles.coordValue}>{editedUser.longitude}</Text>
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            {isEditing ? (
              <View style={styles.editActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setEditedUser(user);
                    setIsEditing(false);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => handleUpdateProfile(editedUser)}
                >
                  <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                <Ionicons name="create" size={18} color="#FFFFFF" />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.logoutButton} onPress={showDialog}>
              <Ionicons name="log-out" size={18} color="#EF4444" />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Logout Dialog */}
        <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Logout</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>Are you sure you want to logout?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog} textColor="#6B7280" labelStyle={{ fontWeight: "600" }}>
              Cancel
            </Button>
            <Button onPress={handleLogout} textColor="#EF4444" labelStyle={{ fontWeight: "600" }}>
              Logout
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  errorText: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 12,
    marginBottom: 20,
  },
  header: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#F3F4F6",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#6366F1",
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  cardsContainer: {
    padding: 16,
    gap: 12,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  cardInput: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "500",
    paddingVertical: 4,
  },
  cardInputDisabled: {
    color: "#4B5563",
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF2FF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 8,
    marginTop: 8,
  },
  locationButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6366F1",
  },
  coordsContainer: {
    marginTop: 12,
    backgroundColor: "#F9FAFB",
    padding: 10,
    borderRadius: 8,
    gap: 6,
  },
  coordRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  coordLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
    width: 50,
  },
  coordValue: {
    fontSize: 12,
    color: "#111827",
    fontWeight: "500",
  },
  actionsContainer: {
    padding: 16,
    gap: 10,
    paddingBottom: 32,
  },
  editActions: {
    flexDirection: "row",
    gap: 10,
  },
  editButton: {
    flexDirection: "row",
    backgroundColor: "#6366F1",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: "#6B7280",
    fontSize: 15,
    fontWeight: "700",
  },
  saveButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#10B981",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#FEF2F2",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  logoutButtonText: {
    color: "#EF4444",
    fontSize: 15,
    fontWeight: "700",
  },
  logoutBtn: {
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  logoutBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  dialog: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  dialogText: {
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 22,
  },
});

export default ProfileScreen;