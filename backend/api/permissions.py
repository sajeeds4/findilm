from rest_framework.permissions import BasePermission


class IsAdminUserProfile(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        profile = getattr(user, "profile", None)
        return bool(user.is_staff or user.is_superuser or (profile and profile.role == "admin"))
