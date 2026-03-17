import { Product, ProductOption } from "@/context/CartContext";

const MEAL_OPTIONS: ProductOption[] = [
  {
    id: "filling",
    name: "Choose your Filling",
    required: true,
    choices: [
      { id: "chicken", name: "Chicken (Pollo)" },
      { id: "beef", name: "Ground Beef (Carne)" },
      { id: "pork", name: "Pulled Pork (Carnitas)" },
      { id: "veggie", name: "Veggie (Guacamole incl.)" },
      { id: "steak", name: "Steak (Asada)", price: 1.50 }
    ]
  },
  {
    id: "rice",
    name: "Rice & Grains",
    choices: [
      { id: "lime-rice", name: "Lime Rice" },
      { id: "quinoa", name: "Quinoa (+€1.00)", price: 1.00 },
      { id: "no-rice", name: "No Rice" }
    ]
  },
  {
    id: "beans",
    name: "Beans",
    choices: [
      { id: "black-beans", name: "Black Beans" },
      { id: "pinto-beans", name: "Pinto Beans" },
      { id: "no-beans", name: "No Beans" }
    ]
  },
  {
    id: "salsa",
    name: "Salsa",
    choices: [
      { id: "pico", name: "Pico de Gallo (Mild)" },
      { id: "verde", name: "Salsa Verde (Medium)" },
      { id: "roja", name: "Salsa Roja (Hot)" },
      { id: "habanero", name: "Habanero (Extra Hot)" }
    ]
  },
  {
    id: "toppings",
    name: "Toppings",
    multiple: true,
    choices: [
      { id: "sour-cream", name: "Sour Cream" },
      { id: "cheese", name: "Cheese" },
      { id: "romaine", name: "Romaine Lettuce" },
      { id: "corn", name: "Corn" },
      { id: "jalapenos", name: "Jalapeños" }
    ]
  },
  {
    id: "extras",
    name: "Extras",
    multiple: true,
    choices: [
      { id: "extra-guacamole", name: "Extra Guacamole", price: 2.50 },
      { id: "extra-meat", name: "Extra Meat", price: 3.50 }
    ]
  }
];

export const PRODUCTS: Product[] = [
  {
    id: "burrito",
    name: "Classic Burrito",
    description: "Large flour tortilla with choice of lime rice, beans, fresh salsa, cheese or sour cream, and your favorite filling.",
    price: 9.90,
    image: "/images/max-und-benito-burrito-bowl.webp",
    options: MEAL_OPTIONS
  },
  {
    id: "bowl",
    name: "Burrito Bowl",
    description: "All the ingredients of a burrito served in a bowl. Choice of rice, beans, salsa, toppings, and filling. Gluten-free option.",
    price: 9.90,
    image: "/images/max-und-benito-burrito-bowl.webp",
    options: MEAL_OPTIONS
  },
  {
    id: "tacos",
    name: "Tacos (3 pcs)",
    description: "Three soft corn tortillas with your choice of filling, topped with fresh salsa, onions, cilantro, and lime.",
    price: 8.90,
    image: "/images/max-und-benito-burrito-bowl.webp",
    options: MEAL_OPTIONS
  },
  {
    id: "salad",
    name: "Salad Bowl",
    description: "Fresh romaine lettuce with your choice of filling, beans, corn, fresh salsa, and our lime-cilantro dressing.",
    price: 8.90,
    image: "/images/max-und-benito-burrito-bowl.webp",
    options: MEAL_OPTIONS
  },
  {
    id: "chips-salsa",
    name: "Chips & Salsa",
    description: "Our homemade corn tortilla chips served with fresh house salsa of your choice.",
    price: 3.50,
    image: "/images/logo-mini.svg",
    options: [
      {
        id: "salsa-choice",
        name: "Choose your Salsa",
        required: true,
        choices: [
          { id: "pico", name: "Pico de Gallo (Mild)" },
          { id: "verde", name: "Salsa Verde (Medium)" },
          { id: "roja", name: "Salsa Roja (Hot)" },
          { id: "habanero", name: "Habanero (Extra Hot)" }
        ]
      }
    ]
  },
  {
    id: "guacamole",
    name: "Guacamole",
    description: "Extra portion of our fresh, daily made guacamole from ripe avocados.",
    price: 2.50,
    image: "/images/logo-mini.svg"
  },
  {
    id: "jarritos",
    name: "Jarritos (0,37l)",
    description: "Authentic Mexican fruit soda. Available in Lime, Mango, Guava, or Pineapple.",
    price: 3.50,
    image: "/images/logo-mini.svg",
    options: [
      {
        id: "flavor",
        name: "Choose Flavor",
        required: true,
        choices: [
          { id: "lime", name: "Lime" },
          { id: "mango", name: "Mango" },
          { id: "guava", name: "Guava" },
          { id: "pineapple", name: "Pineapple" }
        ]
      }
    ]
  },
  {
    id: "soft-drinks",
    name: "Soft Drinks",
    description: "Vöslauer Water, Fritz-Cola, or Apple Spritzer.",
    price: 2.90,
    image: "/images/logo-mini.svg",
    options: [
      {
        id: "drink",
        name: "Choose Drink",
        required: true,
        choices: [
          { id: "water-still", name: "Vöslauer Still" },
          { id: "water-sparkling", name: "Vöslauer Sparkling" },
          { id: "fritz-cola", name: "Fritz-Cola" },
          { id: "apple-spritzer", name: "Apple Spritzer" }
        ]
      }
    ]
  },
  {
    id: "beer",
    name: "Mexican Beer",
    description: "Corona or Desperados.",
    price: 4.20,
    image: "/images/logo-mini.svg",
    options: [
      {
        id: "beer-choice",
        name: "Choose Beer",
        required: true,
        choices: [
          { id: "corona", name: "Corona" },
          { id: "desperados", name: "Desperados" }
        ]
      }
    ]
  }
];

export interface PackageRequirement {
  id: string;
  name: string;
  quantity: number;
  productIds: string[];
}

export interface CateringPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  requirements: PackageRequirement[];
}

export const CATERING_PACKAGES: CateringPackage[] = [
  {
    id: "office-party-10",
    name: "Mini Fiesta (10 People)",
    description: "Small but mighty. Enough burritos to make the interns happy. Includes 10 main courses, 10 sides, and 10 drinks.",
    price: 159.00,
    image: "/images/max-und-benito-burrito-bowl.webp",
    requirements: [
      {
        id: "mains",
        name: "Main Courses",
        quantity: 10,
        productIds: ["burrito", "bowl", "tacos", "salad"]
      },
      {
        id: "sides",
        name: "Sides",
        quantity: 10,
        productIds: ["chips-salsa", "guacamole"]
      },
      {
        id: "drinks",
        name: "Drinks",
        quantity: 10,
        productIds: ["jarritos", "soft-drinks", "beer"]
      }
    ]
  },
  {
    id: "office-party-20",
    name: "Burrito Bonanza (20 People)",
    description: "The gold standard of office lunches. A guaranteed crowd-pleaser for any team. Includes 20 main courses, 20 sides, and 20 drinks.",
    price: 299.00,
    image: "/images/max-und-benito-burrito-bowl.webp",
    requirements: [
      {
        id: "mains",
        name: "Main Courses",
        quantity: 20,
        productIds: ["burrito", "bowl", "tacos", "salad"]
      },
      {
        id: "sides",
        name: "Sides",
        quantity: 20,
        productIds: ["chips-salsa", "guacamole"]
      },
      {
        id: "drinks",
        name: "Drinks",
        quantity: 20,
        productIds: ["jarritos", "soft-drinks", "beer"]
      }
    ]
  },
  {
    id: "office-party-50",
    name: "Holy Guacamole! (50 People)",
    description: "When the whole department shows up. A mountain of food for a serious celebration. Includes 50 main courses, 50 sides, and 50 drinks.",
    price: 715.00,
    image: "/images/max-und-benito-burrito-bowl.webp",
    requirements: [
      {
        id: "mains",
        name: "Main Courses",
        quantity: 50,
        productIds: ["burrito", "bowl", "tacos", "salad"]
      },
      {
        id: "sides",
        name: "Sides",
        quantity: 50,
        productIds: ["chips-salsa", "guacamole"]
      },
      {
        id: "drinks",
        name: "Drinks",
        quantity: 50,
        productIds: ["jarritos", "soft-drinks", "beer"]
      }
    ]
  }
];
