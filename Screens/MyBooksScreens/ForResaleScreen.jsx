import React, { useEffect, useState } from "react";
import { sharedStyles as styles } from "./Styles/sharedStyles"; // adjust path
import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { AnimatedFAB } from "react-native-paper";
import { useFetchBooks } from "../services/bookService";
const ForResaleScreen = () => {
  const { books, loading, refreshing, handleRefresh } =
    useFetchBooks("resale-books");
  const [isExtended, setIsExtended] = useState(true); // for FAB animation
  const navigation = useNavigation();
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("resaleBooksDetails", { book: item })}
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
        {item.title.length > 20 ? item.title.slice(0, 20) + "..." : item.title}
      </Text>
      <Text style={styles.status}>Status: {item.status}</Text>
    </TouchableOpacity>
  );

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setIsExtended(currentScrollPosition <= 0); // collapse FAB on scroll
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <FlatList
          data={Array.from({ length: 9 })}
          renderItem={() => (
            <View style={styles.card}>
              <View style={styles.skeletonImage} />
              <View style={styles.skeletonText} />
              <View style={styles.skeletonTextSmall} />
            </View>
          )}
          keyExtractor={(_, index) => index.toString()}
          numColumns={3}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
        />
      ) : books.length === 0 ? (
        <Text style={styles.noBooksText}>No resale books available.</Text>
      ) : (
        <FlatList
          data={books}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          numColumns={3}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onScroll={onScroll}
        />
      )}

      {/* Floating Plus Button */}
      <AnimatedFAB
        icon="plus"
        label="Add Book"
        extended={isExtended}
        onPress={() => navigation.navigate("AddResaleBookScreen")}
        visible={true}
        animateFrom="right"
        iconMode="dynamic"
        style={styles.fab}
        color="#D6D6D6"
      />
    </View>
  );
};

export default ForResaleScreen;
