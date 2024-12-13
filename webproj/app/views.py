from django.shortcuts import render
from datetime import datetime
from app.models import *
from django.http import HttpResponse
from app.forms import *
from django.contrib import messages
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required, permission_required, user_passes_test
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .decorators import permissions_required

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from app.serializers import *

# Create your views here.

def home(request):
    tparams = {
        'title': 'Home Page',
        'year': datetime.now().year,
    }
    return render(request, 'index.html', tparams)



"""
MOVIE OBJECT
"""


def movies(request):
    movies = Movie.objects.all()
    liked_movies = None
    can_add_movies = request.user.has_perm('app.add_movie')  or request.user.is_superuser
    if request.user.is_authenticated:
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        liked_movies = profile.liked_movies.all()  
    else:
        liked_movies = Movie.objects.filter(id__in=request.session.get('liked_movies', []))

    tparams = {
        'title': 'Movies',
        'movies': movies,
        'liked_movies': liked_movies,
        'can_add_movies': can_add_movies,
        'form': MovieQueryForm()
    }

    if request.method == 'POST':
        form = MovieQueryForm(request.POST)
        if form.is_valid():
            query = form.cleaned_data['query']
            movies = Movie.objects.filter(title__icontains=query)
            form = MovieQueryForm()
            tparams['movies'] = movies
            tparams['form'] = form
            return render(request, 'movies.html', tparams)


    return render(request, 'movies.html', tparams)


def movie_details(request, movie_id):
    movie = Movie.objects.get(id=movie_id)
    tparams = {
        'title': 'Movie Details',
        'movie': movie,
    }
    return render(request, 'movie_details.html', tparams)

@login_required(login_url='/login/')
@permissions_required(['app.add_movie'], 'movies')
def add_movie(request):
    if request.method == 'POST':
        form = MovieInsertOrUpdateForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            message = 'Movie ' + form.cleaned_data['title'] + ' added successfully!'
            messages.success(request, message)
            return redirect('movies')
    else:
        form = MovieInsertOrUpdateForm()
    tparams = {
        'title': 'Add Movie',
        'form': form,
    }
    return render(request, 'addmovie.html', tparams)

@login_required(login_url='/login/')
@permissions_required(['app.delete_movie'], 'movies')
def delete_movie(request, movie_id):
    movie = get_object_or_404(Movie, id=movie_id)
    movie.delete()
    messages.warning(request, 'Movie deleted successfully!')
    return redirect('movies')  

@login_required(login_url='/login/')
@permissions_required(['app.change_movie'], 'movies')
def edit_movie(request, movie_id):
    movie = get_object_or_404(Movie, id=movie_id)
    if request.method == 'POST':
        form = MovieInsertOrUpdateForm(request.POST, request.FILES, instance=movie) 
        if form.is_valid():
            message = f"Movie '{movie.title}' edited successfully!"
            messages.success(request, message)
            form.save()
            return redirect('movies')  
    else:
        form = MovieInsertOrUpdateForm(instance=movie)
    
    return render(request, 'editmovie.html', {'form': form, 'movie': movie})


def toggle_like(request, movie_id):
    movie = get_object_or_404(Movie, id=movie_id)

    # If not logged in, we use the session to store the liked movies

    if not request.user.is_authenticated:
        liked_movies = request.session.get('liked_movies', [])
        if movie.id in liked_movies:
            liked_movies.remove(movie.id)
        else:
            liked_movies.append(movie.id)
        request.session['liked_movies'] = liked_movies
    else:
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        
        if movie in profile.liked_movies.all():
            profile.liked_movies.remove(movie)
        else:
            profile.liked_movies.add(movie)

    this_page = request.META.get('HTTP_REFERER')
    return redirect(this_page)
    
def favorites(request):
    if request.user.is_authenticated:
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        liked_movies = profile.liked_movies.all()
    else:
        liked_movies = Movie.objects.filter(id__in=request.session.get('liked_movies', []))
    return render(request, 'favorites.html', {'liked_movies': liked_movies})


"""
ACTOR OBJECT
"""



@api_view(['GET'])
def actors(request):
    """
    Handles GET requests to retrieve all actors.
    """
    actors = Actor.objects.all()  # Fetch all actors
    serializer = ActorSerializer(actors, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def create_actor(request):
    """
    Handles POST requests to create a new actor.
    """
    serializer = ActorSerializer(data=request.data)  # Validate input data
    if serializer.is_valid():
        serializer.save()  # Save actor if valid
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@login_required(login_url='/login/')
@permissions_required(['app.add_actor'], 'actors')
def actor_update_insert(request):
    
    action_title = 'Add New Actor'
    
    if request.method == 'POST':
        form = ActorInsertOrUpdateForm(request.POST, request.FILES)
        
        if form.is_valid():
            actor = form.save()
            message = f"Actor '{actor.name}' added successfully!"
            messages.success(request, message)
            return redirect('actors')
        else:
            messages.error(request, "Please correct the errors below.")
    else:
        form = ActorInsertOrUpdateForm()
    
    tparams = {
        'action_title': action_title,
        'form': form,
    }
    return render(request, 'actor_update_insert.html', tparams)


# def actors(request):
#     actors = Actor.objects.all()
#     form = ActorQueryForm()
#     tparams = {
#         'title': 'Actors',
#         'actors': actors,
#         'form': form
#     }

#     if request.method == 'POST':
#         form = ActorQueryForm(request.POST)
#         if form.is_valid():
#             query = form.cleaned_data['query']
#             actors = Actor.objects.filter(name__icontains=query)
#             form = ActorQueryForm() # Reset form
#             # Replace the actors and the form
#             tparams['actors'] = actors
#             tparams['form'] = form
#             return render(request, 'actors.html', tparams)

#     return render(request, 'actors.html', tparams)

def actor_details(request, id):
    actor = Actor.objects.get(id=id)
    tparams = {
        'title': 'Actor Details',
        'actor': actor,
        'movies': actor.movies.all()
    }
    return render(request, 'actor_details.html', tparams)


@login_required(login_url='/login/')
@permissions_required(['app.delete_actor'], 'actors')
def delete_actor(request, id):
    actor = get_object_or_404(Actor, id=id)
    actor.delete()
    return redirect('actors') 


@login_required(login_url='/login/')
@permissions_required(['app.change_actor'], 'actors')
def edit_actor(request, id):
    actor = get_object_or_404(Actor, id=id)
    if request.method == 'POST':
        form = ActorInsertOrUpdateForm(request.POST, request.FILES, instance=actor)
        if form.is_valid():
            message = f"Actor '{actor.name}' edited successfully!"
            messages.success(request, message)
            form.save()
            return redirect('actors')
    else:
        form = ActorInsertOrUpdateForm(instance=actor)
    title = 'Edit Actor - ' + actor.name
    
    return render(request, 'actor_update_insert.html', {'form': form, 'actor': actor, 'action_title': title})

"""
PRODUCER OBJECT
"""

# def producers(request):
#     producers = Producer.objects.all()
#     form = ProducerQueryForm()
#     tparams = {
#         'title' : 'Producers',
#         'producers': producers,
#         'form': form
#     }
#     if request.method == 'POST':
#         form = ProducerQueryForm(request.POST)
#         if form.is_valid():
#             query = form.cleaned_data['query']
#             producers = Producer.objects.filter(name__icontains=query)
#             form = ProducerQueryForm()
#             tparams['producers'] = producers
#             tparams['form'] = form
#             return render(request, 'producers.html', tparams)
    
#     return render(request, 'producers.html', tparams)

@api_view(['GET'])
def producers(request):
    """
    Handles GET requests to retrieve all producers.
    """
    producers = Producer.objects.all()
    serializer = ProducerSerializer(producers, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def create_producer(request):
    """
    Handles POST requests to create a new producer.
    """
    serializer = ProducerSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@login_required(login_url='/login/')
@permissions_required(['app.add_producer'], 'producers')
def producer_add(request):
    if request.method == 'POST':
        form = ProducerInsertOrUpdateForm(request.POST, request.FILES)
        if form.is_valid():
            name = form.cleaned_data['name']
            date_of_birth = form.cleaned_data['date_of_birth']
            date_of_death = form.cleaned_data['date_of_death']
            biography = form.cleaned_data['biography']
            picture = form.cleaned_data['picture']  
            producer = Producer(name=name, date_of_birth=date_of_birth, date_of_death=date_of_death, biography=biography, picture=picture)
            producer.save()
            message = 'Producer ' + name + ' added successfully!'
            messages.success(request, message)
            return redirect('producers')
    else:
        form = ProducerInsertOrUpdateForm()
    tparams = {
        'title': 'Add Producer',
        'form': form,
    }
    return render(request, 'producer_add.html', tparams)



def producer_details(request, id):
    producer = Producer.objects.get(id=id)
    tparams = {
        'title': 'Producer Details',
        'producer': producer,
    }
    return render(request, 'producer_details.html', tparams)


@login_required(login_url='/login/')
@permissions_required(['app.delete_producer'], 'producers')
def delete_producer(request, id):
    producer = get_object_or_404(Producer, id=id)
    producer.delete()
    return redirect('producers')


@login_required(login_url='/login/')
@permissions_required(['app.change_producer'], 'producers')
def edit_producer(request, id):
    producer = get_object_or_404(Producer, id=id)
    if request.method == 'POST':
        form = ProducerInsertOrUpdateForm(request.POST, request.FILES, instance=producer)
        if form.is_valid():
            message = f"Producer '{producer.name}' edited successfully!"
            messages.success(request, message)
            form.save()
            return redirect('producers')
    else:
        form = ProducerInsertOrUpdateForm(instance=producer)
    
    return render(request, 'editproducer.html', {'form': form, 'producer': producer})

"""
GENRE OBJECT
"""
def genres(request):
    genres = Genre.objects.all()
    tparams = {
        'title': 'Genres',
        'genres': genres,
    }
    return render(request, 'genres.html', tparams)


@login_required(login_url='/login/')
@permissions_required(['app.add_genre'], 'genres')
def add_genre(request):
    if request.method == 'POST':
        form = GenreInsertForm(request.POST)
        if form.is_valid():
            form.save()
            message = 'Genre ' + form.cleaned_data['name'] + ' added successfully!'
            messages.success(request, message)
            return redirect('genres')
    else:
        form = GenreInsertForm()
    tparams = {
        'title': 'Add Genre',
        'form': form,
    }
    return render(request, 'add_genre.html', tparams)


@login_required(login_url='/login/')
@permissions_required(['app.delete_genre'], 'genres')
def delete_genre(request, id):
    genre = get_object_or_404(Genre, id=id)
    genre.delete()
    return redirect('genres')

"""
AUTHENTICATION
"""

def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()  
            group = form.cleaned_data['group']
            group.user_set.add(user)
            login(request, user)  
            return redirect('home')  
    else:
        form = SignUpForm()  

    return render(request, 'signup.html', {'form': form})

def login_view(request):
    next_url = request.GET.get('next', request.POST.get('next', 'home'))
    if request.method == 'POST':
        form = CustomLoginForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect(next_url)  # Redirect to the next URL
    else:
        form = CustomLoginForm()

    return render(request, 'login.html', {'form': form, 'next': next_url})


def users(request):
    users = User.objects.all()
    tparams = {
        'title': 'Users',
        'users': users,
    }
    return render(request, 'users.html', tparams)

def user_liked_movies(request, id):
    user = User.objects.get(id=id)
    profile, _ = UserProfile.objects.get_or_create(user=user)
    liked_movies = profile.liked_movies.all()
    tparams = {
        'title': 'User Liked Movies',
        'user_': user,
        'liked_movies': liked_movies,
    }
    return render(request, 'user_liked_movies.html', tparams)


@login_required(login_url='/login/')
@permissions_required(['app.delete_user'], 'users')
def delete_user(request, id):
    user = get_object_or_404(User, id=id)
    user.delete()
    return redirect('users')