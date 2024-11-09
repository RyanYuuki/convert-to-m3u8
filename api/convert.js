const axios = require("axios");

module.exports = async (req, res) => {
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
};