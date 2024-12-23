import { z } from "zod";
import { FACULTIES } from "../constants/faculties";

// Shared validation rules
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

// Create a union type of all faculty names
export const FACULTY_NAMES = [
  "Faculty of Arts",
  "Faculty of Business Administration",
  "Faculty of Education",
  "Faculty of Engineering",
  "Faculty of Law",
  "Faculty of Medicine",
  "Faculty of Science",
  "Faculty of Social Science",
] as const;

export const membershipFormSchema = z.object({
  // Required fields
  membershipType: z.enum(["STUDENT", "ORDINARY_II", "ORDINARY_I", "HONORARY"], {
    required_error: "Please select a membership type",
  }),
  salutation: z.enum(["Mr", "Mrs", "Ms", "Dr", "Prof"], {
    required_error: "Please select a salutation",
  }),
  englishName: z.string().min(1, "English name is required"),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"], {
    required_error: "Please select your gender",
  }),

  // Academic Information (Required)
  class: z.coerce
    .number()
    .int()
    .min(1950)
    .max(new Date().getFullYear() + 4)
    .describe("Graduation year"),
  faculty: z.enum(FACULTY_NAMES, {
    required_error: "Please select your faculty",
  }),
  major: z.string({
    required_error: "Please select your major",
  }),
  cusid: z.string().min(1, "Student ID is required"),
  studentIdImage: z
    .union([z.string(), z.instanceof(File)])
    .refine((val) => val !== "", {
      message: "Please upload your student ID card",
    }),

  // Contact Information (Required)
  phoneNumber: z
    .string()
    .regex(phoneRegex, "Please enter a valid phone number")
    .min(8, "Phone number must be at least 8 digits"),

  // Optional fields
  preferredName: z.string().optional(),
  chineseName: z.string().optional(),

  // Professional Information (Optional)
  employer: z.string().optional(),
  position: z.string().optional(),

  // Additional Contact Information (Optional)
  address: z.string().optional(),

  // Industry Information (Optional)
  industry: z.string().optional(),
});
export type MembershipFormValues = z.infer<typeof membershipFormSchema>;
