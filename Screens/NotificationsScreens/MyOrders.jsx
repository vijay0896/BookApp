import React from "react";
import { Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { useBuyBookRequestServices } from "../services/BuyRequestServices"; // Renamed the hook

const MyOrders = ({ navigation }) => {
  const { myRequests, isRefreshing, onRefresh } = useBuyBookRequestServices(); // Using the renamed hook
  
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
    >
      {myRequests.length === 0 ? (
        <Text style={styles.noOrdersText}>You haven't placed any orders yet.</Text>
      ) : (
        myRequests.map((order) => (
          <TouchableOpacity
            key={order.id}
            style={styles.orderCard}
            onPress={() => navigation.navigate("OrderDetails", { order })}
          >
            <Text style={styles.title}>{order.title}</Text>
            <Text style={styles.status}>
              Status:{" "}
              <Text style={{ color: order.status === "approved" ? "green" : order.status === "denied" ? "red" : "orange" }}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Text>
            </Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  noOrdersText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 30,
    color: "#6C757D",
  },
  orderCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#2C3E50",
  },
  status: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});

export default MyOrders;
