const ImageKit = require("@imagekit/nodejs");

const ImageKitclient = new ImageKit({
  privateKey: process.env['IMAGEKIT_PRIVATE_KEY'], // This is the default and can be omitted
});

const uploadFile = async (file) => {
  const result = await ImageKitclient.files.upload({
    file,
    fileName : "music_" + Date.now(),
    folder : "Spotify/music"
  })

  return result;
}

module.exports ={uploadFile}