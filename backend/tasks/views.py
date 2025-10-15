from datetime import date, timedelta
from django.utils import timezone
from django.db.models import Count, Q
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Task
from .serializers import TaskSerializer, RegisterSerializer
from .filters import TaskFilter
from django.contrib.auth.models import User

# ---- Auth ----
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

# ---- Tasks CRUD ----
class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_class = TaskFilter
    search_fields = ["title", "description"]
    ordering_fields = ["due_date", "priority", "status", "updated_at", "created_at"]

    def get_queryset(self):
        return Task.objects.filter(owner=self.request.user).order_by("-updated_at")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class TaskRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(owner=self.request.user)

# ---- Dashboard stats ----
class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = Task.objects.filter(owner=request.user)
        counts = qs.values("status").annotate(c=Count("id"))
        by_status = {row["status"]: row["c"] for row in counts}

        today = date.today()
        start_week = today - timedelta(days=today.weekday())  # Monday
        end_week = start_week + timedelta(days=6)

        due_today = qs.filter(~Q(status="completed"), due_date=today).count()
        due_week  = qs.filter(~Q(status="completed"),
                              due_date__gte=start_week,
                              due_date__lte=end_week).count()

        return Response({
            "by_status": {
                "pending": by_status.get("pending", 0),
                "in-progress": by_status.get("in-progress", 0),
                "completed": by_status.get("completed", 0),
            },
            "due_today": due_today,
            "due_week": due_week,
        })
