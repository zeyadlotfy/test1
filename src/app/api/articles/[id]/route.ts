import { NextRequest, NextResponse } from "next/server";
import { Article } from "@prisma/client";
import { CreateArticleDto, UpdateArticleDto } from "@/utils/dtos";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";

interface Props {
    params: { id: string }
}

/**
 *  @method GET 
 *  @route /api/articles/:id 
 *  @desc Get single Article by id  
 *  @access public
 */
export async function GET(request: NextRequest, { params }: Props) {
    try {
        const article = await prisma.article.findUnique({
            where: { id: parseInt(params.id) },
            include: {
                comments: {
                    include: {
                        user: {
                            select: { username: true }
                        }
                    },
                    orderBy: {
                        createdAt: "desc"
                    }
                }
            }
        })
        if (!article) {
            return NextResponse.json({ message: "Article not found." }, { status: 404 });
        }
        return NextResponse.json(article, { status: 200 });
    }
    catch (error) {
        return Response.json({ message: "Internal server error" }, {
            status: 500
        })
    }
}

/**
 *  @method PUT 
 *  @route /api/articles/:id 
 *  @desc Update single Article by id
 *  @access puplic 
 *  **********  */
export async function PUT(request: NextRequest, { params }: Props) {
    try {
        const user = verifyToken(request);
        if (user === null || user.isAdmin === false) {
            return NextResponse.json({ message: "Unauthorized access, you must be admin" }, { status: 403 })  // Unauthorized access. Only admin users can create articles.  // 403: Forbidden
        }



        const article = await prisma.article.findUnique({
            where: { id: parseInt(params.id) }
        })
        if (!article) {
            return NextResponse.json({ message: "Article not found." }, { status: 404 });
        }
        const body = (await request.json()) as UpdateArticleDto
        const updatedArticle = await prisma.article.update(
            {
                where: { id: parseInt(params.id) },
                data: {
                    title: body.title || article.title,
                    description: body.description || article.description
                }
            }
        )
        return NextResponse.json(updatedArticle, { status: 200 })
    }
    catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}

/**
 *  @method DELETE 
 *  @route /api/articles/:id 
 *  @desc Delete single Article by id
 * @access  puplic 
 * ****                    */
export async function DELETE(request: NextRequest, { params }: Props) {
    try {
        const user = verifyToken(request);
        if (user === null || user.isAdmin === false) {
            return NextResponse.json({ message: "Unauthorized access, you must be admin" }, { status: 403 })  // Unauthorized access. Only admin users can create articles.  // 403: Forbidden
        }


        const article = await prisma.article.findUnique({
            where: { id: parseInt(params.id) },
            include: {
                comments: true
            }
        })
        if (!article) {
            return NextResponse.json({ message: "Article not found." }, { status: 404 });
        }
        await prisma.article.delete({ where: { id: parseInt(params.id) } })

        const commentsIds: number[] = article?.comments.map(comment => comment.id)
        await prisma.comment.deleteMany({ where: { id: { in: commentsIds } } })


        return NextResponse.json({ message: "Article deleted." }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}



