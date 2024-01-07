from django.urls import path
from . import views


app_name = "converter"
urlpatterns = [
    path("", views.index, name="index"),
    path("canvas/", views.renderCanvas, name="canvas"),
    path("upload/", views.uploadTxtFile, name="upload")
]