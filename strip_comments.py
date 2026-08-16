import os
import re
import tokenize
import io

def strip_python_comments(source_code):
    io_obj = io.StringIO(source_code)
    out_tokens = []
    try:
        for tok in tokenize.generate_tokens(io_obj.readline):
            token_type = tok[0]
            if token_type == tokenize.COMMENT:
                pass
            else:
                out_tokens.append(tok)
        # untokenize returns bytes, we decode it
        return tokenize.untokenize(out_tokens)
    except Exception as e:
        # Fallback to regex if parsing fails
        return re.sub(r'(?m)^\s*#.*$', '', source_code)

def strip_js_comments(source_code):
    # Remove JSX block comments
    source_code = re.sub(r'\{\s*/\*.*?\*/\s*\}', '', source_code, flags=re.DOTALL)
    # Remove standard block comments
    source_code = re.sub(r'/\*.*?\*/', '', source_code, flags=re.DOTALL)
    # Remove line comments that are not preceded by a colon (to protect http://)
    # And we preserve the newline character by not matching \n in .*
    source_code = re.sub(r'(?<!:)\/\/.*', '', source_code)
    return source_code

def process_directory(directory):
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in root or '.git' in root or 'venv' in root or '__pycache__' in root:
            continue
            
        for file in files:
            path = os.path.join(root, file)
            if file.endswith('.py'):
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                new_content = strip_python_comments(content)
                if new_content != content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
            
            elif file.endswith(('.js', '.jsx', '.ts', '.tsx')):
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                new_content = strip_js_comments(content)
                if new_content != content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)

if __name__ == '__main__':
    project_root = r"D:\Lapor AI"
    process_directory(os.path.join(project_root, "backend"))
    process_directory(os.path.join(project_root, "frontend", "src"))
    print("Done stripping comments while preserving formatting.")
