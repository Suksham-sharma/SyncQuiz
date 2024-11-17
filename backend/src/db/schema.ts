import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./columns.helpers";

export const usersTable = pgTable("user", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({length: 255}).notNull(),
  ...timestamps,
});

export const quizTable = pgTable("quiz", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  heading: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  bgImageUrl: varchar("bg_image_url", { length: 255 }).notNull(),
  createdBy: integer("created_by")
    .notNull()
    .references(() => usersTable.id, {onDelete: 'cascade'}),
  ...timestamps,
});

export const questionTable = pgTable("question", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  question: varchar({ length: 255 }).notNull(),
  imageUrl: varchar("image_url", { length: 255 }),
  quizId: integer("quiz_id")
    .notNull()
    .references(() => quizTable.id, {onDelete: 'cascade'}),
  ...timestamps,
});

export const optionTable = pgTable("option", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  value: varchar().notNull(),
  questionId: integer("question_id")
    .notNull()
    .references(() => questionTable.id, {onDelete: 'cascade'}),
  ...timestamps,
});

export const answerTable = pgTable("answer", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  questionId: integer("question_id")
    .notNull()
    .references(() => questionTable.id, {onDelete: 'cascade'}),
  optionId: integer("option_id")
    .notNull()
    .references(() => optionTable.id , { onDelete: 'cascade'}),
  answerDescription: varchar("answer_description"),
  ...timestamps,
});
