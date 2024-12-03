from django.shortcuts import redirect

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
