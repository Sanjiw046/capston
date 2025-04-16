import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const OrderHistory = () => {
  const { orderHistory } = useSelector((state) => state.user);

  if (!orderHistory || orderHistory.length === 0) {
    return (
        <div className="padding-fix">
            <div className="min-h-screen flex items-center justify-center text-lg text-gray-600">
                You have no order history yet.
            </div>
        </div>
    );
  }

  const currentOrder = orderHistory[orderHistory.length - 1];
  const oldOrders = orderHistory.slice(0, -1).reverse();

  const statusSteps = ["placed", "preparing", "out for delivery", "delivered"];

  return (
    <div className="padding-fix">
        <div className="min-h-screen px-6 py-10 bg-gray-100">
        <motion.div
            className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <h1 className="text-2xl font-bold text-gray-800 mb-6">🧾 Order History</h1>

            {/* Current Order */}
            <section className="mb-10">
            <h2 className="text-xl font-semibold text-blue-600 mb-3">🟢 Current Order</h2>
            <p className="text-sm text-gray-500 mb-2">
                Ordered on {new Date(currentOrder.date).toLocaleString()}
            </p>

            {/* Order Items */}
            {currentOrder.items.map((item, index) => (
                <div
                key={index}
                className="flex justify-between items-center bg-gray-50 p-3 mb-2 rounded shadow-sm"
                >
                <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-blue-700 font-bold">₹{item.price * item.quantity}</p>
                </div>
            ))}

            {/* Status Tracker */}
            <div className="mt-4 pb-4 shadow-sm">
                <h3 className="text-md font-medium mb-2">Order Status</h3>
                <div className="flex gap-2 flex-wrap">
                {statusSteps.map((step, i) => (
                    <div
                    key={i}
                    className={`px-3 py-1 rounded-full text-sm font-medium shadow 
                    ${step === currentOrder.status
                        ? "bg-green-500 text-white"
                        : statusSteps.indexOf(currentOrder.status) > i
                        ? "bg-gray-300 text-black"
                        : "bg-gray-200 text-gray-500"}`}
                    >
                    {step}
                    </div>
                ))}
                </div>
            </div>
            </section>

            {/* Old Orders */}
            <section className="mt-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">📚 Past Orders</h2>
            {oldOrders.length === 0 ? (
                <p className="text-sm text-gray-500">No previous orders found.</p>
            ) : (
                oldOrders.map((order, idx) => (
                <div
                    key={idx}
                    className="border border-gray-200 rounded-lg p-4 mb-4 shadow-sm"
                >
                    <p className="text-sm text-gray-500 mb-2">
                    Ordered on {new Date(order.date).toLocaleString()} —{" "}
                    <span className="font-semibold text-green-700">{order.status}</span>
                    </p>
                    {order.items.map((item, index) => (
                    <div
                        key={index}
                        className="flex justify-between text-sm text-gray-700 border-t py-2"
                    >
                        <span>{item.name} (x{item.quantity})</span>
                        <span>₹{item.price * item.quantity}</span>
                    </div>
                    ))}
                </div>
                ))
            )}
            </section>
        </motion.div>
        </div>
    </div>
  );
};

export default OrderHistory;
