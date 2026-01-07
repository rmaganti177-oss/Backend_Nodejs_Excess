const express = require("express");
const mongoose = require("mongoose");
const dotEnv = require("dotenv");
const VendorRoutes = require("./Routes/VendorRoutes");
const FirmRoutes = require("./Routes/FirmRoutes") ;// ADDED

dotEnv.config();
const app = express();
const PORT =  4000;

app.use(express.json()); // REQUIRED
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB Connected Successfully"))
.catch(err => console.log("MongoDB Connection Error:", err));

app.use('/Vendor', VendorRoutes);
app.use('/Firm', FirmRoutes);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
