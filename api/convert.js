const axios = require("axios");

module.exports = async (req, res) => {
  try {
    const txtUrl = req.query.url;
    if (!txtUrl) {
      return res.status(400).send("URL parameter is required");
    }

    const decodedUrl = decodeURIComponent(txtUrl);

    const response = await axios.get(decodedUrl, {
      responseType: "text",
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (response.status !== 200) {
      return res
        .status(response.status)
        .send("Failed to fetch the .m3u8 file.");
    }

    let txtContent = response.data;

    const indexOfExtM3U = txtContent.indexOf("#EXTM3U");
    if (indexOfExtM3U !== -1) {
      txtContent = txtContent.substring(indexOfExtM3U);
    } else {
      return res
        .status(400)
        .send("Invalid .m3u8 content: Missing #EXTM3U header.");
    }

    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    res.setHeader("Content-Disposition", 'attachment; filename="master.m3u8"');
    res.setHeader("Access-Control-Allow-Origin", "*");

    res.send(txtContent);
  } catch (error) {
    console.error("Error fetching or processing the file:", error.message);
    res.status(500).send("Error fetching or processing the file.");
  }
};
