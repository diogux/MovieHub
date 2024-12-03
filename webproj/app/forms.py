from django import forms
from .models import *

from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User, Group
from django.contrib.auth.forms import AuthenticationForm
from django.core.exceptions import ValidationError
from django.utils import timezone


from django import forms
from .models import Movie


'''MOVIE FORMS'''

class MovieInsertOrUpdateForm(forms.ModelForm):
    class Meta:
        model = Movie
        fields = ['title', 'duration', 'producers', 'actors', 'release_date', 'genres', 'synopsis', 'poster']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter movie title'}),
            'duration': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Enter duration in minutes'}),
            'producers': forms.CheckboxSelectMultiple(attrs={'class': 'form-check-input'}),
            'actors': forms.CheckboxSelectMultiple(attrs={'class': 'form-check-input'}),
            'release_date': forms.DateInput(attrs={'type': 'date', 'class': 'form-control'}),
            'genres': forms.CheckboxSelectMultiple(attrs={'class': 'form-check-input'}),
            'synopsis': forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'Enter movie synopsis'}),
            'poster': forms.ClearableFileInput(attrs={'class': 'form-control form-control-lg', 'type': 'file'}),
        }

    def clean_duration(self):
        duration = self.cleaned_data.get('duration')
        if duration is not None and duration <= 0:
            raise forms.ValidationError("Duration must be a positive number of minutes.")
        return duration
    
class MovieQueryForm(forms.Form):
    query = forms.CharField(max_length=100, label="Title:", required=False, widget=forms.TextInput(attrs={'class': 'form-control'}))


'''ACTOR FORMS'''

class ActorInsertOrUpdateForm(forms.ModelForm):
    class Meta:
        model = Actor
        fields = ['name', 'date_of_birth', 'place_of_birth', 'date_of_death', 'biography', 'picture']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'required': 'required'}),
            'date_of_birth': forms.DateInput(attrs={'class': 'form-control', 'type': 'date', 'required': 'required'}),
            'place_of_birth': forms.TextInput(attrs={'class': 'form-control', 'required': 'required'}),
            'date_of_death': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'biography': forms.Textarea(attrs={'class': 'form-control'}),
            'picture': forms.ClearableFileInput(attrs={'class': 'form-control form-control-lg', 'type': 'file'}),
        }

class ActorQueryForm(forms.Form):
    query = forms.CharField(max_length=100, label="Name:", required=False, widget=forms.TextInput(attrs={'class': 'form-control'}))

'''PRODUCER FORMS'''

class ProducerInsertOrUpdateForm(forms.ModelForm):
    class Meta:
        model = Producer
        fields = ['name', 'date_of_birth', 'date_of_death', 'biography', 'picture']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control', 
                'placeholder': 'Enter producer name'
            }),
            'date_of_birth': forms.DateInput(attrs={
                'class': 'form-control', 
                'type': 'date', 
                'placeholder': 'Enter producer date of birth'
            }),
            'date_of_death': forms.DateInput(attrs={
                'class': 'form-control', 
                'type': 'date',
                'placeholder': 'Enter producer date of death (if applicable)'
            }),
            'biography': forms.Textarea(attrs={
                'class': 'form-control',
                'placeholder': 'Enter producer biography'
            }),
            'picture': forms.ClearableFileInput(attrs={'class': 'form-control form-control-lg', 'type': 'file'})
        }

    def clean_date_of_death(self):
        date_of_death = self.cleaned_data.get('date_of_death')
        if date_of_death and date_of_death > timezone.now().date():
            raise ValidationError("Date of death cannot be in the future.")
        return date_of_death
    
    def clean_date_of_birth(self):
        date_of_birth = self.cleaned_data.get('date_of_birth')
        if date_of_birth and date_of_birth > timezone.now().date():
            raise ValidationError("Date of birth cannot be in the future.")
        
        return date_of_birth
    
class ProducerQueryForm(forms.Form):
    query = forms.CharField(max_length=100, label="Name:", required=False, widget=forms.TextInput(attrs={'class': 'form-control'}))

'''GENRE FORMS'''

class GenreInsertForm(forms.ModelForm):
    class Meta:
        model = Genre
        fields = ['name']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter genre name'}),
        }


'''LOG IN & SIGN UP FORMS'''

class SignUpForm(UserCreationForm):

    group = forms.ModelChoiceField(
        queryset=Group.objects.all(),
        empty_label="Select a group",
        required=True,
        widget=forms.Select(attrs={
            'class': 'form-select shadow-none',
            'style': 'color: #495057'
        })
    )
    username = forms.CharField(
        max_length=150,
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'form-control shadow-none',
            'placeholder': 'Enter your username'
        })
    )
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={
            'class': 'form-control shadow-none',
            'placeholder': 'Enter your email'
        })
    )
    password1 = forms.CharField(
        label='Password',
        widget=forms.PasswordInput(attrs={
            'class': 'form-control shadow-none',
            'placeholder': 'Enter your password'
        })
    )
    password2 = forms.CharField(
        label='Confirm Password',
        widget=forms.PasswordInput(attrs={
            'class': 'form-control shadow-none',
            'placeholder': 'Confirm your password'
        })
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']

    def clean(self):
        cleaned_data = super().clean()
        password1 = cleaned_data.get("password1")
        password2 = cleaned_data.get("password2")

        if password1 and password2 and password1 != password2:
            self.add_error('password2', "Passwords do not match.")
        return cleaned_data


class CustomLoginForm(AuthenticationForm):
    username = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control shadow-none',
            'placeholder': 'Enter your username'
        })
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'form-control shadow-none',
            'placeholder': 'Enter your password'
        })
    )

