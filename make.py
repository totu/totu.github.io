#!/usr/bin/env python3.11
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from pathlib import Path
import shutil
import datetime
import markdown
import htmlmin


class Watcher:
    def __init__(self, content, generator):
        self.observer = Observer()
        self.content = content
        self.generator = generator

    def run(self):
        event_handler = Handler(generator)
        self.observer.schedule(
            event_handler, self.content.name, recursive=True)
        self.observer.start()
        try:
            while True:
                time.sleep(5)
        except:
            self.observer.stop()
            print("Observer Stopped")

        self.observer.join()


class Handler(FileSystemEventHandler):
    def __init__(self, generator):
        self.generator = generator

    def on_any_event(self, event):

        if event.is_directory:
            return None

        elif event.event_type in ["created", "modified", "deleted"]:
            self.generator.clean()
            self.generator.read_templates()
            self.generator.generate_content()


class Generator():
    def __init__(self, content, output, templates, title):
        self.content = content
        self.output = output
        self.templates = templates
        self.title = title
        self.header = str()
        self.footer = str()

    def clean(self):
        if self.output.exists():
            shutil.rmtree(self.output)
        self.output.mkdir()

    def read_templates(self):
        with open(Path(self.templates / "header.html"), "r") as header:
            self.header = header.read()

        with open(Path(self.templates / "footer.html"), "r") as footer:
            self.footer = footer.read()

    def generate_content(self):
        archives: list[tuple[Path, str, datetime.datetime]] = list()

        for thing in self.content.iterdir():
            # Copy dirs directly to output
            if thing.is_dir():
                shutil.copytree(thing, Path(self.output / thing.name),
                                copy_function=shutil.copy, dirs_exist_ok=True)

            # Files are handles one-by-one
            else:
                # Prep file
                file = self.header

                # Get base name of the file
                base_name = thing.name.split(".")[0]

                # Handle HTML files
                if thing.suffix == ".html":
                    file_title = self.title + base_name
                    file += f"<title>{file_title}</title>"
                    file += thing.read_text()
                    out_file = Path(self.output / thing.name)

                # Handle Markdown files
                elif thing.suffix == ".md":
                    with open(thing, "r") as markdown_file:
                        title = markdown_file.readline().split("title:")[
                            1].strip()
                        date = markdown_file.readline().split("date:")[
                            1].strip()
                        file_title = base_title + title
                        file += f"<title>{file_title}</title>"
                        file += markdown.markdown(markdown_file.read(),
                                                  extensions=["fenced_code"])

                        # Construct proper file name
                        out_file = Path(self.output / f"{base_name}.html")
                        date_time = datetime.datetime.fromisoformat(date)
                        archives.append((out_file, title, date_time))

                # Else throw a fit
                else:
                    raise Exception(f"Unknown filetype {thing}")

                # Add footer
                file += self.footer

                # Minimize HTML
                file = htmlmin.minify(file, remove_empty_space=True)

                # Write the file
                out_file.write_text(file)

        # Prep archive index
        archive_index = self.header + \
            "<a class='post' href='archive.html'><img class='archive logo' src='img/archive-logo.png' alt='archive'></a>" + \
            "<a class='ext' href='https://github.com/totu'><img class='github logo' src='img/github-logo.png' alt='github logo'></a>" + \
            "<a class='ext' href='https://addons.mozilla.org/en-US/firefox/user/15008081/'><img class='firefox logo' src='img/firefox-logo.png' alt='firefox logo'></a>" + \
            f"<title>{base_title} archives</title><div class=window><span class=title>archive</span> <span class=body> "


        # Sort archives based on date
        archives = sorted(archives, key=lambda x: x[2], reverse=True)

        archives_html = "<ul class='archive'>"
        # Create actual index
        for entry in archives:
            entry_file, entry_title, entry_date = entry
            # Convert date to "Jun 2021" format
            entry_date = entry_date.strftime("%b %Y")
            archives_html += f"<li><a class=post href='/{entry_file.name}'>{entry_title} \
                    <span class=post-date>{entry_date}</span></a></li>"

        # Close list and add footer
        archives_html += "</ul>"
        archive_index += archives_html + "</span></div><script src='js/ui.js'></script> " + self.footer

        # Minimize HTML
        archive_index = htmlmin.minify(archive_index, remove_empty_space=True)

        # Write archive index to file
        Path(self.output / "index.html").write_text(archive_index)
        Path(self.output / "archive.html").write_text(archives_html)


if __name__ == "__main__":
    content = Path("content")
    output = Path("output")
    templates = Path("templates")
    base_title = "»»t0p1 // "
    generator = Generator(content=content, output=output,
                          templates=templates, title=base_title)
    generator.clean()
    generator.read_templates()
    generator.generate_content()
    watch = Watcher(content, generator)
    watch.run()
