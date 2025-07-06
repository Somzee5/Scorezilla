
from django.shortcuts import render

from rest_framework.response import Response 
from rest_framework import status 
from rest_framework.views import APIView 

from account.serializers import UserRegistrationSerializer,UserChangePasswordSerializer
from account.models import User
from account.renderers import UserRenderer


from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny

from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q

# Registration view
class UserRegistrationView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request):
        data = request.data
        serializer = UserRegistrationSerializer(data=data)

        if serializer.is_valid():
            # Save the validated user data
            user = serializer.save()

            # Generate JWT tokens for the user
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            return Response({
                'message': 'Registration successful',
                'refresh': str(refresh),
                'access': access_token,
                'user_id': user.id,
                'role': user.role,  # Explicitly include role in the response
                'team': user.team,  # Include team in the response
                'data': serializer.data  # Include serialized data
            }, status=status.HTTP_201_CREATED)

        # If serializer is not valid, return errors
        return Response({
            'message': 'Registration Unsuccessful',
            'data': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

        
from .serializers import TeamUserRegistrationSerializer


class TeamUserRegistrationView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, team):
        # Log incoming data for debugging
        print("Incoming data:", request.data)

        data = request.data

        firstname = data.get('firstname')
        lastname = data.get('lastname')
        email = data.get('email')
        password = data.get('password')  
        password2 = data.get('password2')

        # Check for missing required fields
        if not firstname or not lastname or not email or not password or not password2:
            return Response({
                'message': 'Missing required fields',
                'required_fields': ['firstname', 'lastname', 'email', 'password', 'password2']
            }, status=status.HTTP_400_BAD_REQUEST)

        if password != password2:
            return Response({
                'message': 'Passwords do not match',
            }, status=status.HTTP_400_BAD_REQUEST)

        user_data = {
            'firstname': firstname,
            'lastname': lastname,
            'email': email,
            'role': data.get('role', 'Player'),
            'team': team,
        }

        user = User(**user_data)
        user.set_password(password)

        try:
            user.save()
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            return Response({
                'message': 'Registration successful',
                'refresh': str(refresh),
                'access': access_token,
                'user_id': user.id,
                'role': user.role,
                'team': user.team,
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                'message': 'Registration Unsuccessful',
                'error': str(e),
                'data': data,  # Include the data for better debugging
            }, status=status.HTTP_400_BAD_REQUEST)



class UserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Ensure 'email' is used as the username in the authentication backend
        user = authenticate(request, username=email, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_id': user.id,
                'role': user.role, 
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Invalid email or password'
            }, status=status.HTTP_400_BAD_REQUEST)




  


from rest_framework.decorators import api_view, permission_classes



 


from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


 

 


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    user_data = {
        'user_id': request.user.id,
        'email': request.user.email,
        'firstname': request.user.firstname,
        # Add other fields if needed
    }
    
    return Response({'user': user_data}, status=200)
 




# Change password
class UserChangePasswordView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        data = request.data
        serializer = UserChangePasswordSerializer(data = data, context={'user': request.user})

        if serializer.is_valid(raise_exception=True):
            return Response({'message': 'Password changed successfully' },
                status = status.HTTP_200_OK )
        
        return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)
 


# View for Sending OTP
from django.core.mail import send_mail
from .models import User, OTP
import random

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            otp = random.randint(100000, 999999)
            # Save OTP in the database (optional)
            OTP.objects.create(user=user, otp=otp)

            # Send OTP via email
            send_mail(
                'Your OTP for Password Reset',
                f'Your OTP is {otp}',
                'sohampatilsp55@gmail.com',  # Sender email
                [email],  # Receiver email
                fail_silently=False,
            )

            return Response({"message": "OTP sent to your email"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)




from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import OTP  # Make sure to import your OTP model
from django.utils import timezone

class VerifyOTPView(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp_input = request.data.get('otp_input')
        new_password = request.data.get('new_password')  # Get new password from request

        try:


            # Get the OTP record for the given email
            otp_record = OTP.objects.get(user__email=email, otp=otp_input, is_valid=True)

            # Check if the OTP is still valid (e.g., check timestamp)
            if (timezone.now() - otp_record.created_at).seconds > 300:
                return Response({"error": "OTP has expired"}, status=status.HTTP_400_BAD_REQUEST)

            # If valid, proceed to update the user's password
            user = otp_record.user
            user.set_password(new_password)
            user.save()

            # Mark OTP as used
            otp_record.is_valid = False
            otp_record.save()

            return Response({"message": "Password has been reset successfully!"}, status=status.HTTP_200_OK)

        except OTP.DoesNotExist:
            return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


 
class TeamWisePlayersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        teams = {}
        for user in User.objects.filter(Q(role="Player") | Q(role="Leader")).order_by("team"):
            team = user.team if user.team else "No Team"
            if team not in teams: 
                teams[team] = []
            teams[team].append({
                "player_id": user.player_id,
                "name": f"{user.firstname} {user.lastname}",
                "points": user.points, 
            })
        return Response(teams)
    

class TeamLeaderView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request): 
        user = request.user
        if user.role == 'Leader' and user.team:
            return Response({"team_name": user.team})
        return Response({"error": "User is not a team leader or does not have a team."}, status=403)
    

from .models import Team
from django.db.models import F
import logging
logger = logging.getLogger(__name__)

class UpdateScoreView(APIView):
    def post(self, request):
        data = request.data  # Assuming data is sent as JSON
        logger.debug(f"Received data: {data}")  # Debug log to check incoming data
        try:
            # Update team scores
            for team_name, points in data.get('teams', {}).items():
                logger.debug(f"Updating score for team: {team_name} by {points}")  # Debug log
                Team.objects.filter(team_name=team_name).update(score=F('score') + points)

            # Update individual player scores using the User model
            for player_data in data.get('players', []):
                player_id = player_data.get('player_id')
                points = player_data.get('points', 0)

                logger.debug(f"Updating points for player: {player_id} by {points}")  # Debug log
                user = User.objects.filter(player_id=player_id).first()  # Get the first matching user
                if user:
                    User.objects.filter(player_id=player_id).update(points=F('points') + points)
                    logger.debug(f"Updated points for player {player_id}: new points = {user.points + points}")  # Log the new points
                else:
                    logger.warning(f"Player with id {player_id} not found.")  # Log warning
                    return Response({"error": f"Player with id {player_id} not found."}, status=status.HTTP_404_NOT_FOUND)

            # Calculate and update super scores for top 3 teams
            top_teams = Team.objects.order_by('-score')[:3]  # Get top 3 teams by score
            super_scores = [5, 3, 1]  # Super scores for top 3 teams
            
            for i, team in enumerate(top_teams):
                team.super_score = super_scores[i]  # Assign super score based on rank
                team.save()  # Save the updated team object
                logger.debug(f"Updated super score for team {team.team_name}: new super score = {team.super_score}")

            return Response({"message": "Scores updated successfully."}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error occurred: {str(e)}")  # Log the error
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

from django.http import JsonResponse

class TopTeamsView(APIView):
    def get(self, request):
        # Fetch top 3 teams based on super_score, sorted in descending order
        top_teams = Team.objects.order_by('-super_score')[:3]
        
        # Prepare data for JSON response
        data = [
            {
                "team_name": team.team_name or "Unnamed Team",
                "super_score": team.super_score,
                "score": team.score
            }
            for team in top_teams
        ]
        
        return JsonResponse(data, safe=False)
    

class TeamNameView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        team_name = user.team  # Adjust this based on how your User model is structured
        return Response({"teamName": team_name})
    


class TopPlayersView(APIView):
    def get(self, request):
        # Query the top 3 players based on points
        top_players = User.objects.order_by('-points')[:3]  # Get top 3 players with highest points
        
        # Prepare the response data
        data = []
        for player in top_players:
            player_data = {
                'id': player.id,
                'firstname': player.firstname,
                'lastname': player.lastname,
                'points': player.points,
            }
            data.append(player_data)
        
        return JsonResponse(data, safe=False) 
    
 

from .serializers import TournamentSerializer

class TournamentCreateView(APIView):
    def post(self, request):
        serializer = TournamentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

from .models import Tournament
class GameTypeView(APIView):
    def get(self, request):
        # Fetch all tournament instances
        tournaments = Tournament.objects.all()

        game_types = {
            "fun": ["Puzzle", "Ludo"],
            "indoor": ["Chess", "Carrom"],
            "outdoor": ["Cricket", "Futsal"]
        }

        # Extract the names of the games
        games_list = []
        for games in game_types.values():
            games_list.extend(games)

        # Remove duplicates by converting to a set and back to a list
        unique_games = list(set(games_list))

        return Response(unique_games, status=status.HTTP_200_OK)