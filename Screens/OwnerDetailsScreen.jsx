import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useRoute } from "@react-navigation/native";
import { BASE_URLS } from "../Utils/config";
import EbookScreen from "./EbookScreen";
import ResaleScreen from "./ResaleScreen";
import * as Location from "expo-location";
import MapView, { Marker, Polyline } from "react-native-maps";


const Tab = createMaterialTopTabNavigator();

const OwnerDetailsScreen = () => {
  const route = useRoute();
  const { ownerId } = route.params;

  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [distance, setDistance] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchOwnerDetails = async () => {
      try {
        const res = await axios.get(`${BASE_URLS}/api/users/getAllusers/${ownerId}`);
        setOwner(res.data);
      } catch (err) {
        console.error("Failed to fetch owner:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOwnerDetails();
  }, [ownerId]);

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync();
        setUserLocation(location.coords);
      }
    };
    getLocation();
  }, []);

  const handleGetDirections = () => {
    if (!userLocation || !owner?.latitude || !owner?.longitude) return;

    const ownerLat = parseFloat(owner.latitude);
   const ownerLon = parseFloat(owner.longitude);
  
    const distInKm = getDistanceFromLatLonInKm(
      userLocation.latitude,
      userLocation.longitude,
      ownerLat,
      ownerLon
    );

    if (distInKm < 1) {
      const distInMeters = distInKm * 1000;
      setDistance(`${distInMeters.toFixed(0)} meters`);
    } else {
      setDistance(`${distInKm.toFixed(2)} km`);
    }

    setMapRegion({
      latitude: (userLocation.latitude + ownerLat) / 2,
      longitude: (userLocation.longitude + ownerLon) / 2,
      latitudeDelta: Math.abs(userLocation.latitude - ownerLat) + 0.01,
      longitudeDelta: Math.abs(userLocation.longitude - ownerLon) + 0.01,
    });

    setShowMap(true);
  };

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);

  useEffect(() => {
    let subscription;
    const startLocationTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 1,
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          setUserLocation({ latitude, longitude });

          if (owner?.latitude && owner?.longitude) {
            const distInKm = getDistanceFromLatLonInKm(
              latitude,
              longitude,
              parseFloat(owner.latitude),
              parseFloat(owner.longitude)
            );

            if (distInKm < 1) {
              setDistance(`${(distInKm * 1000).toFixed(0)} meters`);
            } else {
              setDistance(`${distInKm.toFixed(2)} km`);
            }
          }
        }
      );
    };

    startLocationTracking();
    return () => {
      if (subscription) subscription.remove();
    };
  }, [owner]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!owner) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Owner details not available.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* Owner Info Card */}
      <View style={styles.ownerCard}>
        <View style={styles.ownerHeader}>
          <View style={styles.avatarContainer}>
            {owner.profileImage ? (
              <Image source={{ uri: owner.profileImage }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color="#9CA3AF" />
              </View>
            )}
          </View>

          <View style={styles.ownerInfo}>
            <Text style={styles.ownerName}>{owner.name}</Text>
            <View style={styles.badgeContainer}>
              <View style={styles.badge}>
                <Ionicons name="book" size={12} color="#3B82F6" />
                <Text style={styles.badgeText}>{owner.totalBooks} Books</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons name="call" size={18} color="#6B7280" />
            <Text style={styles.infoText}>{owner.phone}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location" size={18} color="#6B7280" />
            <Text style={styles.infoText}>{owner.address}</Text>
          </View>

          {distance && (
            <View style={styles.infoRow}>
              <Ionicons name="navigate" size={18} color="#10B981" />
              <Text style={[styles.infoText, { color: "#10B981", fontWeight: "600" }]}>
                {distance} away
              </Text>
            </View>
          )}
        </View>

        {/* Directions Button */}
        <TouchableOpacity style={styles.directionsButton} onPress={handleGetDirections}>
          <Ionicons name="map" size={18} color="#FFFFFF" />
          <Text style={styles.directionsButtonText}>Get Directions</Text>
        </TouchableOpacity>
      </View>

      {/* Map Modal */}
      <Modal visible={showMap} animationType="slide">
        <View style={{ flex: 1 }}>
          {userLocation && owner?.latitude && owner?.longitude && (
            <MapView
              style={{ flex: 1 }}
              
              region={mapRegion}
              ref={mapRef}
              showsUserLocation
              followsUserLocation
              showsMyLocationButton={true}
              scrollEnabled={true}
             
              rotateEnabled={true}
              
              
             

            >
              <Marker
                coordinate={{
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                }}
                title="Your Location"
              />
              <Marker
                coordinate={{
                  latitude: parseFloat(owner.latitude),
                  longitude: parseFloat(owner.longitude),
                }}
                title={owner.name}
              />
              <Polyline
                coordinates={[
                  {
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                  },
                  {
                    latitude: parseFloat(owner.latitude),
                    longitude: parseFloat(owner.longitude),
                  },
                ]}
                strokeColor="#3B82F6"
                strokeWidth={3}
              />
            </MapView>
          )}

          {distance && (
            <View style={styles.mapDistanceOverlay}>
              <Ionicons name="navigate" size={16} color="#FFFFFF" />
              <Text style={styles.mapDistanceText}>{distance}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.myLocationButton}
            onPress={() => {
              if (mapRef.current && userLocation) {
                mapRef.current.animateToRegion(
                  {
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  },
                  1000
                );
              }
            }}
          >
            <Ionicons name="locate" size={24} color="#3B82F6" />
          </TouchableOpacity>

          <View style={styles.zoomControls}>
            <TouchableOpacity
              onPress={() =>
                setMapRegion((prev) => ({
                  ...prev,
                  latitudeDelta: prev.latitudeDelta * 0.5,
                  longitudeDelta: prev.longitudeDelta * 0.5,
                }))
              }
              style={styles.zoomButton}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.zoomDivider} />
            <TouchableOpacity
              onPress={() =>
                setMapRegion((prev) => ({
                  ...prev,
                  latitudeDelta: prev.latitudeDelta * 2,
                  longitudeDelta: prev.longitudeDelta * 2,
                }))
              }
              style={styles.zoomButton}
            >
              <Ionicons name="remove" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => setShowMap(false)} style={styles.closeMapButton}>
            <Ionicons name="close" size={20} color="#FFFFFF" />
            <Text style={styles.closeMapButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Top Tabs */}
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 13, fontWeight: "700", textTransform: "none" },
          tabBarIndicatorStyle: { backgroundColor: "#3B82F6", height: 3 },
          tabBarActiveTintColor: "#3B82F6",
          tabBarInactiveTintColor: "#9CA3AF",
          tabBarStyle: { elevation: 0, shadowOpacity: 0 },
        }}
      >
        <Tab.Screen name="Ebooks">{() => <EbookScreen userId={ownerId} />}</Tab.Screen>
        <Tab.Screen name="Resale">{() => <ResaleScreen userId={ownerId} />}</Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  errorText: {
    fontSize: 15,
    color: "#6B7280",
  },
  ownerCard: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderBottomColor: "#8a89890f",
    borderBottomWidth:1
  },
  ownerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: "cover",
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
  },
  badgeContainer: {
    flexDirection: "row",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    color: "#3B82F6",
    fontWeight: "600",
  },
  infoSection: {
    gap: 10,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#4B5563",
    flex: 1,
  },
  directionsButton: {
    flexDirection: "row",
    backgroundColor: "#3B82F6",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  directionsButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  mapDistanceOverlay: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(59, 130, 246, 0.95)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
  },
  mapDistanceText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  myLocationButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "#FFFFFF",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  zoomControls: {
    position: "absolute",
    right: 20,
    top: 120,
    backgroundColor: "rgba(59, 130, 246, 0.95)",
    borderRadius: 8,
    overflow: "hidden",
  },
  zoomButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  zoomDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  closeMapButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: "#111827",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
    gap: 8,
  },
  closeMapButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});

export default OwnerDetailsScreen;