"""
Split data specification into one Excel file per table, pivoted for dashboard use.
Each file contains:
  - Schema: One row per column (for API/JSON consumption by frontend)
  - Pivoted: Attributes as rows, column names as headers (compact reference view)
"""

import pandas as pd
import os

INPUT_CSV = "data_specifications_01262026.xlsx - fa.csv"
OUTPUT_DIR = "dashboard_specs"

# Columns to include in schema (dashboard-ready order)
SCHEMA_COLS = [
    "COLUMN_NAME",
    "DATA_TYPE",
    "DESCRIPTION",
    "IS_NULLABLE",
    "IS_ID",
    "ORDINAL_POSITION",
    "CHAR_MAX_LENGTH",
    "NUM_PRECISION",
    "NUM_SCALE",
    "NOTES",
]

# Attributes to include in pivoted view (rows); column names become Excel columns
PIVOT_ATTRS = ["DATA_TYPE", "IS_NULLABLE", "IS_ID", "ORDINAL_POSITION", "DESCRIPTION"]


def main():
    df = pd.read_csv(INPUT_CSV)

    # Convert ordinals to numeric for sorting
    df["ORDINAL_POSITION"] = pd.to_numeric(df["ORDINAL_POSITION"], errors="coerce")

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    for table_name in df["FILE_NAME"].unique():
        subset = df[df["FILE_NAME"] == table_name].sort_values("ORDINAL_POSITION")

        schema = subset[[c for c in SCHEMA_COLS if c in subset.columns]].copy()
        schema.columns = [
            "Column Name",
            "Data Type",
            "Description",
            "Nullable",
            "Is Identifier",
            "Position",
            "Char Max Length",
            "Num Precision",
            "Num Scale",
            "Notes",
        ]

        # Pivoted: attributes as rows, column names as Excel columns
        pivot_rows = []
        for attr in PIVOT_ATTRS:
            row = {"Attribute": attr.replace("_", " ").title()}
            for _, r in subset.iterrows():
                val = r[attr]
                row[r["COLUMN_NAME"]] = val if pd.notna(val) else ""
            pivot_rows.append(row)

        pivot_df = pd.DataFrame(pivot_rows)

        out_path = os.path.join(OUTPUT_DIR, f"{table_name}.xlsx")
        with pd.ExcelWriter(out_path, engine="openpyxl") as writer:
            schema.to_excel(writer, sheet_name="Schema", index=False)
            pivot_df.to_excel(writer, sheet_name="Pivoted", index=False)

        print(f"Created: {out_path}")

    print(f"\nDone! {len(df['FILE_NAME'].unique())} Excel files in '{OUTPUT_DIR}/'")


if __name__ == "__main__":
    main()
