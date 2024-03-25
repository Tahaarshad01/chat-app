import { connectToDB } from "@/connection";
import User from "@/models/User";
import { hash } from "bcryptjs";

export const POST = async (req, res) => {
  try {
    await connectToDB();

    const body = await req.json();
    const { username, email, password } = body;
    const existUser = await User.findOne({ email });
    if (existUser) {
      return new Response("User Already Exist");
    }
    const hashedPassword = await hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return new Response(JSON.stringify(newUser), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to create a new user", { status: 500 });
  }
};
