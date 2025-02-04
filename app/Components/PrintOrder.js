// PrintOrder.js
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";

// Function to print or share the order
export const printOrder = async (currentOrder, getOrderItemPrice) => {
  if (!currentOrder) return;

  const orderHtml = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .total { font-weight: bold; font-size: 18px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <h1>Order Receipt</h1>
        <p><strong>Order ID:</strong> ${currentOrder.orderId}</p>
        <p><strong>Order Type:</strong> ${currentOrder.orderType}</p>
        <p><strong>Timestamp:</strong> ${currentOrder.timestamp}</p>

        <h2>Foods Ordered:</h2>
        <table>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
          ${currentOrder.items
            .map(
              (item) => `
            <tr>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>${getOrderItemPrice(item.name, item.quantity)}$</td>
            </tr>
          `
            )
            .join("")}
        </table>

        <p class="total">Total: ${currentOrder.total} $</p>
      </body>
    </html>
  `;

  try {
    // Generate the PDF
    const { uri } = await Print.printToFileAsync({ html: orderHtml });

    // Define the file path
    const pdfFileUri = `${FileSystem.cacheDirectory}order-receipt-${currentOrder.orderId}.pdf`;

    // Move the generated file to a new location
    await FileSystem.moveAsync({
      from: uri,
      to: pdfFileUri,
    });

    // Share the PDF
    await Sharing.shareAsync(pdfFileUri);
  } catch (error) {
    console.error("Error generating or sharing PDF:", error);
  }
};
