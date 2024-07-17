import pandas as pd
import sys


def reorganize_excel(input_file, output_file="temp_output.xlsx"):
    # Read the Excel file
    df = pd.read_excel(input_file)

    # Get column names
    columns = df.columns.tolist()

    # Initialize lists to store data
    labels = []
    hrefs = []

    # Iterate through columns and reorganize data
    for i in range(0, len(columns), 2):
        label_col = columns[i]
        href_col = columns[i + 1]

        labels.extend(df[label_col].tolist())
        hrefs.extend(df[href_col].tolist())

    # Create a new dataframe with reorganized data
    new_df = pd.DataFrame({"Label": labels, "Href": hrefs})

    # Remove NaN values
    new_df = new_df.dropna()

    # Save to a new Excel file
    new_df.to_excel(output_file, index=False)

    print(f"Data reorganized and saved to {output_file}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python transform.py <input_excel_file>")
        sys.exit(1)

    input_file = sys.argv[1]
    reorganize_excel(input_file)
