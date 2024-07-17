import requests
from bs4 import BeautifulSoup
import openpyxl
import time
import re
import sys
from queue import Queue


def extract_chapter_number(title):
    match = re.search(r"Chapter (\d+)", title)
    return int(match.group(1)) if match else 0


def read_and_sort_excel(input_file):
    # Load the workbook and select the active sheet
    workbook = openpyxl.load_workbook(input_file)
    sheet = workbook.active

    # Read data from the sheet
    data = []
    for row in sheet.iter_rows(values_only=True):
        if row[0] and row[1]:  # Ensure both title and URL are present
            data.append(
                {
                    "title": row[0],
                    "url": row[1],
                    "chapter_number": extract_chapter_number(row[0]),
                }
            )

    # Sort the data based on chapter number
    sorted_data = sorted(data, key=lambda x: x["chapter_number"])

    return sorted_data


def scrape_website(url):
    # Send a GET request to the URL
    response = requests.get(url)

    # Parse the HTML content
    soup = BeautifulSoup(response.content, "html.parser")

    # Find all h4 and p tags
    h4_tags = soup.find_all("h4")
    p_tags = soup.find_all("p")

    # Extract text from tags
    h4_content = [tag.get_text() for tag in h4_tags]
    p_content = [tag.get_text() for tag in p_tags]

    return h4_content, p_content


def process_chapter(novel_id, chapter, retry_queue):
    h4_content, p_content = scrape_website(chapter["url"])
    success = send_to_api(novel_id, h4_content, p_content, chapter["title"])
    if not success:
        retry_queue.put((novel_id, h4_content, p_content))
    time.sleep(1)


def retry_failed_chapters(retry_queue):
    print("\nRetrying failed chapters:")
    while not retry_queue.empty():
        novel_id, h4_content, p_content = retry_queue.get()
        success = send_to_api(novel_id, h4_content, p_content)
        if not success:
            print(f"Retry failed for {h4_content}")
        time.sleep(1)


def send_to_api(novel_id, h4_content, p_content, title):
    api_url = "https://novel-app-server.vercel.app/api/v1/chapters"

    # Prepare the data
    if len(h4_content) == 0:
        h4_content = [title]

    data = {"novel_id": novel_id, "h4_content": h4_content, "p_content": p_content}

    # Send POST request to the API
    response = requests.post(api_url, json=data)

    if response.status_code == 201:
        print(f"Data successfully sent to API {data['h4_content']}")
        return True
    elif response.status_code == 409:
        print(f"Data already exists in the Database {data['h4_content']}")
        return True
    elif response.status_code == 400:
        print(
            f"Failed to send data to API (400 error). Queuing for retry: {data['h4_content']}"
        )
        return False
    else:
        print(f"Failed to send data to API. Status code: {response.status_code}")
        return True


# Main execution
if __name__ == "__main__":
    excel_file = "file.xlsx"  # Replace with your Excel file path
    chapter_data = read_and_sort_excel(excel_file)

    retry_queue = Queue()

    for chapter in chapter_data:
        process_chapter(sys.argv[1], chapter, retry_queue)

    print(
        f"Scraping and API submission completed for {len(chapter_data)} chapters. Failed for {retry_queue.qsize()} chapters."
    )

    print("Initial run completed. Starting retry for failed chapters.")
    retry_failed_chapters(retry_queue)

    print("Scraping and API submission completed, including retries.")
