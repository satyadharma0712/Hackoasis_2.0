# from django.shortcuts import render

# # Create your views here.
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from .models import TravelInquiry
# from .serializers import TravelInquirySerializer

# # views.py
# from rest_framework import status
# from rest_framework.response import Response
# from rest_framework.decorators import api_view
# from .serializers import TravelInquirySerializer

# @api_view(['POST'])
# def submit_travel_inquiry(request):
#     if request.method == 'POST':
#         # Deserialize the incoming JSON data
#         serializer = TravelInquirySerializer(data=request.data)

#         if serializer.is_valid():
#             # Save the valid data to the database
#             serializer.save()

#             # Return a success response
#             return Response({"message": "Inquiry submitted successfully!"}, status=status.HTTP_201_CREATED)
        
#         # Return a response with validation errors
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# views.py
from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from .models import TravelInquiry
from .serializers import TravelInquirySerializer

class TravelInquiryViewSet(viewsets.ViewSet):
    def create(self, request):
        # Instantiate the serializer with the incoming data
        serializer = TravelInquirySerializer(data=request.data)

        # Check if the data is valid
        if serializer.is_valid():
            # Save the data to the database
            serializer.save()
            # Return a success response
            return Response({
                "message": "Inquiry submitted successfully.",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        
        # If serializer is not valid, return errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
