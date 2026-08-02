export interface Category {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    name: string;
    description: string | null;
    price: string;
    stock: number;
    category: Category;
}