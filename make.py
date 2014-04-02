#!/usr/bin/env python3
from pathlib import Path
import shutil
import datetime
import markdown

content = Path("content")
output = Path("output")
templates = Path("templates")
base_title = "»»t0p1 // "
header = footer = str()

# Clean output
if output.exists():
    shutil.rmtree(output)
output.mkdir()

# Read templates
with open(Path(templates / "header.html"), "r") as input_file:
    header = input_file.read()

with open(Path(templates / "footer.html"), "r") as input_file:
    footer = input_file.read()

# Handle content
archives: list[tuple[Path, str, datetime.datetime]] = list()

for thing in content.iterdir():
    # Copy dirs directly to output
    if thing.is_dir():
        shutil.copytree(thing, Path(output / thing.name), copy_function=shutil.copy, dirs_exist_ok=True)

    # Files are handles one-by-one
    else:
        # Prep file
        file = header

        # Get base name of the file
        base_name = thing.name.split(".")[0]

        # Handle HTML files
        if thing.suffix == ".html":
            file_title = base_title + base_name
            file += f"<title>{file_title}</title>"
            file += thing.read_text()
            out_file = Path(output / thing.name)

        # Handle Markdown files
        elif thing.suffix == ".md":
            with open(thing, "r") as input_file:
                title = input_file.readline().split("title:")[1].strip()
                date = input_file.readline().split("date:")[1].strip()
                file_title = base_title + title
                file += f"<title>{file_title}</title>"
                file += markdown.markdown(input_file.read(), extensions=["fenced_code"])

            # Construct proper file name
            out_file = Path(output / f"{base_name}.html")
            date_time = datetime.datetime.fromisoformat(date)
            archives.append((out_file, title, date_time))


        # Else throw a fit
        else:
            raise Exception("Unknown filetype {thing}")

        # Add footer
        file += footer

        # Write the file
        out_file.write_text(file)


# Prep archive index
archive_index = header + f"<title>{base_title} archives</title><ul class='archive'>"

# Sort archives based on date
archives = sorted(archives, key=lambda x: x[2], reverse=True)

# Create actual index
for entry in archives:
    entry_file, entry_title, entry_date = entry
    # Convert date to "Jun 2021" format
    entry_date = entry_date.strftime("%b %Y")
    archive_index += f"<li><a href='/{entry_file.name}'>{entry_title}<span style='float:right'>{entry_date}</span></a></li>"

# Close list and add footer
archive_index += "</ul>" + footer

# Write archive index to file
Path(output / "archives.html").write_text(archive_index)
