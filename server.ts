import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import firebaseConfig from "./firebase-applet-config.json" with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Client SDK
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function startServer() {
  const server = express();
  const PORT = Number(process.env.PORT || 3000);

  server.use(express.json());

  // --- PUBLIC API ROUTES ---

  // Get all products
  server.get("/api/products", async (req, res) => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(products);
    } catch (error: any) {
      console.error("API Error (products):", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get a single product
  server.get("/api/products/:id", async (req, res) => {
    try {
      const docSnap = await getDoc(doc(db, "products", req.params.id));
      if (!docSnap.exists()) return res.status(404).json({ error: "Product not found" });
      res.json({ id: docSnap.id, ...docSnap.data() });
    } catch (error: any) {
      console.error("API Error (product):", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get all categories
  server.get("/api/categories", async (req, res) => {
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const categories = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(categories);
    } catch (error: any) {
      console.error("API Error (categories):", error);
      res.status(500).json({ error: error.message });
    }
  });

  // --- ADMIN API ROUTES ---

  // Add a new category
  server.post("/api/categories", async (req, res) => {
    try {
      const categoryData = {
        ...req.body,
        createdAt: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, "categories"), categoryData);
      res.status(201).json({ id: docRef.id, ...categoryData });
    } catch (error: any) {
      console.error("Admin API Error (add category):", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update a category
  server.put("/api/categories/:id", async (req, res) => {
    try {
      const categoryRef = doc(db, "categories", req.params.id);
      await updateDoc(categoryRef, {
        ...req.body,
        updatedAt: serverTimestamp(),
      });
      res.json({ message: "Category updated successfully" });
    } catch (error: any) {
      console.error("Admin API Error (update category):", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete a category
  server.delete("/api/categories/:id", async (req, res) => {
    try {
      await deleteDoc(doc(db, "categories", req.params.id));
      res.json({ message: "Category deleted successfully" });
    } catch (error: any) {
      console.error("Admin API Error (delete category):", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Add a new product
  server.post("/api/products", async (req, res) => {
    try {
      const productData = {
        ...req.body,
        createdAt: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, "products"), productData);
      res.status(201).json({ id: docRef.id, ...productData });
    } catch (error: any) {
      console.error("Admin API Error (add product):", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update a product
  server.put("/api/products/:id", async (req, res) => {
    try {
      const productRef = doc(db, "products", req.params.id);
      await updateDoc(productRef, {
        ...req.body,
        updatedAt: serverTimestamp(),
      });
      res.json({ message: "Product updated successfully" });
    } catch (error: any) {
      console.error("Admin API Error (update product):", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete a product
  server.delete("/api/products/:id", async (req, res) => {
    try {
      await deleteDoc(doc(db, "products", req.params.id));
      res.json({ message: "Product deleted successfully" });
    } catch (error: any) {
      console.error("Admin API Error (delete product):", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get all orders
  server.get("/api/orders", async (req, res) => {
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(orders);
    } catch (error: any) {
      console.error("Admin API Error (orders):", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update order status
  server.put("/api/orders/:id", async (req, res) => {
    try {
      const orderRef = doc(db, "orders", req.params.id);
      await updateDoc(orderRef, {
        status: req.body.status,
        updatedAt: serverTimestamp(),
      });
      res.json({ message: "Order status updated successfully" });
    } catch (error: any) {
      console.error("Admin API Error (update order):", error);
      res.status(500).json({ error: error.message });
    }
  });

  // --- VITE MIDDLEWARE ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    server.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    server.use(express.static(distPath));
    server.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api/products`);
  });
}

startServer();
