import { createarticleSchema } from "@/utils/validationSchema";
import { NextRequest, NextResponse } from "next/server"
import { Article } from "@prisma/client";
import { CreateArticleDto } from "@/utils/dtos";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";



export async function GET(request: NextRequest) {
    try {
        const pageNumber = request.nextUrl.searchParams.get('pageNumber') || "1";
        const ARTICLE_PER_PAGE = 6
        const articles = await prisma.article.findMany({
            skip: ARTICLE_PER_PAGE * (parseInt(pageNumber) - 1),
            take: ARTICLE_PER_PAGE,
        })
        return NextResponse.json(articles, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "internal server error" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = verifyToken(request);
        if (user === null || user.isAdmin === false) {
            return NextResponse.json({ message: "Unauthorized access, you must be admin" }, { status: 403 })  // Unauthorized access. Only admin users can create articles.  // 403: Forbidden
        }




        const body = (await request.json()) as CreateArticleDto
        const validation = createarticleSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ message: validation.error.errors[0].message }, { status: 400 })
        }

        const newArticle: Article = await prisma.article.create({
            data: {
                title: body.title,
                description: body.description
            }
        })


        return NextResponse.json(newArticle, { status: 201 })
    }
    catch (error) {
        return NextResponse.json({ message: "internal server error" }, { status: 500 })
    }
}