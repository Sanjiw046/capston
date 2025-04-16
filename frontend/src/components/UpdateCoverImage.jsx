import React, { useState } from "react";
import axios from "../utils/axios";

const UpdateCoverImage = ({ restaurantName }) => {
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coverImage) {
      alert("Please select an image");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("restaurant_name", restaurantName);
    formData.append("coverImage", coverImage);

    try {
      const response = await axios.post("/restaurant/update-coverImage", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Cover image updated successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error updating cover image:", error.response?.data?.message);
      alert("Failed to update cover image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-lg font-semibold">Update Cover Image</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} className="mt-2"/>
      <button 
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white py-2 px-4 rounded-lg mt-2"
      >
        {loading ? "Updating..." : "Update Image"}
      </button>
    </div>
  );
};

export default UpdateCoverImage;
