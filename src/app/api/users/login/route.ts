import prisma from "@/utils/db";
import { LoginUserDto } from "@/utils/dtos";
import { loginSchema } from "@/utils/validationSchema";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import { setCookie } from "@/utils/generateToken";
import { JWTPayload } from "@/utils/types";

/** 
 * @method POST
 * @route  `/api/users/login
 * @desc   Loign user
 * @access public
 */
export async function POST(request: NextRequest) {
    try {

        const body = await request.json() as LoginUserDto;
        const validation = loginSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json({ message: validation.error.errors[0].message }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email: body.email } })
        if (!user) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 404 });

        }
        const comparedPassword = await bcrypt.compare(body.password, user.password)
        if (!comparedPassword) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        const jwtPayload: JWTPayload = {
            id: user.id,
            isAdmin: user.isAdmin,
            username: user.username
        }
        const cookie = setCookie(jwtPayload)


        return NextResponse.json({ message: "Authenticated" }, {
            status: 200,
            headers: {
                'Set-Cookie': cookie
            }
        })

    } catch (err) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}