export type Category = {
  name: string;
  description: string;
  id: string;
}

export type Todo = {
  id: string;
  name: string;
  isDone: boolean;
  category: Category | null;
  deadline: Date | null;
};