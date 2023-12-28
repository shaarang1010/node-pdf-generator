import express from "express";
import bodyParser from "body-parser";
import DBConnect from "./pgClient.mjs";
import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/api/pod-event", async (req, res) => {
  const {
    podNo,
    deliveryDate,
    deliveryTime,
    deliveryLocation,
    deliveryProof,
    receiverName,
    signature,
  } = req.body;
  try {
    await DBConnect.connect();
    console.log(DBConnect);
    const uploadResponse = await Promise.all([
      cloudinary.uploader.upload(deliveryProof, {
        folder: "delivery-proof",
      }),
      cloudinary.uploader.upload(signature, {
        folder: "signatures",
      }),
    ]);
    console.log(uploadResponse);
    // await DBConnect.insertData(
    //   podNo,
    //   deliveryDate,
    //   deliveryTime,
    //   deliveryProof,
    //   deliveryLocation,
    //   receiverName,
    //   signature
    // );
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
