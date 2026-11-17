import assert from "node:assert/strict";
import test from "node:test";
import { deserializeData } from "../src/TS/storage.ts";

const category = { id: "study", name: "勉強", description: "", color: "purple" };
const todo = { id: "task", name: "復習", isDone: true, priority: 1, category, deadline: "2026-11-16T15:30:00.000Z" };

test("保存した期限をDateに戻し、カテゴリの最新情報を参照する", () => {
  const restored = deserializeData(
    JSON.stringify({ categories: [category], todos: [{ ...todo, category: { ...category, color: "blue" } }] }),
  );
  assert.equal(restored.todos[0].deadline?.toISOString(), todo.deadline);
  assert.strictEqual(restored.todos[0].category, restored.categories[0]);
  assert.equal(restored.todos[0].isDone, true);
  assert.equal(restored.todos[0].priority, 1);
});

test("全件削除した空のデータも復元する", () => {
  assert.deepEqual(deserializeData('{"todos":[],"categories":[]}'), { todos: [], categories: [] });
});

test("期限未設定と削除済みカテゴリを扱う", () => {
  const restored = deserializeData(JSON.stringify({ categories: [], todos: [{ ...todo, deadline: null }] }));
  assert.equal(restored.todos[0].deadline, null);
  assert.equal(restored.todos[0].category, null);
});

test("破損したJSON・不正な日付・不正な型・重複IDを拒否する", () => {
  for (const json of [
    "{",
    "null",
    "[]",
    JSON.stringify({ todos: [], categories: [{ ...category, color: "invalid" }] }),
    ...[
      { ...todo, deadline: "invalid" },
      { ...todo, isDone: "false" },
      { ...todo, priority: 0 },
      { ...todo, priority: 1.5 },
    ].map((invalid) => JSON.stringify({ categories: [category], todos: [invalid] })),
    JSON.stringify({ categories: [category], todos: [todo, todo] }),
    JSON.stringify({ categories: [category, category], todos: [] }),
  ])
    assert.throws(() => deserializeData(json));
});
