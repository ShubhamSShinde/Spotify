const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

"const getCookieOptions = (req) => {
  const isProduction =
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL === "1" ||
    req?.headers["x-forwarded-proto"] === "https";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  };
};

//register controller
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await userModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
    );

    res.cookie("token", token, getCookieOptions(req));

    res.status(201).json({
      message: "User registered successfully",
      newUser: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

//login controller
const loginUser = async (req, res) => {
  const { username, email, password } = req.body;
  const user = await userModel.findOne({ $or: [{ username }, { email }] });

  if (!user) {
    return res.status(404).json("invalid username or email");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json("invalid password");
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
  );

  res.cookie("token", token, getCookieOptions(req));

  res.status(200).json({
    message: "login successfully",
    user: {
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
};

const logoutUser = (req, res) => {
  res.clearCookie("token", getCookieOptions(req));
  res.status(200).json({
    message: "Logout successful",
  });
}

module.exports = { registerUser, loginUser , logoutUser};
