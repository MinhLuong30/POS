import { useState } from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Button, Card } from "@ant-design/react-native";
import japaneseFoodData from "../Data";
import '../../global.css';
const foodTypes = ["All", "Sushi", "Salad", "Tenmaki", "My Order"];

export default function FoodDisplay({ quantities, updateQuantity }) {
  const [selectedType, setSelectedType] = useState("All");

  // Filter data based on selected type
// Filter data based on selected type
const filteredData =
  selectedType === "All"
    ? japaneseFoodData
    : selectedType === "My Order"
    ? japaneseFoodData.filter((item) => quantities[item.name] > 0) // Show only selected items
    : japaneseFoodData.filter(
        (item) => item.type.toLowerCase() === selectedType.toLowerCase()
      );


  return (
    <View className="w-3/4 bg-gray-100 p-4">
      /* Food Type ScrollView */
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        {foodTypes.map((type, index) => (
          <TouchableOpacity key={index} onPress={() => setSelectedType(type)}>
            <View className={`w-40 h-20 p-2`}>
              <Card style={{ height: 50, borderRadius: 20, marginBottom: 30, backgroundColor: `${selectedType === type ? "black" : "white"}` }}>
                <Card.Body>
                  <Text className={`text-center items-center justify-center text-lg ${selectedType === type ? "text-white" : ""}`}>{type}</Text>
                </Card.Body>
              </Card>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      /* Food Items Grid */
      <ScrollView>
        <View className="flex-wrap flex-row h-screen mb-32">
          {filteredData.map((item, index) => (
            <View key={index} className="w-1/4 p-2">
              <Card style={{ marginBottom: 10, height: 280, borderRadius: 20 }}>
                <View className="h-48 rounded-tl-2xl rounded-tr-2xl bg-blue-200"></View>
                <Card.Header
                  title={<Text className="w-auto text-center text-xl">{item.name}</Text>}
                />
                <Card.Body>
                  <View className="flex-row items-center justify-between ml-5 mr-5">
                    <Text className="text-xl font-bold">{item.price} $</Text>
                    <View className="flex-row items-center ml-2 gap-2">
                      <Button
                        style={{ borderRadius: 50, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }} 
                        onPress={() => updateQuantity(item.name, -1)}>-</Button>
                      <Text className="text-xl font-bold">{quantities[item.name] || 0}</Text>
                      <Button
                        style={{ borderRadius: 50, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => updateQuantity(item.name, 1)}>+</Button>
                    </View>
                  </View>
                </Card.Body>
              </Card>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
