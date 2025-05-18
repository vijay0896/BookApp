import React from "react";
import { View, Text, FlatList, Image, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";

const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - 40) / 2; // Adjusted for padding and spacing

const AllUsersScreen = ({ route }) => {
  const { users } = route.params;
  const navigation = useNavigation();

  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("OwnerDetailsScreen", { ownerId: item.id })}
      style={styles.cardContainer}
    >
      <View style={styles.card}>
        {item.profileImage ? (
          <Image source={{ uri: item.profileImage }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.bookCount}>{item.totalBooks} Books</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={renderUserItem}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FC",
    paddingHorizontal: 10,
  },
  listContent: {
    paddingBottom: 20,
    paddingTop: 10,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
  cardContainer: {
    width: cardWidth,
  },
  card: {
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "flex-start",
    borderColor: "#E0E0E0",
    borderWidth: 1,
    overflow: "hidden",
    elevation: 2, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    width: "100%",
    height: 120,
  },
  placeholderImage: {
    backgroundColor: "#D8D8D8",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#777",
    fontSize: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
    marginHorizontal: 8,
  },
  bookCount: {
    fontSize: 13,
    color: "#888",
    marginBottom: 10,
    marginHorizontal: 8,
  },
});

export default AllUsersScreen;
