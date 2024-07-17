import subprocess
import sys
import time

#  python pipeline.py manipulating-harem-god.xlsx 66976190151e9be6d32445c9


def run_pipeline(input_file, id):
    # measure the time taken to run the pipeline
    start_time = time.time()
    # Step 1: Run transform.py
    print("Running transform.py...")
    subprocess.run(["python", "transform.py", input_file], check=True)

    # Step 2: Run scraper.py
    print("Running scraper.py...")
    subprocess.run(
        ["python", "scraper.py", id, "temp_output.xlsx", "final_output.xlsx"],
        check=True,
    )
    end_time = time.time()
    print(f"Time taken: {end_time - start_time:.2f} seconds")

    # Step 3: Run cleanup.py
    print("Pipeline completed.")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python run_pipeline.py <input_excel_file> <id>")
        sys.exit(1)

    input_file = sys.argv[1]
    id = sys.argv[2]
    run_pipeline(input_file, id)
