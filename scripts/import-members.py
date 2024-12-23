import pandas as pd
import requests
import json
from typing import Dict, List, Optional, Union, Any

def clean_string(value: Any) -> Optional[str]:
    """Clean up string values, return None if empty."""
    if pd.isna(value):
        return None
    return str(value).strip()

def clean_class_year(value: Any) -> Optional[int]:
    """Clean up class year, ensuring it's a valid integer."""
    if pd.isna(value):
        return None
    try:
        if isinstance(value, str):
            # Remove any non-numeric characters
            numeric = ''.join(filter(str.isdigit, value))
            return int(numeric)
        return int(value)
    except (ValueError, TypeError):
        return None

def map_membership_type(value: str) -> str:
    """Map membership type to valid enum values."""
    value = value.lower() if isinstance(value, str) else ""
    if "honorary" in value:
        return "HONORARY"
    if "student" in value:
        return "STUDENT"
    if "ordinary ii" in value:
        return "ORDINARY_II"
    return "ORDINARY_I"

def rename_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Rename unnamed columns based on the first row."""
    # Get the first row which contains our column names
    column_names = df.iloc[0]
    
    # Create a mapping of current column names to desired column names
    column_mapping = {}
    for i, col in enumerate(df.columns):
        if pd.notna(column_names[i]):
            column_mapping[col] = str(column_names[i]).strip()
    
    # Rename the columns
    df = df.rename(columns=column_mapping)
    
    # Drop the first row as it was our column names
    df = df.iloc[1:].reset_index(drop=True)
    
    return df

def validate_row(row: Dict[str, Any]) -> tuple[bool, Optional[str]]:
    """Validate a single row of data."""
    # Map Excel columns to our required fields
    required_mappings = {
        "English Name": ["English Name", "Name Box"],
        "Email": ["Email"],
        "Class": ["Class"],
        "Faculty": ["Faculty"],
        "Major": ["Major"]
    }
    
    # Check each required field
    for field, possible_columns in required_mappings.items():
        found = False
        for col in possible_columns:
            if col in row and not pd.isna(row[col]):
                found = True
                break
        if not found:
            return False, f"Missing required field: {field}"
    
    # Validate class year
    class_value = None
    for col in required_mappings["Class"]:
        if col in row:
            class_value = clean_class_year(row[col])
            if class_value:
                break
    
    if not class_value:
        return False, "Invalid or missing Class year"
    
    return True, None

def transform_row(row: Dict[str, Any]) -> Dict[str, Any]:
    """Transform a row into the API format."""
    # Get English name from possible columns
    english_name = clean_string(row.get("English Name"))
    preferred_name = clean_string(row.get("Preferred Name"))
    
    # Use preferred name if available, otherwise use English name
    final_name = preferred_name if preferred_name else english_name
    
    # Get membership type and fee
    membership_type = map_membership_type(str(row.get("Membership", "ORDINARY_I")))
    membership_fee = 500 if membership_type in ["ORDINARY_I", "ORDINARY_II"] else 0
    
    # Parse transaction date if available
    transaction_date = None
    if not pd.isna(row.get("Date of transaction")):
        try:
            transaction_date = pd.to_datetime(row["Date of transaction"]).isoformat()
        except:
            pass
    
    # Parse registration date if available
    registration_date = None
    if not pd.isna(row.get("Date of registration")):
        try:
            registration_date = pd.to_datetime(row["Date of registration"]).isoformat()
        except:
            pass
    
    # Map the row to our API format
    return {
        # Personal Information
        "salutation": clean_string(row.get("Salutation", "Mr")),
        "englishName": final_name,
        "preferredName": preferred_name,
        "chineseName": clean_string(row.get("Chinese Name")),
        "gender": clean_string(row.get("Gender", "prefer_not_to_say")),
        
        # Academic Information
        "class": clean_class_year(row.get("Class")),
        "faculty": clean_string(row.get("Faculty")),
        "major": clean_string(row.get("Major")),
        "cusid": clean_string(row.get("CUSID", "LEGACY")),
        "studentIdImage": "LEGACY",  # Default value for imported members
        
        # Professional Information
        "employer": clean_string(row.get("Employer")),
        "position": clean_string(row.get("Position")),
        "industry": clean_string(row.get("Industry", "")),
        
        # Contact Information
        "email": clean_string(row.get("Email")),
        "phoneNumber": str(row.get("Phone Number", "")),
        "address": clean_string(row.get("Address")),
        
        # Membership Details
        "membershipType": membership_type,
        "membershipFee": membership_fee,
        "transactionDate": transaction_date,
        "dateOfRegistration": registration_date,
        
        # Status (all imported members are verified)
        "isVerified": True,
        "status": "APPROVED"
    }

def import_members():
    try:
        print("Reading Excel file...")
        # Read the Excel file, skipping empty rows
        df = pd.read_excel(
            "instructions/membersdata/Membership Book.xlsx",
            na_values=['', 'NA', 'N/A'],
            keep_default_na=True
        )
        
        # Rename columns using the first row
        df = rename_columns(df)
        
        # Print column names for debugging
        print("\nDetected columns:")
        print(df.columns.tolist())
        
        # Take only first 2 rows for testing
        test_df = df.head(2)
        print("\nProcessing first 2 rows:")
        print(test_df.to_string())
        
        # Convert rows to dictionaries and validate
        valid_rows = []
        invalid_rows = []
        
        for index, row in test_df.iterrows():
            row_dict = row.to_dict()
            print(f"\nValidating row {index + 1}:")
            print("Raw data:", json.dumps(row_dict, default=str))
            
            is_valid, error = validate_row(row_dict)
            if is_valid:
                print("✅ Row is valid")
                transformed = transform_row(row_dict)
                print("Transformed data:", json.dumps(transformed, indent=2))
                valid_rows.append(transformed)
            else:
                print(f"❌ Row has validation error: {error}")
                invalid_rows.append({
                    "row": index + 2,  # +2 because Excel is 1-based and we have a header row
                    "error": error
                })
        
        # Log validation errors if any
        if invalid_rows:
            print("\nValidation errors found:")
            for row_error in invalid_rows:
                print(f"Row {row_error['row']}: {row_error['error']}")
            
            if not valid_rows:
                raise ValueError("No valid rows found in Excel file")
            print("\nProceeding with valid rows only...\n")
        
        # Ask for confirmation before importing
        print("\nReady to import the following members:")
        for member in valid_rows:
            print(f"\n{member['englishName']} ({member['email']}):")
            print(json.dumps(member, indent=2))
        
        confirm = input("\nProceed with import? (y/n): ")
        if confirm.lower() != 'y':
            print("Import cancelled")
            return
        
        print("\nImporting members to database...")
        # Call the Next.js API endpoint directly
        response = requests.post(
            "http://localhost:3000/api/import-members",  # We'll create this endpoint
            json=valid_rows,  # Send the array directly
            headers={
                "Content-Type": "application/json",
                "x-api-key": "your-secret-key"  # We'll add this for security
            }
        )
        
        if not response.ok:
            print("\nAPI Response:", response.text)
            raise ValueError(f"API request failed: {response.text}")
        
        try:
            result = response.json()
            print("\nImport completed:")
            print(f"Total processed: {result['totalProcessed']}")
            print(f"Successful: {result['successful']}")
            print(f"Failed: {result['failed']}")
            
            # Log detailed results
            print("\nDetailed results:")
            for r in result["results"]:
                if r["success"]:
                    print(f"✅ {r['email']}: Successfully imported")
                    print(f"  Member ID: {r['memberId']}")
                    print(f"  Dummy User ID: {r['dummyUserId']}")
                else:
                    print(f"❌ {r['email']}: {r['error']}")
                    
        except Exception as e:
            print("\nFailed to parse API response:")
            print("Response:", response.text)
            raise e
                
    except Exception as e:
        print(f"\nError importing members: {str(e)}")
        exit(1)

if __name__ == "__main__":
    import_members() 