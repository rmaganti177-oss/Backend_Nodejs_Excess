const Vendor = require("../Models/Vendor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotEnv = require('dotenv');

dotEnv.config();
const SecretKey = process.env.WHATISYOURNAME;

const VendorRegister = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingVendor = await Vendor.findOne({ email });
        if (existingVendor) {
            return res.status(400).json({ message: "Email Already Registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword
        });

        await newVendor.save();
        return res.status(201).json({ message: "Vendor Registered Successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Internal Error" });
    }
};


const VendorLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const vendor = await Vendor.findOne({ email });
        if (!vendor) {
            return res.status(404).json({ error: "Email Not Found" });
        }

        const isMatch = await bcrypt.compare(password, vendor.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Password incorrect" });
        }

        const token = jwt.sign(
            { _id: vendor._id },  // FIXED KEY
            SecretKey,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Login Successful",
            token,
            vendorId: vendor._id
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal Error" });
    }
}

const getAllVendors = async(req, res) => {
    try {
        const vendors = await Vendor.find().populate('firm');
        res.json({ vendors })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}  

const getVendorById = async(req, res) => {
    const vendorId = req.params.apple;

    try {
        const vendor = await Vendor.findById(vendorId).populate('firm');
        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found" })
        }
        const vendorFirmId = vendor.firm[0]._id;
        res.status(200).json({ vendorId, vendorFirmId, vendor })
        console.log(vendorFirmId);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}


module.exports = { VendorRegister, VendorLogin , getAllVendors , getVendorById};
