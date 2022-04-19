import re


def search_regexp_str(string: str, pattern: str):
    res = re.search(rf"{pattern}", string)
    return res.group(0) if res else None
