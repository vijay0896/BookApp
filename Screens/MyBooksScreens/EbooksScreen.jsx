import React, { useEffect, useState } from "react";
import { sharedStyles as styles } from "./Styles/sharedStyles"; // adjust path
import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  NativeEventEmitter,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { AnimatedFAB } from "react-native-paper";
import { useFetchBooks } from "../services/bookService";
const EbooksScreen = () => {
  const { books, loading, refreshing, handleRefresh } =
    useFetchBooks("rentals-books");
  const numColumns = 3; // Define fixed number of columns
  const navigation = useNavigation();
 const [isExtended, setIsExtended] = useState(true);
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("EBooksDetails", { book: item })}
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
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.status}>Genre: {item.genre}</Text>
    </TouchableOpacity>
  );

  const onScroll =({nativeEvent})=>{
    const currentScrollPosition=Math.floor(nativeEvent?.contentOffset?.y)??0;
    setIsExtended(currentScrollPosition<=0);
  }

  if (loading) {
    const placeholders = Array.from({ length: 6 });

    return (
      <View style={styles.container}>
        <FlatList
          data={placeholders}
          renderItem={() => (
            <View style={styles.card}>
              <View style={styles.skeletonImage} />
              <View style={styles.skeletonText} />
              <View style={styles.skeletonTextSmall} />
            </View>
          )}
          keyExtractor={(_, index) => index.toString()}
          numColumns={numColumns}
          key={numColumns}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
        />

      </View>
    );
  }

  return (
    <View style={styles.container}>
      {books.length === 0 ? (
        <Text style={styles.noBooksText}>No resale books available.</Text>
      ) : (
        <FlatList
          data={books}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          numColumns={numColumns}
          key={numColumns}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onScroll={onScroll}
        />
        
      )}
      <AnimatedFAB
              icon="plus"
              label="Add Book"
              extended={isExtended}
              onPress={() => navigation.navigate("AddEbookScreen")}
              visible={true}
              animateFrom="right"
              iconMode="dynamic"
              style={styles.fab}
              color="#D6D6D6"
            />
    </View>
  );
};

export default EbooksScreen;
