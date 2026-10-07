from decimal import Decimal

from .models import MenuItem

MENU = [
    (1, "Iced Matcha", Decimal("6.00"), True),
    (2, "Latte", Decimal("5.00"), True),
    (3, "Americano", Decimal("4.00"), True),
    (4, "Chai Latte", Decimal("5.50"), True),
]


def seed_menu():
    for pk, name, price, available in MENU:
        MenuItem.objects.update_or_create(
            pk=pk,
            defaults={
                "name": name,
                "price": price,
                "available": available,
            },
        )
