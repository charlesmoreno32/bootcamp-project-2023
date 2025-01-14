import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/helpers/db";
import BlogModel from "@/database/blogSchema";
import {IComment} from "@/database/commentSchema";

type IParams = {
    params: {
         slug: string;
    };
};

export async function POST(req: NextRequest, { params }: IParams) {
    await connectDB();
	const { slug } = params; 

    
    try {
        const blog = await BlogModel.findOne({ slug }).orFail();

        const { user, comment, time }: IComment = await req.json();
        
        // validate body
        if (!user || !comment) {
            return NextResponse.json("Invalid Comment.", { status: 400 });
        }

        const newComment = {user,comment,time}

        // push comment object to document
        await BlogModel.updateOne(
            {slug},
            {$push: {comments: newComment}}).orFail();

        await blog.save();
        return NextResponse.json("Comment Added", { status: 200 });
    } catch(err){
        return NextResponse.json(err, { status: 404 });
    }
}