import { read, utils, type WorkBook, type WorkSheet } from "xlsx";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { type AppRouter } from "@/server/api/root";
import superjson from "superjson";
import { z } from "zod";

// Define the expected Excel row structure
const ExcelRowSchema = z.object({
  Salutation: z.string().optional(),
  "English Name": z.string(),
  "Chinese Name": z.string().optional(),
  Email: z.string(),
  "Phone Number": z.union([z.string(), z.number()]).optional(),
  Class: z.union([z.string(), z.number()]),
  Faculty: z.string(),
  Major: z.string(),
  Industry: z.string().optional(),
  Employer: z.string().optional(),
  Position: z.string().optional(),
  "Membership Type": z
    .enum(["STUDENT", "ORDINARY_II", "ORDINARY_I", "HONORARY"])
    .optional(),
});

type ExcelRow = z.infer<typeof ExcelRowSchema>;

// Create a tRPC client
const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/api/trpc",
      transformer: superjson,
    }),
  ],
});

async function importMembers() {
  try {
    console.log("Reading Excel file...");
    // Read the Excel file
    const workbook: WorkBook = read(
      "instructions/membersdata/Membership Book.xlsx",
    );
    const worksheet: WorkSheet = workbook.Sheets[workbook.SheetNames[0]!]!;
    const rawData = utils.sheet_to_json(worksheet);

    // Take only first 2 rows for testing
    const testData = rawData.slice(0, 2);
    console.log("\nProcessing first 2 rows:");
    console.log(JSON.stringify(testData, null, 2));

    // Validate and transform the data
    const validRows: ExcelRow[] = [];
    const invalidRows: { row: number; errors: string[] }[] = [];

    testData.forEach((row, index) => {
      console.log(`\nValidating row ${index + 1}:`);
      const result = ExcelRowSchema.safeParse(row);
      if (result.success) {
        console.log("✅ Row is valid");
        validRows.push(result.data);
      } else {
        console.log("❌ Row has validation errors");
        invalidRows.push({
          row: index + 2, // +2 because Excel is 1-based and we have a header row
          errors: result.error.errors.map(
            (e) => `${e.path.join(".")}: ${e.message}`,
          ),
        });
      }
    });

    // Log validation errors if any
    if (invalidRows.length > 0) {
      console.log("\nValidation errors found:");
      invalidRows.forEach(({ row, errors }) => {
        console.log(`Row ${row}:`);
        errors.forEach((error) => console.log(`  - ${error}`));
      });
      if (validRows.length === 0) {
        throw new Error("No valid rows found in Excel file");
      }
      console.log("\nProceeding with valid rows only...\n");
    }

    // Transform valid rows to match our API schema
    console.log("\nTransforming valid rows to API format:");
    const members = validRows.map((row) => {
      const member = {
        salutation: row.Salutation ?? "Mr",
        englishName: row["English Name"],
        chineseName: row["Chinese Name"],
        email: row.Email,
        phoneNumber: row["Phone Number"]?.toString() ?? "",
        class:
          typeof row.Class === "string" ? parseInt(row.Class, 10) : row.Class,
        faculty: row.Faculty,
        major: row.Major,
        industry: row.Industry,
        employer: row.Employer,
        position: row.Position,
        membershipType: row["Membership Type"] ?? "ORDINARY_I",
      };
      console.log(JSON.stringify(member, null, 2));
      return member;
    });

    console.log("\nImporting members to database...");
    // Import members using our API
    const result = await trpc.member.importMembers.mutate(members);

    console.log("\nImport completed:");
    console.log(`Total processed: ${result.totalProcessed}`);
    console.log(`Successful: ${result.successful}`);
    console.log(`Failed: ${result.failed}`);

    // Log detailed results
    console.log("\nDetailed results:");
    result.results.forEach((r) => {
      if (r.success) {
        console.log(`✅ ${r.email}: Successfully imported`);
        console.log(`  Member ID: ${r.memberId}`);
        console.log(`  Dummy User ID: ${r.dummyUserId}`);
      } else {
        console.log(`❌ ${r.email}: ${r.error}`);
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("\nError importing members:", error.message);
    } else {
      console.error("\nUnknown error occurred during import");
    }
    process.exit(1);
  }
}

// Run the import
void importMembers();
