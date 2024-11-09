const express = require("express");
const axios = require("axios");
const app = express();

// API endpoint to handle user request
app.get("/convert", async (req, res) => {
  try {
    const txtUrl = req.query.url;
    if (!txtUrl) {
      return res.status(400).send("URL parameter is required");
    }

    // Fetch the content from the provided URL
    const response = await axios.get(txtUrl);
    const txtContent = response.data;

    // Set headers to indicate the file type (M3U8)
    res.setHeader("Content-Type", "application/x-mpegURL");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="converted.m3u8"'
    );

    // Send the same content back as m3u8 file
    res.send(txtContent);
  } catch (error) {
    // Handle errors (e.g., invalid URL, fetch failure)
    console.error(error);
    res.status(500).send("Error fetching or processing the file.");
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
