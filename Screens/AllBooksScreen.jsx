import React from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { sharedStyles as styles } from "./MyBooksScreens/Styles/sharedStyles";

const AllBooksScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { books } = route.params;

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
      <Text style={styles.status}>
        Service Type: {item.service_type === "rental" ? "ebook" : "resale"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={style.container}>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={styles.listWithTopMargin}
      />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FC",
    padding: 10,
  },
});

export default AllBooksScreen;
