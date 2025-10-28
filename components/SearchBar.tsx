import { Image, TextInput, View } from "react-native";
import React from "react";
import { icons } from "@/constants/icons";
// import { SearchBar as Searchbar } from "react-native-screens";

interface SearchProps {
  onPress?: () => void;
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

const SearchBar = ({
  onPress,
  placeholder,
  value,
  onChangeText,
}: SearchProps) => {
  return (
    <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4">
      <Image
        source={icons.search}
        className="size-5"
        resizeMode="contain"
        tintColor="#ab8bff"
      />
      <TextInput
        onPress={onPress}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#a8b5db"
        className="flex-1 ml-2 text-white"
      />
      {/* <Searchbar onPress={() => {}} placeholder='Search' value='' onChangeText={() => {}} placeholderTextColor='#a8b5db' className='flex-1 ml-2 text-white' /> */}
    </View>
  );
};

export default SearchBar;
