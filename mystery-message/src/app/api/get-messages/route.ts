import connectDb from "@/lib/connectDb";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import userModel from "@/models/user.model";

export async function GET(request: Request) {
  connectDb();

  //get session.user by getServerSession
  const session = await getServerSession(authOptions);
  const user: User = await session?.user;

  //agr session aur user nh ha to
  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 404 }
    );
  }

  //  const userId = user._id  ❌❌ 📧remind that I make userId string toString in nextAuth

  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    //make aggregation pipelines
    const User = await userModel
      .aggregate([
        { $match: { _id: userId } },
        { $unwind: "$messages" },
        { $sort: { "messages.createdAt": -1 } },
        { $group: { _id: "$_id", messages: { $push: "$messages" } } },
      ])
      .exec();

    if (!User || User.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        messages: User[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("An expected error occured in get messages", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
