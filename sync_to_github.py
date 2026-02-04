import os
import shutil
import fnmatch

src = r"d:\Project\GAntigravity\tdytime-fn-2026-02-03"
dst = r"d:\Project\GAntigravity\tdytime-fn-2026-02-04-github"

# .gitignore patterns to ignore
ignore_patterns = [
    'logs', '*.log', 'node_modules', 'dist', 'dist-ssr', '*.local',
    '.vscode/*', '.idea', '.DS_Store', '*.suo', '*.ntvs*', '*.njsproj',
    '*.sln', '*.sw?', '*.md'
]

# whitelist patterns (even if matched by ignore_patterns)
whitelist_patterns = [
    'README.md', '.vscode/extensions.json'
]

def should_ignore(path, root_src):
    rel_path = os.path.relpath(path, root_src)
    
    # Check whitelist first
    for pattern in whitelist_patterns:
        if fnmatch.fnmatch(rel_path, pattern):
            return False
            
    # Check ignore patterns
    for pattern in ignore_patterns:
        if fnmatch.fnmatch(rel_path, pattern) or any(fnmatch.fnmatch(p, pattern) for p in rel_path.split(os.sep)):
            return True
    return False

if not os.path.exists(dst):
    os.makedirs(dst)

for root, dirs, files in os.walk(src):
    # Filter directories in-place to prevent walking into them
    dirs[:] = [d for d in dirs if not should_ignore(os.path.join(root, d), src)]
    
    # Calculate destination root
    rel_root = os.path.relpath(root, src)
    dest_root = os.path.join(dst, rel_root)
    
    if not os.path.exists(dest_root):
        os.makedirs(dest_root)
        
    for file in files:
        src_file = os.path.join(root, file)
        if not should_ignore(src_file, src):
            shutil.copy2(src_file, dest_root)
            print(f"Copied: {os.path.join(rel_root, file)}")

print("Sync completed!")
