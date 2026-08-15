// Curriculum content for the AI Explorers course: 3 levels, 6 units, 17 lessons.
// Kept separate from seed.ts to keep the content readable on its own.

export interface QuizQuestionSeed {
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export type ContentBlockSeed =
  | { type: "text"; text: string }
  | { type: "callout"; text: string }
  | { type: "image"; imageKey: string; alt: string };

export interface LessonSeed {
  key: string;
  title: string;
  order: number;
  estimatedMinutes: number;
  imageKey: string | null;
  content: ContentBlockSeed[];
  tutorPromptSuggestions: string[];
  quiz: QuizQuestionSeed[];
}

export interface UnitSeed {
  key: string;
  name: string;
  description: string;
  order: number;
  lessons: LessonSeed[];
}

export interface LevelSeed {
  key: string;
  name: string;
  description: string;
  order: number;
  minAge: number;
  maxAge: number;
  imageKey: string | null;
  units: UnitSeed[];
}

export const CURRICULUM: LevelSeed[] = [
  {
    key: "beginner",
    name: "Meet AI",
    description: "Start your journey! Discover what AI really is and meet your first chatbot.",
    order: 1,
    minAge: 7,
    maxAge: 12,
    imageKey: "mascot",
    units: [
      {
        key: "what-is-ai",
        name: "What Is AI?",
        description: "The basics: what AI means and where you already see it every day.",
        order: 1,
        lessons: [
          {
            key: "what-does-ai-mean",
            title: "What Does \"AI\" Mean?",
            order: 1,
            estimatedMinutes: 4,
            imageKey: "l1_1_what_is_ai",
            content: [
              { type: "text", text: "AI stands for Artificial Intelligence. \"Artificial\" means something made by people, not found in nature. \"Intelligence\" means being able to think, learn, and solve problems. So AI means a computer that has been built to act a little bit like it can think!" },
              { type: "text", text: "You've probably already used AI without even knowing it! Every time you ask a smart speaker a question, or a game guesses what move you'll make next, that's AI working behind the scenes." },
              { type: "callout", text: "Fun fact: the first ideas about \"thinking machines\" go all the way back to the 1950s - AI has been growing and changing for over 70 years!" },
              { type: "image", imageKey: "l1_1_what_is_ai", alt: "A curious child looking up at glowing letters A and I above a friendly robot" },
            ],
            tutorPromptSuggestions: ["What does AI stand for?", "Give me another example of AI I might use."],
            quiz: [
              { questionText: 'What does "AI" stand for?', options: ["Artificial Intelligence", "Automatic Internet", "Amazing Inventions", "Animal Instinct"], correctAnswer: "Artificial Intelligence", explanation: "AI stands for Artificial Intelligence - a computer built to act a bit like it can think." },
              { questionText: 'What does "artificial" mean?', options: ["Made by people, not found in nature", "Something very old", "Something invisible", "Something loud"], correctAnswer: "Made by people, not found in nature", explanation: "Artificial means made by people rather than something that happens naturally." },
              { questionText: "Which of these best describes what AI can do?", options: ["Think, learn, and solve problems", "Fly like a bird", "Grow like a plant", "Feel hungry"], correctAnswer: "Think, learn, and solve problems", explanation: "AI is built to think, learn, and solve problems - though not exactly the way people do." },
            ],
          },
          {
            key: "ai-around-you",
            title: "AI All Around You",
            order: 2,
            estimatedMinutes: 4,
            imageKey: "l1_2_ai_around_you",
            content: [
              { type: "text", text: "AI isn't just in science fiction movies - it's part of your everyday life! When a photo app finds all the pictures of your dog, that's AI. When a video app recommends a show you might like, that's AI too." },
              { type: "text", text: "Smart speakers that answer your questions out loud use AI to understand your words and find an answer. Even some video games use AI to control characters that react to what you do." },
              { type: "callout", text: "Try this: next time you use an app, ask yourself - could AI be helping this work?" },
              { type: "image", imageKey: "l1_2_ai_around_you", alt: "A cozy room with a smart speaker, tablet, and phone connected by glowing lines" },
            ],
            tutorPromptSuggestions: ["What are three apps that might use AI?", "How does a smart speaker understand me?"],
            quiz: [
              { questionText: "Which of these is a real example of AI in daily life?", options: ["A photo app that finds pictures of your pet", "A wooden ruler", "A paper notebook", "A rubber ball"], correctAnswer: "A photo app that finds pictures of your pet", explanation: "Photo apps often use AI to recognize people, pets, and objects in pictures." },
              { questionText: "What helps a smart speaker answer your questions?", options: ["AI that understands your words", "Magic", "A tiny person inside", "Nothing, it just repeats sounds"], correctAnswer: "AI that understands your words", explanation: "Smart speakers use AI to understand spoken language and find helpful answers." },
              { questionText: "Which app feature likely uses AI?", options: ["A video app suggesting what to watch next", "The app's volume button", "The app's icon color", "The app's file size"], correctAnswer: "A video app suggesting what to watch next", explanation: "Recommending what to watch is a classic AI feature - it learns from what you've watched before." },
            ],
          },
          {
            key: "robots-vs-ai",
            title: "Robots vs. AI: What's the Difference?",
            order: 3,
            estimatedMinutes: 4,
            imageKey: "l1_3_robots_vs_ai",
            content: [
              { type: "text", text: "People often mix up robots and AI, but they're not the same thing! A robot is a physical machine - something you can touch, like a robot vacuum or a toy robot arm." },
              { type: "text", text: "AI is the \"thinking part\" - the software that can make decisions. Some robots use AI to think, but many robots don't use AI at all - they just follow simple, fixed instructions over and over." },
              { type: "callout", text: "Think of it this way: a robot is like a body, and AI is like a brain. A robot can have a very simple brain (no AI) or a smart AI brain - it depends on how it was built!" },
              { type: "image", imageKey: "l1_3_robots_vs_ai", alt: "A toy robot and a glowing digital brain character side by side with a curious child" },
            ],
            tutorPromptSuggestions: ["Can a robot exist without AI?", "Give me an example of a robot that uses AI."],
            quiz: [
              { questionText: "What is a robot?", options: ["A physical machine you can touch", "A word for AI", "A type of computer game", "A kind of internet"], correctAnswer: "A physical machine you can touch", explanation: "A robot is a physical machine, while AI is the thinking software that can be inside it." },
              { questionText: "Do all robots use AI?", options: ["No, many just follow simple fixed instructions", "Yes, every robot is smart", "Only toy robots use AI", "Robots and AI are always the same"], correctAnswer: "No, many just follow simple fixed instructions", explanation: "Many robots just repeat simple pre-programmed movements without any AI." },
              { questionText: "Which comparison best fits robots and AI?", options: ["Robot = body, AI = brain", "Robot = brain, AI = body", "They are the exact same thing", "Neither has anything to do with computers"], correctAnswer: "Robot = body, AI = brain", explanation: "A helpful way to remember it: the robot is like a body, and AI is like the brain that can make it smart." },
            ],
          },
        ],
      },
      {
        key: "say-hello-chatbots",
        name: "Say Hello to Chatbots",
        description: "Meet chatbots, learn how they think, and practice chatting with your AI tutor.",
        order: 2,
        lessons: [
          {
            key: "what-is-a-chatbot",
            title: "What Is a Chatbot?",
            order: 1,
            estimatedMinutes: 4,
            imageKey: "l2_1_what_is_chatbot",
            content: [
              { type: "text", text: "A chatbot is a computer program built to have a conversation with you, using words you type or speak. You ask a question, and the chatbot writes back an answer!" },
              { type: "text", text: "Chatbots are powered by AI called \"large language models,\" or LLMs for short. That's a big name, but it just means the AI has read an enormous amount of text and learned how words and ideas fit together." },
              { type: "callout", text: "You'll be practicing with a friendly AI tutor named Botly throughout this course - look for the chat bubble on your lessons!" },
              { type: "image", imageKey: "l2_1_what_is_chatbot", alt: "A friendly speech-bubble robot character chatting with a happy child" },
            ],
            tutorPromptSuggestions: ["What does LLM stand for?", "How is a chatbot different from a search engine?"],
            quiz: [
              { questionText: "What is a chatbot?", options: ["A computer program you can have a conversation with", "A robot that walks", "A kind of video game", "A type of email"], correctAnswer: "A computer program you can have a conversation with", explanation: "A chatbot is built to have conversations with people using text or voice." },
              { questionText: 'What does "LLM" stand for?', options: ["Large Language Model", "Little Learning Machine", "Long List Maker", "Live Learning Method"], correctAnswer: "Large Language Model", explanation: "LLM stands for Large Language Model - AI trained on huge amounts of text." },
              { questionText: "How does an LLM learn to understand language?", options: ["By reading a huge amount of text", "By watching TV", "By listening to music only", "It doesn't learn at all"], correctAnswer: "By reading a huge amount of text", explanation: "LLMs learn patterns in language by studying enormous amounts of text." },
            ],
          },
          {
            key: "how-chatbot-thinks",
            title: 'How a Chatbot "Thinks"',
            order: 2,
            estimatedMinutes: 4,
            imageKey: "l2_2_how_chatbot_thinks",
            content: [
              { type: "text", text: "When you send a chatbot a message, it doesn't look up your exact question in a book. Instead, it predicts the best next word, one at a time, based on patterns it learned from reading tons of text." },
              { type: "text", text: 'Imagine finishing the sentence "The sky is ___." You\'d probably guess "blue" because you\'ve heard that pattern before. A chatbot does something similar - just on a much bigger, more complicated scale!' },
              { type: "callout", text: "Because it's predicting rather than truly \"knowing,\" a chatbot can sometimes guess wrong - we'll learn all about that in Level 2!" },
              { type: "image", imageKey: "l2_2_how_chatbot_thinks", alt: "A friendly robot with a glowing brain surrounded by floating books" },
            ],
            tutorPromptSuggestions: ["Can you finish this sentence: The ocean is full of ___", "Why do you predict words instead of just knowing answers?"],
            quiz: [
              { questionText: "How does a chatbot generate its reply?", options: ["It predicts the next likely word based on patterns", "It calls a real person to answer", "It flips a coin", "It copies from one single book"], correctAnswer: "It predicts the next likely word based on patterns", explanation: "Chatbots generate replies by predicting the most likely next word based on patterns they learned." },
              { questionText: 'What helps a chatbot "guess" good answers?', options: ["Patterns learned from huge amounts of text", "Random luck", "A hidden human typist", "Nothing, it's magic"], correctAnswer: "Patterns learned from huge amounts of text", explanation: "A chatbot's replies come from patterns learned during training on lots of text." },
              { questionText: 'A chatbot finishing "The sky is ___" works by...', options: ["predicting the most likely next word", "always saying the same word", "asking you to finish it", "refusing to answer"], correctAnswer: "predicting the most likely next word", explanation: 'Just like guessing "blue," a chatbot predicts likely next words based on patterns.' },
            ],
          },
          {
            key: "practice-chat-with-tutor",
            title: "Practice: Chat with an AI Tutor",
            order: 3,
            estimatedMinutes: 5,
            imageKey: "l2_3_practice_chat",
            content: [
              { type: "text", text: "Now it's your turn! Use the chat box below to say hello to Botly, your AI tutor. Try asking a question about anything you learned in this unit." },
              { type: "text", text: "Remember: keep it friendly, don't share personal details like your address or school name, and have fun practicing!" },
              { type: "callout", text: 'Good prompt ideas: "What is a chatbot?" or "Can you give me another example of AI I use every day?"' },
              { type: "image", imageKey: "l2_3_practice_chat", alt: "A cheerful child typing on a laptop with a friendly robot waving from the screen" },
            ],
            tutorPromptSuggestions: ["What is a chatbot?", "Can you give me another example of AI I use every day?"],
            quiz: [
              { questionText: "What should you avoid sharing with an AI chatbot?", options: ["Personal details like your address", "Questions about lessons", "Your favorite color", "A polite hello"], correctAnswer: "Personal details like your address", explanation: "It's smart to keep personal details like your address private, even when chatting with AI." },
              { questionText: "What is a good way to start a chat with an AI tutor?", options: ["A clear, friendly question", "A totally blank message", "Random keyboard mashing", "Nothing at all"], correctAnswer: "A clear, friendly question", explanation: "Clear, friendly questions help the AI understand what you want to know." },
              { questionText: "Why is practicing chatting with AI useful?", options: ["It helps you learn how to ask good questions", "It's the only way to use a computer", "It replaces talking to people", "It's required by law"], correctAnswer: "It helps you learn how to ask good questions", explanation: "Practicing with an AI tutor helps you build the skill of asking clear questions." },
            ],
          },
        ],
      },
    ],
  },
  {
    key: "intermediate",
    name: "Talk Like an AI Pro",
    description: "Level up your skills: learn to write great prompts and understand how AI learns (and sometimes gets things wrong).",
    order: 2,
    minAge: 9,
    maxAge: 12,
    imageKey: null,
    units: [
      {
        key: "magic-of-prompts",
        name: "The Magic of Prompts",
        description: "Learn what a prompt is and how to write ones that get great results.",
        order: 1,
        lessons: [
          {
            key: "what-is-a-prompt",
            title: "What Is a Prompt?",
            order: 1,
            estimatedMinutes: 4,
            imageKey: "l3_1_what_is_prompt",
            content: [
              { type: "text", text: 'A prompt is the message you type or say to ask an AI to do something. It could be a question, an instruction, or even a fun request like "write me a silly poem about pizza."' },
              { type: "text", text: "Prompts are like directions - the clearer your directions, the more likely you'll get where you want to go! The same is true with AI: clear prompts lead to better answers." },
              { type: "callout", text: 'Prompt example: "Explain photosynthesis in 2 simple sentences for a 9-year-old" is much clearer than just "plants."' },
              { type: "image", imageKey: "l3_1_what_is_prompt", alt: "A child holding a pencil like a magic wand, writing glowing words" },
            ],
            tutorPromptSuggestions: ["What makes a prompt good?", "Turn 'tell me about dogs' into a clearer prompt."],
            quiz: [
              { questionText: "What is a prompt?", options: ["The message you give an AI to ask it to do something", "A type of password", "A robot's name", "A computer virus"], correctAnswer: "The message you give an AI to ask it to do something", explanation: "A prompt is the instruction or question you give an AI." },
              { questionText: "Why are clear prompts helpful?", options: ["They help the AI understand exactly what you want", "They make the AI faster at typing", "They are required to turn on the computer", "They have no real effect"], correctAnswer: "They help the AI understand exactly what you want", explanation: "Clear prompts help the AI understand your request and give a better answer." },
              { questionText: "Which is the better prompt?", options: ["Explain photosynthesis in 2 simple sentences for a 9-year-old", "plants", "stuff", "?"], correctAnswer: "Explain photosynthesis in 2 simple sentences for a 9-year-old", explanation: "This prompt is specific about the topic, length, and audience, so it will get a much more helpful answer." },
            ],
          },
          {
            key: "how-to-write-great-prompt",
            title: "How to Write a Great Prompt",
            order: 2,
            estimatedMinutes: 5,
            imageKey: "l3_2_great_prompt",
            content: [
              { type: "text", text: "Great prompts usually answer three questions: WHAT do you want, WHO is it for (or what style), and HOW much detail you need." },
              { type: "text", text: 'For example: "Write a 3-line poem (WHAT) about the ocean (topic) for a little kid (WHO), using simple words (HOW)." That\'s much better than just saying "write something."' },
              { type: "callout", text: 'Try adding examples too! Saying "like a superhero" or "in the style of a joke" can help the AI match the vibe you want.' },
              { type: "image", imageKey: "l3_2_great_prompt", alt: "A child building a tower of colorful blocks with a friendly robot watching" },
            ],
            tutorPromptSuggestions: ["Help me write a great prompt about volcanoes.", "What's an example of adding style to a prompt?"],
            quiz: [
              { questionText: "What three things do great prompts usually include?", options: ["What you want, who it's for, how much detail", "Your name, age, and address", "A secret code", "Nothing extra at all"], correctAnswer: "What you want, who it's for, how much detail", explanation: "Clear prompts usually cover the what, who/style, and how-much-detail." },
              { questionText: "Which prompt is more likely to get a great result?", options: ["Write a 3-line poem about the ocean for a little kid, using simple words", "Write something", "Ocean", "Poem now"], correctAnswer: "Write a 3-line poem about the ocean for a little kid, using simple words", explanation: "This prompt is specific about length, topic, audience, and style." },
              { questionText: "What can adding an example to your prompt do?", options: ["Help the AI match the style you want", "Make the AI shut down", "Slow down the internet", "Nothing useful"], correctAnswer: "Help the AI match the style you want", explanation: "Examples in a prompt help guide the AI toward the tone or style you're imagining." },
            ],
          },
          {
            key: "practice-fix-this-prompt",
            title: "Practice: Fix This Prompt",
            order: 3,
            estimatedMinutes: 5,
            imageKey: "l3_3_practice_fix_prompt",
            content: [
              { type: "text", text: 'Here\'s a weak prompt: "tell me about space." It\'s too vague! Try rewriting it with Botly to make it clearer - add a topic, an age level, and how much detail you want.' },
              { type: "text", text: "Chat with Botly below and try improving a vague prompt together. See how the answer changes when your prompt gets clearer!" },
              { type: "callout", text: "Challenge: ask Botly the vague version first, then ask an improved version, and compare the two answers." },
              { type: "image", imageKey: "l3_3_practice_fix_prompt", alt: "A child with a magnifying glass sorting jumbled colorful letter blocks into order" },
            ],
            tutorPromptSuggestions: ["Tell me about space", "Explain one cool fact about black holes in 2 sentences for a 10-year-old"],
            quiz: [
              { questionText: 'What\'s the main problem with the prompt "tell me about space"?', options: ["It's too vague and unclear", "It's too long", "It uses bad words", "It's written in the wrong language"], correctAnswer: "It's too vague and unclear", explanation: "This prompt doesn't say what about space, for whom, or how much detail - so it's very vague." },
              { questionText: 'Which improvement would help the "tell me about space" prompt most?', options: ["Adding a specific topic and detail level", "Making it shorter by deleting words", "Typing it in all capital letters", "Asking it twice in a row"], correctAnswer: "Adding a specific topic and detail level", explanation: "Adding specifics like topic and detail level turns a vague prompt into a clear one." },
              { questionText: "Why compare a vague prompt's answer with an improved prompt's answer?", options: ["It shows how clearer prompts get better answers", "It doesn't show anything useful", "It's just for fun, no learning value", "AI always gives the exact same answer regardless"], correctAnswer: "It shows how clearer prompts get better answers", explanation: "Comparing answers is a great way to see firsthand how much clearer prompts improve results." },
            ],
          },
        ],
      },
      {
        key: "how-ai-learns",
        name: "How AI Learns",
        description: "Discover training data and why AI sometimes gets things wrong.",
        order: 2,
        lessons: [
          {
            key: "training-data",
            title: "Training Data: AI's Giant Library",
            order: 1,
            estimatedMinutes: 4,
            imageKey: "l4_1_training_data",
            content: [
              { type: "text", text: 'Before an AI chatbot can chat with you, it has to learn - and it learns by studying huge amounts of text, called "training data." Think of it like the biggest library you can imagine, except the AI reads all of it before it ever talks to anyone!' },
              { type: "text", text: "This training data can include books, websites, articles, and more. The AI looks for patterns - like which words tend to go together - and uses those patterns to write new sentences." },
              { type: "callout", text: 'The AI doesn\'t "remember" each book like a person would - it learns general patterns from all of them combined.' },
              { type: "image", imageKey: "l4_1_training_data", alt: "A friendly robot surrounded by a whimsical floating library of colorful books" },
            ],
            tutorPromptSuggestions: ["What kinds of text might be in an AI's training data?", "How is training data different from a search engine's index?"],
            quiz: [
              { questionText: 'What is "training data"?', options: ["The huge amount of text an AI studies to learn patterns", "A type of computer chip", "A password for the AI", "A robot's toolbox"], correctAnswer: "The huge amount of text an AI studies to learn patterns", explanation: "Training data is the enormous collection of text an AI studies to learn language patterns." },
              { questionText: "What does an AI look for in its training data?", options: ["Patterns in how words and ideas fit together", "Its own name", "Secret codes", "Nothing, it ignores the data"], correctAnswer: "Patterns in how words and ideas fit together", explanation: "AI looks for patterns in language to help it generate new, sensible text." },
              { questionText: "Does an AI remember each book exactly like a person would?", options: ["No, it learns general patterns instead", "Yes, word for word", "Only on weekends", "Only if you ask nicely"], correctAnswer: "No, it learns general patterns instead", explanation: "AI learns general patterns from combined data rather than memorizing individual books." },
            ],
          },
          {
            key: "why-ai-gets-it-wrong",
            title: "Why AI Sometimes Gets It Wrong",
            order: 2,
            estimatedMinutes: 5,
            imageKey: "l4_2_why_ai_wrong",
            content: [
              { type: "text", text: 'Even though AI can seem very smart, it can make mistakes! Sometimes it states something false very confidently - this is called a "hallucination." It\'s not lying on purpose; it\'s just predicting words that sound right, even when they aren\'t true.' },
              { type: "text", text: "AI can also be out of date - it only knows what was in its training data, so it might not know about very recent events unless someone tells it." },
              { type: "callout", text: "That's why it's always smart to double-check important AI answers with a trusted source, like a teacher, book, or reliable website." },
              { type: "image", imageKey: "l4_2_why_ai_wrong", alt: "A friendly robot looking gently confused next to a child kindly pointing out a mistake" },
            ],
            tutorPromptSuggestions: ["What is a hallucination in AI?", "Why might you be wrong about something? Can you make mistakes?"],
            quiz: [
              { questionText: "What do people call it when AI confidently states something false?", options: ["A hallucination", "A celebration", "An upgrade", "A shortcut"], correctAnswer: "A hallucination", explanation: "When AI states something false very confidently, it's called a hallucination." },
              { questionText: "Why might an AI not know about something that happened very recently?", options: ["It only knows what was in its training data", "It refuses to learn new things on purpose", "It doesn't understand time at all", "AI always knows everything instantly"], correctAnswer: "It only knows what was in its training data", explanation: "AI is trained up to a certain point in time, so very recent events may be unknown to it." },
              { questionText: "What's a smart habit when an AI gives you a surprising fact?", options: ["Double-check it with a trusted source", "Always believe it immediately", "Never use AI again", "Assume it's always wrong"], correctAnswer: "Double-check it with a trusted source", explanation: "Fact-checking surprising AI answers with trusted sources is always a smart habit." },
            ],
          },
          {
            key: "practice-catch-the-mistake",
            title: "Practice: Catch the AI Mistake",
            order: 3,
            estimatedMinutes: 5,
            imageKey: "l4_3_practice_catch_mistake",
            content: [
              { type: "text", text: "Time to be an AI detective! Ask Botly a tricky question - maybe about something that happened very recently, or ask it to do simple math with big numbers." },
              { type: "text", text: "See if you can spot when an answer seems unsure or possibly wrong. Being able to notice this is one of the most important AI skills you can have!" },
              { type: "callout", text: "Remember: even a wrong-sounding answer might be said very confidently - that's exactly the tricky part we just learned about." },
              { type: "image", imageKey: "l4_3_practice_catch_mistake", alt: "A child wearing a detective hat examining a glowing screen with a puzzled robot" },
            ],
            tutorPromptSuggestions: ["What happened in the news today?", "What is 48291 times 7734?"],
            quiz: [
              { questionText: "Why is it useful to practice spotting AI mistakes?", options: ["It builds a habit of checking AI answers carefully", "It's not useful at all", "It makes the AI angry", "It slows down your computer"], correctAnswer: "It builds a habit of checking AI answers carefully", explanation: "Practicing this builds the important habit of critically checking AI answers." },
              { questionText: "What's a tricky type of question that might reveal an AI mistake?", options: ["A question about very recent events", "Asking the AI to say hello", "Asking the AI its favorite color", "A simple yes or no question"], correctAnswer: "A question about very recent events", explanation: "Very recent events are a common area where AI's training data might be outdated." },
              { questionText: "How confidently can AI state wrong answers?", options: ["It can sound very sure even when it's wrong", "It always sounds unsure when wrong", "It refuses to answer if unsure", "It only makes mistakes when asked to"], correctAnswer: "It can sound very sure even when it's wrong", explanation: "AI can generate confident-sounding text regardless of whether the content is actually accurate." },
            ],
          },
        ],
      },
    ],
  },
  {
    key: "advanced",
    name: "Smart & Safe AI Use",
    description: "Become a responsible AI citizen: privacy, spotting AI images, fairness, and honesty.",
    order: 3,
    minAge: 10,
    maxAge: 12,
    imageKey: null,
    units: [
      {
        key: "keeping-safe",
        name: "Keeping Safe with AI",
        description: "Learn what to keep private and how to spot AI-made pictures.",
        order: 1,
        lessons: [
          {
            key: "what-not-to-share",
            title: "What NOT to Share with AI",
            order: 1,
            estimatedMinutes: 4,
            imageKey: "l5_1_what_not_to_share",
            content: [
              { type: "text", text: "Chatting with AI can feel like chatting with a friend, but it's important to remember: AI chatbots aren't people, and what you type might be stored or reviewed by the company that made them." },
              { type: "text", text: "Never share your full name, home address, phone number, school name, passwords, or photos of yourself with an AI chatbot - the same rules for staying safe online apply here too." },
              { type: "callout", text: "If an AI ever asks you for personal information, that's a sign to stop and tell a trusted adult." },
              { type: "image", imageKey: "l5_1_what_not_to_share", alt: "A child holding a glowing shield next to a friendly robot, protecting a treasure chest of personal info" },
            ],
            tutorPromptSuggestions: ["What information is safe to share with an AI?", "Why can't I trust a chatbot the same way I trust a friend?"],
            quiz: [
              { questionText: "Why shouldn't you share personal information with an AI chatbot?", options: ["It might be stored or reviewed, so privacy isn't guaranteed", "AI chatbots need it to work at all", "It's required to get any answer", "There's no real reason, it's totally fine"], correctAnswer: "It might be stored or reviewed, so privacy isn't guaranteed", explanation: "Depending on the service, conversations may be stored or reviewed, so it's safest to keep personal info private." },
              { questionText: "Which of these should you NEVER share with an AI chatbot?", options: ["Your home address", "Your favorite animal", "A question about space", "A joke you like"], correctAnswer: "Your home address", explanation: "Personal details like your home address should stay private, even from AI." },
              { questionText: "What should you do if an AI asks for personal information?", options: ["Stop and tell a trusted adult", "Give it right away", "Make up a fake address", "Ignore it and keep chatting the same way"], correctAnswer: "Stop and tell a trusted adult", explanation: "If an AI asks for personal info, that's a signal to pause and involve a trusted adult." },
            ],
          },
          {
            key: "spotting-ai-pictures",
            title: "Spotting AI-Made Pictures",
            order: 2,
            estimatedMinutes: 5,
            imageKey: "l5_2_spotting_ai_pictures",
            content: [
              { type: "text", text: "AI can create pictures too, not just words! Some AI tools can make an image from just a text description. These pictures can look incredibly real, even though nothing like them ever actually happened." },
              { type: "text", text: "How can you spot an AI-made image? Look closely at hands (AI sometimes struggles with the right number of fingers), backgrounds (they can look blurry or strange), and text in the image (it's often garbled or nonsensical)." },
              { type: "callout", text: "Many companies now add a small label or watermark to AI-made images to help people tell them apart from real photos." },
              { type: "image", imageKey: "l5_2_spotting_ai_pictures", alt: "A child with a magnifying glass comparing two pictures, one marked with a small sparkle icon" },
            ],
            tutorPromptSuggestions: ["What are 3 signs a picture might be AI-made?", "Why do companies label AI-generated images?"],
            quiz: [
              { questionText: "Can AI create pictures, not just text?", options: ["Yes, from a text description", "No, AI can only write words", "Only if a human draws it first", "Only black and white pictures"], correctAnswer: "Yes, from a text description", explanation: "AI image generators can create pictures directly from a text description." },
              { questionText: "What's one common giveaway of an AI-made image?", options: ["Hands with an odd number of fingers", "Perfect grammar", "A very small file size", "Bright colors"], correctAnswer: "Hands with an odd number of fingers", explanation: "Hands are tricky for AI to draw correctly, so odd finger counts are a common giveaway." },
              { questionText: "Why do some companies add a label to AI-made images?", options: ["To help people know it wasn't a real photograph", "Because it's required to make the image load", "To make the picture funnier", "To change the image's colors"], correctAnswer: "To help people know it wasn't a real photograph", explanation: "Labels or watermarks help people distinguish AI-generated images from real photos." },
            ],
          },
        ],
      },
      {
        key: "great-ai-citizen",
        name: "Being a Great AI Citizen",
        description: "Explore fairness, honesty, and finish with your final AI challenge.",
        order: 2,
        lessons: [
          {
            key: "fairness-and-bias",
            title: "Is That Fair? AI and Bias",
            order: 1,
            estimatedMinutes: 5,
            imageKey: "l6_1_fairness_bias",
            content: [
              { type: "text", text: 'AI learns from data made by people - and sometimes that data includes unfair patterns, called "bias." If the training data has bias in it, the AI might accidentally repeat it in its answers.' },
              { type: "text", text: "For example, if an AI was mostly trained on stories about one type of job being done by one type of person, it might unfairly assume that's the only kind of person who can do that job - even though that's not true or fair." },
              { type: "callout", text: "Being aware of bias helps us think critically about AI answers instead of always assuming they're perfectly fair." },
              { type: "image", imageKey: "l6_1_fairness_bias", alt: "A friendly robot holding a balanced scale with diverse smiling children on both sides" },
            ],
            tutorPromptSuggestions: ["What is bias in simple words?", "Why can AI accidentally be unfair?"],
            quiz: [
              { questionText: 'What is "bias" in AI?', options: ["Unfair patterns the AI might repeat from its training data", "A type of computer virus", "A setting you can turn off with one click", "A kind of robot part"], correctAnswer: "Unfair patterns the AI might repeat from its training data", explanation: "Bias means unfair patterns that can show up in AI answers because they existed in the training data." },
              { questionText: "Where does AI bias usually come from?", options: ["Unfair patterns in the real-world data it was trained on", "The AI's own personal opinions", "Random chance every time", "It never happens"], correctAnswer: "Unfair patterns in the real-world data it was trained on", explanation: "AI learns from real data created by people, which can include unfair patterns." },
              { questionText: "Why is it helpful to know about AI bias?", options: ["It helps you think critically instead of assuming AI is always fair", "It has no real use", "It means you should never use AI", "It only matters for adults"], correctAnswer: "It helps you think critically instead of assuming AI is always fair", explanation: "Knowing about bias helps you evaluate AI answers thoughtfully rather than accepting them blindly." },
            ],
          },
          {
            key: "honest-at-school",
            title: "Using AI Honestly at School",
            order: 2,
            estimatedMinutes: 5,
            imageKey: "l6_2_honest_at_school",
            content: [
              { type: "text", text: "AI can be a great helper for learning - like explaining a tricky topic in a new way or helping you brainstorm ideas. But turning in AI-written work as if it's entirely your own isn't honest, and it means you miss out on the practice that helps you grow." },
              { type: "text", text: "A good rule: use AI to help you understand and think, not to think for you. If your teacher allows AI help, it's still a great idea to say how you used it." },
              { type: "callout", text: '"Am I learning from this, or just copying it?" That question can guide you toward honest AI use.' },
              { type: "image", imageKey: "l6_2_honest_at_school", alt: "A child proudly holding a handwritten notebook next to a robot giving a thumbs up" },
            ],
            tutorPromptSuggestions: ["What's an honest way to use AI on homework?", "Can you help me understand a topic without writing my essay for me?"],
            quiz: [
              { questionText: "Why is it not honest to turn in AI-written work as entirely your own?", options: ["It doesn't reflect your own thinking and effort", "Because AI writing is always low quality", "Because teachers can't read it", "Because it takes too long to generate"], correctAnswer: "It doesn't reflect your own thinking and effort", explanation: "Schoolwork should show your own thinking - claiming AI's work as entirely yours isn't honest." },
              { questionText: "What's a good way to use AI for schoolwork?", options: ["To help you understand and think, not to think for you", "To write every assignment completely", "To avoid ever reading the textbook", "To replace talking to your teacher"], correctAnswer: "To help you understand and think, not to think for you", explanation: "Using AI as a helper for understanding, rather than a replacement for your own thinking, is the honest approach." },
              { questionText: "What question can help guide honest AI use?", options: ["Am I learning from this, or just copying it?", "How fast can I finish?", "Will anyone notice?", "Is this the shortest way?"], correctAnswer: "Am I learning from this, or just copying it?", explanation: "This question helps you check whether you're truly learning or just copying AI's output." },
            ],
          },
          {
            key: "final-challenge",
            title: "Your AI Toolkit: Final Challenge",
            order: 3,
            estimatedMinutes: 6,
            imageKey: "l6_3_final_challenge",
            content: [
              { type: "text", text: "You've learned so much: what AI is, how chatbots think, how to write great prompts, why AI sometimes makes mistakes, and how to use AI safely and honestly. That's a real AI toolkit!" },
              { type: "text", text: "For your final challenge, chat with Botly and show off what you've learned - write the clearest, most thoughtful prompt you can about any AI topic from this course." },
              { type: "callout", text: "Congratulations, AI Explorer! You now know more about how AI works than most adults do." },
              { type: "image", imageKey: "l6_3_final_challenge", alt: "A joyful child holding a glowing toolbox of icons next to a proud robot friend with confetti" },
            ],
            tutorPromptSuggestions: ["Quiz me on something from this whole course!", "What's one thing every kid should know about using AI safely?"],
            quiz: [
              { questionText: "Which of these is NOT something you learned in this course?", options: ["How to build a physical robot from scratch", "What a prompt is", "Why AI can make mistakes", "How to stay safe chatting with AI"], correctAnswer: "How to build a physical robot from scratch", explanation: "This course focused on AI literacy - understanding and using AI - not physical robot engineering." },
              { questionText: "What makes a prompt clear and effective?", options: ["Saying what you want, who it's for, and how much detail", "Being as short as possible always", "Using only one word", "Never explaining anything"], correctAnswer: "Saying what you want, who it's for, and how much detail", explanation: "Clear prompts usually cover what you want, who it's for, and how much detail you need." },
              { questionText: "What should you always do with a surprising or important AI answer?", options: ["Double-check it with a trusted source", "Believe it instantly", "Ignore it completely", "Share it with strangers online"], correctAnswer: "Double-check it with a trusted source", explanation: "Fact-checking important AI answers with trusted sources is a habit worth keeping forever." },
            ],
          },
        ],
      },
    ],
  },
];
