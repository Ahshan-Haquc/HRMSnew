const app = require("./app");
const connectDatabase = require("./config/db");
const { serverPort } = require("./secret");
// const { connectToDevice } = require("./config/connectToDevice");

const PORT = serverPort

app.listen(PORT, async ()=>{
    console.log(`Server is running at http://localhost:${PORT}`)
    connectDatabase();
    // connectToDevice();

})