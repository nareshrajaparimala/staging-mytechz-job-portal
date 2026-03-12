# Company Profile Requirements

## Mandatory Fields (Required to Post Jobs)
1. **Company Name** - Text input
2. **Website** - URL input
3. **Industry** - Dropdown selection
4. **Company Size** - Dropdown selection
5. **Founded Year** - Number input
6. **Work Mode** - Dropdown (Remote/Hybrid/Office)
7. **Office Address** - Textarea

## Optional Fields
1. **Head Office Location** - Text input (optional)
2. **Company Description** - Textarea (optional)
3. **Mission & Culture** - Textarea (optional)
4. **Benefits & Perks** - Array/List (optional)

## Business Rules
- Recruiters CANNOT post jobs until ALL mandatory fields are completed
- The system should check company profile completion before allowing job posting
- Display clear error messages for missing mandatory fields
- Optional fields can be left empty

## Database Schema
Only the fields listed above should be stored in the database.
Remove any unnecessary fields from the current implementation.

## Implementation Notes
- Add validation on both frontend and backend
- Show profile completion percentage
- Redirect to company profile if incomplete when trying to post a job
- Display clear indicators for mandatory vs optional fields
