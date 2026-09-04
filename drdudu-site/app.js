const IMG = {
  clinic: "https://static.wixstatic.com/media/2fd671_f94b47083a464d29b229b9e56502c2b3~mv2.jpg/v1/fill/w_1400,h_900,al_c,q_88/CLINIC%20LIGHT%20PAINT.jpg",
  doctor: "https://static.wixstatic.com/media/2fd671_a73676a2246b470984abe3295f091e49~mv2.jpg/v1/fill/w_900,h_1100,al_c,q_88/about%20the%20dr.jpg",
  implants: "https://static.wixstatic.com/media/2fd671_a9a41b1f78cc41fb839c90eef9afa006~mv2.jpg/v1/fill/w_1052,h_680,al_c,q_88/3298013.jpg",
  prostho: "https://static.wixstatic.com/media/2fd671_923f5a8a2df0460b812c8b36c8640cee~mv2.jpg/v1/fill/w_980,h_718,al_c,q_88/2fd671_923f5a8a2df0460b812c8b36c8640cee~mv2.jpg",
  tech: "https://static.wixstatic.com/media/2fd671_d8d2d3c930ab465ab06e74bc9ea4f759~mv2.jpg/v1/fill/w_760,h_560,al_c,q_88/panoramic.jpg",
  smile: "https://static.wixstatic.com/media/11062b_4b7c9a8e48334d5aad2fd274fddba3bc~mv2.jpg/v1/fill/w_980,h_493,al_c,q_88/11062b_4b7c9a8e48334d5aad2fd274fddba3bc~mv2.jpg",
  lab: "https://static.wixstatic.com/media/2fd671_6982abfb1c4048b49af6bc9495cf1f98~mv2.jpg/v1/fill/w_792,h_520,al_c,q_88/776_edited.jpg"
};

const treatments = [
  {
    id: "implants",
    title: "שתלים והשתלת עצם",
    image: IMG.implants,
    text: "פתרונות לשיניים חסרות, כולל מקרים מורכבים של חוסר עצם, שתלים צרים/קצרים ותכנון שיקום אישי.",
    link: "#implants"
  },
  {
    id: "rehab",
    title: "שיקום הפה",
    image: IMG.prostho,
    text: "כתרים, גשרים, תותבות ושיקום על גבי שתלים בחומרים אסתטיים מתקדמים.",
    link: "#rehab"
  },
  {
    id: "technology",
    title: "טכנולוגיה דיגיטלית",
    image: IMG.tech,
    text: "צילום פנורמי, סריקה תלת ממדית, תכנון דיגיטלי וטכנולוגיות שמסייעות בדיוק הטיפול.",
    link: "#technology"
  },
  {
    id: "oneday",
    title: "שיניים ביום אחד",
    image: IMG.smile,
    text: "במקרים מתאימים ניתן לבצע עקירות, שתלים ושיקום מעבר באותו יום, כולל אפשרות לטשטוש או הרדמה כללית.",
    link: "#oneday"
  },
  {
    id: "perio",
    title: "טיפולי חניכיים",
    image: IMG.clinic,
    text: "אבחון, תחזוקה וטיפול במחלות חניכיים כחלק מתוכנית שמירה על השיניים והשתלים.",
    link: "#perio"
  },
  {
    id: "conservative",
    title: "טיפולים משמרים",
    image: IMG.lab,
    text: "סתימות, טיפולי שורש, שחזורים וטיפול מניעתי בגישה מדויקת ושמרנית ככל האפשר.",
    link: "#treatments"
  }
];

const pages = {
  home: () => `
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-copy">
          <span class="eyebrow">מרפאת שיניים בחולון</span>
          <h1>השתלות שיניים ושיקום הפה בגישה אישית</h1>
          <p>ד"ר דודו יגודייב, רופא שיניים DMD משנת 2008, משלב ניסיון כירורגי, תכנון דיגיטלי וטכנולוגיות מתקדמות לטיפול במטופלים רגילים וגם במקרים מורכבים.</p>
          <div class="hero-actions">
            <a class="primary-btn" href="#contact">לקביעת תור</a>
            <a class="secondary-btn" href="tel:035030483">03-5030483</a>
          </div>
        </div>
        <div class="hero-facts" aria-label="נתוני המרפאה">
          <div class="fact"><strong>משנת 2008</strong><span>ניסיון קליני ברפואת שיניים</span></div>
          <div class="fact"><strong>חולון</strong><span>סוקולוב 57, נגיש ונוח</span></div>
          <div class="fact"><strong>דיגיטלי</strong><span>סריקות, הדמיה ותכנון מתקדם</span></div>
        </div>
      </div>
    </section>
    ${treatmentsSection()}
    <section class="section alt">
      <div class="section-inner split">
        <div>
          <span class="eyebrow">גישה טיפולית</span>
          <h2>תוכנית טיפול ברורה לפני שמתחילים</h2>
          <p>הדגש בסקיצה החדשה הוא להפוך את האתר לפחות עמוס ויותר משכנע: פחות טקסט מפוזר, יותר סדר, חלוקה ברורה לפי צורך רפואי, והובלה רגועה ליצירת קשר.</p>
          <ul class="feature-list">
            <li>אבחון מסודר ותיאום ציפיות</li>
            <li>הסבר פשוט על אפשרויות הטיפול</li>
            <li>פתרונות למטופלים עם חוסר עצם או מחלות רקע</li>
            <li>שיקום אסתטי ותפקודי לטווח ארוך</li>
          </ul>
        </div>
        <img src="${IMG.clinic}" alt="מרפאת ד״ר דודו יגודייב">
      </div>
    </section>
    ${doctorSection()}
    ${reviewsSection()}
    ${contactSection()}
  `,
  implants: () => articlePage({
    title: "שתלים והשתלת עצם",
    kicker: "פתרונות לשיניים חסרות",
    image: IMG.implants,
    text: [
      "שתל דנטלי הוא תחליף לשורש השן שאבד. לאחר קליטה בעצם ניתן לבנות עליו כתר, גשר או שיקום מלא, כך שהמטופל מקבל פתרון יציב ונוח יותר מתותבת נשלפת במקרים רבים.",
      "במקרים שבהם חסרה עצם באזור ההשתלה נדרשת לעיתים השתלת עצם, הרמת סינוס או שימוש בשתלים ותכנון מותאמים. מטרת הבדיקה היא לבחור את הדרך הנכונה לפי מצב העצם, הבריאות הכללית והצורך השיקומי."
    ],
    bullets: ["שתלים בודדים או שיקום מלא", "השתלת עצם והרמות סינוס במידת הצורך", "תכנון אישי למטופלים עם סוכרת, עישון או עצם ירודה", "שיקום זמני וקבוע בהתאם למקרה"],
    faqs: [
      ["האם כל אחד מתאים להשתלות?", "לא תמיד. צריך לבדוק מצב רפואי, עצם זמינה, חניכיים והרגלים כמו עישון. ברוב המקרים ניתן למצוא פתרון, אבל לא תמיד אותו פתרון."],
      ["כמה זמן עד לשיקום?", "בדרך כלל כמה חודשים, בהתאם לקליטת השתל ולמצב העצם. במקרים מסוימים אפשר לבצע שיקום מעבר מוקדם יותר."],
      ["האם חוסר עצם מונע השתלה?", "לא בהכרח. לעיתים ניתן לבצע השתלת עצם, הרמת סינוס, או לבחור פתרון אחר שמתאים לאזור ולמצב הרפואי."]
    ]
  }),
  rehab: () => articlePage({
    title: "שיקום הפה",
    kicker: "כתרים, גשרים ושיקום על שתלים",
    image: IMG.prostho,
    text: [
      "שיקום הפה מחבר בין בריאות, תפקוד ואסתטיקה. המטרה היא להחזיר יכולת לעיסה, דיבור וחיוך טבעי תוך התאמה לחומרי השיקום, למבנה הפה ולתקציב.",
      "הסקיצה מציגה את השיקום כעמוד מרכזי ולא כטקסט צדדי, כדי שמטופל יבין מהר מה אפשר לעשות ומה השלב הבא."
    ],
    bullets: ["כתרי זירקוניה וחרסינה", "גשרים ושיקום על גבי שתלים", "תותבות במקרים מתאימים", "סריקה דיגיטלית והעברה למעבדה"],
    faqs: [
      ["מה ההבדל בין כתר לגשר?", "כתר משקם שן אחת. גשר משלים חסר של שן או כמה שיניים בעזרת תמיכה בשיניים או שתלים סמוכים."],
      ["האם חייבים תותבת?", "לא תמיד. במקרים רבים אפשר לבחון שתלים או גשרים, אבל ההחלטה תלויה במצב העצם, השיניים והבריאות הכללית."]
    ]
  }),
  technology: () => articlePage({
    title: "טכנולוגיה מתקדמת במרפאה",
    kicker: "אבחון ותכנון מדויקים יותר",
    image: IMG.tech,
    text: [
      "צילום פנורמי, סריקה דיגיטלית ותכנון ממוחשב מאפשרים לראות את מצב הפה בצורה רחבה וברורה יותר, לזהות בעיות מוקדם ולתכנן טיפול מדויק.",
      "באתר החדש כדאי להציג את הטכנולוגיה בצורה מקצועית אך לא מוגזמת: לא כהבטחה קסומה, אלא ככלי שעוזר לרופא לקבל החלטות טובות יותר."
    ],
    bullets: ["צילום פנורמי בפיקוח משרד הבריאות", "סריקה תלת ממדית ללא מדידות מסורתיות במקרים מתאימים", "תכנון שיקום דיגיטלי", "טכנולוגיות לתמיכה בקליטת שתלים"],
    faqs: [
      ["למה צריך צילום פנורמי?", "הצילום מאפשר לראות את הלסתות, השיניים והמבנים הסמוכים ומסייע לאבחון לפני טיפול."],
      ["מה היתרון של סריקה דיגיטלית?", "הסריקה יכולה לקצר ולדייק תהליכי מדידה ושיקום, ולהעביר את הנתונים למעבדה באופן מהיר."]
    ]
  }),
  oneday: () => articlePage({
    title: "שיניים ביום אחד",
    kicker: "למקרים שמתאימים לכך",
    image: IMG.smile,
    text: [
      "במקרים מסוימים ניתן לבצע עקירות, התקנת שתלים ושיקום מעבר זמני באותו יום. זהו טיפול שמחייב תכנון מוקדם, בדיקת עצם והתאמה רפואית.",
      "חשוב להציג את השירות בצורה אחראית: לא כל מטופל מתאים, ולעיתים נכון יותר לבצע טיפול בשלבים כדי לשפר את סיכויי ההצלחה."
    ],
    bullets: ["בדיקת התאמה לפני החלטה", "אפשרות לטשטוש או הרדמה כללית במקרים מתאימים", "שיקום מעבר זמני עד לשיקום הקבוע", "ליווי והסבר לאורך התהליך"],
    faqs: [
      ["האם באמת יוצאים עם שיניים?", "במקרים מתאימים יוצאים עם שיקום זמני. השיקום הקבוע מגיע לאחר שלב הריפוי."],
      ["למי זה לא מתאים?", "מטופלים עם חוסר עצם משמעותי, דלקת פעילה או מגבלות רפואיות עשויים להזדקק לתוכנית אחרת."]
    ]
  }),
  perio: () => articlePage({
    title: "טיפולי חניכיים",
    kicker: "בסיס לשיניים ולשתלים יציבים",
    image: IMG.clinic,
    text: [
      "בריאות החניכיים משפיעה על השיניים הטבעיות ועל שתלים. דימום, ניידות שיניים, ריח רע או נסיגת חניכיים דורשים אבחון וטיפול מוקדם.",
      "עמוד כזה באתר צריך להסביר בפשטות למה תחזוקה ובדיקות תקופתיות חשובות, בלי להפחיד את המטופל."
    ],
    bullets: ["אבחון מחלת חניכיים", "הדרכה להיגיינה ותחזוקה", "טיפולי שיננית ומעקב", "שמירה על שתלים לאורך זמן"],
    faqs: [
      ["האם דימום בצחצוח הוא סימן בעייתי?", "כן, דימום חוזר יכול להעיד על דלקת חניכיים וכדאי לבדוק אותו."],
      ["האם שתלים צריכים תחזוקה?", "כן. שתלים אינם חסינים מדלקות ולכן חשוב להגיע לביקורות וטיפולי תחזוקה."]
    ]
  }),
  treatments: () => `
    <section class="page-hero">
      <div class="page-intro">
        <span class="eyebrow">כל הטיפולים</span>
        <h1>טיפולי שיניים במרפאה</h1>
        <p>עמוד מרכזי שמסדר למטופל את אפשרויות הטיפול בלי עומס: מה הבעיה, איזה פתרון קיים, ומה כדאי לבדוק בפגישה.</p>
      </div>
    </section>
    ${treatmentsSection(false)}
    <section class="section alt">
      <div class="section-inner simple-grid">
        ${["כתרים ותותבות", "יישור שיניים", "טיפולי שורש", "סתימות ושחזורים", "חזיתות חרסינה", "בדיקות תקופתיות", "הרדמה כללית", "חוות דעת נוספת"].map(item => `
          <article class="simple-card">
            <strong>${item}</strong>
            <p>תיאור קצר וברור שמוביל לייעוץ אישי במקום טקסט ארוך ומבלבל.</p>
          </article>
        `).join("")}
      </div>
    </section>
    ${contactSection()}
  `,
  about: () => `
    <section class="page-hero">
      <div class="page-intro">
        <span class="eyebrow">אודות</span>
        <h1>ד"ר דודו יגודייב</h1>
        <p>רופא שיניים DMD משנת 2008, דור שלישי לעוסקים ברפואת שיניים, מתמקצע בכירורגיית שתלים ושיקום הפה.</p>
      </div>
    </section>
    ${doctorSection(false)}
    <section class="section alt">
      <div class="section-inner split">
        <div>
          <h2>ניסיון, הוראה והתעדכנות מקצועית</h2>
          <p>ד"ר יגודייב חבר בהסתדרות לרפואת שיניים, בעמותה הישראלית להשתלות דנטליות IAOI ובקונגרס הבינלאומי להשתלות דנטליות ICOI בעל תואר Fellow. בנוסף הוא מרצה בתחום השתלות השיניים ושיפור בניית עצם סביב שתלים.</p>
        </div>
        <ul class="check-list">
          <li>רופא שיניים מוסמך משנת 2008</li>
          <li>הכשרות בכירורגיית שתלים ושיקום</li>
          <li>מוסמך משרד הבריאות לטיפולים תחת הרדמה כללית</li>
          <li>השתתפות בקורסים מקצועיים בארץ ובעולם</li>
        </ul>
      </div>
    </section>
    ${contactSection()}
  `,
  reviews: () => `
    <section class="page-hero">
      <div class="page-intro">
        <span class="eyebrow">מטופלים ממליצים</span>
        <h1>ביקורות וחוויות מטופלים</h1>
        <p>בשלב הסקיצה שמרתי מקום מסודר לביקורות אמיתיות, סרטונים או צילומי Google Reviews. לפני פרסום חי כדאי לשלב רק ביקורות מאושרות.</p>
      </div>
    </section>
    ${reviewsSection(false)}
    ${contactSection()}
  `,
  contact: () => `
    <section class="page-hero">
      <div class="page-intro">
        <span class="eyebrow">צור קשר</span>
        <h1>קביעת תור וייעוץ ראשוני</h1>
        <p>המרפאה נמצאת ברחוב סוקולוב 57, חולון. אפשר להשאיר פרטים או להתקשר ישירות.</p>
      </div>
    </section>
    ${contactSection(false)}
  `,
  privacy: () => articlePage({
    title: "הצהרת פרטיות",
    kicker: "סקיצה לעמוד חובה",
    image: IMG.clinic,
    text: [
      "עמוד זה מיועד לנוסח משפטי/פרטיות מסודר לפני פרסום האתר. בסקיצה נשמר מקום למדיניות פרטיות, שימוש בטפסים, עוגיות ומעקב כניסות.",
      "לפני העלאה לאתר חי מומלץ לעבור על הנוסח המשפטי ולוודא התאמה לאופן שבו נאספים פרטים באתר."
    ],
    bullets: ["פרטי יצירת קשר נשמרים לצורך חזרה לפונה", "לא יוצגו פרטי מטופלים ללא אישור", "ניתן להסיר או לשנות מידע לפי בקשה"],
    faqs: []
  })
};

function treatmentsSection(showHead = true) {
  return `
    <section class="section">
      <div class="section-inner">
        ${showHead ? `
          <div class="section-head">
            <div>
              <span class="eyebrow">הטיפולים במרפאה</span>
              <h2>עמודים ברורים לפי צורך רפואי</h2>
            </div>
            <p>במקום רשימת קישורים עמוסה, האתר החדש מציג לכל טיפול כניסה ברורה עם הסבר קצר ופעולה אחת טבעית.</p>
          </div>
        ` : ""}
        <div class="treatment-grid">
          ${treatments.map(item => `
            <article class="treatment-card">
              <img src="${item.image}" alt="${item.title}">
              <div>
                <h3>${item.title}</h3>
                <p>${item.text}</p>
                <a href="${item.link}">קראו עוד</a>
              </div>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function doctorSection(wrap = true) {
  const content = `
    <div class="section-inner doctor-panel">
      <img src="${IMG.doctor}" alt="ד״ר דודו יגודייב">
      <div class="doctor-copy">
        <span class="eyebrow">הכירו את הרופא</span>
        <h2>מקצועיות גבוהה, הסבר בגובה העיניים</h2>
        <p>ד"ר דודו יגודייב סיים את לימודי רפואת השיניים בשנת 2008. הוא מתמקצע בהשתלות דנטליות, שיקום הפה וטיפולי שיניים משמרים, עם דגש על טיפול מותאם אישית וידע מקצועי עדכני.</p>
        <p>הסיפור האישי והמקצועי מקבל באתר החדש מקום מכובד, אבל קצר וקריא יותר, כדי שהמטופל יבין מהר מי מטפל בו ולמה אפשר לסמוך עליו.</p>
        <div class="credentials">
          <span>DMD משנת 2008</span>
          <span>חבר IAOI</span>
          <span>ICOI Fellow</span>
          <span>הרדמה כללית</span>
        </div>
      </div>
    </div>
  `;
  return wrap ? `<section class="section alt">${content}</section>` : `<section class="section">${content}</section>`;
}

function reviewsSection(wrap = true) {
  const content = `
    <div class="section-inner">
      <div class="section-head">
        <div>
          <span class="eyebrow">מטופלים ממליצים</span>
          <h2>אמון שנבנה דרך חוויה אמיתית</h2>
        </div>
        <p>כאן כדאי לשלב ביקורות Google אמיתיות, סרטוני מטופלים או ציטוטים מאושרים. כרגע אלו טקסטים לדוגמה בלבד.</p>
      </div>
      <div class="reviews">
        <article class="review"><div class="stars">★★★★★</div><p>הסבר ברור לפני הטיפול, יחס רגוע ומקצועי לאורך כל הדרך.</p></article>
        <article class="review"><div class="stars">★★★★★</div><p>הגעתי עם חשש גדול וקיבלתי תוכנית מסודרת והרגשה שיש על מי לסמוך.</p></article>
        <article class="review"><div class="stars">★★★★★</div><p>מרפאה נעימה, ציוד מתקדם ותוצאה אסתטית שמרגישה טבעית.</p></article>
      </div>
    </div>
  `;
  return wrap ? `<section class="section deep">${content}</section>` : `<section class="section deep">${content}</section>`;
}

function contactSection(wrap = true) {
  const content = `
    <div class="section-inner contact-layout">
      <div class="contact-box">
        <span class="eyebrow">יצירת קשר</span>
        <h2>לקביעת תור במרפאה</h2>
        <p class="muted">השארת פרטים בסקיצה לא שולחת מידע עדיין. בפרסום חי נחבר את הטופס לגיליון, מייל או הודעת WhatsApp לפי מה שנבחר.</p>
        <div class="contact-lines">
          <a href="tel:035030483">טלפון: 03-5030483</a>
          <span>כתובת: סוקולוב 57, חולון</span>
          <span>תחומים מרכזיים: השתלות, שיקום, חניכיים וטכנולוגיה דיגיטלית</span>
        </div>
      </div>
      <form class="contact-box form" onsubmit="event.preventDefault(); alert('בסקיצה הטופס לא מחובר עדיין.');">
        <label class="field">שם מלא<input type="text" autocomplete="name" placeholder="שם המטופל"></label>
        <label class="field">טלפון<input type="tel" autocomplete="tel" placeholder="050-0000000"></label>
        <label class="field">במה תרצה להתייעץ?<textarea placeholder="לדוגמה: השתלת שיניים, שיקום, בדיקה כללית"></textarea></label>
        <button class="primary-btn" type="submit">שליחת פרטים</button>
      </form>
    </div>
  `;
  return wrap ? `<section class="section alt">${content}</section>` : `<section class="section">${content}</section>`;
}

function articlePage({ title, kicker, image, text, bullets, faqs }) {
  return `
    <section class="page-hero">
      <div class="page-intro">
        <span class="eyebrow">${kicker}</span>
        <h1>${title}</h1>
        <p>${text[0]}</p>
        <div class="section-actions">
          <a class="primary-btn" href="#contact">לקביעת ייעוץ</a>
          <a class="secondary-btn" href="tel:035030483">התקשרו למרפאה</a>
        </div>
      </div>
    </section>
    <article class="article">
      <div class="article-grid">
        <img src="${image}" alt="${title}">
        <div>
          ${text.map(p => `<p>${p}</p>`).join("")}
          <ul class="check-list">
            ${bullets.map(b => `<li>${b}</li>`).join("")}
          </ul>
        </div>
      </div>
      ${faqs.length ? `
        <div class="faq">
          ${faqs.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}
        </div>
      ` : ""}
    </article>
    ${contactSection()}
  `;
}

function render() {
  const key = (location.hash || "#home").replace("#", "");
  const view = pages[key] ? key : "home";
  document.querySelector("#app").innerHTML = pages[view]();
  document.querySelectorAll(".main-nav a").forEach(a => {
    a.classList.toggle("active", a.getAttribute("href") === `#${view}`);
  });
  document.body.classList.remove("nav-open");
  document.querySelector(".menu-toggle").setAttribute("aria-expanded", "false");
  window.scrollTo({ top: 0, behavior: "instant" });
}

document.querySelector(".menu-toggle").addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  document.querySelector(".menu-toggle").setAttribute("aria-expanded", String(isOpen));
});

window.addEventListener("hashchange", render);
render();
