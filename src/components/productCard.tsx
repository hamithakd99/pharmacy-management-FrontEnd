

interface Product {
  id: number
  name: string
  price: number
  description: string
}

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="product-card">
      <h2>{product.name}</h2>
      <p>${product.price.toFixed(2)}</p>
      <p>{product.description}</p>
    </div>
  )
}

export default ProductCard