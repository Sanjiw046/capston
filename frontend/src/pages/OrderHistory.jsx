import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import socket from "../utils/socket";
import axios from "../utils/axios";

const OrderHistory = () => {
  const { orderHistory } = useSelector((state) => state.user);
  const  userData  = useSelector((state) => state.user);
  const [currentOrders, setCurrentOrders] = useState(null);

  // joining the socket room
  useEffect(() => {
    //  console.log('User state:', userData._id);
    if (userData && userData._id) {
      // Join user room on socket connect
      socket.emit('joinUserRoom', userData._id);
      
    }
  }, [userData]);


 useEffect(() => {
  if (!orderHistory || orderHistory.length === 0) return;

   const ongoing = orderHistory.filter(order => order.status !== "delivered");
   setCurrentOrders(ongoing);

 }, [orderHistory]);


  useEffect(() => {
    if (!currentOrders) return;
    // console.log(currentOrder);
    
    const handleStatusUpdate = async({ orderId, status }) => {
      const normalizeStauts = status === 'pending' ? 'placed': status; 
      // console.log('orderStatusUpdate user');
      //   console.log(orderId);
      //   console.log(status);
    //   if (orderId === currentOrder.orderId) {
    //     setCurrentOrder((prevOrder) => ({
    //       ...prevOrder,
    //       status: status === "pending" ? "placed" : status, // normalize "pending" to "placed"
    //     }));
    //   }
        setCurrentOrders((prevOrders) => {
          const updatedOrders = prevOrders.map((order) => {
            if (order._id === orderId) {
              // Found the order to update
              return {
                ...order,
                status: normalizeStauts, // update the status
              };
            } else {
              // Leave this order unchanged
              return order;
            }
          });

          return updatedOrders; // setCurrentOrders will use this
        });
        // console.log('id',orderId)
        // console.log('orderhis: ',orderHistory);

        try {
          if(status=='pending'){
            status = 'placed';
          }
          const res = await axios.post("/update/order-status",{
            status
          })
          console.log(res);
        } 
        catch (error) {
          console.log(error);
        }
    };

    socket.on("orderStatusUpdate", handleStatusUpdate);

    return () => {
      
      socket.off("orderStatusUpdate", handleStatusUpdate);
    };
  }, [currentOrders]);

  if (!orderHistory || orderHistory.length === 0 ) {
    return (
      <div className="padding-fix">
        <div className="min-h-screen flex items-center justify-center text-lg text-gray-600">
          You have no order history yet.
        </div>
      </div>
    );
  }


  // If currentOrder is delevered, all orders are old
  const oldOrders = orderHistory
  .filter(order => order.status === "delivered")
  .reverse();

  // console.log('oldorder: ',oldOrders[oldOrders.length-1]);


  const statusSteps = ["placed", "preparing", "out for delivery", "delivered"];

  return (
    <div className="padding-fix">
        <div className="h-[25vh] bg-gradient-to-r from-purple-600 to-indigo-700 mb-6 flex items-center justify-center">
        <h1 className="text-3xl font-bold text-white">🧾 Order History</h1>
      </div>

      <div className="min-h-screen px-6 py-10 bg-gray-100">
        <motion.div
          className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >

          {/* ✅ Current Order Section */}
          {currentOrders && currentOrders.length > 0 && (
            <section className="mb-10 bg-gradient-to-br from-blue-50 to-purple-100 border border-blue-300 rounded-lg p-5 shadow-md">
              <h2 className="text-xl font-semibold text-blue-600 mb-4 ml-2">🚚 Current Orders</h2>

              {currentOrders.map((order, idx) => (
                <div key={idx} className="mb-6">
                  {order.items.map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center bg-white p-3 mb-3 rounded shadow-sm border border-blue-100">
                        <img
                          src={item.image || "/placeholder.png"}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="ml-4 flex-grow">
                          <p className="font-semibold mb-0">{item.name}</p>
                          <p className="text-sm text-gray-600 mb-0">Qty: {item.quantity}</p>
                          <p className="text-sm text-gray-500 mb-0">
                            Ordered on {new Date(order.date).toLocaleString()}
                          </p>
                        </div>
                        <div className="ml-auto">
                          <p className="text-blue-700 font-bold text-lg">
                            ₹{item.price * item.quantity}
                          </p>
                        </div>
                      </div>

                      {/* Status Tracker */}
                      <div className="mt-2 ml-4 mb-4">
                        <div className="flex gap-2 flex-wrap">
                          {statusSteps.map((step, i) => (
                            <div
                              key={i}
                              className={`px-3 py-1 rounded-full text-sm font-medium shadow 
                              ${step === order.status
                                ? "bg-green-500 text-white"
                                : statusSteps.indexOf(order.status) > i
                                ? "bg-gray-300 text-black"
                                : "bg-gray-200 text-gray-500"}`}
                            >
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </section>
          )}



          {/* ✅ Past Orders Section */}
          <section className="mt-6 bg-white border border-gray-300 rounded-lg p-5 shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">📚 Past Orders</h2>
            {oldOrders.length === 0 ? (
              <p className="text-sm text-gray-500">No previous orders found.</p>
            ) : (
              oldOrders.map((order, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-2 mb-4 shadow-sm bg-gray-50"
                >
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center py-2 border-b last:border-b-0"
                    >
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        className="w-18 h-18 object-cover rounded"
                      />

                      <div className="ml-4 flex-grow">
                        <p className="font-semibold mb-1">{item.name}</p>
                        <p className="text-xs text-gray-500 mb-0">
                          {new Date(order.date).toLocaleString()}
                        </p>
                        <p className="text-xs text-green-600 capitalize">{order.status}</p>
                      </div>

                      <div className="ml-auto">
                        <p className="text-blue-700 font-medium text-right">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
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
