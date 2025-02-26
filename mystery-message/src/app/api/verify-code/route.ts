import connectDb from "@/lib/connectDb";
import userModel from "@/models/user.model";

export async function POST (req:Request) {
    //Connect the databse 
    await connectDb();
    try {
        const {username,code} = await req.json();
        //user may be give username by URI or maybe body so that,s why I am using 
        const decodeUsername = decodeURIComponent(username);
        
        const user = await userModel.findOne({username: decodeUsername});

        if(!user){
            return Response.json({
                success: false,
                message: "User not found",
            },{status: 404});
        }

        const isVerifyCode =  user.verifyCode === code; 
        const isVerifyCdeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isVerifyCode && isVerifyCdeNotExpired){
            //Update the user's verification status
             user.isVerified = true;
             await user.save();
            return Response.json({
                success: true,
                message: "Account verify successfully",
            },{status: 200})
        }else if(!isVerifyCdeNotExpired){
            //Code has expired
            return Response.json({
                success: false,
                message: "Verification code has expired. Please sign up again to get a new code",
            },{status: 400})
        }else{
            //Code is incorrect
              return Response.json({
                success: false,
                message: "Incorrect verification code",
            },{status: 400})
        }

    } catch (error) {
        console.error('Error verifying user:', error);
        return Response.json(
          { success: false, message: 'Error verifying user' },
          { status: 500 }
        );
    }
}