from django.urls import path
from account.views import UserRegistrationView, UserLoginView,  UserChangePasswordView, ForgotPasswordView, VerifyOTPView, TeamWisePlayersView, TeamLeaderView, UpdateScoreView, TopTeamsView, TeamNameView, TeamUserRegistrationView, TopPlayersView, TournamentCreateView, GameTypeView
from .views import get_current_user
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name="register"),
    path('login/', UserLoginView.as_view(), name="login"),  
    path('changepassword/', UserChangePasswordView.as_view(), name="changepassword"),
    path('me/', get_current_user, name='current_user'),

    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('team-wise-players/', TeamWisePlayersView.as_view(), name='team-wise-players'),
    path('leader-team/', TeamLeaderView.as_view(), name='leader-team'),
    path('update-team-scores/', UpdateScoreView.as_view(), name='update-team-scores'),
    path('top-teams/', TopTeamsView.as_view(), name='top-teams'),
    path('team-name/', TeamNameView.as_view(), name='team-name'),
    path('register/<str:team>/', TeamUserRegistrationView.as_view(), name='user-register'),
    path('top-players/', TopPlayersView.as_view(), name='top_players'),
    path('tournaments/', TournamentCreateView.as_view(), name='top_players'),
    path('game-types/', GameTypeView.as_view(), name='get_game_types'),
    

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)  