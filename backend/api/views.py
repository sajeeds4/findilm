from datetime import date
from decimal import Decimal
from urllib.error import URLError
from urllib.request import urlopen

from django.contrib.auth import get_user_model
from django.db.models import Avg, F, Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    AnalyticsEvent,
    AssistantConversation,
    AssistantMessage,
    CommunityPostAttachment,
    CommunityBookmark,
    CommunityCategory,
    CommunityPost,
    CommunityPostLike,
    CommunityReply,
    Course,
    CourseEnrollment,
    CourseLesson,
    DuaAmeen,
    DuaRequest,
    KnowledgeCategory,
    KnowledgeResource,
    LessonCompletion,
    ModerationReport,
    Notification,
    PodcastEpisode,
    PrayerTimeCache,
    Reflection,
    SavedResource,
    SharedContent,
    UserFollow,
)
from .permissions import IsAdminUserProfile
from .seed import ensure_seed_data
from .serializers import (
    AssistantConversationSerializer,
    AssistantMessageSerializer,
    CommunityCategorySerializer,
    CommunityPostAttachmentSerializer,
    CommunityPostSerializer,
    CommunityReplySerializer,
    CourseSerializer,
    DuaRequestSerializer,
    KnowledgeCategorySerializer,
    KnowledgeResourceSerializer,
    LessonCompletionSerializer,
    LoginSerializer,
    ModerationReportSerializer,
    NotificationSerializer,
    PodcastEpisodeSerializer,
    ReflectionSerializer,
    RegisterSerializer,
    SavedResourceSerializer,
    SharedContentSerializer,
    FollowUserSummarySerializer,
    UserProfileSerializer,
    AnalyticsEventSerializer,
)
from .admin_serializers import (
    AdminCommunityPostSerializer,
    AdminCourseSerializer,
    AdminDuaSerializer,
    AdminKnowledgeResourceSerializer,
    AdminPodcastEpisodeSerializer,
    AdminReflectionSerializer,
    AdminUserSummarySerializer,
)

User = get_user_model()

DAILY_AYAHS = [
    {
        "text": "Indeed, with hardship comes ease.",
        "reference": "Ash-Sharh 94:6",
    },
    {
        "text": "So remember Me; I will remember you.",
        "reference": "Al-Baqarah 2:152",
    },
    {
        "text": "And He found you lost and guided [you].",
        "reference": "Ad-Duhaa 93:7",
    },
    {
        "text": "And put your trust in Allah; and sufficient is Allah as Disposer of affairs.",
        "reference": "Al-Ahzab 33:3",
    },
    {
        "text": "My mercy encompasses all things.",
        "reference": "Al-A'raf 7:156",
    },
]


class HealthCheckView(APIView):
    def get(self, request):
        return Response({"status": "ok", "message": "FindIlm Django backend is running"})


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        auth_user = serializer.validated_data["user"]
        token, _ = Token.objects.get_or_create(user=auth_user)
        return Response(
            {
                "success": True,
                "user": {
                    "id": str(auth_user.id),
                    "email": auth_user.email,
                    "displayName": getattr(auth_user.profile, "display_name", "") or auth_user.get_full_name() or auth_user.username,
                },
                "token": token.key,
            }
        )


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        AnalyticsEvent.objects.create(event_type=AnalyticsEvent.EventType.SIGN_UP, user=user, path="/auth/register")
        Notification.objects.create(
            user=user,
            title="Welcome to FindIlm",
            body="Your account is ready. Explore courses, community, and spiritual tools.",
            kind=Notification.Kind.SYSTEM,
            action_url="/dashboard",
        )

        return Response(
            {
                "success": True,
                "user": {
                    "id": str(user.id),
                    "email": user.email,
                    "displayName": getattr(user.profile, "display_name", "") or user.get_full_name() or user.username,
                },
                "token": token.key,
            },
            status=status.HTTP_201_CREATED,
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response({"success": True})


class UserMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserProfileSerializer(request.user.profile, context={"request": request}).data)


class FollowGraphView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        following_links = (
            UserFollow.objects.filter(follower=request.user)
            .select_related("following", "following__profile")
            .order_by("-created_at")
        )
        follower_links = (
            UserFollow.objects.filter(following=request.user)
            .select_related("follower", "follower__profile")
            .order_by("-created_at")
        )
        following = [
            {
                "id": link.following.id,
                "uid": str(link.following.id),
                "displayName": getattr(link.following.profile, "display_name", "") or link.following.get_full_name() or link.following.username,
                "email": link.following.email,
                "photoURL": getattr(link.following.profile, "photo_url", ""),
                "role": getattr(link.following.profile, "role", "user"),
                "followedAt": link.created_at,
            }
            for link in following_links
        ]
        followers = [
            {
                "id": link.follower.id,
                "uid": str(link.follower.id),
                "displayName": getattr(link.follower.profile, "display_name", "") or link.follower.get_full_name() or link.follower.username,
                "email": link.follower.email,
                "photoURL": getattr(link.follower.profile, "photo_url", ""),
                "role": getattr(link.follower.profile, "role", "user"),
                "followedAt": link.created_at,
            }
            for link in follower_links
        ]
        return Response(
            {
                "following": FollowUserSummarySerializer(following, many=True).data,
                "followers": FollowUserSummarySerializer(followers, many=True).data,
                "counts": {
                    "following": len(following),
                    "followers": len(followers),
                },
            }
        )


class FollowToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        target = get_object_or_404(User.objects.select_related("profile"), pk=user_id)
        if target.id == request.user.id:
            return Response({"detail": "You cannot follow yourself."}, status=status.HTTP_400_BAD_REQUEST)

        follow, created = UserFollow.objects.get_or_create(follower=request.user, following=target)
        if created:
            Notification.objects.create(
                user=target,
                title="New follower",
                body=f"{getattr(request.user.profile, 'display_name', '') or request.user.get_full_name() or request.user.username} started following you.",
                kind=Notification.Kind.FOLLOW,
                action_url="/community",
            )
            return Response(
                {
                    "success": True,
                    "active": True,
                    "followersCount": UserFollow.objects.filter(following=target).count(),
                }
            )

        follow.delete()
        return Response(
            {
                "success": True,
                "active": False,
                "followersCount": UserFollow.objects.filter(following=target).count(),
            }
        )


class DailyAyahView(APIView):
    def get(self, request):
        idx = date.today().toordinal() % len(DAILY_AYAHS)
        return Response(DAILY_AYAHS[idx])


class ReflectionListCreateView(generics.ListCreateAPIView):
    serializer_class = ReflectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Reflection.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReflectionDetailView(generics.DestroyAPIView):
    serializer_class = ReflectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Reflection.objects.filter(user=self.request.user)


class DuaRequestListCreateView(generics.ListCreateAPIView):
    serializer_class = DuaRequestSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticatedOrReadOnly()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        return DuaRequest.objects.select_related("user", "user__profile")

    def perform_create(self, serializer):
        dua = serializer.save(user=self.request.user if self.request.user.is_authenticated else None)
        if self.request.user.is_authenticated:
            Notification.objects.create(
                user=self.request.user,
                title="Dua request submitted",
                body="Your community support request is now live.",
                kind=Notification.Kind.DUA,
                action_url="/dua",
            )
            AnalyticsEvent.objects.create(
                event_type=AnalyticsEvent.EventType.DUA_CREATED,
                user=self.request.user,
                path="/dua",
                metadata={"dua_request_id": dua.id},
            )


class DuaAmeenToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        dua_request = get_object_or_404(DuaRequest, pk=pk)
        ameen, created = DuaAmeen.objects.get_or_create(dua_request=dua_request, user=request.user)
        if created:
            DuaRequest.objects.filter(pk=dua_request.pk).update(ameen_count=F("ameen_count") + 1)
            return Response({"success": True, "ameenCount": dua_request.ameen_count + 1, "active": True})

        ameen.delete()
        DuaRequest.objects.filter(pk=dua_request.pk, ameen_count__gt=0).update(ameen_count=F("ameen_count") - 1)
        dua_request.refresh_from_db()
        return Response({"success": True, "ameenCount": dua_request.ameen_count, "active": False})


class CommunityCategoryListView(generics.ListAPIView):
    serializer_class = CommunityCategorySerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        ensure_seed_data()
        return CommunityCategory.objects.all()


class CommunityPostListCreateView(generics.ListCreateAPIView):
    serializer_class = CommunityPostSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        ensure_seed_data()
        queryset = CommunityPost.objects.select_related("category", "user", "user__profile").prefetch_related(
            "attachments",
            "replies",
            "replies__user",
            "replies__user__profile",
            "replies__children",
            "replies__children__user",
            "replies__children__user__profile",
            "replies__children__children",
            "replies__children__children__user",
            "replies__children__children__user__profile",
        )
        category = self.request.query_params.get("category")
        search = self.request.query_params.get("search")
        if category and category.lower() != "all":
            queryset = queryset.filter(category__slug=category)
        if search:
            queryset = queryset.filter(Q(title__icontains=search) | Q(content__icontains=search))
        return queryset

    def perform_create(self, serializer):
        post = serializer.save(user=self.request.user)
        Notification.objects.create(
            user=self.request.user,
            title="Discussion published",
            body=f"Your post '{post.title}' is now part of the community feed.",
            kind=Notification.Kind.COMMUNITY,
            action_url="/community",
        )
        AnalyticsEvent.objects.create(
            event_type=AnalyticsEvent.EventType.COMMUNITY_POST,
            user=self.request.user,
            path="/community",
            metadata={"community_post_id": post.id},
        )


class CommunityPostAttachmentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommunityPostAttachmentSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        post = get_object_or_404(CommunityPost, pk=self.kwargs["pk"])
        return post.attachments.all()

    def post(self, request, *args, **kwargs):
        post = get_object_or_404(CommunityPost, pk=self.kwargs["pk"])
        if post.user_id != request.user.id and not request.user.is_staff and not request.user.is_superuser:
            return Response({"detail": "You can only attach files to your own discussions."}, status=status.HTTP_403_FORBIDDEN)

        uploaded_file = request.FILES.get("file")
        if not uploaded_file:
            return Response({"detail": "A file is required."}, status=status.HTTP_400_BAD_REQUEST)

        attachment = CommunityPostAttachment.objects.create(
            post=post,
            uploaded_by=request.user,
            file=uploaded_file,
            caption=request.data.get("caption", ""),
        )
        return Response(
            CommunityPostAttachmentSerializer(attachment, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )


class CommunityReplyListCreateView(generics.ListCreateAPIView):
    serializer_class = CommunityReplySerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        post = get_object_or_404(CommunityPost, pk=self.kwargs["pk"])
        return (
            post.replies.filter(parent__isnull=True)
            .select_related("user", "user__profile")
            .prefetch_related(
                "children",
                "children__user",
                "children__user__profile",
                "children__children",
                "children__children__user",
                "children__children__user__profile",
            )
        )

    def post(self, request, *args, **kwargs):
        post = get_object_or_404(CommunityPost, pk=self.kwargs["pk"])
        content = str(request.data.get("content", "")).strip()
        if not content:
            return Response({"detail": "Reply content is required."}, status=status.HTTP_400_BAD_REQUEST)

        parent = None
        parent_id = request.data.get("parentId")
        if parent_id:
            parent = get_object_or_404(CommunityReply, pk=parent_id, post=post)

        reply = CommunityReply.objects.create(
            post=post,
            user=request.user,
            parent=parent,
            content=content,
            is_anonymous=str(request.data.get("isAnonymous", "")).lower() in {"true", "1", "yes", "on"},
        )
        CommunityPost.objects.filter(pk=post.pk).update(comments_count=F("comments_count") + 1)

        Notification.objects.create(
            user=request.user,
            title="Reply posted",
            body=f"Your response was added to '{post.title}'.",
            kind=Notification.Kind.COMMUNITY,
            action_url="/community",
        )
        AnalyticsEvent.objects.create(
            event_type=AnalyticsEvent.EventType.COMMUNITY_POST,
            user=request.user,
            path="/community",
            metadata={"community_post_id": post.id, "community_reply_id": reply.id, "parent_id": parent.id if parent else None},
        )
        return Response(CommunityReplySerializer(reply, context={"request": request}).data, status=status.HTTP_201_CREATED)


class CommunityPostLikeToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        post = get_object_or_404(CommunityPost, pk=pk)
        like, created = CommunityPostLike.objects.get_or_create(post=post, user=request.user)
        if created:
            CommunityPost.objects.filter(pk=post.pk).update(likes_count=F("likes_count") + 1)
            return Response({"success": True, "active": True})
        like.delete()
        CommunityPost.objects.filter(pk=post.pk, likes_count__gt=0).update(likes_count=F("likes_count") - 1)
        return Response({"success": True, "active": False})


class CommunityPostBookmarkToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        post = get_object_or_404(CommunityPost, pk=pk)
        bookmark, created = CommunityBookmark.objects.get_or_create(post=post, user=request.user)
        if not created:
            bookmark.delete()
            return Response({"success": True, "active": False})
        return Response({"success": True, "active": True})


class CourseListView(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        ensure_seed_data()
        queryset = Course.objects.filter(is_published=True).prefetch_related("lessons")
        category = self.request.query_params.get("category")
        if category and category.lower() != "all":
            queryset = queryset.filter(category__iexact=category)
        return queryset


class FeaturedCourseView(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        ensure_seed_data()
        return Course.objects.filter(is_featured=True, is_published=True).prefetch_related("lessons")


class CourseEnrollmentToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, slug):
        course = get_object_or_404(Course, slug=slug, is_published=True)
        enrollment, created = CourseEnrollment.objects.get_or_create(user=request.user, course=course)
        if created:
            Course.objects.filter(pk=course.pk).update(students=F("students") + 1)
            Notification.objects.create(
                user=request.user,
                title="Course joined",
                body=f"You enrolled in {course.title}.",
                kind=Notification.Kind.COURSE,
                action_url="/courses",
            )
            AnalyticsEvent.objects.create(
                event_type=AnalyticsEvent.EventType.COURSE_JOIN,
                user=request.user,
                path="/courses",
                metadata={"course_id": course.id, "slug": course.slug},
            )
        serializer = CourseSerializer(course)
        return Response({"success": True, "created": created, "course": serializer.data})


class LessonCompletionToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, lesson_id):
        lesson = get_object_or_404(CourseLesson, pk=lesson_id)
        enrollment, _ = CourseEnrollment.objects.get_or_create(user=request.user, course=lesson.course)
        completion, created = LessonCompletion.objects.get_or_create(enrollment=enrollment, lesson=lesson)
        if not created:
            completion.completed = not completion.completed
            completion.save(update_fields=["completed", "updated_at"])

        completed_count = enrollment.lesson_completions.filter(completed=True).count()
        total_lessons = max(lesson.course.lessons.count(), 1)
        enrollment.completed_lessons = completed_count
        enrollment.progress_percent = round((completed_count / total_lessons) * 100)
        enrollment.save(update_fields=["completed_lessons", "progress_percent", "updated_at"])

        return Response(
            {
                "success": True,
                "completion": LessonCompletionSerializer(completion).data,
                "enrollment": {
                    "completedLessons": enrollment.completed_lessons,
                    "progressPercent": enrollment.progress_percent,
                },
            }
        )


class KnowledgeCategoryListView(generics.ListAPIView):
    serializer_class = KnowledgeCategorySerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        ensure_seed_data()
        return KnowledgeCategory.objects.all()


class KnowledgeResourceListView(generics.ListAPIView):
    serializer_class = KnowledgeResourceSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        ensure_seed_data()
        queryset = KnowledgeResource.objects.select_related("category")
        category = self.request.query_params.get("category")
        resource_type = self.request.query_params.get("type")
        if category and category.lower() != "all":
            queryset = queryset.filter(category__slug=category)
        if resource_type and resource_type.lower() != "all":
            queryset = queryset.filter(resource_type=resource_type.lower())
        return queryset


class SavedResourceListView(generics.ListAPIView):
    serializer_class = SavedResourceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SavedResource.objects.filter(user=self.request.user).select_related("resource", "resource__category")


class SavedResourceToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, resource_id):
        resource = get_object_or_404(KnowledgeResource, pk=resource_id)
        saved, created = SavedResource.objects.get_or_create(user=request.user, resource=resource)
        if created:
            Notification.objects.create(
                user=request.user,
                title="Resource saved",
                body=f"{resource.title} was added to your saved library.",
                kind=Notification.Kind.SYSTEM,
                action_url="/knowledge",
            )
            AnalyticsEvent.objects.create(
                event_type=AnalyticsEvent.EventType.RESOURCE_SAVE,
                user=request.user,
                path="/knowledge",
                metadata={"resource_id": resource.id},
            )
            return Response({"success": True, "active": True})
        saved.delete()
        return Response({"success": True, "active": False})


class SharedContentListCreateView(generics.ListCreateAPIView):
    serializer_class = SharedContentSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        queryset = SharedContent.objects.select_related("uploader", "uploader__profile")
        if self.request.user.is_authenticated and (self.request.user.is_staff or self.request.user.is_superuser):
            return queryset
        return queryset.filter(status=SharedContent.Status.APPROVED, is_public=True)

    def post(self, request, *args, **kwargs):
        file = request.FILES.get("file")
        external_url = request.data.get("external_url", "")
        if not file and not external_url:
            return Response({"detail": "Provide either a file upload or an external URL."}, status=status.HTTP_400_BAD_REQUEST)

        shared = SharedContent.objects.create(
            uploader=request.user,
            title=request.data.get("title", "").strip(),
            description=request.data.get("description", "").strip(),
            content_type=request.data.get("content_type", SharedContent.ContentType.DOCUMENT),
            category=request.data.get("category", "").strip(),
            file=file if file else "",
            external_url=external_url,
            is_public=str(request.data.get("is_public", "true")).lower() == "true",
            status=SharedContent.Status.PENDING,
        )
        Notification.objects.create(
            user=request.user,
            title="Content submitted",
            body=f"Your upload '{shared.title}' is waiting for review.",
            kind=Notification.Kind.SYSTEM,
            action_url="/dashboard",
        )
        return Response(SharedContentSerializer(shared, context={"request": request}).data, status=status.HTTP_201_CREATED)


class UserSharedContentListView(generics.ListAPIView):
    serializer_class = SharedContentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SharedContent.objects.filter(uploader=self.request.user).select_related("uploader", "uploader__profile")


class PodcastEpisodeListView(generics.ListAPIView):
    serializer_class = PodcastEpisodeSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        ensure_seed_data()
        return PodcastEpisode.objects.all()


def _fallback_timings():
    return {
        "Fajr": "05:12",
        "Sunrise": "06:28",
        "Dhuhr": "12:19",
        "Asr": "15:45",
        "Maghrib": "18:11",
        "Isha": "19:27",
    }


def _fetch_remote_prayer_times(latitude, longitude, method):
    endpoint = (
        f"https://api.aladhan.com/v1/timings?latitude={latitude}&longitude={longitude}&method={method}"
    )
    with urlopen(endpoint, timeout=5) as response:  # nosec B310
        import json

        payload = json.loads(response.read().decode("utf-8"))
        return payload.get("data", {}).get("timings", {})


class PrayerTimesView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        latitude = Decimal(request.query_params.get("latitude", "21.4225"))
        longitude = Decimal(request.query_params.get("longitude", "39.8262"))
        method = int(request.query_params.get("method", 2))
        today = timezone.localdate()

        cached = PrayerTimeCache.objects.filter(
            date=today, latitude=latitude, longitude=longitude, method=method
        ).first()
        if cached:
            return Response(
                {
                    "date": str(today),
                    "location": {"latitude": float(latitude), "longitude": float(longitude)},
                    "timings": cached.timings,
                    "source": "cache",
                }
            )

        try:
            timings = _fetch_remote_prayer_times(latitude, longitude, method)
            source = "aladhan"
        except (URLError, TimeoutError, ValueError):
            timings = _fallback_timings()
            source = "fallback"

        PrayerTimeCache.objects.get_or_create(
            date=today,
            latitude=latitude,
            longitude=longitude,
            method=method,
            defaults={"timings": timings, "timezone": "UTC"},
        )
        return Response(
            {
                "date": str(today),
                "location": {"latitude": float(latitude), "longitude": float(longitude)},
                "timings": timings,
                "source": source,
            }
        )


class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        ensure_seed_data()
        reflections = Reflection.objects.filter(user=request.user)
        dua_requests = DuaRequest.objects.filter(user=request.user)
        enrollments = CourseEnrollment.objects.filter(user=request.user).select_related("course")
        saved_resources = SavedResource.objects.filter(user=request.user)
        unread_notifications = Notification.objects.filter(user=request.user, is_read=False)
        return Response(
            {
                "profile": UserProfileSerializer(request.user.profile).data,
                "stats": {
                    "reflections": reflections.count(),
                    "publicReflections": reflections.filter(is_public=True).count(),
                    "duaRequests": dua_requests.count(),
                    "courseEnrollments": enrollments.count(),
                    "averageProgress": enrollments.aggregate(avg=Avg("progress_percent")).get("avg") or 0,
                    "savedResources": saved_resources.count(),
                    "unreadNotifications": unread_notifications.count(),
                },
                "recentReflections": ReflectionSerializer(reflections[:5], many=True).data,
                "enrollments": [
                    {
                        "course": enrollment.course.title,
                        "progressPercent": enrollment.progress_percent,
                        "completedLessons": enrollment.completed_lessons,
                    }
                    for enrollment in enrollments[:5]
                ],
                "notifications": NotificationSerializer(unread_notifications[:5], many=True).data,
            }
        )


class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


class NotificationMarkReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        notification = get_object_or_404(Notification, pk=pk, user=request.user)
        notification.is_read = True
        notification.save(update_fields=["is_read", "updated_at"])
        return Response({"success": True})


class AssistantConversationListCreateView(generics.ListCreateAPIView):
    serializer_class = AssistantConversationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AssistantConversation.objects.filter(user=self.request.user).prefetch_related("messages")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AssistantConversationMessageListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        conversation = get_object_or_404(AssistantConversation, pk=pk, user=request.user)
        return Response(AssistantMessageSerializer(conversation.messages.all(), many=True).data)

    def post(self, request, pk):
        conversation = get_object_or_404(AssistantConversation, pk=pk, user=request.user)
        role = request.data.get("role")
        text = (request.data.get("text") or "").strip()
        if role not in {AssistantMessage.Role.USER, AssistantMessage.Role.MODEL} or not text:
            return Response({"detail": "Valid role and text are required."}, status=status.HTTP_400_BAD_REQUEST)
        message = AssistantMessage.objects.create(conversation=conversation, role=role, text=text)
        if conversation.title == "New conversation" and role == AssistantMessage.Role.USER:
            conversation.title = text[:60]
            conversation.save(update_fields=["title", "updated_at"])
        return Response(AssistantMessageSerializer(message).data, status=status.HTTP_201_CREATED)


class ModerationReportListCreateView(generics.ListCreateAPIView):
    serializer_class = ModerationReportSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [IsAdminUserProfile()]
        return [permissions.IsAuthenticatedOrReadOnly()]

    def get_queryset(self):
        return ModerationReport.objects.all()

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user if self.request.user.is_authenticated else None)


class ModerationReportDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = ModerationReportSerializer
    permission_classes = [IsAdminUserProfile]
    queryset = ModerationReport.objects.all()

    def perform_update(self, serializer):
        serializer.save(reviewed_by=self.request.user)


class AnalyticsEventCreateView(generics.CreateAPIView):
    serializer_class = AnalyticsEventSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user if self.request.user.is_authenticated else None)


class AdminOverviewView(APIView):
    permission_classes = [IsAdminUserProfile]

    def get(self, request):
        ensure_seed_data()
        return Response(
            {
                "stats": {
                    "users": User.objects.count(),
                    "reflections": Reflection.objects.count(),
                    "duaRequests": DuaRequest.objects.count(),
                    "communityPosts": CommunityPost.objects.count(),
                    "courses": Course.objects.count(),
                    "resources": KnowledgeResource.objects.count(),
                    "episodes": PodcastEpisode.objects.count(),
                    "savedResources": SavedResource.objects.count(),
                    "notifications": Notification.objects.count(),
                    "visitors": AnalyticsEvent.objects.filter(event_type=AnalyticsEvent.EventType.PAGE_VIEW).count(),
                    "courseJoiners": AnalyticsEvent.objects.filter(event_type=AnalyticsEvent.EventType.COURSE_JOIN).count(),
                    "openReports": ModerationReport.objects.filter(status=ModerationReport.Status.OPEN).count(),
                },
                "recentUsers": AdminUserSummarySerializer(
                    User.objects.select_related("profile").order_by("-date_joined")[:5],
                    many=True,
                ).data,
                "recentReflections": AdminReflectionSerializer(
                    Reflection.objects.select_related("user", "user__profile")[:5],
                    many=True,
                ).data,
                "recentDuas": AdminDuaSerializer(
                    DuaRequest.objects.select_related("user", "user__profile")[:5],
                    many=True,
                ).data,
                "recentReports": ModerationReportSerializer(ModerationReport.objects.all()[:5], many=True).data,
            }
        )


class AdminCourseListCreateView(generics.ListCreateAPIView):
    serializer_class = AdminCourseSerializer
    permission_classes = [IsAdminUserProfile]
    queryset = Course.objects.all().prefetch_related("lessons")


class AdminCourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AdminCourseSerializer
    permission_classes = [IsAdminUserProfile]
    queryset = Course.objects.all().prefetch_related("lessons")


class AdminResourceListCreateView(generics.ListCreateAPIView):
    serializer_class = AdminKnowledgeResourceSerializer
    permission_classes = [IsAdminUserProfile]
    queryset = KnowledgeResource.objects.all().select_related("category")


class AdminResourceDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AdminKnowledgeResourceSerializer
    permission_classes = [IsAdminUserProfile]
    queryset = KnowledgeResource.objects.all().select_related("category")


class AdminEpisodeListCreateView(generics.ListCreateAPIView):
    serializer_class = AdminPodcastEpisodeSerializer
    permission_classes = [IsAdminUserProfile]
    queryset = PodcastEpisode.objects.all()


class AdminEpisodeDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AdminPodcastEpisodeSerializer
    permission_classes = [IsAdminUserProfile]
    queryset = PodcastEpisode.objects.all()


class AdminCommunityPostListCreateView(generics.ListCreateAPIView):
    serializer_class = AdminCommunityPostSerializer
    permission_classes = [IsAdminUserProfile]
    queryset = CommunityPost.objects.all().select_related("category", "user", "user__profile")


class AdminCommunityPostDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AdminCommunityPostSerializer
    permission_classes = [IsAdminUserProfile]
    queryset = CommunityPost.objects.all().select_related("category", "user", "user__profile")


class AdminUserListView(generics.ListAPIView):
    serializer_class = AdminUserSummarySerializer
    permission_classes = [IsAdminUserProfile]
    queryset = User.objects.all().select_related("profile").order_by("-date_joined")


class AdminReflectionListView(generics.ListAPIView):
    serializer_class = AdminReflectionSerializer
    permission_classes = [IsAdminUserProfile]
    queryset = Reflection.objects.all().select_related("user", "user__profile")


class AdminDuaListView(generics.ListAPIView):
    serializer_class = AdminDuaSerializer
    permission_classes = [IsAdminUserProfile]
    queryset = DuaRequest.objects.all().select_related("user", "user__profile")


class AdminAnalyticsListView(generics.ListAPIView):
    serializer_class = AnalyticsEventSerializer
    permission_classes = [IsAdminUserProfile]
    queryset = AnalyticsEvent.objects.all().select_related("user")
