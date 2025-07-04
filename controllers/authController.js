const bcrypt = require("bcrypt");
const Seller = require("../models/sellerModel");
const responseHandler = require("../utils/responseHandler");
const jwt = require("jsonwebtoken");



const JWT_SECRET = "woo-com" || process.env.JWT_SECRET;

exports.register = async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;

  try {
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return responseHandler(res, 400, false, "Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newSeller = new Seller({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
    });
    await newSeller.save();

    return responseHandler(res, 201, true, "Seller registered successfully", {
      id: newSeller._id,
      name: newSeller.name,
      email: newSeller.email,
    });
  } catch (err) {
    return responseHandler(res, 500, false, "Server error", err.message);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return responseHandler(res, 400, false, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return responseHandler(res, 400, false, "Invalid email or password");
    }

    const token = await jwt.sign({ id: seller._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    return responseHandler(res, 200, true, "Login successful", {
      token,
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email,
      },
    });
  } catch (err) {
    return responseHandler(res, 500, false, "Server error", err.message);
  }
};


exports.getByToken = async (req, res) => {
  const data = req.user;
  
  try {
    const seller = await Seller.findById(data._id);
    if (!seller) return responseHandler(res, 404, false, "Seller not found");
    return responseHandler(res, 200, true, "Seller retrieved", seller);
} catch (err) {
    return responseHandler(res, 500, false, "Error fetching seller", err.message);
}
};
