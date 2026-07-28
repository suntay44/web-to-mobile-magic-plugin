import React from "react";
import { TextInput, View } from "react-native";

export default function LoginScreen() {
  return (
    <View>
      <TextInput accessibilityLabel="Email" placeholder="Email address" />
    </View>
  );
}
