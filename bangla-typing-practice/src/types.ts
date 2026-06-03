/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LessonDifficulty = "beginner" | "intermediate" | "advanced" | "custom";

export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: LessonDifficulty;
  content: string; // The Bengali text to practice typing
  expectedPhonetic?: string; // Guidance for phonetic keys, like "amar sonar bangla"
}

export interface TypingStats {
  wpm: number;
  accuracy: number;
  correctChars: number;
  errorChars: number;
  timeSpentSecs: number;
  completedAt: string;
}

export interface SessionHistory {
  id: string;
  lessonId: string;
  lessonTitle: string;
  difficulty: LessonDifficulty;
  wpm: number;
  accuracy: number;
  timeSpentSecs: number;
  completedAt: string;
}

export interface CharMatchStatus {
  char: string;
  expected: string;
  status: "correct" | "incorrect" | "pending" | "current";
}
