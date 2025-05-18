// Notifications.js
import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useBuyBookRequestServices, handleRequestAction } from "../services/BuyRequestServices"; // ✅ Correct import

const Notifications = () => {
  const navigation = useNavigation();

  const { myRequests, isRefreshing, buyRequests, setBuyRequests, onRefresh } = useBuyBookRequestServices();

  const handleAction = (requestId, action, request) => {
    handleRequestAction(requestId, action, request, buyRequests, setBuyRequests);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      {buyRequests.length === 0 ? (
        <Text>No pending requests</Text>
      ) : (
        buyRequests.map((request) => (
          <View key={request.id} style={styles.requestCard}>
            <Text>{request.title}</Text>
            <Text>Buyer: {request.buyer_name}</Text>
            <Text>Phone: {request.buyer_phone}</Text>
            <Text>Location: {request.buyer_location}</Text>
            <Text>Status: {request.status}</Text>
            <TouchableOpacity
              onPress={() => handleAction(request.id, "approved", request)}
              style={styles.button}
            >
              <Text>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleAction(request.id, "denied", request)}
              style={styles.button}
            >
              <Text>Deny</Text>
            </TouchableOpacity>
          </View>
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
  requestCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
});

export default Notifications;
