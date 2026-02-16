"""
Generate PostgreSQL CREATE TABLE statements from the data specification CSV.
Output: supabase_beacon_schema.sql (11 tables matching dashboard_specs Excel files)
"""
import csv
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(SCRIPT_DIR)
CSV_PATH = os.path.join(ROOT, "data_specifications_01262026.xlsx - fa.csv")
OUT_PATH = os.path.join(ROOT, "supabase_beacon_schema.sql")


def pg_type(row):
    dt = (row.get("DATA_TYPE") or "").lower()
    clen = row.get("CHAR_MAX_LENGTH")
    prec = row.get("NUM_PRECISION")
    scale = row.get("NUM_SCALE")
    try:
        clen = int(float(clen)) if clen and str(clen) != "null" else None
        prec = int(float(prec)) if prec and str(prec) != "null" else None
        scale = int(float(scale)) if scale and str(scale) != "null" else None
    except (ValueError, TypeError):
        clen = prec = scale = None
    if dt == "varchar":
        if clen and clen > 0 and clen != 8000:
            return f"VARCHAR({min(clen, 8000)})"
        return "TEXT"
    if dt == "nvarchar":
        if clen and clen > 0:
            return "TEXT"
        return "TEXT"
    if dt == "numeric":
        if prec:
            return f"NUMERIC({prec},{scale or 0})"
        return "NUMERIC"
    if dt == "bigint":
        return "BIGINT"
    if dt == "int":
        return "INTEGER"
    if dt == "datetime":
        return "TIMESTAMP"
    if dt == "bit":
        return "BOOLEAN"
    if dt == "money":
        return "DECIMAL(19,4)"
    if dt == "decimal":
        if prec:
            return f"DECIMAL({prec},{scale or 0})"
        return "DECIMAL(10,2)"
    return "TEXT"


def quote_col(name):
    if " " in name or "-" in name or name.lower() in ("user", "order", "group"):
        return f'"{name}"'
    return name


def main():
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    by_table = {}
    for r in rows:
        t = r["FILE_NAME"]
        if t not in by_table:
            by_table[t] = []
        by_table[t].append(r)

    out = ["-- Beacon Fixed Annuity schema (11 tables) - generated from data specification\n"]
    out.append("-- Run this in Supabase SQL Editor: https://supabase.com/dashboard -> SQL Editor\n\n")

    for table in sorted(by_table.keys()):
        cols = sorted(by_table[table], key=lambda x: (int(float(x["ORDINAL_POSITION"] or 0)), x["COLUMN_NAME"]))
        seen = set()
        col_defs = []
        for r in cols:
            cname = r["COLUMN_NAME"].strip()
            if cname in seen:
                continue
            seen.add(cname)
            ctype = pg_type(r)
            nullable = "NULL" if (r.get("IS_NULLABLE") or "").upper() == "YES" else "NOT NULL"
            col_defs.append(f"  {quote_col(cname)} {ctype} {nullable}")
        out.append(f"CREATE TABLE IF NOT EXISTS {table} (\n")
        out.append(",\n".join(col_defs))
        out.append("\n);\n\n")

    with open(OUT_PATH, "w") as f:
        f.write("".join(out))
    print(f"Generated {OUT_PATH}")


if __name__ == "__main__":
    main()
