export type ThemeColor = | "blue" | "green" | "red" | "yellow" | "purple";

export const categoryColorClasses = {
  blue: "bg-blue-100 text-blue-800 border-blue-500",
  green: "bg-green-100 text-green-800 border-green-500",
  red: "bg-red-100 text-red-800 border-red-500",
  yellow: "bg-yellow-100 text-yellow-800 border-yellow-500",
  purple: "bg-purple-100 text-purple-800 border-purple-500",
} satisfies Record<ThemeColor, string>;

export type Category = {
  name: string;
  description: string;
  id: string;
  color: ThemeColor;
}

export type Todo = {
  id: string;
  name: string;
  isDone: boolean;
  category: Category | null;
  deadline: Date | null;
};