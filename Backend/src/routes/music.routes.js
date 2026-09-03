const express = require("express");
const { createMusic } = require("../controllers/music.controller");
const multer = require("multer");
const { createAlbum, getAllmusic , getAlbums,getAlbumById } = require("../controllers/music.controller");
const { authMiddleware, authuser } = require("../middlewares/auth.middleware");

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post("/upload", authMiddleware, upload.single("music"), createMusic);
router.post("/create-album", authMiddleware, createAlbum);

router.get("/", authuser, getAllmusic);
router.get("/albums", authuser, getAlbums);
router.get("/albums/:albumId", authuser, getAlbumById);

module.exports = router;
