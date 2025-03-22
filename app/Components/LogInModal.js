import { useState } from "react";
import { View, Text, Modal, TextInput, TouchableOpacity, Alert } from "react-native";
import { Button } from "@ant-design/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useLocation from "../../hooks/useLocation";
import axios from "axios";

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    isAdmin: true,
  },
  {
    name: "Regular User",
    email: "user@example.com",
    password: "user123",
    isAdmin: false,
  },
];

export default function LogInModal({ visible, onClose, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { location, errorMsg } = useLocation();

  const API_URL = "https://67de1bf4471aaaa742834afe.mockapi.io/POS"; // Replace with your actual API URL

  const loginUser = async (name, email, location) => {
    try {
      const time = new Date().toISOString(); // Get the current time in ISO format
      const response = await axios.post(`${API_URL}/Attendance`, {
        name,
        email,
        location,
        type: "CheckIn",
        time
      });
  
      return response.data;
    } catch (error) {
      throw error.response?.data || "Login failed";
    }
  };

  const handleLogin = async () => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      try {
        const response = await loginUser(user.name, user.email, location[0]?.formattedAddress || "Unknown Location");
        console.log(response);
        await AsyncStorage.setItem("user", JSON.stringify(user));
        Alert.alert("Login Successful", `Welcome, ${user.name}!`);
        onLogin(user);
        onClose();
      } catch (error) {
        Alert.alert("Storage Error", "Failed to save user data");
      }
    } else {
      Alert.alert("Login Failed", "Invalid email or password");
    }
  };

  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View style={{ width: 300, backgroundColor: "white", padding: 20, borderRadius: 10 }}>
          <Text className="text-2xl text-center mb-4 font-bold">Login</Text>
          
          <Text className="text-lg">Email:</Text>
          <TextInput
            className="border p-2 mb-4"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
            keyboardType="email-address"
          />
          
          <Text className="text-lg">Password:</Text>
          <TextInput
            className="border p-2 mb-4"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            secureTextEntry
          />
          
          <Button type="primary" onPress={handleLogin}>Login</Button>
          <TouchableOpacity onPress={onClose}>
            <Text className="text-center text-lg text-blue-500 mt-4">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}