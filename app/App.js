import { useState } from "react";
import { View, Text, ScrollView, StatusBar } from "react-native";
import { Provider, Card } from "@ant-design/react-native";
import FoodDisplay from "./Components/FoodDisplay";
import japaneseFoodData from "./Data";

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
          
          <View className="flex-1 h-fit ml-3 bg-gray-100 p-4">
            <Text className="text-2xl text-center mb-4">Order Foods</Text>
            <View className='max-h-20'>
            <ScrollView >
              {Object.entries(quantities).map(([itemName, quantity]) => {
                if (quantity > 0) {
                  const item = japaneseFoodData.find((food) => food.name === itemName);
                  return (
                    <Card key={itemName} style={{ marginBottom: 40, borderRadius: 20 }}>
                      
                      <Card.Header
                        title={<Text className="w-auto text-center text-xl">{item.name}</Text>}
                      />
                      <Card.Body>
                        <View className="flex-row items-center justify-between ml-5 mr-5">
                          <Text className="text-xl font-bold">{item.price} $</Text>
                          <Text className="text-lg">Quantity: {quantity}</Text>
                        </View>
                      </Card.Body>
                    </Card>
                  );
                }
                return null;
              })}
            </ScrollView>
            </View>
            
          </View>
        </View>
        <StatusBar style="auto" />
      </View>
    </Provider>
  );
}
