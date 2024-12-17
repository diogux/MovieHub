from app.models import *
from rest_framework import serializers
from django.contrib.auth.models import User, Group

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


class UserSerializer(serializers.ModelSerializer):
    userprofile = UserProfileSerializer(read_only=True)  # Nested serialization for user profile
    groups = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all(), many=True)  # Add groups
    group_permissions = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'userprofile', 'password', 'groups', 'group_permissions']
        extra_kwargs = {
            'password': {'write_only': True}
        }


    def get_group_permissions(self, obj):
        # Obter as permissões associadas aos grupos do usuário
        permissions = []
        for group in obj.groups.all():
            permissions.extend(group.permissions.values_list('codename', flat=True))
        return permissions
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        groups = validated_data.pop('groups', [])  # Remove groups from validated data
        instance = User(**validated_data)
        if password:
            instance.set_password(password)
        instance.save()

        # Assign user to groups
        if groups:
            instance.groups.set(groups)  # Set the groups for the user
        return instance
    

class GroupPermissionSerializer(serializers.ModelSerializer):
    permissions = serializers.StringRelatedField(many=True)

    class Meta:
        model = Group
        fields = ['name', 'permissions']

# class UserSerializer(serializers.ModelSerializer):
#     groups = GroupPermissionSerializer(many=True)

#     class Meta:
#         model = User
#         fields = ['username', 'groups']
