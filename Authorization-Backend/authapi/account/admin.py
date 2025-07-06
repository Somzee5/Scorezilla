from django.contrib import admin

from account.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin


class UserModelAdmin(BaseUserAdmin):
    # Display fields in the user list view
    list_display = ["id", "email", "firstname", "lastname", "role", "team", "player_id", "points", "tc", "is_admin", "is_active", "created_at", "updated_at"]
    list_filter = ["is_admin", "role", "is_active"]

    # Fieldsets for viewing and editing a user
    fieldsets = [
        ('User Credentials', {"fields": ["email", "password"]}),
        ("Personal Info", {"fields": ["firstname", "lastname", "role", "team", "player_id", "points", "tc"]}),  # Added 'team'
        ("Permissions", {"fields": ["is_admin", "is_active"]}),
        ("Timestamps", {"fields": ["created_at", "updated_at"]}),
    ]

    # Fieldsets for adding a new user
    add_fieldsets = [
        (
            None,
            {
                "classes": ["wide"],
                "fields": ["email", "firstname", "lastname", "role", "team", "player_id", "points", "tc", "password1", "password2"],  # Added 'team'
            },
        ),
    ]

    # Search and ordering settings
    search_fields = ["email", "firstname", "lastname", "role", "team"]  # Added 'team' to search
    ordering = ["email"]

    filter_horizontal = []

admin.site.register(User, UserModelAdmin)


from .models import Team
admin.site.register(Team)


from .models import Tournament
admin.site.register(Tournament)