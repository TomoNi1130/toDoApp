import type { Todo, Category } from "../types/todo";
import { v4 as uuidv4 } from "uuid";

export const initCategories: Category[] = [
  {
    id: uuidv4(),
    name: "勉強",
    description: "授業の課題や復習など、学習に関するタスク。",
    color: "blue",
  },
  {
    id: uuidv4(),
    name: "家事",
    description: "買い物や掃除など、日々の暮らしに関するタスク。",
    color: "green",
  },
  {
    id: uuidv4(),
    name: "健康",
    description: "通院や運動など、体調管理に関するタスク。",
    color: "red",
  },
  {
    id: uuidv4(),
    name: "用事",
    description: "返却や手続きなど、忘れずに済ませたいタスク。",
    color: "yellow",
  },
  {
    id: uuidv4(),
    name: "趣味",
    description: "映画や読書など、自分の楽しみのためのタスク。",
    color: "purple",
  },
];

const categories = new Map(initCategories.map((category) => [category.name, category]));

// 初めて開いた月に、5色のタスクが並ぶようにする。月初・月末でも同じ月に収める。
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();
const lastDay = new Date(year, month + 1, 0).getDate();
const firstDay = Math.max(1, Math.min(today.getDate() - 2, lastDay - 4));
const sampleDeadline = (offset: number, hour: number, minute = 0) =>
  new Date(year, month, firstDay + offset, hour, minute);

export const initTodos: Todo[] = [
  {
    id: uuidv4(),
    name: "プログラミングの課題を提出",
    description: "動作とREADMEを確認して提出する。\n公開ページの表示も確認する。",
    isDone: false,
    priority: 1,
    category: categories.get("勉強") ?? null,
    deadline: sampleDeadline(2, 18),
  },
  {
    id: uuidv4(),
    name: "夕食の買い物",
    description: "牛乳・卵・野菜を買う。冷蔵庫の残りも確認する。",
    isDone: false,
    priority: 2,
    category: categories.get("家事") ?? null,
    deadline: sampleDeadline(0, 17, 30),
  },
  {
    id: uuidv4(),
    name: "歯科の定期検診",
    description: "診察券を持参する。予約時刻の10分前に到着する。",
    isDone: false,
    priority: 1,
    category: categories.get("健康") ?? null,
    deadline: sampleDeadline(3, 10),
  },
  {
    id: uuidv4(),
    name: "図書館の本を返却",
    description: "借りている2冊を返却する。",
    isDone: false,
    priority: 2,
    category: categories.get("用事") ?? null,
    deadline: sampleDeadline(1, 16),
  },
  {
    id: uuidv4(),
    name: "気になっていた映画を見る",
    description: "週末の楽しみ。見終わったら感想をメモする。",
    isDone: false,
    priority: 3,
    category: categories.get("趣味") ?? null,
    deadline: sampleDeadline(4, 20),
  },
  {
    id: uuidv4(),
    name: "授業ノートを整理",
    description: "重要なところをまとめ、復習まで完了。",
    isDone: true,
    priority: 2,
    category: categories.get("勉強") ?? null,
    deadline: sampleDeadline(0, 12),
  },
  {
    id: uuidv4(),
    name: "やってみたいことをメモ",
    description: "期限やカテゴリを決めずに、思いついたことを残す。",
    isDone: false,
    priority: 3,
    category: null,
    deadline: null,
  },
];
