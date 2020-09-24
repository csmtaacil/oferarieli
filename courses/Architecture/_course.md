---
smartApply: true
layout: course
name_en: Introuction to Computer Architecture
name_he: מבוא לארכיטקטורת מחשבים
cType_he: חובה
cType_en: Mandatory
cClass_en: Hardware/Software
cClass_he: חומרה/תוכנה
---
{% assign hebrew = false %}
{% if page.url contains '_he' %}
	{% assign hebrew = true %}
{% endif %}

{% if hebrew %}
בדרך כלל מלמדים את הקורס ד"ר כרמי מרימוביץ ד"ר אסתי שטיין, ודר" אלון שקלאר.
{% else %}
The course is being taught by Dr. Carmi Merimovich, Dr. Alon Schlar, and Dr. Esti Stein.
{% endif %}