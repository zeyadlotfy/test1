import { getArticles } from "@/apiCall/articleApiCall";
import ArticleItem from "@/components/articles/articleItme";
import Pagination from "@/components/articles/Pagination";
import SearchArticleInput from "@/components/articles/SearchArticle";
import prisma from "@/utils/db";
import { Article } from '@prisma/client';

interface ArticlePageProps {
    searchParams: { pageNumber: string }
}
const ArticlesPage = async ({ searchParams }: ArticlePageProps) => {
    const { pageNumber } = searchParams
    let articles: Article[] = await getArticles(pageNumber);
    const ARTICLE_PER_PAGE = 6
    const count: number = await prisma.article.count();

    const pages = Math.ceil(count / ARTICLE_PER_PAGE);



    return (
        <section className="container m-auto px5 ">
            <SearchArticleInput />
            <h2 className="text-3xl font-bold text-gray-900 mb-5">Latest Articles</h2>
            <div className="flex items-center justify-center flex-wrap gap-7">
                {articles.map(item => (
                    <ArticleItem article={item} key={item.id} />
                ))}
            </div>
            <Pagination pageNumber={parseInt(pageNumber)} route="/articles" pages={pages} />
        </section>
    )
};

export default ArticlesPage;
