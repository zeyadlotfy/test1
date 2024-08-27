export const ARTICLE_PER_PAGE = 6;

const PRODUCTION_DOMAIN = "http://localhost:3000";
const DEVELOPMENT_DOMAIN = "http://localhost:3000";

export const DOMAIN = process.env.NODE_ENV === 'production'
    ? PRODUCTION_DOMAIN
    : DEVELOPMENT_DOMAIN;