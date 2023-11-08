const fs = require("fs/promises");
const dirname = require("path");


async function ReadData() {
  try {
    console.log("reading data");
    // Make sure the file exists
    // await fs.access(dirname.resolve(__filename, "listdata.json"));
    // Read the file
    const absPath = dirname.join(__dirname, "listdata.json");
    const dataBuff = await fs.readFile(absPath, "utf-8");

    // convert the buffer to a json object and return it

    return JSON.parse(dataBuff);

  } catch (error) {
    console.error("Error reading data", error);
    throw error;
  }
}

async function WriteData(dataOut) {
  try {
    // convert JSON file to a string
    const dataStr = JSON.stringify(dataOut, null, 2);
    await fs.writeFile("listdata.json", dataStr, "utf-8");
    console.log("Writing success");
  } catch (error) {
    console.log("Problem writing data", error);
    throw error;
  }
}

exports.ReadData = ReadData;
exports.WriteData = WriteData;
