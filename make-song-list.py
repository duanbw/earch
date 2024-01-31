import sys
import os
import json
if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', '-d',
            help='搜索的路径，应当为相对路径')
    parser.add_argument('--output', '-o', default='songs.js',
            help='输出文件')
    args = parser.parse_args()

    root = args.root
    records = []
    for entry in os.listdir(root):
        base, ext = os.path.splitext(entry)
        if ext in ['.mp3', '.wav', '.wma', '.ogg']:
            records.append({
                'name': base,
                'path': root + '/' + entry,
            })
    songs_str = json.dumps(records, ensure_ascii=False, indent=2)

    with open(args.output, 'w', encoding='utf-8') as f:
        f.write("window.SONG_LIST = ")
        f.write(songs_str)
        f.write('\n')
