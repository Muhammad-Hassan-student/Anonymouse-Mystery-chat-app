import connectDb from "@/lib/connectDb";

import userModel, { Message } from "@/models/user.model";

export async function POST(request: Request) {
  connectDb();

  const { username, content } = await request.json();

  try {
    const user = await userModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 403 }
      );
    }

    //Check user is accepting message
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "user not accepting messages",
        },
        { status: 400 }
      );
    }

    const newMessage = { content, createdAt: new Date() };

    //push new message in message array
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      {
        message: "Message sent successfully",
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding message:", error);
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
