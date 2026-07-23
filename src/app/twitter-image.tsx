// X/Twitter share card — reuses the same generator as the OpenGraph image so the
// two never drift. Next injects <meta name="twitter:image"> from this route.
export { default, alt, size, contentType } from './opengraph-image'
