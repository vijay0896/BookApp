import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const OrderDetailsScreen = ({ route }) => {
  const { order } = route.params;

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "#27AE60"; // Green for approved
      case "denied":
        return "#E74C3C"; // Red for denied
      default:
        return "#F39C12"; // Yellow for pending
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <Text style={styles.mainHeading}>Order Details</Text> */}

      <View style={styles.card}>
        <Text style={styles.sectionHeading}>📚 Book Details</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Title</Text>
          <Text style={styles.value}>{order.title}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Price</Text>
          <Text style={styles.value}>₹
                {order.service_type === "rental"
                  ? order.rental_price != null
                    ? order.rental_price
                    : "Not for rent"
                  : order.price != null
                  ? order.price
                  : "Not for sale"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Status</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
            <Text style={styles.statusText}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionHeading}>👤 Seller Details</Text>

        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={20} color="#7F8C8D" />
          <Text style={styles.detailText}>{order.seller_name}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="call-outline" size={20} color="#7F8C8D" />
          <Text style={styles.detailText}>{order.seller_phone}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={20} color="#7F8C8D" />
          <Text style={styles.detailText}>{order.seller_location}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F4F6F8",
    padding: 16,
    paddingBottom: 40,
  },
  mainHeading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2C3E50",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Roboto", // Modern font
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5, // Modern shadow for Android
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#34495E",
    fontFamily: "Roboto", // Modern font
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: "#7F8C8D",
    fontWeight: "600",
    fontFamily: "Roboto", // Modern font
  },
  value: {
    fontSize: 16,
    color: "#2C3E50",
    fontWeight: "500",
    textAlign: "right",
    maxWidth: "60%",
    fontFamily: "Roboto", // Modern font
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  statusText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Roboto", // Modern font
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  detailText: {
    fontSize: 16,
    color: "#2C3E50",
    marginLeft: 12,
    fontWeight: "500",
    fontFamily: "Roboto", // Modern font
  },
});

export default OrderDetailsScreen;
