// components/NotificationListener.jsx
import React, { useEffect, useState } from "react";
import NotificationToast from "../components/NotificationToast";
import socket from "../utils/socket";
import { useParams } from "react-router-dom";

const NotificationListener = () => {
  const [toastMessage, setToastMessage] = useState(null);
  const {restaurant_id : currResId} = useParams();

  useEffect(() => {
    console.log("👂 Listening for newOrderPlaced...");
    // socket.on("connect", () => {
    //   console.log("✅ Connected to socket server:", socket.id);
    // });
    const handleNewewOrder = (order)=>{

      // if resId not present in params or resId not matched with the resId saved in orer
      if(!currResId || order.restaurantId !== currResId){
        return;
      }

      setToastMessage(
        `Order placed by ${order.name || "a user"} with ${order.items.length} item's.`
      );
      setTimeout(() => setToastMessage(null), 500000);
      
    }
    socket.on("newOrderPlaced", handleNewewOrder);

    return () => socket.off("newOrderPlaced");
  }, [currResId]);

  return (
    <>
      {toastMessage && (
        <NotificationToast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </>
  );
};

export default NotificationListener;
