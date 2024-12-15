from django.db import models
from django.contrib.auth.models import User, AbstractUser

class Producer(models.Model):
    """
    A model representing a movie producer.

    Attributes:
        name (str): The name of the producer.
        date_of_birth (datetime.date): The date of birth of the producer.
    """
    name = models.CharField(max_length=255)
    date_of_birth = models.DateField(blank=True, null=True)
    date_of_death = models.DateField(blank=True, null=True)
    biography = models.TextField(blank=True, null=True)  
    picture = models.ImageField(upload_to='producer_pics/', null=True, blank=True)

    def __str__(self):
        return self.name


class Actor(models.Model):
    """
    A model representing a movie actor.

    Attributes:
        name (str): The name of the actor.
        date_of_birth (datetime.date): The date of birth of the actor.
    """
    name = models.CharField(max_length=255)
    date_of_birth = models.DateField(blank=True, null=True)
    place_of_birth = models.CharField(max_length=255, blank=True, null=True)
    date_of_death = models.DateField(blank=True, null=True)
    biography = models.TextField(blank=True, null=True)  
    picture = models.ImageField(upload_to='actor_pics/', null=True, blank=True)


    def __str__(self):
        return self.name


class Genre(models.Model):
    """
    A model representing a movie genre.

    Attributes:
        name (str): The name of the
    """
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Movie(models.Model):
    """
    A model representing a movie in the database.

    Attributes:
        title (str): The title of the movie.
        duration (datetime.timedelta): The duration of the movie.
        producers (list of Producer): The producers of the movie.
        actors (list of Actor): The actors in the movie.
        release_date (datetime.date): The release date of the movie.
        genres (list of Genre): The genres of the movie.
        synopsis (str): The synopsis of the movie.
        score (float): The average rating of the movie.
        likes (int): The number of likes of the movie.
    """
    title = models.CharField(max_length=255)
    duration = models.IntegerField(help_text="Duration in minutes")
    producers = models.ManyToManyField(Producer, related_name='movies')  # Many-to-many relationship with producers
    actors = models.ManyToManyField(Actor, related_name='movies')  # Many-to-many relationship with actors
    release_date = models.DateField()
    genres = models.ManyToManyField(Genre, related_name='movies')
    synopsis = models.TextField()
    poster = models.ImageField(upload_to='posters/', null=True, blank=True)

    def __str__(self):
        return self.title


class User(AbstractUser):
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    username = None

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    liked_movies = models.ManyToManyField(Movie, related_name='liked_by', blank=True)

    def __str__(self):
        return self.user.username