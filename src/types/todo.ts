export type ThemeColor = "blue" | "green" | "red" | "yellow" | "purple";

export const categoryColorClasses = {
  blue: "color-blue",
  green: "color-green",
  red: "color-red",
  yellow: "color-yellow",
  purple: "color-purple",
} satisfies Record<ThemeColor, string>;

export const colorOptions: { value: ThemeColor; label: string }[] = [
  { value: "blue", label: "青" },
  { value: "green", label: "緑" },
  { value: "red", label: "赤" },
  { value: "yellow", label: "黄" },
  { value: "purple", label: "紫" },
];

export const priorityLabels: Record<number, string> = { 1: "高", 2: "中", 3: "低" };

export type Category = {
  id: string;
  name: string;
  description: string;
  color: ThemeColor;
};

export type Todo = {
  id: string;
  name: string;
  description: string;
  isDone: boolean;
  priority: number;
  category: Category | null;
  deadline: Date | null;
};
