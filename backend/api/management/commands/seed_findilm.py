from django.core.management.base import BaseCommand

from api.seed import ensure_seed_data


class Command(BaseCommand):
    help = "Seed baseline FindIlm backend data for courses, community, resources, and audio."

    def handle(self, *args, **options):
        ensure_seed_data()
        self.stdout.write(self.style.SUCCESS("FindIlm seed data is ready."))
