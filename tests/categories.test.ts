import assert from "node:assert/strict";
import test from "node:test";
import { updateCategoryData } from "../src/features/categories/utils/updateCategory.ts";
import { deserializeData, type AppData } from "../src/lib/storage.ts";
import type { Category, Todo } from "../src/types/todo.ts";

const study: Category = { id: "study", name: "勉強", description: "元の説明", color: "blue" };
const housework: Category = { id: "housework", name: "家事", description: "", color: "green" };
const makeTodo = (id: string, category: Category | null, isDone = false): Todo => ({
  id,
  name: id,
  description: "タスクの説明",
  isDone,
  priority: 2,
  category,
  deadline: new Date("2026-11-19T09:00:00+09:00"),
});
const data: AppData = {
  categories: [study, housework],
  todos: [
    makeTodo("active", study),
    makeTodo("done", study, true),
    makeTodo("other", housework),
    makeTodo("none", null),
  ],
};
const fields: Omit<Category, "id"> = { name: "授業", description: "教科書を読む\n課題を提出する", color: "purple" };

test("カテゴリのIDと件数を維持して、名前・説明・色を更新する", () => {
  const updated = updateCategoryData(data, study.id, fields);
  assert.deepEqual(updated.categories[0], { ...fields, id: study.id });
  assert.equal(updated.categories.length, data.categories.length);
  assert.equal(updated.todos.length, data.todos.length);
});

test("関連する完了・未完了タスクも更新し、他の情報や無関係のタスクを維持する", () => {
  const before = JSON.stringify(data);
  const updated = updateCategoryData(data, study.id, fields);
  for (const index of [0, 1]) {
    assert.deepEqual(updated.todos[index], { ...data.todos[index], category: updated.categories[0] });
    assert.strictEqual(updated.todos[index].category, updated.categories[0]);
  }
  assert.strictEqual(updated.categories[1], housework);
  assert.strictEqual(updated.todos[2], data.todos[2]);
  assert.strictEqual(updated.todos[3], data.todos[3]);
  assert.equal(JSON.stringify(data), before);
});

test("更新したカテゴリと関連タスクを保存・再読み込みしても維持する", () => {
  const updated = updateCategoryData(data, study.id, fields);
  const restored = deserializeData(JSON.stringify(updated));
  assert.deepEqual(restored, updated);
  assert.strictEqual(restored.todos[0].category, restored.categories[0]);
  assert.strictEqual(restored.todos[1].category, restored.categories[0]);
});

test("存在しないカテゴリの編集では、カテゴリやタスクを追加・変更しない", () => {
  assert.strictEqual(updateCategoryData(data, "missing", fields), data);
});
