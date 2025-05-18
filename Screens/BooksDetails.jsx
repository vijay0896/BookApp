import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Alert } from "react-native";
import { Portal, Provider } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { RefreshControl } from "react-native";
import { useBuyBookRequestServices,  sendBuyRequest ,fetchOrderStatusService,handleRequestAction} from "./services/BuyRequestServices";
const BooksDetails = () => {
  const route = useRoute();
  const { book: initialBook } = route.params;
  const [bookData, setBookData] = useState(initialBook);
  const [orderStatus, setOrderStatus] = useState(null); // Track order status
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [buyRequestId, setBuyRequestId] = useState(null);
  // const { onRefresh } = useBuyBookRequestServices();
 
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrderStatus();  // 👈 Important: refetch order status also
    setRefreshing(false);
  };
  

  const handleBuyButtonPress = async () => {
    const requestId = await sendBuyRequest(bookData);
    if (requestId) {
      setBuyRequestId(requestId);
    }
  };
  const fetchOrderStatus = async () => {
    const result = await fetchOrderStatusService(bookData.id);
    if (result.status) {
      setOrderStatus(result.status);
    } else {
      setOrderStatus("No request found for this book.");
    }
  };
  useEffect(() => {
    fetchOrderStatus();
    return () => {
      AsyncStorage.removeItem("buyRequestId");
    };
  }, []);
  useEffect(() => {
    if (buyRequestId) {
      fetchOrderStatus();
    }
  }, [buyRequestId]);

  useEffect(() => {
    const fetchBuyRequestId = async () => {
      const savedBuyRequestId = await AsyncStorage.getItem(
        `buyRequestId_${bookData.id}`
      );
      if (savedBuyRequestId) {
        setBuyRequestId(savedBuyRequestId);
      }
    };

    fetchBuyRequestId();
  }, [bookData.id]);

  

  return (
    <Provider>
      <Portal>
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Book Cover */}
          <View style={styles.imageContainer}>
            {bookData.cover_image_url ? (
              <Image
                source={{ uri: bookData.cover_image_url }}
                style={styles.image}
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Text>No Image Available</Text>
              </View>
            )}
          </View>

          {/* Genre Tag */}
          <View style={styles.genreTag}>
            <Text style={styles.genreText}>
              {bookData.genre || "Unknown Genre"}
            </Text>
          </View>

          {/* Book Info */}
          <View style={styles.infoSection}>
            <Text style={styles.title}>{bookData.title}</Text>
            <Text style={styles.author}>
              by {bookData.author || "Unknown Author"}
            </Text>
            <Text style={styles.description}>
              {bookData.description ||
                "No description available for this book."}
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("OwnerDetailsScreen", {
                  ownerId: bookData.owner_id,
                })
              }
            >
              <Text
                style={[
                  styles.description,
                  { color: "#007bff", textDecorationLine: "underline" },
                ]}
              >
                {bookData.owner_name || "Unknown Owner"}
              </Text>
            </TouchableOpacity>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Price:</Text>
              <Text style={styles.priceValue}>
                ₹
                {bookData.service_type === "rental"
                  ? bookData.rental_price != null
                    ? bookData.rental_price
                    : "Not for rent"
                  : bookData.price != null
                  ? bookData.price
                  : "Not for sale"}
              </Text>
            </View>

            {/* Buy Button */}
            <TouchableOpacity
              style={{
                backgroundColor: "#007bff",
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 8,
                marginTop: 20,
                alignSelf: "center",
                width: "25%",
              }}
              onPress={()=>handleBuyButtonPress()}
            >
              <Text
                style={{
                  color: "#fff",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Buy
              </Text>
            </TouchableOpacity>

            {/* Show Buy Request ID if available */}
            {buyRequestId && <Text>Request ID: {buyRequestId}</Text>}

            {/* Show Rental PDF button if order status is approved */}
            {bookData.service_type === "rental" && (
              <>
                {orderStatus === "approved" ? (
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#28a745",
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      borderRadius: 8,
                      marginTop: 15,
                      alignSelf: "center",
                      width: "40%",
                    }}
                    onPress={() =>
                      navigation.navigate("PDFViewer", {
                        pdfUrl: bookData.pdf_url,
                        title: bookData.title,
                      })
                    }
                  >
                    <Text
                      style={{
                        color: "#fff",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      Open PDF
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View
                    style={{
                      backgroundColor: "#6c757d",
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      borderRadius: 8,
                      marginTop: 15,
                      alignSelf: "center",
                      width: "60%",
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      Buy First to Access PDF
                    </Text>
                  </View>
                )}
              </>
            )}

            {/* Displaying the order status */}
            {orderStatus !== null && (
              <View style={styles.statusContainer}>
                <Text style={styles.statusText}>
                  Your request status:{" "}
                  {orderStatus === "approved"
                    ? "✅ Approved"
                    : orderStatus === "denied"
                    ? "❌ Denied"
                    : "⏳ Pending"}
                </Text>
              </View>
            )}

            {orderStatus === null && (
              <View style={styles.statusContainer}>
                <Text style={styles.statusText}>
                  No request found for this book.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  imageContainer: {
    width: "100%",
    height: 250,
    backgroundColor: "#E1E4E8",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 220,
    borderRadius: 10,
    resizeMode: "cover",
  },
  placeholderImage: {
    width: 150,
    height: 220,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  genreTag: {
    backgroundColor: "#EEF1F1",
    alignSelf: "flex-start",
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 10,
  },
  genreText: {
    color: "#607D8B",
    fontSize: 13,
    fontWeight: "500",
  },
  infoSection: {
    paddingHorizontal: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 4,
  },
  author: {
    fontSize: 16,
    color: "#6C757D",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: "#3E494A",
    lineHeight: 22,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#495057",
    marginRight: 6,
  },
  priceValue: {
    fontSize: 16,
    color: "#28a745",
    fontWeight: "bold",
  },
  statusContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f8d7da",
    borderRadius: 5,
  },
  statusText: {
    color: "#721c24",
    fontWeight: "bold",
  },
});

export default BooksDetails;
