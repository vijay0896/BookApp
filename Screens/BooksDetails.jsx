import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Portal, Provider } from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useBuyBookRequestServices, sendBuyRequest, fetchOrderStatusService } from "./services/BuyRequestServices";

const BooksDetails = () => {
  const route = useRoute();
  const { book: initialBook } = route.params;
  const [bookData, setBookData] = useState(initialBook);
  const [orderStatus, setOrderStatus] = useState(null);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [buyRequestId, setBuyRequestId] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return { bg: "#D1FAE5", text: "#10B981" };
      case "denied":
        return { bg: "#FEE2E2", text: "#EF4444" };
      default:
        return { bg: "#FEF3C7", text: "#F59E0B" };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return "checkmark-circle";
      case "denied":
        return "close-circle";
      default:
        return "time";
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrderStatus();
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
      setOrderStatus(null);
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
      const savedBuyRequestId = await AsyncStorage.getItem(`buyRequestId_${bookData.id}`);
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
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.coverWrapper}>
              {bookData.cover_image_url ? (
                <Image source={{ uri: bookData.cover_image_url }} style={styles.coverImage} />
              ) : (
                <View style={styles.placeholderCover}>
                  <Ionicons name="book" size={48} color="#9CA3AF" />
                </View>
              )}
              <View style={styles.coverShadow} />
            </View>
          </View>

          {/* Content Section */}
          <View style={styles.contentSection}>
            {/* Genre Badge */}
            <View style={styles.genreBadge}>
              <Text style={styles.genreText}>{bookData.genre || "Unknown"}</Text>
            </View>

            {/* Title & Author */}
            <Text style={styles.bookTitle}>{bookData.title}</Text>
            <View style={styles.authorRow}>
              <Ionicons name="person-circle-outline" size={16} color="#6B7280" />
              <Text style={styles.authorText}>{bookData.author || "Unknown Author"}</Text>
            </View>

            {/* Description Card */}
            {bookData.description && (
              <View style={styles.descriptionCard}>
                <Text style={styles.descriptionTitle}>Description</Text>
                <Text style={styles.descriptionText}>{bookData.description}</Text>
              </View>
            )}

            {/* Owner Info */}
            <TouchableOpacity
              style={styles.ownerCard}
              onPress={() => navigation.navigate("OwnerDetailsScreen", { ownerId: bookData.owner_id })}
            >
              <View style={styles.ownerIconCircle}>
                <Ionicons name="person" size={20} color="#3B82F6" />
              </View>
              <View style={styles.ownerContent}>
                <Text style={styles.ownerLabel}>Seller</Text>
                <Text style={styles.ownerName}>{bookData.owner_name || "Unknown Owner"}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Price Card */}
            <View style={styles.priceCard}>
              <View style={styles.priceIconCircle}>
                <Ionicons name="pricetag" size={22} color="#10B981" />
              </View>
              <View style={styles.priceContent}>
                <Text style={styles.priceLabel}>
                  {bookData.service_type === "rental" ? "Rental Price" : "Sale Price"}
                </Text>
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
            </View>

            {/* Status Badge */}
            {orderStatus && (
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(orderStatus).bg },
                ]}
              >
                <Ionicons
                  name={getStatusIcon(orderStatus)}
                  size={20}
                  color={getStatusColor(orderStatus).text}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(orderStatus).text },
                  ]}
                >
                  {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              {orderStatus !== "approved" && (
                <TouchableOpacity
                  style={styles.buyButton}
                  onPress={handleBuyButtonPress}
                >
                  <Ionicons name="cart" size={20} color="#FFFFFF" />
                  <Text style={styles.buyButtonText}>Buy Now</Text>
                </TouchableOpacity>
              )}

              {bookData.service_type === "rental" && orderStatus === "approved" && (
                <TouchableOpacity
                  style={styles.pdfButton}
                  onPress={() =>
                    navigation.navigate("PDFViewer", {
                      pdfUrl: bookData.pdf_url,
                      title: bookData.title,
                    })
                  }
                >
                  <Ionicons name="reader" size={20} color="#FFFFFF" />
                  <Text style={styles.pdfButtonText}>Open PDF</Text>
                </TouchableOpacity>
              )}

              {bookData.service_type === "rental" && orderStatus !== "approved" && (
                <View style={styles.disabledButton}>
                  <Ionicons name="lock-closed" size={18} color="#9CA3AF" />
                  <Text style={styles.disabledButtonText}>Buy to Access PDF</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  heroSection: {
    backgroundColor: "#F9FAFB",
    paddingTop: 16,
    paddingBottom: 40,
    alignItems: "center",
  },
  coverWrapper: {
    position: "relative",
  },
  coverImage: {
    width: 130,
    height: 190,
    borderRadius: 12,
    resizeMode: "cover",
  },
  placeholderCover: {
    width: 130,
    height: 190,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  coverShadow: {
    position: "absolute",
    bottom: -15,
    left: 15,
    right: 15,
    height: 15,
    backgroundColor: "#000",
    opacity: 0.08,
    borderRadius: 100,
    transform: [{ scaleX: 1.2 }],
  },
  contentSection: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -30,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
  },
  genreBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  genreText: {
    color: "#8B5CF6",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
    lineHeight: 26,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 5,
  },
  authorText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  descriptionCard: {
    backgroundColor: "#F9FAFB",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  descriptionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  descriptionText: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 20,
  },
  ownerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  ownerIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  ownerContent: {
    flex: 1,
  },
  ownerLabel: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 2,
  },
  ownerName: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "600",
  },
  priceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  priceIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  priceContent: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 3,
  },
  priceValue: {
    fontSize: 18,
    color: "#10B981",
    fontWeight: "700",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 16,
    gap: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "700",
  },
  actionsContainer: {
    gap: 10,
  },
  buyButton: {
    flexDirection: "row",
    backgroundColor: "#3B82F6",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buyButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  pdfButton: {
    flexDirection: "row",
    backgroundColor: "#10B981",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  pdfButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  disabledButton: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  disabledButtonText: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default BooksDetails;