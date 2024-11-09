import { Area } from "../models/area.model.js";
import { PostOffice } from "../models/postOffice.model.js";
import { User } from "../models/user.model.js";

export const signup = async (req, res) => {
  try {
    const { name, id, email, password, area, postOffice, phoneno } = req.body;
    if (
      !name ||
      !id ||
      !email ||
      !password ||
      !area ||
      !postOffice ||
      !phoneno
    ) {
      return res
        .status(401)
        .json({ message: "Please provide all the field", success: false });
    }
    const existingUser = await User.findOne({ $or: [{ id }, { email }] });
    if (existingUser) {
      return res.status(401).json({ message: "user already exist try login" });
    }
    let postOfficeDoc = await PostOffice.findOne({
      name: postOffice,
    });
    if (postOfficeDoc) {
      return res.status(401).json({ message: "Post Office already exist!!" });
    }
    const newUser = await User.create({
      name,
      id,
      email,
      password,
      area,
      postOffice,
      phoneno,
    });
    console.log(newUser);
    let areaDoc = await Area.findOne({ name: area });
    if (!areaDoc) {
      areaDoc = await Area.create({
        name: area,
        postOffices: [],
      });
    }
    postOfficeDoc = await PostOffice.create({
      name: postOffice,
      areaId: areaDoc._id,
      userId: newUser._id,
      cleanlinessScore: 0,
      photoLinks: [],
    });
    await Area.findByIdAndUpdate(
      areaDoc._id,
      {
        $push: { postOffices: postOfficeDoc._id },
      },
      { new: true }
    );
    if (newUser)
      return res.status(200).json({ message: "user created successfully!!" });
    return res.status(401).json({ message: "user can't be created!!" });
  } catch (error) {
    console.log(error);
  }
};

export const signin = async (req, res) => {
  try {
    const { id, password } = req.body;
    if (!id || !password) {
      return res
        .status(401)
        .json({ message: "Please provide all the field", success: false });
    }
    const existingUser = await User.findOne({ id: id });
    if (existingUser) {
      const userid = existingUser._id.toString();
      const name = existingUser.name;
      if (password == existingUser.password) {
        return res.status(200).json({
          message: "sucessfully logged in!!",
          userid: userid,
          name: name,
        });
      } else {
        return res.status(401).json({ message: "Incorrect password" });
      }
    } else return res.status(401).json({ message: "user not found" });
  } catch (error) {
    console.log(error);
  }
};

export const health = async (req, res) => {
  return res.status(200).json({ message: "health is fine" });
};
