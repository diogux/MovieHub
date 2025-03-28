"""webproj URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from app import views
from django.contrib.auth import views as auth_views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # API auth
    path('api/register', views.register, name='register'),
    path('api/login', views.login, name='login'),
    path('api/user', views.user, name='user'),
    path('api/logout', views.logout, name='logout'),


    # Favorite Movies API
    path('api/favorites/', views.get_favorites_movies, name='get_favorites_movies'),
    path('api/favorites/toggle', views.toggle_favorite, name='toggle_favorite'),

    # MOVIES
    path('api/movies/', views.movies, name='movies'),
    path('api/movies/add/', views.add_movie, name='add_movie'),
    path('api/movies/<int:movie_id>/', views.movie_details, name='movie_details'),
    path('api/movies/<int:movie_id>/edit/', views.edit_movie, name='edit_movie'),
    path('api/movies/<int:movie_id>/del/', views.delete_movie, name='delete_movie'),

    # ACTORS
    path('api/actors/', views.actors, name='actors'),
    path('api/actors/add/', views.create_actor, name='actor_add'),
    path('api/actors/<int:actor_id>/', views.actor_details, name='actor_details'),
    path('api/actors/<int:actor_id>/movies/', views.actor_movies, name='actor_movies'),
    path('api/actors/<int:actor_id>/movies/add/', views.create_actor, name='actor_movies_add'),
    path('api/actors/<int:actor_id>/del', views.delete_actor, name="delete_actor"),
    path('api/actors/<int:actor_id>/edit', views.edit_actor, name="edit_actor"),

    # PRODUCERS
    path('api/producers/', views.producers, name='producers'),
    path('api/producers/add/', views.create_producer, name='producer_add'),
    path('api/producers/<int:producer_id>/', views.producer_details, name='producer_details'),
    path('api/producers/<int:producer_id>/movies/', views.producer_movies, name='producer_movies'),
    path('api/producers/<int:producer_id>/edit/', views.edit_producer, name='edit_producer'),
    path('api/producers/<int:producer_id>/del/', views.delete_producer, name='delete_producer'),

    #GENRES
    path('api/genres/', views.genres, name='genres'),
    path('api/genres/add/', views.create_genre, name='add_genre'),

    #USERS
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)



