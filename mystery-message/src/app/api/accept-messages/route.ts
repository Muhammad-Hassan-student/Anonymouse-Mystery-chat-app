import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import userModel from "@/models/user.model";
import { User } from 'next-auth'
import connectDb from "@/lib/connectDb";

//Update isAcceptingMessage
export async function POST (request:Request) {
    connectDb();
   
    //session get by getSereverSession
    const session = await getServerSession(authOptions);

    //seesion ha to uska user stored in user varible
    const user: User = session?.user;
    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Not authenticated",
        },{status: 401});
    }

    const userId = user._id;
    const {acceptMessages} = await request.json();

    try {
        //updated isAcceptingMessage by userId
        const updatedUser = await userModel.findByIdAndUpdate(userId,{isAcceptingMessage: acceptMessages},{new: true});

        if(!updatedUser){
            //User not found 
            return Response.json({
                success: false,
                message: "Unable to find user to update message acceptance status",
            },{status: 404});
        }

        //Successfully updated isAcceptingMessage 
        return Response.json({
            success: true,
            message: "Message acceptance status updated successfully",
            updatedUser,
        },{status: 200});
        

    } catch (error) {
        console.error('Error updating message acceptance status:', error);
    return Response.json(
      { success: false, message: 'Error updating message acceptance status' },
      { status: 500 }
    );
    }

}

//GET USER MESSAGE ACCEPTANCE STATUS
export async function GET(request: Request){
    //connectDb
    connectDb();

    const session = await getServerSession(authOptions);
    const user = await session?.user;
    if(!session || user){
        return Response.json({
            success: false,
            message: "Not authenticated",
        },{status: 401});
    }

    try {
        const foundUser = await userModel.findById(user._id);

        if(!foundUser){
            //user not found
            return Response.json({
                success: false,
                message: "User not found",
            },{status: 400});
        }

        //Return the user's message acceptance status
        return Response.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessage,
        },{status: 200});
    } catch (error) {
        console.log("Error in retreiving message acceptance status: ", error);
        return Response.json({
            success: false,
            message: "Error in retreiving message acceptance status"
        },{status: 500});
    }

}