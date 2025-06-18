const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const mindee = require("mindee");

const mindeeClient = new mindee.Client({apiKey: "52ae378b81aa1f415328e9d0eff01f92"})

const inputSource = mindeeClient.docFromBuffer(file.data, { // initialize new inputsource data from post method
    filename: file.name,
});

const apiResponse = mindeeClient.enqueueAndParse( // Parse the resume
    mindee.product.ResumeV1,
    inputSource
);

apiResponse.then((resp) => {
    console.log(resp.document.toString());
})