const express = require("express");
const VendorController = require("../controllers/VendorController");

const router = express.Router();

router.post('/register', VendorController.VendorRegister);
router.post('/login',VendorController.VendorLogin);

router.get('/AllVendors',VendorController.getAllVendors);
router.get('/single-vendor/:apple', VendorController.getVendorById)
module.exports = router ;
