import { createContext, useContext, useEffect, useMemo, useState } from "react";
// import { CATEGORIES } from "@/data/mockData";
import {
  approveProduct,
  createProduct,
  getAllProducts,
  ProductDTO,
  rejectProduct,
  updateProduct,
} from "@/lib/productApi";

type ApprovalStatus = "pending" | "approved" | "rejected";

export interface ManagedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  stock: number;
  status: ApprovalStatus;
  vendor: string;
  rating: number;
  reviews: number;
  categoryStatus?: ApprovalStatus;
}

export interface CategoryRequest {
  id: string;
  name: string;
  status: ApprovalStatus;
  vendor: string;
}

interface AddProductInput {
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  stock: number;
  vendor: string;
}

interface ProductWorkflowContextType {
  products: ManagedProduct[];
  categories: string[];
  categoryRequests: CategoryRequest[];
  addProduct: (input: AddProductInput) => Promise<void>;
  requestCategory: (name: string, vendor: string) => { created: boolean; message: string };
  updateProductStatus: (productId: string, status: Exclude<ApprovalStatus, "pending">) => Promise<void>;
  updateCategoryStatus: (requestId: string, status: Exclude<ApprovalStatus, "pending">) => void;
  updateProductDescription: (productId: string, description: string) => Promise<void>;
  updateProductStock: (productId: string, stock: number) => Promise<void>;
}

const ProductWorkflowContext = createContext<ProductWorkflowContextType | undefined>(undefined);

const normalizeText = (value: string) => value.trim().toLowerCase();

const mapApiProduct = (product: ProductDTO): ManagedProduct => {
  return {
    id: String(product.id ?? ""),
    name: product.name,
    price: product.price,
    image: product.image,
    category: product.category,
    description: product.description,
    stock: product.stock,
    status: product.status,
    vendor: product.vendor,
    rating: product.rating,
    reviews: product.reviews,
    categoryStatus: "approved", // simple default
  };
};

const mapManagedProductToPayload = (product: ManagedProduct): Omit<ProductDTO, "id"> => ({
  name: product.name,
  price: product.price,
  image: product.image,
  category: product.category,
  description: product.description,
  stock: product.stock,
  status: product.status,
  vendor: product.vendor,
  rating: product.rating,
  reviews: product.reviews,
});

export const ProductWorkflowProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<ManagedProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryRequests, setCategoryRequests] = useState<CategoryRequest[]>([]);

  useEffect(() => {
  const uniqueCategories = Array.from(
    new Set(
      products
        .map((p) => p.category?.trim())
        .filter(Boolean)
    )
  );

  setCategories(uniqueCategories);
}, [products]);
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await getAllProducts();
        setProducts(response.data.map(mapApiProduct));
      } catch (error) {
        console.error("Failed to load products", error);
      }
    };

    void loadProducts();
  }, []);

  useEffect(() => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => ({
        ...product,
        categoryStatus: categories.some((category) => normalizeText(category) === normalizeText(product.category))
          ? "approved"
          : product.status === "pending"
          ? "pending"
          : "approved",
      }))
    );
  }, [categories]);

  const requestCategory = (name: string, vendor: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return { created: false, message: "Category name is required." };
    }

    const normalizedName = normalizeText(trimmedName);
    const existsInCategories = categories.some((category) => normalizeText(category) === normalizedName);
    const existingRequest = categoryRequests.find((request) => normalizeText(request.name) === normalizedName);

    if (existsInCategories) {
      return { created: false, message: "Category already exists." };
    }

    if (existingRequest) {
      return { created: false, message: `Category request is already ${existingRequest.status}.` };
    }

    const newRequest: CategoryRequest = {
      id: `cat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: trimmedName,
      status: "pending",
      vendor,
    };

    setCategoryRequests((prevRequests) => [newRequest, ...prevRequests]);
    return { created: true, message: "Category sent for admin approval." };
  };

  const addProduct = async (input: AddProductInput) => {
    const normalizedCategory = normalizeText(input.category);
    const categoryExists = categories.some((category) => normalizeText(category) === normalizedCategory);

    if (!categoryExists) {
      requestCategory(input.category, input.vendor);
    }

    const response = await createProduct({
      name: input.name,
      price: input.price,
      image: input.image,
      category: input.category.trim(),
      description: input.description,
      stock: input.stock,
      status: "pending",
      vendor: input.vendor,
      rating: 0,
      reviews: 0,
    });

    setProducts((prevProducts) => [mapApiProduct(response.data), ...prevProducts]);
  };

  const updateProductStatus = async (productId: string, status: Exclude<ApprovalStatus, "pending">) => {
    const response =
      status === "approved"
        ? await approveProduct(Number(productId))
        : await rejectProduct(Number(productId));

    const updatedProduct = mapApiProduct(response.data);
    setProducts((prevProducts) => prevProducts.map((product) => (product.id === productId ? updatedProduct : product)));
  };

  const updateCategoryStatus = (requestId: string, status: Exclude<ApprovalStatus, "pending">) => {
    let requestName = "";

    setCategoryRequests((prevRequests) =>
      prevRequests.map((request) => {
        if (request.id !== requestId) return request;
        requestName = request.name;
        return { ...request, status };
      })
    );

    if (!requestName) return;

    if (status === "approved") {
      setCategories((prevCategories) => {
        const exists = prevCategories.some((category) => normalizeText(category) === normalizeText(requestName));
        return exists ? prevCategories : [...prevCategories, requestName];
      });
    }

    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (normalizeText(product.category) !== normalizeText(requestName)) {
          return product;
        }

        if (status === "rejected") {
          return { ...product, categoryStatus: "rejected", status: "rejected" };
        }

        return { ...product, categoryStatus: "approved" };
      })
    );
  };

  const updateProductDescription = async (productId: string, description: string) => {
    const existingProduct = products.find((product) => product.id === productId);
    if (!existingProduct) {
      return;
    }

    const response = await updateProduct(Number(productId), {
      ...mapManagedProductToPayload(existingProduct),
      description,
    });

    const updatedProduct = mapApiProduct(response.data);
    setProducts((prevProducts) => prevProducts.map((product) => (product.id === productId ? updatedProduct : product)));
  };

  const updateProductStock = async (productId: string, stock: number) => {
  const existingProduct = products.find((product) => product.id === productId);
  if (!existingProduct) return;

  try {
    const response = await updateProduct(Number(productId), {
      ...mapManagedProductToPayload(existingProduct),
      stock, 
    });

    const updatedProduct = mapApiProduct(response.data);

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? updatedProduct : product
      )
    );
  } catch (error) {
    console.error("Failed to update stock", error);
    throw error;
  }
};

  const value = useMemo(
    () => ({
      products,
      categories,
      categoryRequests,
      addProduct,
      requestCategory,
      updateProductStatus,
      updateCategoryStatus,
      updateProductDescription,
      updateProductStock,
    }),
    [products, categories, categoryRequests]
  );

  return <ProductWorkflowContext.Provider value={value}>{children}</ProductWorkflowContext.Provider>;
};

export const useProductWorkflow = () => {
  const context = useContext(ProductWorkflowContext);
  if (!context) {
    throw new Error("useProductWorkflow must be used within ProductWorkflowProvider");
  }
  return context;
};
