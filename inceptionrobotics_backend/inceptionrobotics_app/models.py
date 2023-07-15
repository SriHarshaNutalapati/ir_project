from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from .managers import UserManager

# Create your models here.
class InceptionRoboticsUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_("email address"), unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    first_name = models.CharField(max_length=255, null=False, blank=False)
    last_name = models.CharField(max_length=255, null=False, blank=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email
    
    @property
    def full_name(self):
        return self.first_name + ' ' + self.last_name
    
class RobotDetails(models.Model):
    robot_name = models.CharField(max_length=255, null=False, blank=False)
    robot_width = models.FloatField(null=False, blank=False)
    robot_height = models.FloatField(null=False, blank=False)
    robot_length = models.FloatField(null=False, blank=False)
    sensor_type = models.CharField(max_length=255, null=False, blank=False)
    image_url = models.CharField(max_length=2000, null=False, blank=False)

    def __str__(self):
        return self.robot_name

class QuadCopterDetails(models.Model):
    circuit_diagram = models.TextField(null=True, blank=True)
    name = models.CharField(max_length=255, null=False, blank=False)
    drone_details = models.TextField(null=False, blank=False)
    user = models.ForeignKey(InceptionRoboticsUser, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
    
class RobotComments(models.Model):
    comment = models.TextField(null=False, blank=False)
    robot = models.ForeignKey(RobotDetails, on_delete=models.CASCADE)
    user = models.ForeignKey(InceptionRoboticsUser, on_delete=models.CASCADE)

class DroneComments(models.Model):
    comment = models.TextField(null=False, blank=False)
    drone = models.ForeignKey(QuadCopterDetails, on_delete=models.CASCADE)
    user = models.ForeignKey(InceptionRoboticsUser, on_delete=models.CASCADE)

    
