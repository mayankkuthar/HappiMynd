import re
import os

files = [
    "node_modules/expo/android/build.gradle",
    "node_modules/expo-cellular/android/build.gradle",
    "node_modules/expo-constants/android/build.gradle",
    "node_modules/expo-document-picker/android/build.gradle",
    "node_modules/expo-file-system/android/build.gradle",
    "node_modules/expo-firebase-analytics/android/build.gradle",
    "node_modules/expo-firebase-core/android/build.gradle",
    "node_modules/expo-modules-core/android/build.gradle",
    "node_modules/expo-network/android/build.gradle",
    "node_modules/expo-splash-screen/android/build.gradle",
]

def remove_block(content, keyword):
    """Remove a top-level Groovy block starting with `keyword {` and its contents."""
    result = []
    lines = content.split('\n')
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        # Match lines like: uploadArchives {  OR  configurations {  etc.
        if re.match(r'^' + re.escape(keyword) + r'\s*\{', stripped):
            depth = stripped.count('{') - stripped.count('}')
            i += 1
            while i < len(lines) and depth > 0:
                depth += lines[i].count('{') - lines[i].count('}')
                i += 1
        else:
            result.append(line)
            i += 1
    return '\n'.join(result)

def remove_task_block(content, task_name):
    """Remove a Gradle task definition: task <name>(type: ...) { ... }"""
    result = []
    lines = content.split('\n')
    i = 0
    while i < len(lines):
        stripped = lines[i].strip()
        if re.match(r'^task\s+' + re.escape(task_name) + r'\b', stripped):
            depth = stripped.count('{') - stripped.count('}')
            if depth > 0:
                i += 1
                while i < len(lines) and depth > 0:
                    depth += lines[i].count('{') - lines[i].count('}')
                    i += 1
            else:
                i += 1
        else:
            result.append(lines[i])
            i += 1
    return '\n'.join(result)

def remove_line_pattern(content, pattern):
    """Remove lines matching a regex pattern."""
    return '\n'.join(
        line for line in content.split('\n')
        if not re.search(pattern, line)
    )

def remove_comment_line(content, keyword):
    """Remove single-line comments that contain a keyword."""
    return '\n'.join(
        line for line in content.split('\n')
        if not (line.strip().startswith('//') and keyword.lower() in line.lower())
    )

def patch_file(filepath):
    if not os.path.exists(filepath):
        print(f"  SKIP (not found): {filepath}")
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        original = f.read()

    content = original

    # 1. Remove: apply plugin: 'maven'
    content = remove_line_pattern(content, r"apply plugin:\s*['\"]maven['\"]")

    # 2. Remove comment lines related to maven publishing
    content = remove_comment_line(content, 'upload android library')
    content = remove_comment_line(content, 'creating sources')
    content = remove_comment_line(content, 'androidSources and javadoc')
    content = remove_comment_line(content, 'put the androidSources')

    # 3. Remove: configurations { deployerJars }
    content = remove_block(content, 'configurations')

    # 4. Remove: task androidSourcesJar(type: Jar) { ... }
    content = remove_task_block(content, 'androidSourcesJar')

    # 5. Remove: artifacts { archives androidSourcesJar }
    content = remove_block(content, 'artifacts')

    # 6. Remove: uploadArchives { ... }
    content = remove_block(content, 'uploadArchives')

    # 7. Collapse more than 2 consecutive blank lines into 1
    content = re.sub(r'\n{3,}', '\n\n', content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  PATCHED: {filepath}")
    else:
        print(f"  UNCHANGED: {filepath}")

print("Patching Expo module build.gradle files for Gradle 7.x compatibility...\n")
for f in files:
    patch_file(f)
print("\nAll done!")
