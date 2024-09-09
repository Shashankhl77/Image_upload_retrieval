const express = require("express");
const app = express();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
//const body = require("body-parse");
const PORT = 7000;

app.use(express.json());
// multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    {
      const unique = Date.now() + "-" + file.originalname;
      cb(null, unique);
    }
  },
});

const filefilter = (req, file, cb) => {
  const type = ["image/jpeg", "image/png", "image/gif"];
  if (type.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new error("only these files  are allowed(JPEG,PNG,GIF)", false));
  }
};

const size = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: filefilter,
});

app.post("/upload", size.single("image"), (req, res) => {
  if (req.file) {
    res.send("file uploaded");
  } else {
    res.status(400).send("file not uploaded");
  }
});

app.get("/images/:filename", (req, res) => {
  const filepath = path.join(__dirname, "uploads", req.params.filename);
  console.log(filepath);
  if (filepath) {
    res.sendFile(filepath);
  } else {
    res.status(404).send("file not found");
  }
});

app.get("/images", (req, res) => {
  const drpath = path.join(__dirname, "uploads");
  fs.readdir(drpath, (err, files) => {
    if (err) {
      res.status(400).send(" dr not found ");
    }
    res.json(files);
  });
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).send("multer error");
  } else if (err) {
    res.status(400).send(err.message || "General Error");
  }
});

app.listen(PORT, () => {
  console.log("server running");
});

app.post("/", (req, res) => {
  const data = req.body;
  console.log(data);
});
