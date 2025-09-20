# Create your models here.
from django.db import models

class TravelInquiry(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    destination = models.CharField(max_length=255)
    departure_date = models.DateField()
    return_date = models.DateField()
    travelers = models.PositiveIntegerField()
    budget_range = models.CharField(max_length=50)
    # travel_agency = models.CharField(max_length=100)
    travel_type = models.CharField(max_length=100)
    # special_requests = models.TextField(blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.destination}"
