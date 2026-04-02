export interface Product {
  id: string;
  name: string;
  price: number;
  category: "Anime" | "Coding" | "Memes" | "Quotes" | "Aesthetic";
  image: string;
  description: string;
  features: string[];
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Cyberpunk Panda",
    price: 199,
    category: "Aesthetic",
    image: "https://picsum.photos/seed/panda/600/600",
    description: "A futuristic panda with neon accents, perfect for your laptop lid.",
    features: ["Waterproof", "Premium Vinyl", "No Residue"],
    rating: 4.8,
    reviews: 124,
  },
  {
    id: "2",
    name: "React Master",
    price: 149,
    category: "Coding",
    image: "https://picsum.photos/seed/react/600/600",
    description: "Show your love for React with this sleek atomic design.",
    features: ["Waterproof", "Premium Vinyl", "Long Lasting"],
    rating: 4.9,
    reviews: 89,
  },
  {
    id: "3",
    name: "Good Vibes Only",
    price: 129,
    category: "Quotes",
    image: "https://picsum.photos/seed/vibes/600/600",
    description: "Keep the energy high with this holographic quote sticker.",
    features: ["Holographic", "Premium Vinyl", "No Residue"],
    rating: 4.7,
    reviews: 210,
  },
  {
    id: "4",
    name: "Zen Astronaut",
    price: 249,
    category: "Aesthetic",
    image: "https://picsum.photos/seed/astronaut/600/600",
    description: "An astronaut meditating in deep space. Very chill.",
    features: ["Waterproof", "Premium Vinyl", "Matte Finish"],
    rating: 5.0,
    reviews: 56,
  },
  {
    id: "5",
    name: "Python Snake",
    price: 149,
    category: "Coding",
    image: "https://picsum.photos/seed/python/600/600",
    description: "Minimalist Python logo for the backend wizards.",
    features: ["Waterproof", "Premium Vinyl", "No Residue"],
    rating: 4.6,
    reviews: 78,
  },
  {
    id: "6",
    name: "Doge Much Wow",
    price: 99,
    category: "Memes",
    image: "https://picsum.photos/seed/doge/600/600",
    description: "Such sticker. Very wow. Much laptop.",
    features: ["Waterproof", "Premium Vinyl", "Glossy"],
    rating: 4.9,
    reviews: 342,
  },
];
