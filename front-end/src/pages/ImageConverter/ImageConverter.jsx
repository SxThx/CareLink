import React, { useState } from "react";

const ImageToBase64WebP = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [base64Image, setBase64Image] = useState("");
  const [error, setError] = useState("");

  const handleImageConversion = async () => {
    setError("");
    setBase64Image("");

    if (!imageUrl) {
      setError("Please provide a valid image URL.");
      return;
    }

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const base64 = canvas.toDataURL("image/webp", 1.0); // Convert to WebP and get Base64
        setBase64Image(base64);
      };

      img.onerror = () => {
        setError("Failed to load the image. Please check the URL and try again.");
      };

      img.src = URL.createObjectURL(blob);
    } catch (err) {
      setError("Failed to fetch the image. Please check the URL and try again.");
      console.error("Error converting image:", err);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(base64Image).then(() => {
      alert("Base64 image copied to clipboard!");
    }, (err) => {
      console.error("Failed to copy text:", err);
    });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto", height:"100vh" }}>
      <h2>Convert Image to Base64 (WebP)</h2>
      <input
        type="text"
        placeholder="Enter image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />
      <button onClick={handleImageConversion} style={{ padding: "10px 20px", marginBottom: "20px" }}>
        Convert to Base64 WebP
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {base64Image && (
        <div>
          <textarea
            value={base64Image}
            readOnly
            style={{ width: "100%", height: "150px", padding: "10px", marginBottom: "10px" }}
          />
          <button onClick={handleCopyToClipboard} style={{ padding: "10px 20px" }}>
            Copy Base64 Image
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageToBase64WebP;
