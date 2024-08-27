import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import { JWTPayload } from "@/utils/types";
import { verifyToken } from "@/utils/verifyToken";
import { UpdateProfileDto } from "@/utils/dtos";
import bcrypt from 'bcryptjs'
import { updateUserSchema } from "@/utils/validationSchema";
interface Props {
    params: { id: string }
}
/** 
 * @method DELETE
 * @route  `/api/users/profile/:id 
 * @desc   delete a user
 * @access private only user can delete his profile
 */
export async function DELETE(request: NextRequest, { params }: Props) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(params.id) },
            include: { comments: true }
        })
        if (!user) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }



        const userFromToken = verifyToken(request)
        if (userFromToken !== null && userFromToken.id === user.id) {
            await prisma.user.delete({ where: { id: parseInt(params.id) } })

            const commentsIds: number[] = user?.comments.map(comment => comment.id)
            await prisma.comment.deleteMany({ where: { id: { in: commentsIds } } })
            return NextResponse.json({ message: "User deleted successfully." }, { status: 200 });

        }
        return NextResponse.json({ message: "Unauthorized access." }, { status: 403 });


    }
    catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}


/** 
 * @method GET
 * @route  `/api/users/profile/:id 
 * @desc   get profile by id 
 * @access private only user can get his profile 
 */
export async function GET(request: NextRequest, { params }: Props) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(params.id) }, select: {
                id: true,
                email: true,
                username: true,
                createdAt: true,
                isAdmin: true
            }
        })
        if (!user) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }
        const userFromToken = verifyToken(request);
        if (userFromToken === null || userFromToken.id !== user.id) {
            return NextResponse.json({ message: "you are not allowed,access denied." }, { status: 403 });
        }
        return NextResponse.json(user, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

/** 
 * @method PUT
 * @route  `/api/users/profile/:id 
 * @desc   update profile  
 * @access private only user can update his profile 
 */
export async function PUT(request: NextRequest, { params }: Props) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(params.id) }
        })
        if (!user) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }
        const userFromToken = verifyToken(request);
        if (userFromToken === null || userFromToken.id !== user.id) {
            return NextResponse.json({ message: "Unauthorized access." }, { status: 403 });
        }
        const body = (await request.json()) as UpdateProfileDto
        const validation = updateUserSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json({ message: validation.error.errors[0].message }, { status: 400 });
        }

        if (body.password) {
            if (body.password.length < 5) {
                return NextResponse.json({ message: "Password must be at least 5 characters long." }, { status: 400 });
            }
            body.password = await bcrypt.hash(body.password, 10)
        }
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(params.id) },
            data: {
                email: body.email || user.email,
                username: body.username || user.username,
                password: body.password || user.password
            }
        })
        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
} 