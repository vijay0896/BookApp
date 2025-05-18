import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  Button,
  Modal,
  TouchableOpacity,
} from "react-native";
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
        const res = await axios.get(
          `${BASE_URLS}/api/users/getAllusers/${ownerId}`
        );
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
      } else {
        alert("Permission to access location was denied");
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
    const R = 6371; // Radius of Earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);
  useEffect(() => {
    let subscription;

    const startLocationTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // every 1 sec
          distanceInterval: 1, // or every 1 meter
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
              const distInMeters = distInKm * 1000;
              setDistance(`${distInMeters.toFixed(0)} meters`);
            } else {
              setDistance(`${distInKm.toFixed(2)} km`);
            }
          }
        }
      );
    };

    startLocationTracking();

    // Clean up on unmount
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [owner]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2C3E50" />
      </View>
    );
  }

  if (!owner) {
    return (
      <View style={styles.centered}>
        <Text>Owner details not available.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Owner Info Card */}
      <View style={styles.card}>
        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{owner.name}</Text>
          <Text style={styles.info}>Ph.no. {owner.phone}</Text>
          <Text style={styles.info}>Addr. {owner.address}</Text>
          <Text style={styles.info}>Total Books: {owner.totalBooks}</Text>
          <Text style={styles.info}>Latitude: {owner.latitude}</Text>
          <Text style={styles.info}>Longitude : {owner.longitude}</Text>
          {distance && <Text style={styles.info}>Distance: {distance}</Text>}

          <Button title="Get Directions" onPress={handleGetDirections} />
        </View>
        {owner.profileImage ? (
          <Image source={{ uri: owner.profileImage }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text>No Image</Text>
          </View>
        )}
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
              showsMyLocationButton={false}
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
                strokeColor="#2C3E50"
                strokeWidth={3}
              />
            </MapView>
          )}

          {distance && (
            <View style={styles.mapDistanceOverlay}>
              <Text style={styles.mapDistanceText}>Distance: {distance}</Text>
            </View>
          )}
          {/* "My Location" button */}
          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: 20,
              right: 20,
              backgroundColor: "#fff",
              padding: 10,
              borderRadius: 30,
              elevation: 4,
            }}
            onPress={() => {
              if (mapRef.current && userLocation) {
                mapRef.current.animateToRegion(
                  {
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                    latitudeDelta: 0.005, // Zoom in tightly
                    longitudeDelta: 0.005,
                  },
                  5000
                ); // duration in ms
              }
            }}
          >
            <Text style={{ fontSize: 14 }}>📍 My Location</Text>
          </TouchableOpacity>

          {/* ✅ Zoom Buttons */}
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
              <Text style={styles.zoomText}>+</Text>
            </TouchableOpacity>
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
              <Text style={styles.zoomText}>−</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => setShowMap(false)}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>Close Map</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Top Tabs */}
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
          tabBarIndicatorStyle: { backgroundColor: "#2C3E50" },
        }}
      >
        <Tab.Screen name="Ebooks">
          {() => <EbookScreen userId={ownerId} />}
        </Tab.Screen>
        <Tab.Screen name="Resale">
          {() => <ResaleScreen userId={ownerId} />}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#EDEDF4",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailsContainer: {
    flex: 1,
    marginRight: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 12,
  },
  info: {
    fontSize: 16,
    color: "#34495E",
    marginBottom: 6,
  },
  image: {
    width: 120,
    height: 110,
    borderRadius: 12,
    backgroundColor: "#eee",
    resizeMode: "cover",
  },
  placeholderImage: {
    width: 110,
    height: 110,
    borderRadius: 12,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#2C3E50",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  mapDistanceOverlay: {
    position: "absolute",
    top: 40,
    alignSelf: "center",
    backgroundColor: "rgba(44, 62, 80, 0.9)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    zIndex: 10,
  },
  mapDistanceText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  zoomControls: {
    position: "absolute",
    right: 20,
    top: 100,
    backgroundColor: "rgba(44, 62, 80, 0.8)",
    borderRadius: 8,
    overflow: "hidden",
  },
  zoomButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  zoomText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default OwnerDetailsScreen;
