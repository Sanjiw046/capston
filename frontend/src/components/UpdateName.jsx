import React, { useState } from "react";
import axios from "../utils/axios";
import { toast } from "react-toastify";

const UpdateName = ({ restaurantName }) => {
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setNewName(e.target.value);
    console.log(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newName) {
      toast.error("Please enter a new restaurant name.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/restaurant/update-name", {
        restaurant_name: restaurantName,
        new_name: newName,
      });

      toast.success("Restaurant name updated successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error updating restaurant name:", error.response?.data?.message);
      toast.success("Failed to update restaurant name.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-2">Update Restaurant Name</h2>

      <input
        type="text"
        placeholder="Enter new name"
        value={newName}
        onChange={handleChange}
        className="w-full p-2 border rounded-md mb-2"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white py-2 px-4 rounded-lg w-full"
      >
        {loading ? "Updating..." : "Update Name"}
      </button>
    </div>
  );
};

export default UpdateName;
