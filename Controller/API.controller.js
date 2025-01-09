import { User } from "../Model/API.model.js";
import bcrypt from "bcryptjs";

//Register
export async function register(req, res) {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
}

//lOGIN
export async function login(req, res) {
  const { username, password } = req.body;
  try {
    const findUser = await User.findOne({ username });
    if (!findUser) return res.status(401).json({ message: "User not found." });
    const isMatch = await bcrypt.compare(password, findUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    res.status(200).json({ message: "Login successful." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//Reset Password
export async function resetPass(req, res) {
  const { email, currentPassword, newPassword } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Verify the current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect current password" });

    // Hashing the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Updating the password in the database
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
