from django.db import migrations


def seed_binary_brews(apps, schema_editor):
    from cafe.seed import seed_menu

    seed_menu()


class Migration(migrations.Migration):
    dependencies = [
        ("cafe", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_binary_brews, migrations.RunPython.noop),
    ]
