from django.contrib import admin
from app.models import *

# Register your models here.

# ! we need to register the models with the admin site

admin.site.register(Producer)
admin.site.register(Actor)
admin.site.register(Movie)
admin.site.register(Genre)
admin.site.register(UserProfile)