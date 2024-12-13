from app.models import *
from rest_framework import serializers

class ProducerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producer
        fields = '__all__'

class ActorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actor
        fields = '__all__'

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = '__all__'

class MovieSerializer(serializers.ModelSerializer):
    producers = ProducerSerializer(many=True, read_only=True)  # Nested serialization for producers
    actors = ActorSerializer(many=True, read_only=True)  # Nested serialization for actors
    genres = GenreSerializer(many=True, read_only=True)  # Nested serialization for genres

    class Meta:
        model = Movie
        fields = '__all__'

class UserProfileSerializer(serializers.ModelSerializer):
    liked_movies = MovieSerializer(many=True, read_only=True)  # Nested serialization for liked movies

    class Meta:
        model = UserProfile
        fields = '__all__'
