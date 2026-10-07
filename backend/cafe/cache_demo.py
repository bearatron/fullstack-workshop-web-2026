"""Instructor demo only. The workshop views do not import this file.

Call get_cached_menu() twice from a Django shell. The first call prints
CACHE MISS. A second call within a few seconds prints CACHE HIT.
No Redis or other cache server is required.
"""

import time

from .seed import MENU

_cache = {"expires_at": 0, "value": None}
TTL_SECONDS = 5


def get_cached_menu():
    now = time.time()
    if _cache["value"] is not None and now < _cache["expires_at"]:
        print("CACHE HIT")
        return _cache["value"]

    print("CACHE MISS")
    value = [
        {
            "id": pk,
            "name": name,
            "price": f"{price:.2f}",
            "available": available,
        }
        for pk, name, price, available in MENU
    ]
    _cache["value"] = value
    _cache["expires_at"] = now + TTL_SECONDS
    return value
