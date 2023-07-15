from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError


class IRUserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(min_length = 8, write_only = True)

    class Meta:
        model = InceptionRoboticsUser
        fields = ["email", "first_name", "last_name", "password"]
    
    def create(self, cleaned_data):
        user = InceptionRoboticsUser.objects.create_user(cleaned_data['email'], cleaned_data['password'])
        user.first_name = cleaned_data['first_name']
        user.last_name = cleaned_data['last_name']
        user.save()
        return user

class IRUserLoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()

    class Meta:
        model = InceptionRoboticsUser
        fields = ["email"]

    def check_user(self, cleaned_data):
        user = authenticate(username=cleaned_data['email'], password=cleaned_data['password'])
        if not user:
            raise ValidationError('user not found')
        return user
    
class IRUserSerializer(serializers.ModelSerializer):
	class Meta:
		model = InceptionRoboticsUser
		fields = ["email", "first_name", "last_name", "full_name", "id", "is_staff"]


class IRRobotsSerializer(serializers.ModelSerializer):

    class Meta:
        model = RobotDetails
        fields = '__all__'


class IRDroneSerializer(serializers.ModelSerializer):

    class Meta:
        model = QuadCopterDetails
        fields = '__all__'

class IRRobotCommentsSerializer(serializers.ModelSerializer):

    class Meta:
        model = RobotComments
        fields = '__all__'

class IRDroneCommentsSerializer(serializers.ModelSerializer):

    class Meta:
        model = DroneComments
        fields = '__all__'