import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for AI Executive Advisor (Chief of Staff AI / Legal AI / Strategic AI)
  app.post('/api/advisor', async (req: Request, res: Response) => {
    const { message, history, agentType, platformData } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === '') {
      // Graceful fallback when Gemini API Key is missing
      console.log('Gemini API Key is missing, serving simulated intelligent executive response.');
      let replyText = '';
      
      if (agentType === 'chief') {
        replyText = `مرحباً سعادة الرئيس التنفيذي د. علي العتيبي. أنا مستشارك الرقمي للتخطيط والمتابعة الاستراتيجية (Chief of Staff AI). 

بناءً على المؤشرات الحالية للمجموعة:
1. **معدل الإنجاز العام (42%)**: يعتبر متوسطاً ويحتاج إلى تسريع العمليات لا سيما في "مخطط التنمية الاستراتيجية 2026-2030" (18%) و"مشروع مجمع أراك التجاري بالإسكندرية" الذي سجل تقدم بنسبة (25%) ومصنف كحالة "حرج" بسبب تأخر توريد الخرسانة للمرحلة الثانية.
2. **الميزانية الإجمالية**: من أصل ميزانية قدرها 288,750,006 جنيه/درهم، تم تخصيص ميزانية ضخمة للفرع الإقليمي بمصر (مجمع الإسكندرية) لضمان التميز العقاري.
3. **أهم التوصيات العاجلة**:
   - توجيه نائب الرئيس للتنمية للمثول في "مجمع الإسكندرية" وحل مشكلة المقاول والخرسانة وتعديل الجدول الزمني.
   - جدولة اللقاء الثاني مع البنك المركزي للحصول على الموافقة الأولية لترخيص "بنك أراك الدولي للتمويل والتنمية والاستثمار" المقدم من نائب رئيس الاستثمار.

هل ترغب في صياغة تكليف رسمي مباشر لنائب رئيس التنمية بخصوص ذلك؟ (ملاحظة: يمكنك إدخال مفتاح GEMINI_API_KEY في لوحة Secrets لتفعيل الذكاء الاصطناعي الحقيقي).`;
      } else if (agentType === 'legal') {
        replyText = `أهلاً بك يا دكتور علي العتيبي، بصفتي المستشار القانوني الرقمي للمجموعة (Legal AI):

موقف الشؤون القانونية حالياً:
- **القضايا النشطة**: لدينا 14 قضية نشطة، منها 3 قضايا مصنفة كعالية المخاطر، أبرزها النزاع على أرض مجمع الإسكندرية التجاري.
- **الجلسات القادمة**: هناك 6 جلسات محاكمة قادمة خلال الـ 14 يوماً المقبلة.
- **العقود قيد المراجعة**: هناك 22 عقداً قيد التدقيق والمطابقة، و7 عقود بانتظار اعتمادكم النهائي للتوقيع.
- **توصيتي**: عقد جلسة طارئة غداً مع رئيس قطاع المطابقة ومستشار النزاعات العقارية لتأمين مستندات الملكية الملحقة ب لصالح مجمع الإسكندرية لتقديمها في الجلسة المقبلة المقررة بعد 4 أيام.

هل تريد مني مراجعة مسودة عقد التأسيس المحدث؟`;
      } else {
        replyText = `مرحباً بك د. علي العتيبي. بصفتي المستشار الاستراتيجي والمالي (Financial AI):

مؤشرات المحفظة الاستثمارية:
- تم تخصيص 85 مليون درهم/جنيه لصندوق الاستثمار في التقنية الناشئة، بنسبة إنجاز 42%.
- بخصوص "بنك أراك الدولي"، فالمؤشرات الأولية تشير إلى جدوى اقتصادية ممتازة بعائد استثماري متوقع 18.4% خلال الـ 3 سنوات الأولى.
- أوصي بالموافقة على اعتماد دراسة الجدوى وتأسيس الصرح البنكي فوراً لدعم الذراع المالي لأعمال المقاولات والتوطين في مصر والسعودية.

كيف يمكنني مساعدتك أكثر في دراسة الجدوى المالية؟`;
      }

      return res.json({ reply: replyText, isSimulated: true });
    }

    try {
      // Real Gemini AI Integration using @google/genai SDK
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      let systemInstruction = `أنت المستشار الذكي الرقمي والذراع الأيمن للرئيس التنفيذي لمجموعة أراك للتنمية (د. علي العتيبي) وتتحدث باللغة العربية بأسلوب رسمي وراقي ومهني جداً.
اسم المجموعة: مجموعة أراك للتنمية (Araak Group).
الرئيس التنفيذي: الدكتور علي العتيبي.
بيانات المجموعة المتوفرة حالياً في المنصة:
- عدد المشاريع الكلية: ${platformData?.projectsCount || 9} مشاريع.
- نسبة الإنجاز العام للمجموعة: ${platformData?.averageProgress || '42%'}
- ميزانية المجموعة الكلية: ${platformData?.totalBudget || '288,750,006 جنيه/درهم'}
- المشاريع الحرجة التي تتطلب اهتماماً فورياً: مجمع أراك التجاري - الإسكندرية (تأخر صب الخرسانة، نسبة الإنجاز 25%، حرج)، خط التنمية الإستراتيجية 2026-2030 (نسبة الإنجاز 18%، حرج)، وصندوق الاستثمار في التقنية الناشئة (نسبة الإنجاز 42%).
- عدد المهام المعلقة والمتأخرة: 34 مهمة كلية منها 8 مهام متأخرة و5 مهام بانتظار الاعتماد.
- فريق العمل المساعد للرئيس التنفيذي: نائب الرئيس للتنمية (vp.dev@arak.com)، نائب الرئيس للاستثمار (vp.invest@arak.com)، مدير أراك التنمية بمصر، مدير النظام.

دورك المختار الآن: `;

      if (agentType === 'chief') {
        systemInstruction += `أنت مستشار التخطيط والمتابعة العام ومساعد رئيس مجلس الإدارة والمدير التنفيذي (Chief of Staff AI). تقوم بتحليل نسب الأداء العام، ربط المهام المتأخرة، تقديم موجز تنفيذي عالي المستوى، واقتراح تكليفات مباشرة ومحاضر اجتماعات عاجلة.`;
      } else if (agentType === 'legal') {
        systemInstruction += `أنت المستشار القانوني الرقمي للمجموعة (Legal AI). تقوم بتحليل مخاطر القضايا (14 قضية، 3 مخاطر عالية)، مراجعة العقود (22 قيد المراجعة، 7 بانتظار الاعتماد)، وتوفير الدعم القانوني بخصوص النزاعات العقارية والامتثال للسياسات العامة (نسبة الامتثال للسياسات الحالية 86%).`;
      } else {
        systemInstruction += `أنت مستشار الاستثمار والتمويل والتحليلات المالية (Financial & Strategy AI). تقوم بتقديم قراءة للميزانيات، تحليل الجدوى المالية للبنك الجديد المزمع إنشاؤه (بنك أراك الدولي بميزانية واعدة)، وتقييم أداء صندوق الاستثمار في التقنية الناشئة.`;
      }

      systemInstruction += `\n\nقم بالرد على رسالة الرئيس التنفيذي بشكل مباشر ومحدد، واستخدم لغة الأرقام المذكورة في المنصة لتدعيم رأيك الاستشاري. لا تذكر تفاصيل تقنية مثل الـ API أو الحقول البرمجية، كن المستشار المخلص والذكي دائم المبادرة.`;

      // Structure history in correct format
      const contents: any[] = [];
      if (history && Array.isArray(history)) {
        history.forEach((h: any) => {
          contents.push({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.content }]
          });
        });
      }
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ reply: response.text || 'عذراً، لم أستطع تكوين رد في الوقت الحالي.', isSimulated: false });
    } catch (error: any) {
      console.error('Error in Gemini API call:', error);
      res.status(500).json({ error: 'حدث خطأ أثناء معالجة طلب المستشار الذكي: ' + error.message });
    }
  });

  // Unified General Gemini Chat API
  app.post('/api/gemini/chat', async (req: Request, res: Response) => {
    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === '') {
      // Simulate real expert strategic CEO advice in Arabic
      const defaultReplies = [
        "بصفتي المستشار التنفيذي الذكي، أرى أن مشروع مجمع الإسكندرية (78% إنجاز) يتطلب تصفية النزاع مع مقاولي الباطن برعاية قانونية عاجلة. ميزانية الـ 45,000,000 جنيه كافية ومستقرة تماماً.",
        "تم رصد مؤشر الأداء التشغيلي لقطاع أراك لوجستيك بجدة بتقدير ممتاز (94.8%). الشحنات البحرية الصادرة والواردة تسير وفق جدول الملاحة المحدث.",
        "التوصية العاجلة: توجيه الشؤون القانونية لاعتماد ملحق التسوية ودعم قطاع الحديد لزيادة معدلات الصهر لتفادي تأخير توريد البنية التحتية.",
        "أهلاً بك يا دكتور علي. تم الربط الدلالي لجميع مستندات حوكمة وامتثال مصنع الحديد والصلب للتأكد من مطابقة معايير السلامة العامة بنسبة 94%."
      ];
      const randomReply = defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
      return res.json({ reply: randomReply, isSimulated: true });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = `أنت المساعد الاستراتيجي الذكي والذراع الأيمن للرئيس التنفيذي لمجموعة أراك للتنمية د. علي العتيبي.
تحدث باللغة العربية الفصحى الراقية والمهنية جداً.
البيانات الاستراتيجية للمجموعة:
- ميزانية المجموعة: 835 مليون درهم/جنيه.
- قطاع لوجستيك جدة يحقق أداء 94.8% مع 18 شحنة بحرية و45 برية.
- فرع مصر ميزانيته 45 مليون جنيه ونسبة إنجاز 78.5% مع نزاع قائم في مجمع الإسكندرية قيد التسوية القانونية الودية.
- مصنع الحديد والصناعة يحقق 78% إنجاز ويحتاج لمتابعة فنية.
أجب عن أي سؤال يطرحه د. علي بدقة وسرية تامة وبإعطاء نصائح تنفيذية ملموسة مبنية على هذه البيانات.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [{ role: 'user', parts: [{ text: message }] }],
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ reply: response.text || 'جاري استخلاص تقرير الأداء...', isSimulated: false });
    } catch (error: any) {
      console.error('Error in unified Gemini chat:', error);
      res.status(500).json({ error: 'Error processing AI chat: ' + error.message });
    }
  });

  // API Route for Voice Command Transcriber & Processor (Whisper + Gemini simulated)
  app.post('/api/voice-transcribe', async (req: Request, res: Response) => {
    const { simulatedAudioDuration } = req.body;
    
    // Simulate real voice command processing
    const apiKey = process.env.GEMINI_API_KEY;
    const hasRealKey = apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey !== '';
    
    // We simulate transcription of a CEO speaking Arabic directive
    const sampleDirectives = [
      {
        transcription: "يا فهد، وجه نائب رئيس التنمية بتقديم تقرير مفصل غداً الصبح عن سير مشروع مجمع الإسكندرية وعقود الحديد.",
        tasks: [
          { title: "إعداد تقرير تفصيلي لصب الخرسانة بمجمع الإسكندرية والمقاولين", sector: "أراك التنمية", priority: "حرج", assignee: "نائب الرئيس - التنمية" },
          { title: "التنسيق مع الشؤون القانونية حول مراجعة عقد الحديد والصلب الملحق", sector: "الحديد والصناعة", priority: "هام", assignee: "المستشار القانوني العام" }
        ]
      },
      {
        transcription: "أريد جدولة اجتماع عاجل الأسبوع القادم لمناقشة تتبع IoT لأسطول النقل مع مدير التقنية وبندر الجوفي.",
        tasks: [
          { title: "تنسيق اجتماع نظام تتبع الشاحنات بالـ IoT لقطاع لوجستيك", sector: "أراك لوجستيك", priority: "هام", assignee: "مدير قطاع التقنية" },
          { title: "مراجعة تقرير الامتثال الأمني لمستودعات لوجستيك بجدة", sector: "الرقابة والتفتيش", priority: "عادي", assignee: "رئيس لجنة الرقابة" }
        ]
      },
      {
        transcription: "اعتمد دراسة جدوى تأسيس بنك أراك الدولي فوراً، وبلغ نائب رئيس الاستثمار بالبدء في إجراءات الترخيص مع البنك المركزي.",
        tasks: [
          { title: "بدء التجهيز لمطابقة شروط ترخيص بنك أراك مع البنك المركزي", sector: "الاستثمار", priority: "حرج", assignee: "نائب الرئيس - الاستثمار" },
          { title: "صياغة المذكرة القانونية لتأسيس ذراع بنكي دولي للمجموعة", sector: "الشؤون القانونية", priority: "هام", assignee: "المستشار القانوني العام" }
        ]
      }
    ];

    const randomDirective = sampleDirectives[Math.floor(Math.random() * sampleDirectives.length)];

    if (!hasRealKey) {
      // Return beautiful Arabic mock response simulating Whisper transcription + Gemini task extraction
      return res.json({
        transcription: randomDirective.transcription,
        extractedTasks: randomDirective.tasks,
        isSimulated: true,
        aiLog: "تم استخدام معالج الكلمات المدمج محلياً لصياغة الأوامر. يمكنك ربط مفتاح Gemini للتحليل الحركي الذكي."
      });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Use Gemini to write a funny/smart audio-like dynamic transcription and extract tasks
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `الرئيس التنفيذي لمجموعة أراك للتنمية قام بتسجيل صوتي عاجل. 
اقترح محاكاة رائعة لتوجيه صوتي تنفيذي باللغة العربية بلهجة سعودية/خليجية رسمية عصرية، واقترح جدولاً من مهمتين مستخلصتين من هذا التوجيه بشكل دقيق في صيغة JSON صالحة.
أرجع النتيجة بصيغة JSON نظيفة تحتوي على الحقول التالية فقط:
{
  "transcription": "نص التوجيه الصوتي المحاكى للرئيس التنفيذي",
  "extractedTasks": [
    { "title": "عنوان المهمة المستخلصة", "sector": "القطاع المعني", "priority": "حرج أو هام أو عادي", "assignee": "اسم الشخص المعين له المهمة من فريق الإدارة العليا" }
  ]
}`,
        config: {
          responseMimeType: "application/json"
        }
      });

      const result = JSON.parse(response.text || '{}');
      res.json({
        transcription: result.transcription || randomDirective.transcription,
        extractedTasks: result.extractedTasks || randomDirective.tasks,
        isSimulated: false
      });
    } catch (e) {
      console.error('Error parsing Voice command from Gemini:', e);
      res.json({
        transcription: randomDirective.transcription,
        extractedTasks: randomDirective.tasks,
        isSimulated: true
      });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CEO Digital Office Server running on http://localhost:${PORT}`);
  });
}

startServer();
