import User from "../models/User.js";

// GET /api/user
export const getMe = async (req, res, next) => {
  try {
    // If you later implement auth, use req.userId to find user
    // For now return a demo user
    const demo = {
      first_name: "Anurag",
      last_name: "Bais",
      email: "anuragbais121@gmail.com"
    };

    // If you store real users, you can return logged-in user
    res.json(demo);
  } catch (err) {
    next(err);
  }
};
