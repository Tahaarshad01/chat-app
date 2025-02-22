import { connectToDB } from "@/connection";
import Chat from "@/models/Chat";
import Message from "@/models/Message";
import { pusherServer } from "@/lib/pusher";
import User from "@/models/User";

export const POST = async (req) => {
  try {
    await connectToDB();

    const body = await req.json();
    const { chatId, currentUserId, text, photo } = body;

    const currentUser = await User.findById(currentUserId);

    const newMessage = await Message.create({
      chat: chatId,
      sender: currentUser,
      text,
      photo,
      seenBy: [currentUserId],
    });
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { messages: newMessage._id },
        $set: { lastMessageAt: newMessage.createdAt },
      },
      { new: true }
    )
      .populate({
        path: "messages",
        model: Message,
        populate: { path: "sender seenBy", model: "User" },
      })
      .populate({
        path: "members",
        model: "User",
      })
      .exec();

    await pusherServer.trigger(chatId, "new-message", newMessage);

    /* Triggers a Pusher event for each member of the chat about the chat update with the latest message */
    const lastMessage = updatedChat.messages[updatedChat.messages.length - 1];
    updatedChat.members.forEach(async (member) => {
      try {
        await pusherServer.trigger(member._id.toString(), "update-chat", {
          id: chatId,
          messages: [lastMessage],
        });
      } catch (err) {
        console.error(`Failed to trigger update-chat event`);
      }
    });

    return new Response(JSON.stringify(newMessage, { status: 200 }));
  } catch (error) {
    console.log(error);
    return new Response("failed to create the new message", { status: 500 });
  }
};
