from django.apps import AppConfig
from django.db.models.signals import post_migrate

class AppConfig(AppConfig):
    name = 'app'

    def ready(self):
        post_migrate.connect(self.create_groups_and_permissions)
        post_migrate.connect(self.create_users)



    def create_groups_and_permissions(self, sender, **kwargs):
        from django.contrib.auth.models import Group, Permission
        # Define the group names
        group_permissions = {
            'Movie Manager': ['add_movie', 'change_movie', 'delete_movie', 'add_genre', 'change_genre', 'delete_genre'],
            'Crew Manager': ['add_actor', 'change_actor', 'delete_actor', 'add_producer', 'change_producer', 'delete_producer'],
            'User': [],
        }

        for group_name, permissions in group_permissions.items():
            # Create the group if it doesn't exist
            group, created = Group.objects.get_or_create(name=group_name)

            for perm_code in permissions:
                # Fetch the permission by its codename
                try:
                    permission = Permission.objects.get(codename=perm_code)
                    group.permissions.add(permission)
                except Permission.DoesNotExist:
                    pass

    def create_users(self, sender, **kwargs):
        from django.contrib.auth.models import User
        from django.contrib.auth.models import Group

        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin')

        if not User.objects.filter(username='movie_manager').exists():
            User.objects.create_user('movie_manager', 'movie@manager.com', 'movie_manager')
            movie_manager = User.objects.get(username='movie_manager')
            movie_manager.groups.add(Group.objects.get(name='Movie Manager'))

        if not User.objects.filter(username='crew_manager').exists():
            User.objects.create_user('crew_manager', 'crew@manager.com', 'crew_manager')
            crew_manager = User.objects.get(username='crew_manager')
            crew_manager.groups.add(Group.objects.get(name='Crew Manager'))

        if not User.objects.filter(username='user').exists():
            User.objects.create_user('user', 'user@example.com', 'user')
            user = User.objects.get(username='user')
            user.groups.add(Group.objects.get(name='User'))

