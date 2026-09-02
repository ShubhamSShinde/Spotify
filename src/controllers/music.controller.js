const musicModel = require("../models/music.model");
const jwt = require("jsonwebtoken");
const { uploadFile } = require("../services/storage.service");

const createMusic = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "artist") {
      return res.status(403).json({ message: "YOU DONT HAVE PERMISSION" });
    }

    const { uri, title, artist } = req.body;

    const result = await uploadFile(req.file.buffer.toString("base64"));

    const Music = await musicModel.create({
      uri: result.url,
      title, 
     artist: decoded.id
    });

    res.status(201).json({
      message: "Music created successfully",
      Music: {
        uri: Music.uri,
        title: Music.title,
        artist: Music.artist,
      },
    });
  } catch (error) {
    console.log(error)
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { createMusic };
