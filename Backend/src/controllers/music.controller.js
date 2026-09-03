const musicModel = require("../models/music.model");
const jwt = require("jsonwebtoken");
const { uploadFile } = require("../services/storage.service");
const albumModel = require("../models/album.model");

const createMusic = async (req, res) => {
  const { uri, title, artist } = req.body;

  const result = await uploadFile(req.file.buffer.toString("base64"));

  const Music = await musicModel.create({
    uri: result.url,
    title,
    artist: req.user.id,
  });

  res.status(201).json({
    message: "Music created successfully",
    Music: {
      uri: Music.uri,
      title: Music.title,
      artist: Music.artist,
    },
  });
};

const createAlbum = async (req, res) => {
  // const { title, musicsId } = req.body;

  albumModel.create({
    title: req.body.title,
    musics: req.body.musics,
    artist: req.user.id,
  });

  res.status(201).json({
    message: "Album created successfully",
    album: {
      title: req.body.title,
      musics: req.body.musics,
      artist: req.user.id,
    },
  });
};

const getAllmusic = async (req, res) => {
  const albums = await musicModel.find()
  .skip(0)
  .limit(10).populate("artist");

  res.status(200).json({
    message: "Albums fetched successfully",
    albums: albums,
  });
};

const getAlbums = async (req, res) => {
  const albums = await albumModel
    .find()
    .select("title artist ")
    .populate("artist", "username email");
  //.populate("musics");

  res.status(200).json({
    message: "Albums fetched successfully",
    albums: albums,
  });
};

const getAlbumById = async (req, res) => {
  const albumId = req.params.albumId;
  const album = await albumModel
    .findById(albumId)
    .populate("artist", "username email")
    .populate("musics");

  if (!album) {
    return res.status(404).json({ message: "Album not found" });
  }

  res.status(200).json({
    message: "Album fetched successfully",
    album: album,
  });
};

module.exports = {
  createMusic,
  createAlbum,
  getAllmusic,
  getAlbums,
  getAlbumById,
};
