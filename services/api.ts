const BASE_URL = "https://dummyjson.com/products";

export async function getProducts() {
  try {
    const response = await fetch(BASE_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error("Error in getProducts:", error);
    throw error;
  }
}

export async function getProductById(id: number) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch product with id ${id}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getProductById:", error);
    throw error;
  }
}
