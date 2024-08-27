import prisma from "@/utils/db";
import { CreateCommentDto } from "@/utils/dtos";
import { createcommentSchema } from "@/utils/validationSchema";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";




/** 
 * @method POST
 * @route  `/api/comments
 * @desc   create a new comment by user
 * @access private 
 */
export async function POST(request: NextRequest) {
    try {
        const userFromToken = verifyToken(request);
        if (userFromToken === null) {
            return NextResponse.json({ message: "Unauthorized access, please login" }, { status: 403 });
        }

        const body = await request.json() as CreateCommentDto
        const validation = createcommentSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json({ message: validation.error.errors[0].message }, { status: 400 });
        }


        const article = await prisma.article.findUnique({ where: { id: body.articleId } })
        if (!article) {
            return NextResponse.json({ message: "Article not found." }, { status: 404 });
        }



        const newComment = await prisma.comment.create({
            data: {
                text: body.text,
                user: { connect: { id: userFromToken.id } },
                article: { connect: { id: article.id } }
            }
        })
        return NextResponse.json(newComment, { status: 201 })
    }
    catch (err) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}

/** 
 * @method GET
 * @route  `/api/comments
 * @desc   get all comments 
 * @access private (only admin )
 */
export async function GET(request: NextRequest) {
    try {
        const user = verifyToken(request)
        if (user === null || !user.isAdmin) {
            return NextResponse.json({ message: "Unauthorized access, you must be admin" }, { status: 403 })
        }

        const comments = await prisma.comment.findMany()
        return NextResponse.json(comments, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}