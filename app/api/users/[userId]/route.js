import { connectToDB } from "@/connection";
import Chat from "@/models/Chat";
import Message from "@/models/Message";
import User from "@/models/User";

export const GET = async (req, { params }) => {
  try {
    // Connect to the database
    await connectToDB();

    // Extract userId from request parameters
    const { userId } = params;

    // Find all chats where the user is a member, sort by lastMessageAt descending
    const allChats = await Chat.find({ members: userId })
      .sort({ lastMessageAt: -1 })
      .populate({
        path: "members",
        model: User,
      })
      .populate({
        path: "messages",
        model: Message,
        populate: {
          path: "sender seenBy",
          model: User,
        },
      })
      .exec();

    // Return response with chats data
    return new Response(JSON.stringify(allChats), { status: 200 });
  } catch (err) {
    // Log error and return appropriate response
    console.error(err);
    return new Response("Failed to retrieve chats", {
      status: 500,
    });
  }
};
