import { z } from "zod";
import connectDb from "@/lib/connectDb";
import { usernameValidation } from "@/Schemas/signUpSchema";
import userModel from "@/models/user.model";


const usernameValidationSchema = z.object({
    username: usernameValidation,
});

export async function GET(request: Request){
    await connectDb();
    try {
        //first I'll get new url of user web 
        const {searchParams} = new URL(request.url);
        // get specific value form url
        const queryParams = {
            username: searchParams.get("username"),
        } ;
        //query params validate by zod username
        const result = usernameValidationSchema.safeParse(queryParams);
        console.log(result);

        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({
                success: false,
                message:usernameErrors.length > 0 ? usernameErrors.join(', ') : 'Invalid query parameters'
            },{status: 400});
        }

        const {username} = result.data;
        console.log("username: " , username);

        const existingVerifiedUser = await userModel.findOne({username, isverified: true});
    
        if(existingVerifiedUser){
            return Response.json({
                success: false,
                message:"Username is already token",
            },{status: 200});
        }
        return   Response.json({
            success: true,
            message: "Username is unique",
        },{status: 201});
    } catch (error) {
        console.log('error in checking username' ,error);
        return Response.json({
            success: false,
            message: "Error checking username",
        },{status:500});
    }
}