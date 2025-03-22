import { useState } from "react";
import { View, Text, StatusBar } from "react-native";
import { Provider } from "@ant-design/react-native";
import FoodDisplay from "./Components/FoodDisplay";
import OrderFood from "./Components/OrderFood";
import '../global.css';
import * as ScreenOrientation from 'expo-screen-orientation';
import useLocation from "../hooks/useLocation";

export default function App() {
  const [quantities, setQuantities] = useState({});
  const [user, setUser] = useState(null);
  console.log(user);
  const updateQuantity = (itemName, amount) => {
    setQuantities((prev) => {
      const newQuantity = (prev[itemName] || 0) + amount;
      return { ...prev, [itemName]: Math.max(0, newQuantity) };
    });
  };

  const resetQuantities = () => {
    setQuantities({});
  };

  const {location, errorMsg} = useLocation();


  return (
    <Provider>
      <View className="flex-1">
        <View>
          <Text className="text-2xl text-center text-white bg-gray-500">Coco-Ichiban</Text>
        </View>
        <View className="flex-row">
          <FoodDisplay quantities={quantities} updateQuantity={updateQuantity} user={user}  />
          <OrderFood quantities={quantities} resetQuantities={resetQuantities} user={user} setUser={setUser} location={location} />
        </View>
        <StatusBar style="auto" />
      </View>
    </Provider>
  );
}
