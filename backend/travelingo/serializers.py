# from rest_framework import serializers
# from .models import TravelInquiry

# class TravelInquirySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = TravelInquiry
#         fields = [
#             'first_name',
#             'last_name',
#             'email',
#             'phone',
#             'destination',
#             'departure_date',
#             'return_date',
#             'travelers',
#             'budget_range',
#             'travel_agency',
#             'travel_type',
#             'special_requests',
#         ]

#     def validate_departure_date(self, value):
#         if value < models.DateField().to_python(str):  # check if the departure date is in the past
#             raise serializers.ValidationError("Departure date cannot be in the past.")
#         return value

#     def validate_return_date(self, value):
#         if value <= self.initial_data.get('departure_date'):  # check if return date is after departure date
#             raise serializers.ValidationError("Return date must be after departure date.")
#         return value
# serializers.py
from rest_framework import serializers
from .models import TravelInquiry

class TravelInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = TravelInquiry
        fields = '__all__'  # OR list them manually

    def validate(self, data):
        if data['return_date'] <= data['departure_date']:
            raise serializers.ValidationError("Return date must be after departure date.")
        return data
