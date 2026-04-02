from django.contrib import admin

from .models import (
    AssistantConversation,
    AssistantMessage,
    CommunityBookmark,
    CommunityCategory,
    CommunityPost,
    CommunityPostAttachment,
    CommunityPostLike,
    CommunityReply,
    Course,
    CourseEnrollment,
    CourseLesson,
    DuaAmeen,
    DuaRequest,
    KnowledgeCategory,
    KnowledgeResource,
    PodcastEpisode,
    PrayerTimeCache,
    Reflection,
    SharedContent,
    UserFollow,
    UserProfile,
)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "display_name", "role", "created_at")
    search_fields = ("user__username", "user__email", "display_name")


@admin.register(Reflection)
class ReflectionAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "is_public", "created_at")
    list_filter = ("is_public",)
    search_fields = ("user__email", "content")


@admin.register(DuaRequest)
class DuaRequestAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "is_anonymous", "ameen_count", "created_at")
    list_filter = ("is_anonymous",)
    search_fields = ("content", "user__email")


admin.site.register(DuaAmeen)
admin.site.register(CommunityCategory)
admin.site.register(CommunityPost)
admin.site.register(CommunityPostAttachment)
admin.site.register(CommunityReply)
admin.site.register(CommunityPostLike)
admin.site.register(CommunityBookmark)
admin.site.register(Course)
admin.site.register(CourseLesson)
admin.site.register(CourseEnrollment)
admin.site.register(KnowledgeCategory)
admin.site.register(KnowledgeResource)
admin.site.register(SharedContent)
admin.site.register(UserFollow)
admin.site.register(PodcastEpisode)
admin.site.register(PrayerTimeCache)
admin.site.register(AssistantConversation)
admin.site.register(AssistantMessage)
