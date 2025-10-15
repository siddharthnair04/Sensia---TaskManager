from django.urls import path
from .views import (
    TaskListCreateView,
    TaskRetrieveUpdateDestroyView,
    DashboardStatsView,
)

urlpatterns = [
    path("", TaskListCreateView.as_view(), name="task_list_create"),
    path("stats/", DashboardStatsView.as_view(), name="task_stats"),
    path("<int:pk>/", TaskRetrieveUpdateDestroyView.as_view(), name="task_rud"),
]
