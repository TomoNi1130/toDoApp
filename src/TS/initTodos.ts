import type { Todo, Category } from "./types";
import { v4 as uuidv4 } from "uuid";

export const initCategories: Category[] = [
  {
    id: uuidv4(),
    name: "勉強",
    description: "Tasks related to programming",
    color: "blue",
  },
  {
    id: uuidv4(),
    name: "家事",
    description: "Tasks related to housework",
    color: "green",
  },
];

const categories = new Map<string, Category>([
  [initCategories[0].name, { ...initCategories[0] }],
  [initCategories[1].name, { ...initCategories[1] }],
]);

export const initTodos: Todo[] = [
  {
    id: uuidv4(),
    name: "Learn React",
    isDone: false,
    priority: 3,
    category: categories.get("勉強") || null,
    deadline: null,
  },
  {
    id: uuidv4(),
    name: "Learn TypeScript",
    isDone: false,
    priority: 3,
    category: categories.get("家事") || null,
    deadline: null,
  },
];
