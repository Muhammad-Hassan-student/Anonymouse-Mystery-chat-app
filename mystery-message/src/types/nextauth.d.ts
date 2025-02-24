import 'next-auth'

//if you want change type of interface so used first declare module
declare module 'next-auth'{
    interface User {
        _id?:string,
        isVerified?: boolean,
        username?: string,
        isAcceptingMessage: boolean, 
    }
    interface Session {
        user: {
            _id?:string,
            isVerified?: boolean,
            isAcceptingMessage?: boolean,
            username?: string, 
        } & DefaultSession['user'];
    } 

}

//hum ye is trhn bh kr skty hain
declare module 'next-auth/jwt'{
    interface jwt {
        _id?: string,
        isVerified?: boolean,
        isAcceptingMessage?: boolean,
        username?: string,
    }
}
