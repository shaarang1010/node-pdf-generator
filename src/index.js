import express from "express";
import bodyParser from "body-parser";
import DBConnect from "./pgClient.mjs";
import generatePDF from "./pdfGen.mjs";
import "dotenv/config";

const app = express();
const PORT = 8000;

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
    await DBConnect.insertData(
      podNo,
      deliveryDate,
      deliveryTime,
      deliveryProof,
      deliveryLocation,
      receiverName,
      signature
    );
    const data = {
      podNumber: podNo,
      name: `Instrumec proof of delivery- ${podNo}`,
      deliveryDate,
      deliveryTime,
      deliveryDate,
      deliveryLocation,
      receiverName,
      signature,
      deliveryPicture: deliveryProof,
    };
    const generatedFileName = await generatePDF(data);
    res.status(200).json({
      message: "success",
      message: `File ${generatedFileName} is generated!`,
    });
  } catch (err) {
    res.status(500).json({ message: err });
    console.log(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
