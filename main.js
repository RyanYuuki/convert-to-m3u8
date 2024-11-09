const express = require("express");
const axios = require("axios");
const app = express();

app.get("/convert", async (req, res) => {
  try {
    const txtUrl = req.query.url;
    if (!txtUrl) {
      return res.status(400).send("URL parameter is required");
    }

    const response = await axios.get(txtUrl);
    const txtContent = response.data;

    res.setHeader("Content-Type", "application/x-mpegURL");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="converted.m3u8"'
    );

    res.send(txtContent);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching or processing the file.");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
