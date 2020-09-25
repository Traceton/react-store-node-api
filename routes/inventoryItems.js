const express = require("express");
const mongoose = require("mongoose");
const router = express();
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

const methodOverride = require("method-override");

// database
const mongoURI = process.env.DATABASE_URL;

// connection
const conn = mongoose.createConnection(mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

let gfs;

conn.on("error", (error) => {
  console.error(error);
});

conn.once("open", () => {
  console.log("router connection connected");
  // init gfs stream
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  });
});

// create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
  options: {
    useUnifiedTopology: true,
  },
});
const upload = multer({ storage });

// @route get /
// @desc loads form
router.get("/", (req, res) => {
  res.send("hello");
});

// @route post /upload
// @desc uploads file to database
router.post("/upload", upload.single("itemImage"), (req, res) => {
  res.json({ file: req.file });
});

// @route get /files
// @desc display all files in JSON
router.get("/files", (req, res) => {
  gfs.find().toArray((err, files) => {
    // check if files exist
    if (!files || files.length === 0) {
      return res.status(404).json({ err: "no files found" });
    }
    // files were found
    return res.status(201).json(files);
  });
});

// @route get /files/:filename
// @desc display file by filename
// router.get("/files/:filename", (req, res) => {
//   gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//     // check if file exist
//     if (!file || file.length === 0) {
//       return res.status(404).json({ err: "no file found" });
//     }
//     // files were found
//     return res.status(201).json(file);
//   });
// });

// @route get /images/:filename
// @desc display image by filename
router.get("/images/:filename", (req, res) => {
  const file = gfs
    .find({
      filename: req.params.filename,
    })
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({ err: "file not found" });
      }
      gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    });
});

router.use(methodOverride("_method"));
module.exports = router;
