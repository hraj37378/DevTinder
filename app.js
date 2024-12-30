const express = require("express");

const app = express();

const { adminAuth, userAuth } = require("./middlewares/auth");
// app.use("/", (req,res) => {
//     res.send("Homepage");
// });

app.use("/admin", adminAuth);
app.use("/user", userAuth);

app.get("/user", (req, res) => {
    res.send({firstName: "Harsh", lastName: "Raj"});
});

app.post("/user", async(req,res) => {
    // console.log(req.body);
    // saving data to DB
    res.send("Data saved successfully to DB");
});

app.delete("/user", userAuth, (req,res) => {
    res.send("Deleted successfully");
});

app.get("/admin/getAllData", adminAuth, (req, res) => {
    res.send("All data sent");
});

app.post("/admin", (req, res) => {
    res.send("All data posted on server");
});


app.listen(3000, () => {
    console.log("Server running on PORT:", 3000);
});