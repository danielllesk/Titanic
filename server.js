const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const mindee = require("mindee");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:3000 "}));
app.use(fileUpload({ useTempFiles: true }));

const mindeeClient = new mindee.Client({apiKey: process.env.MINDEE_KEY})

app.post("/parse-resume", async (req, res) => {
    const file = req.files?.resume;
    if(!file) return res.status(400).send("No file");

    try {
        const input = mindeeClient.docFromBuffer(file.data, { filename: file.name });
        const response = await mindeeClient.enqueueAndParse(mindee.product.ResumeV1, input);
        res.json(resp.document);
    } catch (error) {
        console.error(err);
        res.status(500).send("Mindee error");
    }
});