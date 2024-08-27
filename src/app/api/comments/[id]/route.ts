import prisma from "@/utils/db";
import { UpdateCommentDto } from "@/utils/dtos";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";

interface Props {
    params: { id: string }
}

/** 
 * @method PUT
 * @route  `/api/comments/:id
 * @desc   update comment
 * @access private (only owner of the comment) 
 */
export async function PUT(request: NextRequest, { params }: Props) {
    try {
        const comment = await prisma.comment.findUnique({ where: { id: parseInt(params.id) } });
        if (!comment) {
            return NextResponse.json({ message: "Comment not found." }, { status: 404 });
        }
        const userFromToken = verifyToken(request);
        if (userFromToken === null || userFromToken.id !== comment.userId) {
            return NextResponse.json({ message: "you are not allowed" }, { status: 403 })
        }

        const body = await request.json() as UpdateCommentDto
        const updatedComment = await prisma.comment.update({
            where: { id: parseInt(params.id) },
            data: { text: body.text }
        })

        return NextResponse.json(updatedComment, { status: 200 })

    }
    catch (error) {
        return NextResponse.json({ message: "Interal server error" }, { status: 500 })
    }
}
/** 
 * @method DELETE
 * @route  `/api/comments/:id
 * @desc   delete comment
 * @access private (only admin or owner of the comment) 
 */
export async function DELETE(request: NextRequest, { params }: Props) {
    try {
        const comment = await prisma.comment.findUnique({ where: { id: parseInt(params.id) } })
        if (!comment) {
            return NextResponse.json({ message: "Comment not found" }, { status: 404 })
        }
        const userFromToken = verifyToken(request)
        if (userFromToken === null || (!userFromToken.isAdmin && userFromToken.id !== comment.userId)) {
            return NextResponse.json({ message: "you are not allowed" }, { status: 403 })
        }
        await prisma.comment.delete({ where: { id: parseInt(params.id) } })
        return NextResponse.json({ message: "Comment deleted successfully" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Interal server error" }, { status: 500 })
    }
}