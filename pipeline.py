import subprocess
import sys

#  python pipeline.py manipulating-harem-god.xlsx 66976190151e9be6d32445c9


def run_pipeline(input_file, id):
    # Step 1: Run transform.py
    print("Running transform.py...")
    subprocess.run(["python", "transform.py", input_file], check=True)

    # Step 2: Run scraper.py
    print("Running scraper.py...")
    subprocess.run(
        ["python", "scraper.py", id, "temp_output.xlsx", "final_output.xlsx"],
        check=True,
    )

    print("Pipeline completed. Results are in final_output.xlsx")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python run_pipeline.py <input_excel_file> <id>")
        sys.exit(1)

    input_file = sys.argv[1]
    id = sys.argv[2]
    run_pipeline(input_file, id)
