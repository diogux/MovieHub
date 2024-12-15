from django.shortcuts import redirect
from functools import wraps
from rest_framework.response import Response
from rest_framework import status
import jwt
from django.contrib.auth.models import User

def permissions_required(permissions, redirect_url):
    """
    Custom decorator to check multiple permissions.
    Redirects to 'redirect_url' if any permission is missing.
    """
    def decorator(view_func):
        def _wrapped_view(request, *args, **kwargs):
            if all(request.user.has_perm(perm) for perm in permissions):
                return view_func(request, *args, **kwargs)
            else:
                return redirect(redirect_url)
        return _wrapped_view
    return decorator




def permission_required(permissions):
    """
    A decorator to check if the user has the required permissions.
    """
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            user = verify_user(request)
            if not user or not all(user.has_perm(perm) for perm in permissions):
                return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
            return view_func(request, *args, **kwargs)
        return _wrapped_view
    return decorator

def user_required():
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            user = verify_user(request)
            if not user:
                return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
            return view_func(request, *args, **kwargs)
        return _wrapped_view
    return decorator



def verify_user(request):
    token = request.COOKIES.get('jwt')
    if not token:
        return None

    try:
        payload = jwt.decode(token, 'secret', algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return None

    return User.objects.filter(id=payload['id']).first()

