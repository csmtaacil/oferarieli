---
layout: "course"
name_en: "Introuction to Operating Systems"
name_he: "מבוא למערכות הפעלה"
cType_he: "חובה"
cType_en: "Mandatory"
cClass_en: "Hardware/Software"
cClass_he: "חומרה/תוכנה"
smartGenerated: "true"
---
{% assign hebrew = false %}
{% if page.url contains '_he' %}
	{% assign hebrew = true %}
{% endif %}

{% if hebrew %}
מערכות הפעלה הוא נושא גדול  ורחב.
אפשר לגשת אליו מצד מתכנת מערכת ואז מדובר בקורס ץכנות לכל דבר ועניין,
רק שלרשותנו אין ספריות ענפות אלא רק שירותי מערכת ההפעלה.
אפשר גם לגשת אליו מצד מערכת ההפעלה ואז מדובר בקורס תכנות ברזלים:
המתכנת עומד מול החומרה ומתמודד איתה ללא התמיכה לה אנו רגילים.

בבית ספרנו הקורס עבר מספר גילגולים.
בגילגולו הנוכחי הקורס עוס' ברובו בתכנות מערכות ןהכרת המושגים העיקריים הנוגעים למערכת ההפעלה.

למתענייניפ בקרנל עצמו, בפיתוח נמצאת סדנא בתכנות קרנל.

בדרך כלל מלמדים את הקורס
ד"ר כרמי מרימוביץ
וד"ר משה סולאמי.
{% else %}
The course is usually taught by Dr. Carmi Merimovich and Dr. Moshe Sulami.
{% endif %}