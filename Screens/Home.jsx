import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Searchbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import { sharedStyles as styles } from "./MyBooksScreens/Styles/sharedStyles";
import { useFetchBooks } from "./services/bookService";
import { BASE_URLS } from "../Utils/config";
const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { books, loading, refreshing, handleRefresh } = useFetchBooks("books");
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("userId");
      setUserId(id);
    };
    fetchUserId();
  }, []);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const currentUserId = await AsyncStorage.getItem("userId");
  
        const res = await fetch(`${BASE_URLS}/api/users/getAllusers?userId=${currentUserId}`);
        const data = await res.json();
  
        if (!Array.isArray(data)) {
          console.error("Unexpected data format:", data);
          return;
        }
  
        const filtered = data.filter((user) => String(user.id) !== String(currentUserId));
        setUsers(filtered);
      } catch (error) {
        console.error("Error fetching users", error);
      } finally {
        setLoadingUsers(false);
      }
    };
  
    fetchUsers();
  }, []);
  
  const filteredBooks = books
    .filter((book) => String(book.owner_id) !== String(userId))
    .filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.genre?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Divide into two: some for vertical (e.g. top picks), some for horizontal (e.g. nearby)
  const verticalBooks = filteredBooks.slice(0, 9);
  const horizontalBooks = filteredBooks.slice(9);

  const renderUserItem = ({ item }) => (
     <TouchableOpacity
          onPress={() => navigation.navigate("OwnerDetailsScreen", { ownerId: item.id })}
        >
    <View
      style={{
        borderRadius: 5,
        width: 125,
        marginRight: 7,
        alignItems: "center",
        borderColor: "#CFCFCF",
        borderWidth: 1,
        height: 200,
        padding: 6,
        
      }}
    >
      <Image
        source={{ uri: item.profileImage }}
        style={{
          width: "100%",
          height: 120,
          borderRadius: 5,
          marginBottom: 5,
        }}
        resizeMode="stretch"
      />
      <Text
        style={{
          fontSize: 14,
          fontWeight: "500",
          color: "#333",
          marginBottom: 2,
          alignSelf: "flex-start",
          
        }}
      >
       {item.name}

      </Text>
      <Text style={{ fontSize: 12, color: "#888", alignSelf: "flex-start" }}>
        {item.totalBooks} Books
      </Text>
    </View>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("BooksDetails", { book: item })}
    >
      {item.cover_image_url ? (
        <Image
          source={{ uri: item.cover_image_url }}
          style={styles.bookImage}
        />
      ) : (
        <View style={styles.placeholderImage}>
          <Text>No Image</Text>
        </View>
      )}
      <Text style={styles.title}>
        {item.title.length > 20 ? item.title.slice(0, 17) + "..." : item.title}
      </Text>
      <Text style={styles.status}>
        Service Type: {item.service_type === "rental" ? "ebook" : "resale"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={style.container}>
      <StatusBar hidden />
      <Searchbar
        placeholder="Search by title, author, or genre"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={style.searchbar}
        icon="magnify"
        iconColor="#6C6C6C"
        inputStyle={style.inputText}
      />

      <View style={{ flex: 1 }}>
        {/* Vertical Section - 65% height */}
        <View style={{ flex: 0.60 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginHorizontal: 5,
            }}
          >
            <Text style={style.Title}>Books</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("AllBooksScreen", { books: filteredBooks })
              }
            >
              <Text style={{ color: "#007AFF", fontWeight: "bold" }}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={verticalBooks}
            renderItem={renderItem}
            keyExtractor={(item, index) =>
              item.id?.toString() || index.toString()
            }
            numColumns={3}
            contentContainerStyle={styles.listWithTopMargin}
            columnWrapperStyle={styles.row}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Horizontal Section - 35% height */}
        <View style={{ flex: 0.40 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom:10
            }}
          >
            <Text style={style.sectionTitle}>Nearby Book Provider</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("AllUsersScreen", { users })}
            >
              <Text
                style={{
                  color: "#007AFF",
                  fontWeight: "bold",
                  marginTop: 20,
                }}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={users}
            horizontal
            renderItem={renderUserItem}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 0 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
          />
        </View>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FC",
    paddingTop: 20,
    padding: 10,
  },
  searchbar: {
    width: "100%",
    height:50,
    borderRadius: 15,
    backgroundColor: "#F8F9FC",
    borderWidth: 1,
    borderColor: "#A0A0A0",
    marginBottom: 10,
    elevation: 2,
  },
  inputText: {
    color: "#333",
  },
  Title: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 1,
    // marginLeft: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 1,
    marginTop: 20,
  },
});

export default HomeScreen;


