from django.shortcuts import render
from django.http import HttpResponse,JsonResponse

# Create your views here.

def index(request):
    return render(request, "start/index.html", {
    })

def renderCanvas(request):
    if request.method == "POST":
        textFile =  request.FILES["txtfile"].read()
        print(textFile)
        #context = {"code":textFile}
        return render(request, "canvas/canvas.html", {"code":textFile})
    return render(request, "canvas/canvas.html")

def uploadTxtFile(request):
    return render(request,"start/index.html")