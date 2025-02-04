const orders = [];

export const saveOrder = (order) => {
  orders.push(order);
  console.log("Order saved:", order);
};

export const getOrders = () => orders;

export default orders;
