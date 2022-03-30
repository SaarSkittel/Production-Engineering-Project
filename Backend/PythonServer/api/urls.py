from django.urls import path
from . import views


urlpatterns = [
    path("login", views.login),
    path("register", views.register),
    path("changepassword", views.change_password),
    path("users", views.users),
    path("logout", views.logout),
    path("token", views.token),
    path("", views.api_home),
]
