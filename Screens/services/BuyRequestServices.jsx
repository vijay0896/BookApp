// BuyRequestServices.js
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";
import { BASE_URLS } from "../../Utils/config";

// Custom hook for buyer and owner requests
export const useBuyBookRequestServices = () => {
  const [myRequests, setMyRequests] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [buyRequests, setBuyRequests] = useState([]);

  const fetchMyOrders = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const userId = await AsyncStorage.getItem("userId");

      if (!userId) {
        console.log("User not logged in");
        return;
      }

      const response = await axios.get(
        `${BASE_URLS}/api/buy-requests/buyer/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMyRequests(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const fetchBuyRequests = async () => {
    try {
      const response = await axios.get(`${BASE_URLS}/api/buy-requests/owner`, {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("authToken")}`,
        },
      });

      const pendingRequests = response.data.filter(
        (request) => request.status === "pending"
      );
      setBuyRequests(pendingRequests);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch buy requests.");
    }
  };

  useEffect(() => {
    fetchMyOrders();
    fetchBuyRequests();
  }, []);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchMyOrders();
    await fetchBuyRequests();
    await fetchOrderStatus(); 
    setIsRefreshing(false);
  };

  return { myRequests, isRefreshing, buyRequests, setBuyRequests, onRefresh };
};

// Function to approve or deny requests
export const handleRequestAction = async (requestId, action, request, buyRequests, setBuyRequests) => {
  try {
    await axios.put(
      `${BASE_URLS}/api/buy-requests/status`,
      {
        request_id: requestId,
        status: action,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await AsyncStorage.getItem("authToken")}`,
        },
      }
    );

    if (action === "approved") {
      console.log(`Emitting notification for Buy Request Approved for ${request.title}`);
    } else if (action === "denied") {
      console.log(`Emitting notification for Buy Request Denied for ${request.title}`);
    }

    Alert.alert(
      "Success",
      `Request ${action === "approved" ? "approved" : "denied"}`
    );

    setBuyRequests(buyRequests.filter((req) => req.id !== requestId));
  } catch (error) {
    console.error(error);
    Alert.alert("Error", "Failed to update request status.");
  }
};

// ----------------------------
// 👉 New function: fetchOrderStatus for BooksDetails
export const fetchOrderStatusService = async (bookId) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const requestId = await AsyncStorage.getItem(`buyRequestId_${bookId}`);

    if (!requestId) {
      console.log("No request ID found.");
      return { status: null };
    }

    const apiUrl = `${BASE_URLS}/api/buy-requests/check-status/${requestId}`;
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.status) {
      return { status: response.data.status };
    } else {
      // Clear AsyncStorage if request ID is no longer valid
      await AsyncStorage.removeItem(`buyRequestId_${bookId}`);
      return { status: null };
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      await AsyncStorage.removeItem(`buyRequestId_${bookId}`);
      return { status: null };
    } else {
      return { status: "error" };
    }
  }
};
export const sendBuyRequest = async (bookData) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const userId = await AsyncStorage.getItem("userId");
  
      if (!userId) {
        Alert.alert("Error", "User not found. Please log in again.");
        return;
      }
  
      const userDetailsUrl = `${BASE_URLS}/api/users/userDetails/${userId}`;
      const responseUserDetails = await axios.get(userDetailsUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const userDetails = responseUserDetails.data;
  
      if (!userDetails.name || !userDetails.phone || !userDetails.address) {
        Alert.alert("Error", "Incomplete user details.");
        return;
      }
  
      const apiUrl = `${BASE_URLS}/api/buy-requests`;
      const payload = {
        book_id: bookData.id,
        buyer_name: userDetails.name,
        buyer_phone: userDetails.phone,
        buyer_location: userDetails.address,
      };
  
      const response = await axios.post(apiUrl, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.data.message) {
        await AsyncStorage.setItem(
          `buyRequestId_${bookData.id}`,
          response.data.buyRequestId.toString()
        );
        Alert.alert("Request Sent", "Your request has been sent to the owner.");
        return response.data.buyRequestId;
      }
    } catch (error) {
      console.error("Buy request error:", error);
      Alert.alert("Error", "Failed to send request.");
      return null;
    }
  };
  