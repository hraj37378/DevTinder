const express = require("express");

const app = express();

// app.use("/", (req,res) => {
//     res.send("Homepage");
// });

app.get("/user", (req, res) => {
    res.send({firstName: "Harsh", lastName: "Raj"});
});

app.post("/user", async(req,res) => {
    // console.log(req.body);
    // saving data to DB
    res.send("Data saved successfully to DB");
});

app.delete("/user", (req,res) => {
    res.send("Deleted successfully");
});

app.listen(3000, () => {
    console.log("Server running on PORT:", 3000);
});