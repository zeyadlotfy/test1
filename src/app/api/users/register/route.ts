import prisma from "@/utils/db";
import { RegisterUserDto } from "@/utils/dtos";
import { registerSchema } from "@/utils/validationSchema";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs"
import { JWTPayload } from "@/utils/types";
import { setCookie } from "@/utils/generateToken";
/** 
 * @method POST
 * @route  `/api/users/register
 * @desc   create a new user
 * @access public
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as RegisterUserDto
        const validation = registerSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json({ message: validation.error.errors[0].message }, {
                status: 400
            });
        }
        const user = await prisma.user.findUnique({ where: { email: body.email } })
        if (user) {
            return NextResponse.json({ message: "Email already exists" }, {
                status: 400
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(body.password, salt);
        const newUser = await prisma.user.create({
            data: {
                username: body.username,
                email: body.email,
                password: hashedPassword
            }
        })

        const jwtPayload: JWTPayload = {
            id: newUser.id,
            isAdmin: newUser.isAdmin,
            username: newUser.username
        }
        const cookie = setCookie(jwtPayload)
        return NextResponse.json({ ...newUser, message: "register and authenticated" }, { status: 201 })

    }
    catch (error) {
        return NextResponse.json({ message: "Internal server error" }, {
            status: 500
        });
    }
}