// // 'use client'
// import { addWatch } from "./server-actions/addWatch";
// // import {React, useState} from 'react'


// export default function WatchForm() {

//   return (
//     // action={addWatch}
//     <form action={addWatch} className="mb-6">
//       <div className="mb-4">
//         <label htmlFor="brand" className="block text-white mb-2">
//           Brand
//         </label>
//         <input
//           type="text"
//           id="brand"
//           name="brand"
//           className="shadow appearance-none border border-gray-600 bg-gray-700 rounded w-full py-2 px-3 text-white"
//           required
//         />
//       </div>
//       <div className="mb-4">
//         <label htmlFor="model" className="block text-white mb-2">
//           Model
//         </label>
//         <input
//           type="text"
//           id="model"
//           name="model"
//           className="shadow appearance-none border border-gray-600 bg-gray-700 rounded w-full py-2 px-3 text-white"
//           required
//         />
//       </div>
//       <div className="mb-4">
//         <label htmlFor="referenceNumber" className="block text-white mb-2">
//           Reference Number
//         </label>
//         <input
//           type="text"
//           id="referenceNumber"
//           name="referenceNumber"
//           className="shadow appearance-none border border-gray-600 bg-gray-700 rounded w-full py-2 px-3 text-white"
//         />
//       </div>

//       {/* New File Input for Image Upload */}
//       <div className="mb-4">
//         <label htmlFor="image" className="block text-white mb-2">
//           Upload Image
//         </label>
//         <input
//           type="file"
//           id="image"
//           name="image"
//           accept="image/*"
//           className="shadow appearance-none border border-gray-600 bg-gray-700 rounded w-full py-2 px-3 text-white"
//           required
//         />
//       </div>

//       <button
//         type="submit"
//         className="bg-gray-600 hover:bg-gray-300 text-white hover:text-black font-bold py-2 px-4 rounded"
//       >
//         Add Watch
//       </button>
//     </form>
//   );
// }
"use client";
import { useState } from "react"; // Make sure to import useState
import { addWatch } from "./server-actions/addWatch";

export default function WatchForm() {
  const [imagePreview, setImagePreview] = useState(null); // State for image preview

  // Handle image change to set a preview
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create a URL for the image
      setImagePreview(imageUrl); // Set the image preview
    } else {
      setImagePreview(null); // Clear the image preview if no file
    }
  };

  return (
    <form action={addWatch} className="mb-6">
      <div className="mb-4">
        <label htmlFor="brand" className="block text-white mb-2">
          Brand
        </label>
        <input
          type="text"
          id="brand"
          name="brand"
          className="shadow appearance-none border border-gray-600 bg-gray-700 rounded w-full py-2 px-3 text-white"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="model" className="block text-white mb-2">
          Model
        </label>
        <input
          type="text"
          id="model"
          name="model"
          className="shadow appearance-none border border-gray-600 bg-gray-700 rounded w-full py-2 px-3 text-white"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="referenceNumber" className="block text-white mb-2">
          Reference Number
        </label>
        <input
          type="text"
          id="referenceNumber"
          name="referenceNumber"
          className="shadow appearance-none border border-gray-600 bg-gray-700 rounded w-full py-2 px-3 text-white"
        />
      </div>

      {/* File Input for Image Upload */}
      <div className="mb-4">
        <label htmlFor="image" className="block text-white mb-2">
          Upload Image
        </label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleImageChange} // Set the onChange handler to update the image preview
          className="shadow appearance-none border border-gray-600 bg-gray-700 rounded w-full py-2 px-3 text-white"
          required
        />
      </div>

      <div className="block width=20px height=90px">
        {/* Image Preview */}
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Watch Preview"
            className="mb-4 w-full h-auto rounded"
          />
        )}
      </div>

      {/* Image Preview
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Watch Preview"
          className="mb-4 w-full h-auto rounded"
        />
      )} */}

      <button
        type="submit"
        className="bg-gray-600 hover:bg-gray-300 text-white hover:text-black font-bold py-2 px-4 rounded"
      >
        Add Watch
      </button>
    </form>
  );
}
