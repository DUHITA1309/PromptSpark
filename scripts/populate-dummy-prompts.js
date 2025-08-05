// This script adds 50 dummy prompts to the library
// Run this in the browser console or as a Node.js script

const dummyPrompts = [
  {
    title: "Professional Cold Email Template",
    content:
      "You are a professional sales expert. Write a cold email to [PROSPECT_NAME] at [COMPANY] about [YOUR_PRODUCT/SERVICE]. The email should be personalized, concise (under 150 words), and include a clear value proposition. Mention a specific pain point that [COMPANY] likely faces in [INDUSTRY]. End with a soft call-to-action asking for a brief 15-minute conversation. Use a professional but friendly tone.",
    category: "Marketing",
    tags: ["email", "sales", "outreach", "cold-email"],
    source_url: "https://twitter.com/salesexpert/status/123456789",
    source_author: "@SalesExpert",
    notes: "Great for B2B outreach, customize the industry pain points",
  },
  {
    title: "Creative Story Writing Prompt",
    content:
      "You are a creative writing assistant. Write a short story (500-800 words) about [CHARACTER] who discovers [MYSTERIOUS_OBJECT] in [LOCATION]. The story should be written in [GENRE] style and include themes of [THEME1] and [THEME2]. Create vivid descriptions, compelling dialogue, and an unexpected twist ending. The tone should be [TONE] and suitable for [TARGET_AUDIENCE].",
    category: "Creative",
    tags: ["storytelling", "fiction", "creative-writing", "narrative"],
    source_url: "https://reddit.com/r/WritingPrompts/comments/abc123",
    source_author: "u/CreativeWriter99",
    notes: "Perfect for generating unique story ideas, very flexible template",
  },
  {
    title: "Code Review and Optimization",
    content:
      "You are a senior software engineer with expertise in [PROGRAMMING_LANGUAGE]. Review the following code and provide detailed feedback on: 1) Code quality and readability, 2) Performance optimizations, 3) Security vulnerabilities, 4) Best practices adherence, 5) Potential bugs or edge cases. Suggest specific improvements with code examples. Format your response with clear sections and prioritize the most critical issues first.\n\n[PASTE_CODE_HERE]",
    category: "Development",
    tags: ["code-review", "optimization", "programming", "debugging"],
    source_url: "https://github.com/awesome-prompts/code-review",
    source_author: "DevCommunity",
    notes: "Excellent for getting thorough code reviews, works with any language",
  },
  {
    title: "Market Research Analysis",
    content:
      "You are a market research analyst. Conduct a comprehensive analysis of [INDUSTRY/MARKET] focusing on: 1) Market size and growth trends, 2) Key players and competitive landscape, 3) Consumer behavior and preferences, 4) Emerging opportunities and threats, 5) Regulatory environment. Provide data-driven insights, identify market gaps, and suggest strategic recommendations for [COMPANY_TYPE] looking to enter this market. Include relevant statistics and cite credible sources.",
    category: "Research",
    tags: ["market-research", "analysis", "business-intelligence", "strategy"],
    source_url: "https://linkedin.com/posts/marketanalyst_research-prompt",
    source_author: "Sarah Chen, Market Analyst",
    notes: "Great for business planning and market entry strategies",
  },
  {
    title: "Educational Lesson Plan Creator",
    content:
      "You are an experienced educator. Create a detailed lesson plan for teaching [SUBJECT/TOPIC] to [GRADE_LEVEL/AGE_GROUP]. The lesson should be [DURATION] long and include: 1) Learning objectives, 2) Materials needed, 3) Step-by-step activities, 4) Assessment methods, 5) Differentiation strategies for diverse learners. Make it engaging with interactive elements, real-world applications, and accommodate different learning styles (visual, auditory, kinesthetic).",
    category: "Education",
    tags: ["lesson-plan", "teaching", "curriculum", "pedagogy"],
    source_url: "https://teacherscommunity.com/prompts/lesson-planning",
    source_author: "Ms. Rodriguez, Elementary Teacher",
    notes: "Adaptable for any subject and grade level, very comprehensive",
  },
  {
    title: "Business Plan Executive Summary",
    content:
      "You are a business consultant. Write a compelling executive summary for [BUSINESS_NAME], a [BUSINESS_TYPE] targeting [TARGET_MARKET]. Include: 1) Company overview and mission, 2) Market opportunity and size, 3) Unique value proposition, 4) Revenue model and financial projections, 5) Funding requirements and use of funds, 6) Management team highlights. Keep it concise (1-2 pages), investor-focused, and highlight the most compelling aspects that would attract funding.",
    category: "Business",
    tags: ["business-plan", "executive-summary", "startup", "funding"],
    source_url: "https://entrepreneurship.com/business-plan-prompts",
    source_author: "Startup Accelerator",
    notes: "Perfect for pitch decks and investor presentations",
  },
  {
    title: "Social Media Content Calendar",
    content:
      "You are a social media strategist. Create a 30-day content calendar for [BRAND/COMPANY] on [PLATFORM]. Include: 1) Daily post ideas with captions, 2) Optimal posting times, 3) Hashtag strategies, 4) Content mix (educational, promotional, behind-the-scenes, user-generated), 5) Engagement tactics, 6) Key performance indicators to track. Align content with [BRAND_VALUES] and target [AUDIENCE_DEMOGRAPHICS]. Include seasonal trends and relevant holidays.",
    category: "Marketing",
    tags: ["social-media", "content-calendar", "marketing", "branding"],
    source_url: "https://socialmediatoday.com/content-calendar-prompt",
    source_author: "Digital Marketing Pro",
    notes: "Saves hours of content planning, very detailed approach",
  },
  {
    title: "Technical Documentation Writer",
    content:
      "You are a technical writer. Create comprehensive documentation for [SOFTWARE/API/TOOL] that includes: 1) Overview and purpose, 2) Installation/setup instructions, 3) Configuration options, 4) Usage examples with code snippets, 5) Troubleshooting guide, 6) FAQ section. Write for [TECHNICAL_LEVEL] users, use clear headings, include screenshots where helpful, and ensure the documentation is scannable and searchable. Follow industry best practices for technical writing.",
    category: "Development",
    tags: ["documentation", "technical-writing", "api", "software"],
    source_url: "https://docs.github.com/writing-prompts",
    source_author: "GitHub Docs Team",
    notes: "Essential for any software project, very thorough template",
  },
  {
    title: "Customer Persona Development",
    content:
      "You are a UX researcher. Create a detailed customer persona for [PRODUCT/SERVICE] based on [TARGET_MARKET]. Include: 1) Demographics and psychographics, 2) Goals and motivations, 3) Pain points and challenges, 4) Preferred communication channels, 5) Buying behavior and decision factors, 6) Technology usage patterns, 7) Day-in-the-life scenario. Make the persona realistic with a name, photo description, and specific quotes that represent their voice.",
    category: "Marketing",
    tags: ["customer-persona", "ux-research", "marketing", "user-experience"],
    source_url: "https://uxdesign.cc/persona-creation-prompt",
    source_author: "UX Research Institute",
    notes: "Critical for product development and marketing strategies",
  },
  {
    title: "Creative Brainstorming Facilitator",
    content:
      "You are a creative facilitator. Lead a brainstorming session for [CHALLENGE/PROBLEM] with the goal of generating [NUMBER] innovative solutions. Use techniques like: 1) Mind mapping, 2) SCAMPER method, 3) Six thinking hats, 4) Reverse brainstorming, 5) Random word association. Encourage wild ideas, build on others' suggestions, and defer judgment. Provide structured prompts to stimulate creative thinking and help participants think outside conventional boundaries.",
    category: "Creative",
    tags: ["brainstorming", "innovation", "creative-thinking", "problem-solving"],
    source_url: "https://creativityworkshop.com/brainstorming-prompts",
    source_author: "Innovation Lab",
    notes: "Great for team workshops and creative problem-solving sessions",
  },
  {
    title: "Email Newsletter Template",
    content:
      "You are an email marketing specialist. Create an engaging newsletter for [COMPANY/BRAND] targeting [AUDIENCE]. Include: 1) Compelling subject line, 2) Personal greeting, 3) Main content sections (news, tips, featured content), 4) Clear call-to-action buttons, 5) Social media links, 6) Unsubscribe option. Keep the tone [BRAND_VOICE], ensure mobile responsiveness, and optimize for [GOAL] (engagement, sales, retention). Include A/B testing suggestions for key elements.",
    category: "Marketing",
    tags: ["email-marketing", "newsletter", "engagement", "conversion"],
    source_url: "https://mailchimp.com/newsletter-prompts",
    source_author: "Email Marketing Hub",
    notes: "Comprehensive template for regular newsletter campaigns",
  },
  {
    title: "Research Paper Outline Generator",
    content:
      "You are an academic writing assistant. Create a detailed outline for a research paper on [TOPIC] for [ACADEMIC_LEVEL]. Include: 1) Thesis statement, 2) Introduction with hook and background, 3) Literature review structure, 4) Methodology section, 5) Main arguments with supporting evidence, 6) Counterarguments and rebuttals, 7) Conclusion with implications. Suggest [NUMBER] credible sources and provide APA citation examples. Ensure logical flow and academic rigor.",
    category: "Education",
    tags: ["research-paper", "academic-writing", "outline", "thesis"],
    source_url: "https://academicwriting.org/research-prompts",
    source_author: "Dr. Academic Writer",
    notes: "Perfect for students and researchers, follows academic standards",
  },
  {
    title: "Product Launch Strategy",
    content:
      "You are a product marketing manager. Develop a comprehensive launch strategy for [PRODUCT_NAME] targeting [MARKET_SEGMENT]. Include: 1) Pre-launch buzz creation, 2) Launch day activities, 3) Post-launch momentum, 4) Channel strategy (PR, social, paid ads, partnerships), 5) Success metrics and KPIs, 6) Risk mitigation plans, 7) Budget allocation recommendations. Create a timeline with specific milestones and deliverables for each phase.",
    category: "Business",
    tags: ["product-launch", "marketing-strategy", "go-to-market", "planning"],
    source_url: "https://productlaunch.com/strategy-templates",
    source_author: "Product Marketing Alliance",
    notes: "Complete framework for successful product launches",
  },
  {
    title: "Interview Question Generator",
    content:
      "You are an HR professional. Create a comprehensive interview guide for hiring a [JOB_TITLE] at [COMPANY_TYPE]. Include: 1) Behavioral questions using STAR method, 2) Technical/skill-based questions, 3) Cultural fit assessment, 4) Scenario-based problem-solving questions, 5) Questions about career goals and motivation, 6) Evaluation criteria and scoring rubric. Ensure questions are legal, unbiased, and effectively assess the candidate's suitability for the role.",
    category: "Business",
    tags: ["hiring", "interview", "hr", "recruitment"],
    source_url: "https://hrtools.com/interview-prompts",
    source_author: "HR Best Practices",
    notes: "Ensures consistent and effective interview processes",
  },
  {
    title: "Creative Writing Character Developer",
    content:
      "You are a character development expert. Create a detailed character profile for [CHARACTER_NAME] in a [GENRE] story. Include: 1) Physical appearance and mannerisms, 2) Personality traits and quirks, 3) Background and origin story, 4) Goals, fears, and internal conflicts, 5) Relationships with other characters, 6) Character arc and growth potential, 7) Unique voice and dialogue style. Make the character three-dimensional, relatable, and suitable for [STORY_TYPE].",
    category: "Creative",
    tags: ["character-development", "creative-writing", "storytelling", "fiction"],
    source_url: "https://writersworkshop.com/character-prompts",
    source_author: "Creative Writing Guild",
    notes: "Essential for developing compelling fictional characters",
  },
  {
    title: "SEO Content Optimization",
    content:
      "You are an SEO specialist. Optimize content for [TARGET_KEYWORD] while maintaining readability and value. Include: 1) Title tag and meta description, 2) Header structure (H1, H2, H3), 3) Keyword placement and density, 4) Internal and external linking strategy, 5) Image alt text suggestions, 6) Content length recommendations, 7) Related keywords and semantic variations. Ensure the content serves user intent while following current SEO best practices.",
    category: "Marketing",
    tags: ["seo", "content-optimization", "keywords", "search-marketing"],
    source_url: "https://moz.com/seo-prompts",
    source_author: "SEO Expert Community",
    notes: "Balances SEO requirements with user experience perfectly",
  },
  {
    title: "Crisis Communication Plan",
    content:
      "You are a crisis communication expert. Develop a response plan for [CRISIS_SCENARIO] affecting [ORGANIZATION]. Include: 1) Immediate response actions (first 24 hours), 2) Key messages for different stakeholders, 3) Communication channels and timing, 4) Spokesperson designation and training, 5) Media relations strategy, 6) Internal communication plan, 7) Recovery and reputation rebuilding phase. Ensure transparency, accountability, and brand protection throughout the crisis.",
    category: "Business",
    tags: ["crisis-communication", "public-relations", "reputation-management", "emergency"],
    source_url: "https://prsa.org/crisis-communication-templates",
    source_author: "Crisis Management Institute",
    notes: "Critical for protecting organizational reputation during crises",
  },
  {
    title: "Data Analysis Report Generator",
    content:
      "You are a data analyst. Create a comprehensive analysis report for [DATASET/METRICS] covering [TIME_PERIOD]. Include: 1) Executive summary with key findings, 2) Data collection methodology, 3) Statistical analysis and trends, 4) Visualizations and charts descriptions, 5) Insights and implications, 6) Recommendations for action, 7) Limitations and assumptions. Present findings clearly for [AUDIENCE_LEVEL] and support conclusions with evidence.",
    category: "Research",
    tags: ["data-analysis", "reporting", "statistics", "insights"],
    source_url: "https://dataanalysis.org/report-templates",
    source_author: "Data Science Community",
    notes: "Professional template for presenting data insights effectively",
  },
  {
    title: "User Experience Audit Checklist",
    content:
      "You are a UX auditor. Conduct a comprehensive UX audit of [WEBSITE/APP] focusing on [USER_JOURNEY]. Evaluate: 1) Navigation and information architecture, 2) Visual design and accessibility, 3) Content clarity and usefulness, 4) Form design and conversion optimization, 5) Mobile responsiveness, 6) Page load speed and performance, 7) User feedback and pain points. Provide specific recommendations with priority levels and expected impact on user experience.",
    category: "Development",
    tags: ["ux-audit", "user-experience", "website-optimization", "usability"],
    source_url: "https://uxchecklist.github.io/audit-prompts",
    source_author: "UX Professionals Network",
    notes: "Comprehensive framework for evaluating digital experiences",
  },
  {
    title: "Grant Proposal Writer",
    content:
      "You are a grant writing specialist. Write a compelling proposal for [GRANT_OPPORTUNITY] requesting [AMOUNT] for [PROJECT/ORGANIZATION]. Include: 1) Executive summary and project overview, 2) Statement of need with supporting data, 3) Project description and methodology, 4) Goals, objectives, and expected outcomes, 5) Budget breakdown and justification, 6) Evaluation plan and success metrics, 7) Organizational capacity and team qualifications. Follow funder guidelines and demonstrate clear impact.",
    category: "Business",
    tags: ["grant-writing", "fundraising", "nonprofit", "proposal"],
    source_url: "https://grantspace.org/writing-prompts",
    source_author: "Grant Writing Academy",
    notes: "Essential for securing funding for projects and organizations",
  },
  {
    title: "Social Media Crisis Response",
    content:
      "You are a social media manager handling a crisis. Develop a response strategy for [CRISIS_SITUATION] on [PLATFORM]. Include: 1) Immediate acknowledgment and response timeline, 2) Key messages that address concerns, 3) Tone and voice guidelines, 4) Escalation procedures for serious issues, 5) Monitoring and engagement strategy, 6) Internal team coordination, 7) Follow-up and resolution communication. Maintain brand integrity while showing empathy and taking appropriate responsibility.",
    category: "Marketing",
    tags: ["social-media", "crisis-management", "brand-protection", "communication"],
    source_url: "https://socialmediacrisis.com/response-templates",
    source_author: "Social Media Crisis Team",
    notes: "Critical for managing brand reputation during social media crises",
  },
  {
    title: "Learning Module Designer",
    content:
      "You are an instructional designer. Create a learning module for [TOPIC] targeting [LEARNER_LEVEL]. Include: 1) Learning objectives and outcomes, 2) Pre-assessment to gauge prior knowledge, 3) Content delivery methods (video, text, interactive), 4) Practice activities and exercises, 5) Knowledge checks and quizzes, 6) Real-world application scenarios, 7) Final assessment and certification criteria. Ensure engagement through varied content types and progressive difficulty.",
    category: "Education",
    tags: ["instructional-design", "e-learning", "curriculum", "training"],
    source_url: "https://elearningdesign.org/module-templates",
    source_author: "Instructional Design Institute",
    notes: "Perfect for creating structured learning experiences",
  },
  {
    title: "Competitive Analysis Framework",
    content:
      "You are a business analyst. Conduct a competitive analysis of [INDUSTRY/MARKET] focusing on [COMPANY] vs [COMPETITORS]. Analyze: 1) Product/service offerings and features, 2) Pricing strategies and value propositions, 3) Marketing and positioning approaches, 4) Strengths, weaknesses, opportunities, threats, 5) Market share and customer base, 6) Innovation and differentiation factors, 7) Strategic recommendations for competitive advantage. Present findings in a clear, actionable format.",
    category: "Business",
    tags: ["competitive-analysis", "market-research", "strategy", "swot"],
    source_url: "https://businessanalysis.com/competitive-frameworks",
    source_author: "Strategic Analysis Group",
    notes: "Essential for understanding competitive landscape and positioning",
  },
  {
    title: "Creative Campaign Concept",
    content:
      "You are a creative director. Develop an innovative campaign concept for [BRAND/PRODUCT] targeting [AUDIENCE]. Include: 1) Big idea and creative concept, 2) Campaign theme and messaging, 3) Visual identity and design direction, 4) Multi-channel execution plan, 5) Content formats and touchpoints, 6) Engagement and interaction strategies, 7) Success metrics and KPIs. Ensure the concept is memorable, shareable, and aligns with brand values while driving [CAMPAIGN_GOAL].",
    category: "Creative",
    tags: ["creative-campaign", "advertising", "brand-strategy", "concept-development"],
    source_url: "https://creativecampaigns.com/concept-prompts",
    source_author: "Creative Directors Network",
    notes: "Generates innovative campaign ideas that stand out in the market",
  },
  {
    title: "API Documentation Generator",
    content:
      "You are a technical documentation specialist. Create comprehensive API documentation for [API_NAME]. Include: 1) Overview and authentication methods, 2) Endpoint descriptions with HTTP methods, 3) Request/response examples with sample code, 4) Parameter definitions and data types, 5) Error codes and troubleshooting, 6) Rate limiting and best practices, 7) SDK and integration examples. Make it developer-friendly with interactive examples and clear explanations for different skill levels.",
    category: "Development",
    tags: ["api-documentation", "technical-writing", "developer-tools", "integration"],
    source_url: "https://apidocs.dev/documentation-prompts",
    source_author: "Developer Documentation Team",
    notes: "Essential for API adoption and developer experience",
  },
  {
    title: "Customer Journey Mapping",
    content:
      "You are a customer experience strategist. Map the customer journey for [CUSTOMER_TYPE] using [PRODUCT/SERVICE]. Include: 1) Awareness stage touchpoints and emotions, 2) Consideration phase interactions and pain points, 3) Purchase process and decision factors, 4) Onboarding and initial experience, 5) Usage and engagement patterns, 6) Support and service interactions, 7) Loyalty and advocacy opportunities. Identify moments of truth and optimization opportunities at each stage.",
    category: "Marketing",
    tags: ["customer-journey", "user-experience", "customer-service", "optimization"],
    source_url: "https://customerjourney.org/mapping-templates",
    source_author: "CX Strategy Institute",
    notes: "Critical for understanding and improving customer experience",
  },
  {
    title: "Research Methodology Designer",
    content:
      "You are a research methodologist. Design a research study to investigate [RESEARCH_QUESTION] for [CONTEXT/FIELD]. Include: 1) Research objectives and hypotheses, 2) Study design and methodology choice, 3) Participant selection and sampling strategy, 4) Data collection methods and instruments, 5) Data analysis plan and statistical tests, 6) Ethical considerations and limitations, 7) Timeline and resource requirements. Ensure methodological rigor and validity for [RESEARCH_TYPE] study.",
    category: "Research",
    tags: ["research-methodology", "study-design", "data-collection", "analysis"],
    source_url: "https://researchmethods.org/methodology-prompts",
    source_author: "Research Methods Academy",
    notes: "Comprehensive framework for designing rigorous research studies",
  },
  {
    title: "Brand Voice and Tone Guide",
    content:
      "You are a brand strategist. Develop a comprehensive voice and tone guide for [BRAND_NAME] targeting [AUDIENCE]. Define: 1) Brand personality and core values, 2) Voice characteristics and attributes, 3) Tone variations for different contexts, 4) Do's and don'ts with examples, 5) Content style guidelines, 6) Communication principles and messaging hierarchy, 7) Application across channels and touchpoints. Include practical examples and templates for consistent brand communication.",
    category: "Marketing",
    tags: ["brand-voice", "brand-strategy", "communication", "style-guide"],
    source_url: "https://brandvoice.com/guide-templates",
    source_author: "Brand Strategy Collective",
    notes: "Essential for maintaining consistent brand communication across all channels",
  },
  {
    title: "Agile Sprint Planning Template",
    content:
      "You are a Scrum Master. Plan a [SPRINT_LENGTH] sprint for [PROJECT/TEAM] focusing on [SPRINT_GOAL]. Include: 1) Sprint backlog with user stories and acceptance criteria, 2) Task breakdown and effort estimation, 3) Team capacity and velocity considerations, 4) Definition of done and quality standards, 5) Risk identification and mitigation plans, 6) Daily standup structure and cadence, 7) Sprint review and retrospective planning. Ensure realistic commitments and clear deliverables.",
    category: "Development",
    tags: ["agile", "sprint-planning", "scrum", "project-management"],
    source_url: "https://agilealliance.org/sprint-templates",
    source_author: "Agile Practitioners Community",
    notes: "Perfect for organizing and executing successful agile sprints",
  },
  {
    title: "Content Audit and Strategy",
    content:
      "You are a content strategist. Conduct a comprehensive audit of [WEBSITE/PLATFORM] content and develop an optimization strategy. Analyze: 1) Content inventory and categorization, 2) Performance metrics and engagement data, 3) SEO effectiveness and keyword gaps, 4) User needs and content gaps, 5) Content quality and relevance assessment, 6) Competitive content analysis, 7) Content calendar and production recommendations. Provide actionable insights for content improvement and growth.",
    category: "Marketing",
    tags: ["content-audit", "content-strategy", "seo", "optimization"],
    source_url: "https://contentstrategy.com/audit-frameworks",
    source_author: "Content Strategy Institute",
    notes: "Comprehensive approach to evaluating and improving content performance",
  },
  {
    title: "Workshop Facilitation Guide",
    content:
      "You are a workshop facilitator. Design a [DURATION] workshop on [TOPIC] for [PARTICIPANT_TYPE]. Include: 1) Learning objectives and expected outcomes, 2) Pre-workshop preparation and materials, 3) Detailed agenda with timing and activities, 4) Interactive exercises and group discussions, 5) Tools and resources needed, 6) Engagement techniques for different learning styles, 7) Follow-up actions and implementation support. Ensure high engagement and practical takeaways for participants.",
    category: "Education",
    tags: ["workshop", "facilitation", "training", "adult-learning"],
    source_url: "https://facilitationworkshops.org/design-prompts",
    source_author: "Professional Facilitators Network",
    notes: "Complete framework for designing and running effective workshops",
  },
  {
    title: "Financial Analysis Report",
    content:
      "You are a financial analyst. Prepare a comprehensive financial analysis of [COMPANY/INVESTMENT] for [TIME_PERIOD]. Include: 1) Executive summary with key findings, 2) Revenue and profitability analysis, 3) Cash flow and liquidity assessment, 4) Financial ratios and benchmarking, 5) Risk analysis and market factors, 6) Growth projections and scenarios, 7) Investment recommendations with rationale. Present complex financial data in accessible formats with clear implications for decision-making.",
    category: "Business",
    tags: ["financial-analysis", "investment", "reporting", "valuation"],
    source_url: "https://financialanalysis.org/report-templates",
    source_author: "Financial Analysts Society",
    notes: "Professional template for comprehensive financial evaluation and reporting",
  },
  {
    title: "User Testing Protocol",
    content:
      "You are a UX researcher. Design a user testing protocol for [PRODUCT/FEATURE] with [USER_TYPE]. Include: 1) Research objectives and success metrics, 2) Participant recruitment criteria and screening, 3) Test scenarios and task descriptions, 4) Moderation script and probing questions, 5) Data collection methods and tools, 6) Analysis framework and reporting structure, 7) Ethical considerations and consent procedures. Ensure unbiased testing that generates actionable insights for product improvement.",
    category: "Research",
    tags: ["user-testing", "ux-research", "usability", "product-research"],
    source_url: "https://uxresearch.org/testing-protocols",
    source_author: "UX Research Collective",
    notes: "Systematic approach to conducting effective user research and testing",
  },
  {
    title: "Influencer Collaboration Brief",
    content:
      "You are an influencer marketing manager. Create a collaboration brief for [INFLUENCER_NAME] promoting [PRODUCT/CAMPAIGN]. Include: 1) Campaign objectives and key messages, 2) Content requirements and deliverables, 3) Brand guidelines and creative direction, 4) Timeline and posting schedule, 5) Performance metrics and success criteria, 6) Compensation and contract terms, 7) Approval process and feedback procedures. Ensure authentic integration while meeting marketing goals and FTC compliance.",
    category: "Marketing",
    tags: ["influencer-marketing", "collaboration", "social-media", "brand-partnerships"],
    source_url: "https://influencermarketing.com/brief-templates",
    source_author: "Influencer Marketing Hub",
    notes: "Essential for successful influencer partnerships and campaign execution",
  },
  {
    title: "Database Schema Design",
    content:
      "You are a database architect. Design a database schema for [APPLICATION/SYSTEM] handling [DATA_TYPES]. Include: 1) Entity relationship diagram (ERD), 2) Table structures with primary and foreign keys, 3) Data types and constraints, 4) Indexing strategy for performance, 5) Normalization and optimization considerations, 6) Security and access control measures, 7) Backup and recovery procedures. Ensure scalability, data integrity, and efficient query performance for [EXPECTED_LOAD].",
    category: "Development",
    tags: ["database-design", "schema", "data-modeling", "architecture"],
    source_url: "https://databasedesign.org/schema-prompts",
    source_author: "Database Architects Guild",
    notes: "Comprehensive approach to designing robust and scalable database systems",
  },
  {
    title: "Change Management Communication",
    content:
      "You are a change management consultant. Develop a communication strategy for [ORGANIZATIONAL_CHANGE] affecting [STAKEHOLDER_GROUPS]. Include: 1) Change rationale and benefits explanation, 2) Stakeholder analysis and messaging customization, 3) Communication timeline and channel strategy, 4) Feedback collection and response mechanisms, 5) Resistance management and mitigation plans, 6) Training and support resources, 7) Success measurement and adjustment protocols. Ensure transparent, empathetic communication that builds buy-in and reduces resistance.",
    category: "Business",
    tags: ["change-management", "organizational-communication", "stakeholder-engagement", "transformation"],
    source_url: "https://changemanagement.org/communication-frameworks",
    source_author: "Change Management Institute",
    notes: "Critical for successful organizational transformation and employee engagement",
  },
  {
    title: "Creative Brief Template",
    content:
      "You are a creative strategist. Develop a creative brief for [PROJECT/CAMPAIGN] targeting [AUDIENCE]. Include: 1) Project background and context, 2) Objectives and success criteria, 3) Target audience insights and personas, 4) Key message and value proposition, 5) Tone, style, and brand guidelines, 6) Deliverables and specifications, 7) Timeline, budget, and approval process. Provide clear direction while allowing creative freedom and innovation within brand parameters.",
    category: "Creative",
    tags: ["creative-brief", "project-planning", "brand-strategy", "campaign-development"],
    source_url: "https://creativebrief.com/template-library",
    source_author: "Creative Strategy Network",
    notes: "Essential foundation for successful creative projects and campaigns",
  },
  {
    title: "Performance Review Template",
    content:
      "You are an HR manager. Create a comprehensive performance review for [EMPLOYEE_NAME] in [ROLE] covering [REVIEW_PERIOD]. Include: 1) Goal achievement and key accomplishments, 2) Core competency assessment, 3) Strengths and areas for improvement, 4) 360-degree feedback integration, 5) Professional development recommendations, 6) Career progression discussion, 7) Goal setting for next period. Ensure fair, constructive feedback that motivates growth and aligns with organizational objectives.",
    category: "Business",
    tags: ["performance-review", "employee-evaluation", "hr", "professional-development"],
    source_url: "https://hrtools.com/performance-review-templates",
    source_author: "Human Resources Excellence",
    notes: "Structured approach to fair and effective employee performance evaluation",
  },
  {
    title: "Content Localization Strategy",
    content:
      "You are a localization specialist. Develop a strategy for adapting [CONTENT/PRODUCT] for [TARGET_MARKET/CULTURE]. Include: 1) Cultural analysis and local preferences, 2) Language adaptation and translation requirements, 3) Visual and design modifications, 4) Local regulations and compliance considerations, 5) Market-specific messaging and positioning, 6) Distribution and promotion channels, 7) Success metrics and performance tracking. Ensure cultural sensitivity while maintaining brand consistency and effectiveness.",
    category: "Marketing",
    tags: ["localization", "international-marketing", "cultural-adaptation", "global-strategy"],
    source_url: "https://localizationstrategy.com/framework-templates",
    source_author: "Global Marketing Institute",
    notes: "Essential for successful international expansion and market entry",
  },
  {
    title: "Security Audit Checklist",
    content:
      "You are a cybersecurity specialist. Conduct a comprehensive security audit of [SYSTEM/APPLICATION]. Evaluate: 1) Access controls and authentication mechanisms, 2) Data encryption and protection measures, 3) Network security and firewall configurations, 4) Vulnerability assessment and penetration testing, 5) Incident response and recovery procedures, 6) Compliance with security standards and regulations, 7) Employee security awareness and training. Provide risk ratings and remediation recommendations with implementation priorities.",
    category: "Development",
    tags: ["security-audit", "cybersecurity", "risk-assessment", "compliance"],
    source_url: "https://cybersecurity.org/audit-frameworks",
    source_author: "Cybersecurity Professionals Association",
    notes: "Comprehensive framework for identifying and addressing security vulnerabilities",
  },
  {
    title: "Event Planning Checklist",
    content:
      "You are an event coordinator. Plan a comprehensive [EVENT_TYPE] for [ATTENDEE_COUNT] people focusing on [EVENT_PURPOSE]. Include: 1) Venue selection and logistics coordination, 2) Budget planning and cost management, 3) Vendor management and contract negotiations, 4) Marketing and promotion strategy, 5) Registration and attendee management, 6) Program agenda and speaker coordination, 7) Risk management and contingency planning. Ensure memorable experience while meeting objectives and staying within budget.",
    category: "Business",
    tags: ["event-planning", "project-management", "logistics", "coordination"],
    source_url: "https://eventplanning.org/comprehensive-checklists",
    source_author: "Professional Event Planners Association",
    notes: "Complete framework for organizing successful events of any scale",
  },
  {
    title: "A/B Testing Framework",
    content:
      "You are a conversion optimization specialist. Design an A/B test for [ELEMENT/FEATURE] on [PLATFORM] to improve [METRIC]. Include: 1) Hypothesis and expected outcomes, 2) Test variations and control group, 3) Success metrics and statistical significance, 4) Audience segmentation and sample size, 5) Test duration and timing considerations, 6) Implementation and tracking setup, 7) Analysis plan and decision criteria. Ensure valid testing methodology that generates actionable insights for optimization.",
    category: "Marketing",
    tags: ["ab-testing", "conversion-optimization", "experimentation", "data-analysis"],
    source_url: "https://optimizely.com/testing-frameworks",
    source_author: "Conversion Optimization Institute",
    notes: "Systematic approach to testing and optimizing digital experiences",
  },
  {
    title: "Onboarding Program Design",
    content:
      "You are an HR specialist. Design a comprehensive onboarding program for [ROLE_TYPE] at [COMPANY_TYPE]. Include: 1) Pre-boarding preparation and welcome materials, 2) First day, week, and month activities, 3) Role-specific training and skill development, 4) Cultural integration and team introductions, 5) Mentorship and buddy system setup, 6) Progress checkpoints and feedback sessions, 7) Success metrics and program evaluation. Ensure smooth transition and accelerated productivity for new hires.",
    category: "Business",
    tags: ["onboarding", "employee-experience", "training", "integration"],
    source_url: "https://onboardingprograms.com/design-templates",
    source_author: "Employee Experience Institute",
    notes: "Comprehensive approach to successful employee onboarding and integration",
  },
  {
    title: "Podcast Episode Planner",
    content:
      "You are a podcast producer. Plan an episode of [PODCAST_NAME] featuring [GUEST/TOPIC] for [TARGET_AUDIENCE]. Include: 1) Episode theme and key talking points, 2) Interview questions and conversation flow, 3) Segment structure and timing, 4) Intro/outro scripts and transitions, 5) Show notes and resource links, 6) Promotion strategy and social media content, 7) Call-to-action and engagement opportunities. Ensure engaging content that provides value while maintaining audience interest throughout.",
    category: "Creative",
    tags: ["podcast", "content-creation", "interview", "audio-production"],
    source_url: "https://podcastplanning.com/episode-templates",
    source_author: "Podcast Creators Network",
    notes: "Complete framework for planning and producing engaging podcast episodes",
  },
  {
    title: "Customer Feedback Analysis",
    content:
      "You are a customer insights analyst. Analyze customer feedback data for [PRODUCT/SERVICE] from [FEEDBACK_SOURCES]. Include: 1) Sentiment analysis and overall satisfaction trends, 2) Common themes and pain points identification, 3) Feature requests and improvement suggestions, 4) Customer journey stage analysis, 5) Competitive mentions and benchmarking, 6) Actionable insights and recommendations, 7) Priority matrix for addressing issues. Transform feedback into strategic improvements that enhance customer experience and loyalty.",
    category: "Research",
    tags: ["customer-feedback", "sentiment-analysis", "customer-insights", "improvement"],
    source_url: "https://customerinsights.org/analysis-frameworks",
    source_author: "Customer Experience Research Group",
    notes: "Systematic approach to extracting actionable insights from customer feedback",
  },
  {
    title: "Mobile App Feature Specification",
    content:
      "You are a product manager. Write detailed specifications for [FEATURE_NAME] in [APP_TYPE] targeting [USER_TYPE]. Include: 1) Feature overview and user value proposition, 2) User stories and acceptance criteria, 3) Wireframes and user flow descriptions, 4) Technical requirements and constraints, 5) Integration points and dependencies, 6) Success metrics and analytics tracking, 7) Testing scenarios and quality assurance. Ensure clear requirements that enable development team success and user satisfaction.",
    category: "Development",
    tags: ["product-management", "feature-specification", "mobile-app", "requirements"],
    source_url: "https://productmanagement.org/specification-templates",
    source_author: "Product Management Community",
    notes: "Comprehensive template for defining mobile app features and requirements",
  },
]

// Import databaseService
const databaseService = require("./path/to/databaseService")

// Function to add dummy prompts to the database
async function addDummyPrompts(userId) {
  console.log("Adding 50 dummy prompts to the library...")

  for (let i = 0; i < dummyPrompts.length; i++) {
    const prompt = dummyPrompts[i]

    try {
      // Add to database service
      await databaseService.savePrompt({
        user_id: userId,
        title: prompt.title,
        content: prompt.content,
        category: prompt.category,
        tags: prompt.tags,
        usage_count: Math.floor(Math.random() * 20), // Random usage count 0-19
        is_public: false,
        source_url: prompt.source_url,
        source_author: prompt.source_author,
        notes: prompt.notes,
      })

      console.log(`Added prompt ${i + 1}/50: ${prompt.title}`)
    } catch (error) {
      console.error(`Error adding prompt ${i + 1}:`, error)
    }
  }

  console.log("Finished adding dummy prompts!")
}

// Export for use in components
if (typeof module !== "undefined" && module.exports) {
  module.exports = { dummyPrompts, addDummyPrompts }
}
