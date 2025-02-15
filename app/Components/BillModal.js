// BillModal.js
import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { Button } from "@ant-design/react-native";
import { printOrder } from "./PrintOrder";

export default function BillModal({ visible, onClose, currentOrder, paymentMethod, getOrderItemPrice }) {
  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View style={{ width: 600, backgroundColor: "white", borderRadius: 20, padding: 20 }}>
          <Text className="text-2xl text-center mb-4 font-bold">Order Receipt</Text>
          {currentOrder && (
            <>
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-lg">Order ID: {currentOrder.orderId}</Text>
                  <Text className="text-lg">Order Type: {currentOrder.orderType}</Text>
                  <Text className="text-lg">Timestamp: {currentOrder.timestamp}</Text>

                  <Text className="text-xl font-bold mt-4">Items Ordered:</Text>
                  {currentOrder.items.map((item, index) => (
                    <Text key={index} className="text-lg">
                      - {item.name} x {item.quantity} = {getOrderItemPrice(item.name, item.quantity)} $
                    </Text>
                  ))}
                </View>

                {paymentMethod === "Bank Transfer" && (
                  <View className="w-72 h-full text-center flex items-center bg-slate-400">
                    <Text>QR CODE</Text>
                  </View>
                )}
              </View>

              <Text className="text-xl font-bold mt-6 text-center">Total: {currentOrder.total} $</Text>

              <Button type="primary" onPress={() => printOrder(currentOrder, getOrderItemPrice)} className="mt-4">
                Print Receipt
              </Button>
            </>
          )}

          <TouchableOpacity onPress={onClose}>
            <Text className="text-center text-lg text-blue-500 mt-4">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
