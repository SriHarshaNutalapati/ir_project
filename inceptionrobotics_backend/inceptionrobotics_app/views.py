from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from .models import *
from .serializers import *
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from django.contrib.auth import get_user_model, login, logout
from django.core.exceptions import ValidationError
import json

# Create your views here.

class IRUserListApiView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    # 1. List all
    def get(self, request, *args, **kwargs):
        users = InceptionRoboticsUser.objects.all()
        serializer = IRUserSerializer(users, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class IRUserApiView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = InceptionRoboticsUser.objects.get(email=request.user.email)
        serializer = IRUserSerializer(user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)

class IRUserLoginApiView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = [SessionAuthentication]
    def post(self, request):
        data = json.loads(request.body)
        if not data["email"] or not data["password"]:
            raise ValidationError("One or more fields are missing")
        serializer = IRUserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.check_user(data)
            login(request, user)
            serialized_data = serializer.data.copy()
            serialized_data["first_name"] = user.first_name
            serialized_data["last_name"] = user.last_name
            serialized_data["full_name"] = user.full_name
            serialized_data["id"] = user.id
            return Response(serialized_data, status=status.HTTP_200_OK)

class IRUserRegisterApiView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        if not data["email"] or not data["password"] or not data["first_name"] or not data["last_name"]:
            raise ValidationError("One or more fields are missing")
        serializer = IRUserRegisterSerializer(data = data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class IRUserLogout(APIView):
	permission_classes = [permissions.AllowAny]
	def get(self, request): # change to post
		logout(request)
		return Response(status=status.HTTP_200_OK)
    

class IRRobotsListApiView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        robots = RobotDetails.objects.all()
        serializer = IRRobotsSerializer(robots, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class IRRobotsCreateApiView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = IRRobotsSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class IRRobotsEditApiView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, id, *args, **kwargs):
        robot = RobotDetails.objects.get(id=id)
        robot.robot_name = request.data["robot_name"]
        robot.robot_width = request.data["robot_width"]
        robot.robot_height = request.data["robot_height"]
        robot.robot_length = request.data["robot_length"]
        robot.sensor_type = request.data["sensor_type"]
        robot.image_url = request.data["image_url"]
        robot.save()
        robot = RobotDetails.objects.filter(id=id)
        serializer = IRRobotsSerializer(robot, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class IRRobotsDeleteApiView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, id, *args, **kwargs):
        robot = RobotDetails.objects.get(id=id)
        robot.delete()
        return Response({"deleted": True}, status=status.HTTP_200_OK)

class IRGetRobotApiView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, id, *args, **kwargs):
        robot = RobotDetails.objects.filter(id=id)
        serializer = IRRobotsSerializer(robot, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class IRGetDroneApiView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id, *args, **kwargs):
        drone = QuadCopterDetails.objects.filter(user_id=user_id)
        serializer = IRDroneSerializer(drone, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class IRSaveDroneApiView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        data = request.data
        if request.data["dronePresent"]:
            drone = QuadCopterDetails.objects.get(user_id=request.user.id)
            drone.circuit_diagram = request.data["circuit_diagram"]
            drone.save()
            return Response({"modified": True}, status=status.HTTP_201_CREATED)
        else:
            data["user"] = request.user.id
            serializer = IRDroneSerializer(data = request.data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class IRRobotCommentsListApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    # 1. List all
    def get(self, request, robot_id, *args, **kwargs):
        robot_comments = [{'comment': o.comment, 'robot_id': o.robot_id, 'user_id': o.user_id, 'user_fullname': InceptionRoboticsUser.objects.get(id=o.user_id).full_name} for o in RobotComments.objects.filter(robot=robot_id)]
        return Response(robot_comments, status=status.HTTP_200_OK)

class IRRobotCommentsPostApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def post(self, request, *args, **kwargs):
        serializer = IRRobotCommentsSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            data = serializer.data.copy()
            data["user_fullname"] = InceptionRoboticsUser.objects.get(id=request.user.id).full_name
            return Response(data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class IRDroneCommentsListApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    # 1. List all
    def get(self, request, *args, **kwargs):
        drone_comments = DroneComments.objects.filter(drone=request.drone.id)
        serializer = IRDroneCommentsSerializer(drone_comments, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # 2. Create
    def post(self, request, *args, **kwargs):
        serializer = IRDroneCommentsSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)