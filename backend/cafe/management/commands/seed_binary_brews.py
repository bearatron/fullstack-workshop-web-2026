from django.core.management.base import BaseCommand

from cafe.seed import seed_menu


class Command(BaseCommand):
    help = "Reset the Binary Brews menu to the four starter drinks."

    def handle(self, *args, **options):
        seed_menu()
        self.stdout.write(self.style.SUCCESS("Seeded Binary Brews menu."))
