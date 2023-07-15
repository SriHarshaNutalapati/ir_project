from django.urls import path, include
from .views import *

urlpatterns = [
    path('users', IRUserListApiView.as_view()),
    path('user', IRUserApiView.as_view()),
    path('user/register', IRUserRegisterApiView.as_view()),
    path('user/login', IRUserLoginApiView.as_view()),
    path('logout', IRUserLogout.as_view()),
    path('robots', IRRobotsListApiView.as_view()),
    path('addrobot', IRRobotsCreateApiView.as_view()),
    path('editrobot/<int:id>/', IRRobotsEditApiView.as_view()),
    path('deleterobot/<int:id>/', IRRobotsDeleteApiView.as_view()),
    path('getrobot/<int:id>/', IRGetRobotApiView.as_view()),
    path('getDrone/<int:user_id>', IRGetDroneApiView.as_view()),
    path('saveDrone', IRSaveDroneApiView.as_view()),
    path('getrobotcomments/<int:robot_id>', IRRobotCommentsListApiView.as_view()),
    path('postRobotComment', IRRobotCommentsPostApiView.as_view()),
    path('drone/comments', IRDroneCommentsListApiView.as_view()),
]