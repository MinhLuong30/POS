import { useState } from "react";
import { View, Text, StatusBar } from "react-native";
import { Provider } from "@ant-design/react-native";
import FoodDisplay from "./Components/FoodDisplay";
import OrderFood from "./Components/OrderFood";
import '../global.css';

export default function App() {
  const [quantities, setQuantities] = useState({});

  // Function to update quantity
  const updateQuantity = (itemName, amount) => {
    setQuantities((prev) => {
      const newQuantity = (prev[itemName] || 0) + amount;
      return { ...prev, [itemName]: Math.max(0, newQuantity) };
    });
  };

  return (
    <Provider>
      <View className="flex-1">
        <View>
          <Text className="text-2xl text-center text-white bg-gray-500">Coco-Ichiban</Text>
        </View>
        <View className="flex-row">
          {/* Food Display */}
          <FoodDisplay quantities={quantities} updateQuantity={updateQuantity} />
          
          {/* Order Food Section */}
          <OrderFood quantities={quantities} />
        </View>
        <StatusBar style="auto" />
      </View>
    </Provider>
  );
}
