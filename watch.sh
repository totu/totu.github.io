inotifywait --recursive --monitor --format "%e %w%f" \\n--event modify,move,create,delete content | while read changed; do ./make.py; done
