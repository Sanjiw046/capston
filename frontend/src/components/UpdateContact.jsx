import React, { useState } from "react";
import axios from "../utils/axios";
import { toast } from "react-toastify";

const UpdateContact = ({ restaurantName }) => {
  const [newNumber, setNewNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Allows only numbers
      setNewNumber(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newNumber || newNumber.length !== 10) {
      toast.error("Please enter a valid 10-digit contact number.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/restaurant/update-number", {
        restaurant_name: restaurantName,
        new_number: newNumber,
      });

      toast.success("Restaurant contact number updated successfully!");
      console.log(response.data);
      setNewNumber(""); // Clear input after successful update
    } catch (error) {
      console.error("Error updating restaurant contact number:", error.response?.data?.message || error);
      toast.error("Failed to update restaurant contact number.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-2">Update Restaurant Contact</h2>

      <input
        type="tel"
        placeholder="Enter new contact number"
        value={newNumber}
        onChange={handleChange}
        className="w-full p-2 border rounded-md mb-2"
        maxLength="10"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white py-2 px-4 rounded-lg w-full"
      >
        {loading ? "Updating..." : "Update Contact"}
      </button>
    </div>
  );
};

export default UpdateContact;
