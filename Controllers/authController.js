import user from '../Models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


//Register a new user
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    //create a new user
    const newUser = new user({
        name,
        email,
        password: hashedPassword,
        role
    });
    //save the user to the database
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};


//Login a user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //find the user by email
    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    //compare the password    
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    //generate a JWT token
    const token = jwt.sign({ userId: existingUser._id, role: existingUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: "User Logged In Successfully", token, role: existingUser.role });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in user', error });
  }
};
