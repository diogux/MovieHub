from django.shortcuts import render
from datetime import datetime, timedelta
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
from .decorators import permissions_required, permission_required, user_required, verify_user
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from app.serializers import *
import jwt


"""
MOVIE OBJECT
"""

@api_view(['GET'])
def movies(request):
    """ 
    Handles GET requests to retrieve all movies.
    """
    movies = Movie.objects.all()  # Fetch all movies
    serializer = MovieSerializer(movies, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK) 


@api_view(['GET'])
def movie_details(request, movie_id):
    """
    Handles GET requests to retrieve details of a specific movie.
    """
    try:
        movie = Movie.objects.get(id=movie_id)
        serializer = MovieSerializer(movie)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Movie.DoesNotExist:
        return Response({"error": "Movie not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_required(['app.add_movie'])
def add_movie(request):
    """
    Handles POST requests to create a new movie.
    """
    data = request.data.copy()
    actors_data = data.pop('actors', [])
    producers_data = data.pop('producers', [])
    genres_data = data.pop('genres', [])

    serializer = MovieSerializer(data=data)
    if serializer.is_valid():
        movie = serializer.save()

        if actors_data:
            actors_data = list_json_parsing(actors_data)
            print(actors_data)
            actors = Actor.objects.filter(id__in=actors_data)
            movie.actors.set(actors)

        if producers_data:
            print(producers_data)
            producers_data = list_json_parsing(producers_data)
            producers = Producer.objects.filter(id__in=producers_data)
            movie.producers.set(producers)

        if genres_data:
            print(genres_data)
            genres_data = list_json_parsing(genres_data)
            genres = Genre.objects.filter(id__in=genres_data)
            movie.genres.set(genres)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_required(['app.delete_movie'])
def delete_movie(request, movie_id):
    movie = Movie.objects.get(id=movie_id)
    movie.delete()
    return Response(status=status.HTTP_200_OK)



@api_view(['PUT'])
@permission_required(['app.change_movie'])
def edit_movie(request, movie_id):
    try:
        movie = Movie.objects.get(id=movie_id)
    except Movie.DoesNotExist:
        return Response({"error": "Movie not found"}, status=status.HTTP_404_NOT_FOUND)

    # Atualiza os campos simples (não-relacionais)
    data = request.data.copy()
    actors_data = data.pop('actors', [])
    producers_data = data.pop('producers', [])
    genres_data = data.pop('genres', [])

    serializer = MovieSerializer(instance=movie, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()

        # Atualiza os campos many-to-many
        if actors_data:
            actors_data = list_json_parsing(actors_data)
            
            
            actors = Actor.objects.filter(id__in=actors_data)
            movie.actors.set(actors)

        if producers_data:
            producers_data = list_json_parsing(producers_data)
            producers = Producer.objects.filter(id__in=producers_data)
            movie.producers.set(producers)

        if genres_data:
            genres_data = list_json_parsing(genres_data)
            genres = Genre.objects.filter(id__in=genres_data)
            movie.genres.set(genres)

        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
@user_required()
def toggle_favorite(request):
    id = request.data.get('id')
    user = verify_user(request)
    movie = get_object_or_404(Movie, id=id)
    profile, created = UserProfile.objects.get_or_create(user=user)
    if movie not in profile.liked_movies.all():
        profile.liked_movies.add(movie)
        return Response({'message': 'Movie favorited successfully!'}, status=status.HTTP_200_OK)
    else:
        profile.liked_movies.remove(movie)
        return Response({'message': 'Movie unfavorited successfully!'}, status=status.HTTP_200_OK)



@api_view(['GET'])
@user_required()
def get_favorites_movies(request):
    user = verify_user(request)
    profile, created = UserProfile.objects.get_or_create(user=user)
    liked_movies = profile.liked_movies.all()
    liked_movies_ids = [movie.id for movie in liked_movies]
    return Response({'liked_movies': liked_movies_ids}, status=status.HTTP_200_OK)

    

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
@permission_required(['app.add_actor'])
def create_actor(request):
    """
    Handles POST requests to create a new actor.
    """
    serializer = ActorSerializer(data=request.data)  # Validate input data
    if serializer.is_valid():
        serializer.save()  # Save actor if valid
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def actor_details(request, actor_id):
    try:
        actor = Actor.objects.get(id=actor_id)
        serializer = ActorSerializer(actor)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Actor.DoesNotExist:
        return Response({"error": "Actor not found"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def actor_movies(request, actor_id):
    try:
        actor = Actor.objects.get(id=actor_id)
        movies = actor.movies.all()
        serializer = MovieSerializer(movies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Actor.DoesNotExist:
        return Response({"error": "Actor not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@permission_required(['app.change_actor'])
def edit_actor(request, actor_id):
    actor = get_object_or_404(Actor, id=actor_id)

    data = request.data.copy()
    picture = request.FILES.get('picture') 

    serializer = ActorSerializer(instance=actor, data=data, partial=True)

    if serializer.is_valid():
        if picture:
            actor.picture = picture
            actor.save()

        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
@api_view(['DELETE'])
@permission_required(['app.delete_actor'])
def delete_actor(request, actor_id):
    actor = Actor.objects.get(id=actor_id)
    actor.delete()
    
    return Response(status=status.HTTP_200_OK)


"""
PRODUCER OBJECT
"""

@api_view(['GET'])
def producers(request):
    """
    Handles GET requests to retrieve all producers.
    """
    producers = Producer.objects.all()
    serializer = ProducerSerializer(producers, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_required(['app.add_producer'])
def create_producer(request):
    """
    Handles POST requests to create a new producer.
    """
    serializer = ProducerSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def producer_details(request, producer_id):
    try:
        producer = Producer.objects.get(id=producer_id)
        serializer = ProducerSerializer(producer)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Producer.DoesNotExist:
        return Response({"error": "Producer not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def producer_movies(request, producer_id):
    try:
        producer = Producer.objects.get(id=producer_id)
        movies = producer.movies.all()
        serializer = MovieSerializer(movies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Producer.DoesNotExist:
        return Response({"error": "Producer not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_required(['app.delete_producer'])
def delete_producer(request, producer_id):
    producer = Producer.objects.get(id=producer_id)
    producer.delete()
    
    return Response(status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_required(['app.change_producer'])
def edit_producer(request, producer_id):
    producer = get_object_or_404(Producer, id=producer_id)

    data = request.data.copy()
    logo = request.FILES.get('logo')  # Captura o ficheiro enviado (se existir)

    # Atualiza o produtor
    serializer = ProducerSerializer(instance=producer, data=data, partial=True)

    if serializer.is_valid():

        if logo:
            producer.logo = logo
            producer.save()

        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
"""
GENRE OBJECT
"""

@api_view(['GET'])
def genres(request):
    """
    Handles GET requests to retrieve all genres.
    """
    genres = Genre.objects.all()  # Fetch all genres
    serializer = GenreSerializer(genres, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_required(['app.add_genre'])
def create_genre(request):
    """
    Handles POST requests to create a new genre.
    """
    serializer = GenreSerializer(data=request.data)  # Validate input data
    if serializer.is_valid():
        serializer.save()  # Save genre if valid
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

"""
AUTHENTICATION
"""

@api_view(['POST'])
def register(request):
    """
    Handles POST requests to register a new user.
    """
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  


@api_view(['POST'])
def login(request):
    """
    Handles POST requests to login a user.
    """
    username = request.data.get('username')
    password = request.data.get('password')

    user = User.objects.filter(username=username).first()

    if user is None:
        return Response({'error': 'Invalid username'}, status=status.HTTP_400_BAD_REQUEST)

    if not user.check_password(password):
        return Response({'error': 'Invalid password'}, status=status.HTTP_400_BAD_REQUEST)

    payload = {
        'id': user.id,
        'exp': datetime.now() + timedelta(days=1),
        'iat': datetime.now()
    }

    token = jwt.encode(payload, 'secret', algorithm='HS256')

    response = Response()

    response.set_cookie(key='jwt', value=token, httponly=False, samesite='Lax',  secure=False)
    response.data = {
        'message': 'Login successful',
        'jwt': token
    }

    return response


@api_view(['GET'])
def user(request):
    token = request.COOKIES.get('jwt')

    if not token:
        return Response({'error': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        # Decodificar o token JWT
        payload = jwt.decode(token, 'secret', algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return Response({'error': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)

    # Buscar o usuário com base no ID do payload do JWT
    user = User.objects.filter(id=payload['id']).first()

    if not user:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    # Serializar o usuário, incluindo seus grupos e permissões
    serializer = UserSerializer(user)

    return Response(serializer.data)

@api_view(['POST'])
def logout(request):
    response = Response()
    response.delete_cookie('jwt')
    response.data = {
        'message': 'Logout successful'
    }
    return response


# Help func

def list_json_parsing(json_string):
    if (isinstance(json_string, list) and len(json_string) == 1 
            and isinstance(json_string[0], str) 
            and json_string[0].startswith('[') and json_string[0].endswith(']')):
                return eval(json_string[0])
    return json_string