import { siteData as defaultSiteData } from '../../../lib/site-data'
import ProductDetailsClient from './ProductDetailsClient'

// Generate static params for all products
export function generateStaticParams() {
  return defaultSiteData.products.map((product) => ({
    id: product.id.toString(),
  }))
}

export default function ProductDetails({ params }: { params: { id: string } }) {
  return <ProductDetailsClient id={params.id} />
}
