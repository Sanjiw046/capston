import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import socket from '../utils/socket';
import { toast } from 'react-toastify';

const AllOrders = () => {
  const { restaurantId } = useParams(); // ✅ extract restaurantId from URL
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (restaurantId) {
      // Join restaurant room on socket connect
      socket.emit('joinRestaurantRoom', restaurantId);
      // console.log('join restaurant room');
    }
  }, [restaurantId]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // console.log('resid:',restaurantId);
        const res = await axios.get(`/restaurant/app/orders/${restaurantId}`);
        // console.log(res);
        setOrders(res.data.formattedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err.message);
      } finally {
        setLoading(false);
      }
    };
    if (restaurantId) fetchOrders();
  }, [restaurantId]);

  const handleStatusChange = async (orderId, newStatus) => {

    try {
      const res = await axios.post(`/restaurant/app/orders/${restaurantId}/updateStatus`, {
        orderId,
        status: newStatus
      });
      

      // Optimistically update the status in frontend state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.orderId === orderId ? { ...order, status: newStatus } : order
        )
      );
      socket.emit('orderStatusUpdate',{orderId,status: newStatus});
      // console.log('join restaurant room');

    } catch (error) {
      console.error("Error updating order status:", error.message);
      toast.error("Failed to update status. Please try again.");
    }
  };


  if (loading) return <div className="text-center mt-10">Loading orders...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Order ID</th>
            <th className="border px-4 py-2">Customer Name</th>
            <th className="border px-4 py-2">Food Items</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Total Price</th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>
        
        <tbody>
          {orders
            .filter(order => order.status !== "delivered") // ✅ exclude delivered orders
            .map(order => (
              <tr key={order.orderId}>
                <td className="border px-4 py-2 align-top">{order.orderId}</td>
                <td className="border px-4 py-2 align-top">{order.userName}</td>
                <td className="border px-4 py-2 align-top">
                  {order.items.map((item, idx) => (
                    <div key={idx}>{item.name}</div>
                  ))}
                </td>
                <td className="border px-4 py-2 align-top">
                  {order.items.map((item, idx) => (
                    <div key={idx}>{item.quantity}</div>
                  ))}
                </td>
                <td className="border px-4 py-2 align-top">₹{order.amount}</td>
                <td className="border px-4 py-2 align-top">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="out for delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
        </tbody>

      </table>
    </div>
  );
};

export default AllOrders;
