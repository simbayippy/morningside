"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create(
        (typeof Iterator === "function" ? Iterator : Object).prototype,
      );
    return (
      (g.next = verb(0)),
      (g["throw"] = verb(1)),
      (g["return"] = verb(2)),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                    ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, "__esModule", { value: true });
var xlsx_1 = require("xlsx");
var client_1 = require("@trpc/client");
var superjson_1 = require("superjson");
var zod_1 = require("zod");
// Define the expected Excel row structure
var ExcelRowSchema = zod_1.z.object({
  Salutation: zod_1.z.string().optional(),
  "English Name": zod_1.z.string(),
  "Chinese Name": zod_1.z.string().optional(),
  Email: zod_1.z.string(),
  "Phone Number": zod_1.z
    .union([zod_1.z.string(), zod_1.z.number()])
    .optional(),
  Class: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]),
  Faculty: zod_1.z.string(),
  Major: zod_1.z.string(),
  Industry: zod_1.z.string().optional(),
  Employer: zod_1.z.string().optional(),
  Position: zod_1.z.string().optional(),
  "Membership Type": zod_1.z
    .enum(["STUDENT", "ORDINARY_II", "ORDINARY_I", "HONORARY"])
    .optional(),
});
// Create a tRPC client
var trpc = (0, client_1.createTRPCProxyClient)({
  links: [
    (0, client_1.httpBatchLink)({
      url: "http://localhost:3000/api/trpc",
      transformer: superjson_1.default,
    }),
  ],
});
function importMembers() {
  return __awaiter(this, void 0, void 0, function () {
    var workbook,
      worksheet,
      rawData,
      testData,
      validRows_1,
      invalidRows_1,
      members,
      result,
      error_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 2, , 3]);
          console.log("Reading Excel file...");
          workbook = (0, xlsx_1.read)(
            "instructions/membersdata/Membership Book.xlsx",
          );
          worksheet = workbook.Sheets[workbook.SheetNames[0]];
          rawData = xlsx_1.utils.sheet_to_json(worksheet);
          testData = rawData.slice(0, 2);
          console.log("\nProcessing first 2 rows:");
          console.log(JSON.stringify(testData, null, 2));
          validRows_1 = [];
          invalidRows_1 = [];
          testData.forEach(function (row, index) {
            console.log("\nValidating row ".concat(index + 1, ":"));
            var result = ExcelRowSchema.safeParse(row);
            if (result.success) {
              console.log("✅ Row is valid");
              validRows_1.push(result.data);
            } else {
              console.log("❌ Row has validation errors");
              invalidRows_1.push({
                row: index + 2, // +2 because Excel is 1-based and we have a header row
                errors: result.error.errors.map(function (e) {
                  return "".concat(e.path.join("."), ": ").concat(e.message);
                }),
              });
            }
          });
          // Log validation errors if any
          if (invalidRows_1.length > 0) {
            console.log("\nValidation errors found:");
            invalidRows_1.forEach(function (_a) {
              var row = _a.row,
                errors = _a.errors;
              console.log("Row ".concat(row, ":"));
              errors.forEach(function (error) {
                return console.log("  - ".concat(error));
              });
            });
            if (validRows_1.length === 0) {
              throw new Error("No valid rows found in Excel file");
            }
            console.log("\nProceeding with valid rows only...\n");
          }
          // Transform valid rows to match our API schema
          console.log("\nTransforming valid rows to API format:");
          members = validRows_1.map(function (row) {
            var _a, _b, _c, _d;
            var member = {
              salutation:
                (_a = row.Salutation) !== null && _a !== void 0 ? _a : "Mr",
              englishName: row["English Name"],
              chineseName: row["Chinese Name"],
              email: row.Email,
              phoneNumber:
                (_c =
                  (_b = row["Phone Number"]) === null || _b === void 0
                    ? void 0
                    : _b.toString()) !== null && _c !== void 0
                  ? _c
                  : "",
              class:
                typeof row.Class === "string"
                  ? parseInt(row.Class, 10)
                  : row.Class,
              faculty: row.Faculty,
              major: row.Major,
              industry: row.Industry,
              employer: row.Employer,
              position: row.Position,
              membershipType:
                (_d = row["Membership Type"]) !== null && _d !== void 0
                  ? _d
                  : "ORDINARY_I",
            };
            console.log(JSON.stringify(member, null, 2));
            return member;
          });
          console.log("\nImporting members to database...");
          return [4 /*yield*/, trpc.member.importMembers.mutate(members)];
        case 1:
          result = _a.sent();
          console.log("\nImport completed:");
          console.log("Total processed: ".concat(result.totalProcessed));
          console.log("Successful: ".concat(result.successful));
          console.log("Failed: ".concat(result.failed));
          // Log detailed results
          console.log("\nDetailed results:");
          result.results.forEach(function (r) {
            if (r.success) {
              console.log("\u2705 ".concat(r.email, ": Successfully imported"));
              console.log("  Member ID: ".concat(r.memberId));
              console.log("  Dummy User ID: ".concat(r.dummyUserId));
            } else {
              console.log("\u274C ".concat(r.email, ": ").concat(r.error));
            }
          });
          return [3 /*break*/, 3];
        case 2:
          error_1 = _a.sent();
          if (error_1 instanceof Error) {
            console.error("\nError importing members:", error_1.message);
          } else {
            console.error("\nUnknown error occurred during import");
          }
          process.exit(1);
          return [3 /*break*/, 3];
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
// Run the import
void importMembers();
