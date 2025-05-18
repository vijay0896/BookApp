// pickImage.js
import * as ImagePicker from "expo-image-picker";

const pickImage = async (onImagePicked) => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    const asset = result.assets[0];
    onImagePicked(asset); // Call the callback with selected image
  }
};

export default pickImage;
