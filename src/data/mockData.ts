export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  stock: number;
  status: "pending" | "approved" | "rejected";
  vendor: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "placed" | "shipped" | "delivered";
  date: string;
}

export const MOCK_PRODUCTS: Product[] = [
  { id: "1", name: "Minimalist Desk Lamp", price: 49.99, image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400&h=400&fit=crop", category: "Lighting", description: "A sleek, modern desk lamp with adjustable brightness and warm LED lighting. Perfect for your workspace.", stock: 24, status: "approved", vendor: "LuxHome" },
  { id: "2", name: "Ceramic Planter Set", price: 34.99, image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop", category: "Home & Garden", description: "Set of 3 handcrafted ceramic planters in neutral tones. Ideal for succulents and small plants.", stock: 58, status: "approved", vendor: "GreenCraft" },
  { id: "3", name: "Linen Throw Blanket", price: 79.99, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop", category: "Textiles", description: "Soft, breathable linen throw in a calming oatmeal color. Machine washable.", stock: 15, status: "approved", vendor: "CozyThreads" },
  { id: "4", name: "Wooden Serving Board", price: 29.99, image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&h=400&fit=crop", category: "Kitchen", description: "Handcrafted acacia wood serving board. Perfect for cheese, charcuterie, or bread.", stock: 42, status: "approved", vendor: "WoodWorks" },
  { id: "5", name: "Scented Candle Trio", price: 24.99, image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=400&h=400&fit=crop", category: "Home & Garden", description: "Three soy wax candles in lavender, vanilla, and cedarwood scents.", stock: 67, status: "approved", vendor: "LuxHome" },
  { id: "6", name: "Modern Wall Clock", price: 44.99, image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400&h=400&fit=crop", category: "Decor", description: "Clean, numberless wall clock with a brushed metal frame. Silent quartz movement.", stock: 31, status: "pending", vendor: "GreenCraft" },
  { id: "7", name: "Cotton Cushion Cover", price: 19.99, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop", category: "Textiles", description: "100% organic cotton cushion cover with a subtle geometric pattern.", stock: 89, status: "approved", vendor: "CozyThreads" },
  { id: "8", name: "Glass Vase", price: 39.99, image: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=400&h=400&fit=crop", category: "Decor", description: "Hand-blown glass vase with a smoky finish. A statement piece for any room.", stock: 0, status: "pending", vendor: "WoodWorks" },
];

export const CATEGORIES = ["All", "Lighting", "Home & Garden", "Textiles", "Kitchen", "Decor"];
