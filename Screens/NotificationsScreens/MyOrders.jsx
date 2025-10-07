import React from "react";
import { Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useBuyBookRequestServices } from "../services/BuyRequestServices";

const MyOrders = ({ navigation }) => {
  const { myRequests, isRefreshing, onRefresh } = useBuyBookRequestServices();

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "#10B981";
      case "denied":
        return "#EF4444";
      default:
        return "#F59E0B";
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case "approved":
        return "#D1FAE5";
      case "denied":
        return "#FEE2E2";
      default:
        return "#FEF3C7";
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
    >
      {myRequests.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="book-outline" size={48} color="#D1D5DB" />
          </View>
          <Text style={styles.emptyTitle}>No Orders Yet</Text>
          <Text style={styles.emptySubtitle}>
            Your book orders will appear here once you place them
          </Text>
        </View>
      ) : (
        myRequests.map((order) => (
          <TouchableOpacity
            key={order.id}
            style={styles.orderCard}
            onPress={() => navigation.navigate("OrderDetails", { order })}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.bookTitle} numberOfLines={2}>
                {order.title}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>

            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: getStatusBgColor(order.status),
                  },
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: getStatusColor(order.status) },
                  ]}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(order.status) },
                  ]}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
    paddingBottom: 40,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 22,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: "#00000080",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  bookTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#111827d4",
    lineHeight: 24,
    marginRight: 12,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});

export default MyOrders;