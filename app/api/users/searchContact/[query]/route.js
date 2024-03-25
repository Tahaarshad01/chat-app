import { connectToDB } from "@/connection";
import User from "@/models/User";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const { query } = params;

    const searchedContacts = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } }, // "i" is used for the if search capital or small it show result insensitive contant
      ],
    });

    return new Response(JSON.stringify(searchedContacts), { status: 200 });
  } catch (err) {
    return new Response("Failed to search contact", { status: 500 });
  }
};
