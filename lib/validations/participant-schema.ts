import { z } from "zod";

export const GENDER_OPTIONS = [
  { value: "female", label: "여성" },
  { value: "male", label: "남성" },
] as const;

export const participantSchema = z.object({
  gender: z.enum(["female", "male"]),
  age: z.number().int().positive().max(120),
  hasOnlineExperience: z.enum(["yes", "no"]),
});

export type ParticipantFormInput = z.infer<typeof participantSchema>;
