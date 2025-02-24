import connectDb from "@/lib/connectDb";
import userModel from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


export  const authOptions: NextAuthOptions = {
        providers: [
            CredentialsProvider({
                id: "credentials",
                name: "Credentials",
                credentials: {
                    email: { label: "Email", type: "text" },
                    password: { label: "Password", type: "password" }
                  },
                  //Authorize
                  async authorize(credentials: any): Promise<any> {
                    await connectDb();
                    try {
                        const user = await userModel.findOne({
                            $or: [
                                {emai: credentials.email},
                                {username: credentials.username},
                            ]
                        });
                        //user check
                        if(!user){
                            throw new Error("No user found with this email");
                        }
                        if(!user.isVerified){
                            throw new Error("Please verify your email before login");

                        }
                        //isMatchedPassword
                        const isMatchedPassword = await bcrypt.compare(credentials.password,user.password);
                        if(!isMatchedPassword){
                            return user;
                        }else{
                            throw new Error("Invalid password");

                        }
                    } catch (err: any) {
                        throw new Error(err);
                    }
                  },
            },)
        ],
        //CallBacks
        callbacks: {
            async jwt({ token, user,}) {
                if(user){
                    token._id = user._id;
                    token.isVerified = user.isVerified;
                    token.username = user.username;
                    token.isAcceptingMessage = user.isAcceptingMessage;
                }
              return token
            },
            async session({ session,token }) {
                if (token) {
                    session.user._id = token._id;
                    session.user.isVerified = token.isVerified;
                    session.user.isAcceptingMessages = token.isAcceptingMessages;
                    session.user.username = token.username;
                  }
                return session 
              },
        },
          session: {
            strategy: 'jwt'
        },
        //The session object and all properties on it are optional.
        secret: process.env.JWT_SECRET,
        pages: {
            signIn: '/sign-in',
        }

}