import React, { useEffect, useState } from "react";
import { View, FlatList, Image, Text, TouchableOpacity, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fetchBooksByType } from "./services/fetchBooks";
import { sharedStyles as styles } from "./MyBooksScreens/Styles/sharedStyles";

const ResaleBooksScreen = ({ userId }) => {
  const [books, setBooks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchData = async () => {
    const data = await fetchBooksByType(userId, "resale");
    setBooks(data);
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("BooksDetails", { book: item })}
    >
      {item.cover_image_url ? (
        <Image source={{ uri: item.cover_image_url }} style={styles.bookImage} />
      ) : (
        <View style={styles.placeholderImage}>
          <Text>No Image</Text>
        </View>
      )}
      <Text style={styles.title}>
        {item.title.length > 20 ? item.title.slice(0, 17) + "..." : item.title}
      </Text>
      <Text style={styles.status}>resale</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={books}
      renderItem={renderItem}
      keyExtractor={(item, index) => item.id?.toString() || index.toString()}
      numColumns={3}
      contentContainerStyle={{ padding: 10 }}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default ResaleBooksScreen;
