from rest_framework import serializers
from account.models import User


class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'firstname', 'lastname', 'tc', 'role', 'team', 'player_id', 'points', 'password2']
        
        extra_kwargs = {
            'password': {'write_only': True},
            'points': {'read_only': True},  # Points are usually set after registration
            'player_id': {'required': False, 'allow_blank': True},  # Optional field
        }

    def validate(self, data):
        password = data.get('password')
        password2 = data.get('password2')

        if password != password2:
            raise serializers.ValidationError("Passwords don't match")

        return data
    
    def create(self, validated_data):
        validated_data.pop('password2')  # Remove password2
        user = User(**validated_data)  # Create user instance
        user.set_password(validated_data['password'])  # Hash the password
        user.save()  # Save the user instance
        return user
    
class TeamUserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User  # Adjust based on your user model
        fields = ['firstname', 'lastname', 'email', 'role', 'team']  # Include relevant fields
    
    def create(self, validated_data):
        # Here we assume you want to set a default password or handle it in another way
        # For example, we could set a default password:
        validated_data['password'] = 'defaultpassword123'  # Or handle it as you see fit
        user = User(**validated_data)
        user.set_password(validated_data['password'])  # Set password hash
        user.save()
        return user


# Login serializer
class UserLoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255)

    class Meta:
        model = User 
        fields = ['email', 'password', 'role']




# change password serializer
class UserChangePasswordSerializer(serializers.Serializer):
    password = serializers.CharField(max_length = 255,style={'input_type':'password'},write_only = True)
    password2 = serializers.CharField(max_length = 255,style={'input_type':'password'},write_only = True)

    class Meta:
        fields = ['password', "password2"]

    def validate(self, data):
        password = data.get('password')
        password2 = data.get('password2')
        user = self.context.get('user')

        if password != password2:
            raise serializers.ValidationError("Passwords don't match")
        
        user.set_password(password)
        user.save()

        return data
    


from .models import Tournament
from datetime import datetime

class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = '__all__'
        read_only_fields = ['tournament_id']  # If generated automatically

    def create(self, validated_data):
        # Generate tournament_id based on current date and time
        validated_data['tournament_id'] = datetime.now().strftime("%d%m%Y")
        return super().create(validated_data)
