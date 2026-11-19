import assert from "node:assert/strict";
import test from "node:test";
import { deserializeData } from "../src/lib/storage.ts";

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

test("説明のない旧データを説明なしとして復元し、他の情報も維持する", () => {
  const restored = deserializeData(JSON.stringify({ categories: [category], todos: [todo] }));
  assert.deepEqual(restored.todos[0], {
    ...todo,
    description: "",
    deadline: new Date(todo.deadline),
  });
});

test("複数行の説明と空の説明を保存・再読み込みしても維持する", () => {
  for (const description of ["", "教科書の第3章を読む\n練習問題を3問解く", "<script>alert('test')</script>"]) {
    const restored = deserializeData(JSON.stringify({ categories: [category], todos: [{ ...todo, description }] }));
    assert.equal(restored.todos[0].description, description);
    assert.equal(deserializeData(JSON.stringify(restored)).todos[0].description, description);
  }
});

test("説明が文字列でない保存データを拒否する", () => {
  for (const description of [null, 42, false, {}, []]) {
    assert.throws(() => deserializeData(JSON.stringify({ categories: [category], todos: [{ ...todo, description }] })));
  }
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
