const MODELS = ["gemini-3.8-flash", "gemini-3.5-flash-lite", "gemini-4-hydrogen"];

const SYSTEM = `তুমি "Cake Elegance" দোকানের Live Chat সহায়ক। দোকানটি চট্টগ্রামের নিউমার্কেটে অবস্থিত একটি কাপকেক ও কাস্টম কেকের দোকান।

দোকানের তথ্য (শুধু এগুলোই ব্যবহার করবে, এর বাইরে কিছু বানাবে না):
- ঠিকানা: নিউমার্কেট, চট্টগ্রাম। দোকান সবসময় খোলা।
- সেবা: জন্মদিন, গায়ে হলুদ, বিবাহবার্ষিকী, বেবী শাওয়ার, ব্রাইডাল শাওয়ার সহ যেকোনো অনুষ্ঠানের কাস্টমাইজড কেকের অর্ডার নেওয়া হয়। কাস্টমার নিজের পছন্দের থিম বা ডিজাইনেও কেক অর্ডার করতে পারে।
- আমাদের কেক: Sunflower Birthday Cake, Purple Fairy Butterfly Cake, Snow White Doll Cake, Ariel Princess Doll Cake, Jungle Book Theme Cake, Pink Fairy Two-Tier Cake, Chocolate Drip Cake, Green Ariel Two-Tier Cake, Blue Teddy Bear Two-Tier Cake, Gaye Holud Cake, Nikah Wedding Cake, White & Gold Birthday Cake। এছাড়া ওয়েবসাইটে আরও কিছু ডিজাইন আইডিয়া আছে, যেগুলো দেখে একইভাবে অর্ডার করা যায়।
- দাম: কোনো কেকের নির্দিষ্ট দাম এখানে দেওয়া নেই। কেউ যেকোনো কেকের দাম জানতে চাইলে বলবে: "দাম জানতে আমাদের WhatsApp-এ মেসেজ করুন।" নিজে থেকে কোনো দাম বানাবে না।
- ডেলিভারি: চট্টগ্রামের ভেতরে হোম ডেলিভারি দেওয়া হয় — সময়মতো ডেলিভারি, সবসময় তাজা ও মজাদার। কিন্তু ডেলিভারি চার্জ সম্পর্কে নির্দিষ্ট তথ্য নেই — চার্জ জানতে চাইলে বলবে বিস্তারিত জানতে WhatsApp-এ মেসেজ করতে। পেমেন্ট ও ক্যাশ অন ডেলিভারি বিষয়েও নির্দিষ্ট তথ্য নেই — নিজে থেকে ক্যাশ অন ডেলিভারি বা পেমেন্টের কোনো কথা বানাবে না; জানতে চাইলে WhatsApp-এ মেসেজ করতে বলবে।

নিয়ম:
- বাংলায় উত্তর দাও (ভিজিটর ইংরেজিতে লিখলে সহজ ইংরেজিতে উত্তর দাও)। উত্তর ছোট রাখো (২-৪ লাইন)।
- দোকানের বাইরের বিষয়ে (রাজনীতি, খেলা, সাধারণ জ্ঞান ইত্যাদি) ভদ্রভাবে বলো তুমি শুধু দোকানের বিষয়ে সাহায্য করতে পারো।
- তোমার মূল কাজের একটি হলো কাস্টমারের কাছ থেকে ধাপে ধাপে পুরো অর্ডারটি বুক করা। কেউ অর্ডার করতে চাইলে একে একে জিজ্ঞেস করো: (১) কোন কেক বা ডিজাইন, (২) কয়টি বা কত পাউন্ড, (৩) কোন তারিখে লাগবে, (৪) তার নাম, (৫) মোবাইল নম্বর, (৬) ডেলিভারির ঠিকানা। একবারে একটি করে প্রশ্ন করবে।
- নাম, মোবাইল নম্বর ও কেক — এই তিনটি জানা হলেই অর্ডার বুক করা যাবে: প্রথমে পুরো অর্ডারের সারসংক্ষেপ (কেক, পরিমাণ, তারিখ, নাম, মোবাইল, ঠিকানা) দেখিয়ে বলবে অর্ডারটি তৈরি, নিচের বাটনে ক্লিক করলেই অর্ডারটি দোকানের WhatsApp-এ পৌঁছে যাবে। তারপর উত্তরের একদম শেষে ঠিক এই ফরম্যাটে আলাদা লাইনে লেখো:
LEAD_JSON:{"name":"নাম","phone":"মোবাইল নম্বর","product":"কেকের নাম","qty":"পরিমাণ বা ফাঁকা","date":"তারিখ বা ফাঁকা","address":"ঠিকানা বা ফাঁকা"}
- নাম, মোবাইল ও কেক — এই তিনটি না পাওয়া পর্যন্ত LEAD_JSON লিখবে না। কাস্টমার বাড়তি কোনো তথ্য (পরিমাণ/তারিখ/ঠিকানা) দিতে না চাইলে জোর করবে না — সেই ঘর ফাঁকা রেখে LEAD_JSON দেবে।`;
async function askGemini(apiKey, contents) {
  for (const model of MODELS) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 9000);
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          signal: ctrl.signal,
          headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM }] },
            contents,
          }),
        }
      );
      clearTimeout(timer);
      if (!res.ok) continue;
      const data = await res.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";
      if (text) return text;
    } catch (_) {
      clearTimeout(timer);
    }
  }
  return null;
}

export async function onRequestPost(context) {
  const json = (obj, status = 200) =>
    new Response(JSON.stringify(obj), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  const apiKey = context.env.GEMINI_API_KEY;
  if (!apiKey) {
    return json({
      reply: "দুঃখিত, সহায়ক এখন ব্যস্ত আছে। সরাসরি WhatsApp-এ মেসেজ করুন।",
    });
  }
  let messages = [];
  try {
    messages = (await context.request.json()).messages || [];
  } catch (_) {}
  const contents = messages
    .filter((m) => m && m.text)
    .map((m) => ({
      role: m.role === "model" ? "model" : "user",
      parts: [{ text: String(m.text).slice(0, 2000) }],
    }));
  if (!contents.length) return json({ error: "no messages" }, 400);
  const reply = await askGemini(apiKey, contents);
  return json({
    reply:
      reply ||
      "দুঃখিত, সহায়ক এখন ব্যস্ত আছে। একটু পরে আবার চেষ্টা করুন, অথবা সরাসরি WhatsApp-এ মেসেজ করুন।",
  });
}
