import django_filters as df
from .models import Task

class TaskFilter(df.FilterSet):
    due_date_before = df.DateFilter(field_name="due_date", lookup_expr="lte")
    due_date_after = df.DateFilter(field_name="due_date", lookup_expr="gte")

    class Meta:
        model = Task
        fields = ["status", "priority", "due_date"]
