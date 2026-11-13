import type {Todo} from "./types";
import {v4 as uuidv4} from "uuid";

export const initTodos:Todo[]=[
  {
    id: uuidv4(),
    name: "Learn React",
    isDone: false,
    priority: 1,
    deadline: null
  },
  {
    id: uuidv4(),
    name: "Learn TypeScript",
    isDone: false,
    priority: 2,
    deadline: null
  },
];