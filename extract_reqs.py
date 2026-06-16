import json

log_path = r"C:\Users\souvi\.gemini\antigravity-ide\brain\09302294-992d-46f5-aae1-6aa4edbd5ddd\.system_generated\logs\transcript.jsonl"
with open(log_path, 'r', encoding='utf-8') as f, open('reqs_utf8.txt', 'w', encoding='utf-8') as out:
    for line in f:
        data = json.loads(line)
        if data.get('type') == 'USER_INPUT' and 'PHASE' in data.get('content', ''):
            out.write(data['content'])
            break
