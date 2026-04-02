from .models import (
    CommunityCategory,
    CommunityPost,
    Course,
    CourseLesson,
    KnowledgeCategory,
    KnowledgeResource,
    PodcastEpisode,
)


def ensure_seed_data():
    if not CommunityCategory.objects.exists():
        categories = {
            "Marriage": "Healthy marriage, family, and companionship discussions.",
            "Mental Health": "Supportive reminders for emotional and spiritual wellbeing.",
            "Family": "Parenting, family ties, and home life through an Islamic lens.",
            "Reminders": "Short reminders that revive the heart.",
            "Education": "Questions and resources for sacred learning.",
        }
        for name, description in categories.items():
            CommunityCategory.objects.get_or_create(name=name, defaults={"description": description})

    if not CommunityPost.objects.exists():
        mental_health = CommunityCategory.objects.get(slug="mental-health")
        reminders = CommunityCategory.objects.get(slug="reminders")
        family = CommunityCategory.objects.get(slug="family")
        for payload in [
            {
                "category": mental_health,
                "title": "Finding peace in difficult times",
                "content": "Surah Ash-Sharh has been a constant reminder that with every hardship comes ease. How do you all maintain tawakkul when things feel heavy?",
                "likes_count": 24,
                "comments_count": 8,
            },
            {
                "category": reminders,
                "title": "Daily Sunnah: The morning adhkar",
                "content": "Which adhkar have you found most grounding at the start of the day? Sharing mine in hopes it benefits someone else too.",
                "likes_count": 42,
                "comments_count": 15,
                "author_role": CommunityPost.AuthorRole.MODERATOR,
            },
            {
                "category": family,
                "title": "Teaching kids about Ramadan",
                "content": "We started a small good-deeds jar at home. I would love more ideas for simple and joyful Ramadan activities for children.",
                "likes_count": 18,
                "comments_count": 22,
            },
        ]:
            CommunityPost.objects.get_or_create(title=payload["title"], defaults=payload)

    if not Course.objects.exists():
        courses = [
            {
                "title": "Qur'an Basics",
                "description": "Learn the fundamentals of Tajweed and correct pronunciation of the Arabic alphabet with guided practice.",
                "duration": "4 Weeks",
                "students": 1240,
                "rating": "4.9",
                "level": Course.Level.BEGINNER,
                "image_url": "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800",
                "lessons_count": 12,
                "category": "Quran",
            },
            {
                "title": "Salah Masterclass",
                "description": "A step-by-step guide to perfecting prayer, from purification to focus and consistency.",
                "duration": "2 Weeks",
                "students": 850,
                "rating": "4.8",
                "level": Course.Level.BEGINNER,
                "image_url": "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=800",
                "lessons_count": 8,
                "category": "Fiqh",
            },
            {
                "title": "Seerah Journey",
                "description": "Explore the life and character of the Prophet Muhammad, peace be upon him, through authentic narration.",
                "duration": "6 Weeks",
                "students": 2100,
                "rating": "5.0",
                "level": Course.Level.INTERMEDIATE,
                "image_url": "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800",
                "lessons_count": 24,
                "category": "History",
                "is_featured": True,
            },
            {
                "title": "Fiqh for Women",
                "description": "Understanding worship and daily-life rulings relevant to Muslim women with balance and clarity.",
                "duration": "4 Weeks",
                "students": 560,
                "rating": "4.7",
                "level": Course.Level.INTERMEDIATE,
                "image_url": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
                "lessons_count": 15,
                "category": "Fiqh",
            },
        ]
        for payload in courses:
            course, created = Course.objects.get_or_create(title=payload["title"], defaults=payload)
            if created:
                for idx in range(1, min(course.lessons_count, 4) + 1):
                    CourseLesson.objects.create(
                        course=course,
                        order=idx,
                        title=f"Lesson {idx}",
                        summary=f"Core lesson {idx} for {course.title}.",
                        duration_minutes=12 + idx,
                        is_preview=idx == 1,
                    )

    if not KnowledgeCategory.objects.exists():
        categories = [
            ("Qur'an Studies", 124, "emerald", "book-open"),
            ("Hadith", 85, "blue", "file-text"),
            ("Fiqh", 62, "amber", "scale"),
            ("Seerah", 45, "rose", "video"),
            ("Duas", 210, "indigo", "audio-lines"),
            ("Women in Islam", 38, "pink", "shield"),
        ]
        for name, count, color, icon in categories:
            KnowledgeCategory.objects.get_or_create(
                name=name,
                defaults={"resource_count": count, "accent_color": color, "icon": icon},
            )

    if not KnowledgeResource.objects.exists():
        quran = KnowledgeCategory.objects.get(slug="quran-studies")
        hadith = KnowledgeCategory.objects.get(slug="hadith")
        fiqh = KnowledgeCategory.objects.get(slug="fiqh")
        for payload in [
            {
                "category": quran,
                "title": "Themes of Surah Al-Fatihah",
                "description": "A concise guide to the foundational themes of the Opening chapter.",
                "resource_type": KnowledgeResource.ResourceType.ARTICLE,
                "author": "FindIlm Editorial",
                "is_featured": True,
            },
            {
                "category": hadith,
                "title": "Forty Hadith Study Notes",
                "description": "Structured notes for one of the most beloved introductory hadith collections.",
                "resource_type": KnowledgeResource.ResourceType.PDF,
                "author": "Scholarly Review Team",
            },
            {
                "category": fiqh,
                "title": "Purification Essentials",
                "description": "A practical walkthrough of the most common purification rulings.",
                "resource_type": KnowledgeResource.ResourceType.VIDEO,
                "author": "Ustadh Team",
            },
        ]:
            KnowledgeResource.objects.get_or_create(title=payload["title"], defaults=payload)

    if not PodcastEpisode.objects.exists():
        for payload in [
            {
                "title": "Healing the Heart",
                "description": "A gentle reminder on sincerity, patience, and returning to Allah in hard moments.",
                "speaker": "Ustadh Kareem",
                "duration": "28 min",
                "is_featured": True,
            },
            {
                "title": "The Character of the Prophet",
                "description": "Reflections on mercy, gentleness, and prophetic leadership.",
                "speaker": "Shaykh Hamza",
                "duration": "34 min",
            },
        ]:
            PodcastEpisode.objects.get_or_create(title=payload["title"], defaults=payload)
