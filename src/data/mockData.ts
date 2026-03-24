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
  rating: number;      // NEW
  reviews: number;     // NEW
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
  { 
    id: "1", 
    name: "Minimalist Desk Lamp", 
    price: 1299, 
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=400&fit=crop", 
    category: "Lighting", 
    description: "A sleek, modern desk lamp with adjustable brightness and warm LED lighting. Perfect for your workspace.", 
    stock: 24, 
    status: "approved", 
    vendor: "LuxHome", 
    rating: 4.8, 
    reviews: 124 
  },
  { 
    id: "2", 
    name: "Ceramic Planter Set", 
    price: 899, 
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop", 
    category: "Home & Garden", 
    description: "Set of 3 handcrafted ceramic planters in neutral tones. Ideal for succulents and small plants.", 
    stock: 58, 
    status: "approved", 
    vendor: "GreenCraft", 
    rating: 4.5, 
    reviews: 89 
  },
  { 
    id: "3", 
    name: "Linen Throw Blanket", 
    price: 2499, 
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop", 
    category: "Textiles", 
    description: "Soft, breathable linen throw in a calming oatmeal color. Machine washable.", 
    stock: 15, 
    status: "approved", 
    vendor: "CozyThreads", 
    rating: 4.9, 
    reviews: 210 
  },
  { 
    id: "4", 
    name: "Wooden Serving Board", 
    price: 1499, 
    image: "https://images.unsplash.com/photo-1574923203787-ee36eef07c71?q=80&w=1904&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    category: "Kitchen", 
    description: "Handcrafted acacia wood serving board. Perfect for cheese, charcuterie, or bread.", 
    stock: 42, 
    status: "approved", 
    vendor: "WoodWorks", 
    rating: 4.2, 
    reviews: 45 
  }
];

export const CATEGORIES = ["All", "Lighting", "Home & Garden", "Textiles", "Kitchen"];