const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = async (req, res) => {
  if (req.method === "GET") {
    const { fileUrl, lang, cache } = req.query;

    if (!fileUrl) {
      return res
        .status(400)
        .json({ error: "fileUrl query parameter is required" });
    }

    try {
      const response = await axios.get(fileUrl, { responseType: "text" });

      const fileName = path.basename(fileUrl, ".txt") + ".m3u8";
      console.log(
        `Language: ${lang || "not specified"}, Cache: ${
          cache || "not specified"
        }`
      );

      const tempFilePath = path.join("/tmp", fileName);
      fs.writeFileSync(tempFilePath, response.data);

      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );
      res.sendFile(tempFilePath, (err) => {
        if (err) {
          return res.status(500).json({ error: "Error sending file" });
        }
        fs.unlinkSync(tempFilePath);
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while processing the file" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
