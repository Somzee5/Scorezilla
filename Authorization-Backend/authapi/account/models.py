from django.db import models

from django.contrib.auth.models import BaseUserManager,AbstractBaseUser

# Custom user manager
class UserManager(BaseUserManager):
    def create_user(self, email, firstname, lastname, tc, password=None ,password2=None):
        """
        Creates and saves a User with the given email, firstname , lastname,
        tc and password.
        """

        if not email:
            raise ValueError("User must have an email address")

        user = self.model(
            email=self.normalize_email(email),
            firstname = firstname,
            lastname = lastname,
            tc = tc,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user


    def create_superuser(self, email, firstname, lastname, tc, password=None):
        """
        Creates and saves a superuser with the given email, firstname , lastname,
        tc and password.
        """
        user = self.create_user(
            email,
            password = password,
            firstname = firstname,
            lastname = lastname,
            tc = tc,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


# custom user manager
class User(AbstractBaseUser):
    ROLE_CHOICES = [
        ('Admin', 'Admin'),
        ('Judge', 'Judge'),
        ('Leader', 'Leader'),
        ('Player', 'Player'),
    ]
 
    email = models.EmailField(verbose_name="Email", max_length=255, unique=True)
    firstname = models.CharField(max_length=30)
    lastname = models.CharField(max_length=30)
    tc = models.BooleanField()
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    role = models.CharField(max_length=6, choices=ROLE_CHOICES, default='Player')
    team = models.CharField(max_length=50, blank=True, null=True)
    player_id = models.CharField(max_length=20, blank=True, null=True)
    points = models.PositiveIntegerField(default=0)

    objects = UserManager() 

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["firstname", "lastname", "tc"]

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        return self.is_admin

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        return self.is_admin


from django.conf import settings
from django.utils import timezone


class OTP(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # Update this line
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(default=timezone.now)
    is_valid = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user.email} - {self.otp}"

 

class Team(models.Model):
    team_name = models.CharField(max_length=100, null=True)  # Example field for team name
    score = models.PositiveIntegerField(default=0)  # Existing field for score
    super_score = models.PositiveIntegerField(default=0)  # New field for super score

    def __str__(self):
        return self.team_name if self.team_name else "Unnamed Team"


from datetime import datetime

def generate_tournament_id():
    return datetime.now().strftime("%d%m%Y")

class Tournament(models.Model):
    tournament_id = models.CharField(
        max_length=50,
        unique=True,
        default=generate_tournament_id,
        blank=True,
    )
    tournament_name = models.CharField(max_length=100, default="Tournament Name")

    EVENTS = [
        ('event1', 'Event 1'),
        ('event2', 'Event 2'),
        ('event3', 'Event 3'),
        ('event4', 'Event 4'),
        ('event5', 'Event 5'),
    ]

    GAME_TYPES = [
        ('fun', 'Fun'),
        ('indoor', 'Indoor'),
        ('outdoor', 'Outdoor'),
    ]

    GAMES = {
        'fun': ['Puzzle', 'Ludo'],
        'indoor': ['Chess', 'Carrom'],
        'outdoor': ['Cricket', 'Futsal'],
    }

    events = models.JSONField(default=list)  # store selected events as JSON
    game_types = models.JSONField(default=dict)   # store games by type as JSON

    def save(self, *args, **kwargs):
        if not self.events:
            self.events = [event[0] for event in self.EVENTS]
        if not self.game_types:  # Adjusting this line
            self.game_types = self.GAMES
        super(Tournament, self).save(*args, **kwargs)


    def __str__(self):
        return self.tournament_name