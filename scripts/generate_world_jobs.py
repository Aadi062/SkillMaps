# World Jobs Generator
import json, os

WORLD_REGIONS = {
    'North America': [
        ('United States', 'San Francisco, CA, USA', 'ScaleTech Systems', 'Junior Python Backend Engineer', 'Full-time', 'Software Engineering', 'Junior', ',000 - ,000 / yr', ['python', 'fastapi', 'docker', 'sql', 'git'], 'https://scaletech.io/careers', 'Scale real-time telemetry APIs with FastAPI and Docker.'),
        ('United States', 'Seattle, WA, USA', 'Stripe', 'Software Engineer Apprentice', 'Apprenticeship', 'Software Engineering', 'Junior', ',000 / yr', ['python', 'react', 'rest api', 'system design', 'git'], 'https://stripe.com/jobs', 'Build fault-tolerant global payments infrastructure.'),
        ('United States', 'Menlo Park, CA, USA', 'Meta', 'AI Infrastructure & PyTorch Engineer', 'Full-time', 'AI / Machine Learning', 'Mid', ',000 - ,000 / yr', ['python', 'pytorch', 'distributed systems', 'c++', 'docker'], 'https://metacareers.com', 'Optimize distributed training clusters for Llama 3 models.'),
        ('United States', 'Redmond, WA, USA', 'Microsoft Azure', 'Cloud Native DevOps Engineer', 'Full-time', 'Cloud & DevOps', 'Junior-Mid', ',000 - ,000 / yr', ['azure', 'kubernetes', 'terraform', 'docker', 'ci/cd'], 'https://careers.microsoft.com', 'Deploy enterprise Kubernetes microservices and Terraform configs.'),
        ('United States', 'San Francisco, CA, USA', 'OpenAI', 'Research Engineer - LLM Alignment', 'Full-time', 'AI / Machine Learning', 'Mid-Senior', ',000 - ,000 / yr', ['python', 'nlp', 'transformers', 'deep learning', 'math'], 'https://openai.com/careers', 'Train multimodal LLMs and RLHF pipelines for frontier systems.'),
        ('United States', 'New York, NY, USA', 'Bloomberg LP', 'Quantitative Financial Systems Developer', 'Full-time', 'Software Engineering', 'Junior-Mid', ',000 - ,000 / yr', ['c++', 'python', 'sql', 'algorithms', 'git'], 'https://bloomberg.com/careers', 'Engineer sub-millisecond market feed handlers and order routers.'),
        ('Canada', 'Toronto, ON, Canada', 'Shopify', 'Full Stack Developer (Shopify Core)', 'Full-time', 'Software Engineering', 'Junior-Mid', 'CAD ,000 - ,000 / yr', ['react', 'graphql', 'typescript', 'ruby', 'sql'], 'https://shopify.com/careers', 'Empower millions of merchants with GraphQL and React.'),
        ('Canada', 'Toronto, ON, Canada', 'Cohere', 'NLP & Embeddings ML Intern', 'Internship', 'AI / Machine Learning', 'Intern', 'CAD ,500 / mo', ['python', 'nlp', 'spacy', 'pytorch', 'vector db'], 'https://cohere.com/careers', 'Evaluate multilingual embeddings and RAG vector indexing.')
    ],
    'Europe': [
        ('United Kingdom', 'London, United Kingdom', 'Google DeepMind', 'Research Scientist - Reinforcement Learning', 'Research', 'AI / Machine Learning', 'Mid-Senior', '£110,000 - £140,000 / yr', ['python', 'jax', 'reinforcement learning', 'machine learning', 'math'], 'https://deepmind.google', 'Investigate novel algorithms in reinforcement learning.'),
        ('United Kingdom', 'London, United Kingdom', 'Revolut', 'Graduate Backend Systems Engineer', 'Full-time', 'Software Engineering', 'Junior', '£65,000 - £80,000 / yr', ['java', 'sql', 'kafka', 'rest api', 'git'], 'https://revolut.com/careers', 'Architect high-throughput global fintech transactions.'),
        ('United Kingdom', 'Cambridge, United Kingdom', 'ARM Holdings', 'Embedded Firmware Architecture Engineer', 'Full-time', 'Systems & Embedded', 'Junior-Mid', '£60,000 - £75,000 / yr', ['c', 'c++', 'assembly', 'linux', 'arm'], 'https://arm.com/careers', 'Design instruction set simulators and energy-efficient kernels.'),
        ('Germany', 'Berlin, Germany', 'Delivery Hero', 'Distributed Microservices Engineer', 'Full-time', 'Software Engineering', 'Junior-Mid', '€72,000 - €88,000 / yr', ['python', 'fastapi', 'docker', 'kubernetes', 'postgresql'], 'https://deliveryhero.com/careers', 'Build food delivery dispatch microservices with FastAPI and Go.'),
        ('Germany', 'Munich, Germany', 'BMW TechWorks', 'Autonomous Driving Perception SWE', 'Full-time', 'AI / Machine Learning', 'Junior-Mid', '€75,000 - €92,000 / yr', ['python', 'c++', 'computer vision', 'ros', 'pytorch'], 'https://bmwgroup.jobs', 'Develop real-time sensor fusion and lidar object detection.'),
        ('France', 'Paris, France', 'Mistral AI', 'Open Source Model Optimization Engineer', 'Full-time', 'AI / Machine Learning', 'Mid', '€85,000 - €110,000 / yr', ['python', 'c++', 'vllm', 'cuda', 'deep learning'], 'https://mistral.ai/jobs', 'Optimize open-weight LLMs with TensorRT and FlashAttention.'),
        ('France', 'Paris, France', 'Datadog', 'Distributed Observability Systems SWE', 'Full-time', 'Cloud & DevOps', 'Junior-Mid', '€78,000 - €95,000 / yr', ['go', 'python', 'distributed systems', 'linux', 'docker'], 'https://datadoghq.com/careers', 'Ingest trillions of metric events daily across global clouds.'),
        ('Netherlands', 'Veldhoven, Netherlands', 'ASML', 'Semiconductor Control Software Engineer', 'Full-time', 'Systems & Embedded', 'Junior-Mid', '€68,000 - €84,000 / yr', ['c++', 'python', 'linux', 'algorithms', 'math'], 'https://asml.com/careers', 'Program nanometer-precision robotic wafer positioning software.'),
        ('Netherlands', 'Amsterdam, Netherlands', 'Booking.com', 'Principal Data Platform Engineer', 'Full-time', 'Data & Analytics', 'Mid-Senior', '€90,000 - €115,000 / yr', ['python', 'sql', 'spark', 'kafka', 'big data'], 'https://booking.com/careers', 'Orchestrate petabyte-scale data pipelines for global accommodations.'),
        ('Switzerland', 'Geneva, Switzerland', 'CERN', 'Scientific Computing & Grid Infrastructure Engineer', 'Research', 'Systems & Embedded', 'Junior-Fellowship', 'CHF 5,500 / mo Tax-Free', ['python', 'linux', 'c++', 'distributed systems', 'sql'], 'https://careers.cern', 'Process collision event telemetry from the Large Hadron Collider.'),
        ('Switzerland', 'Zurich, Switzerland', 'Google Switzerland', 'YouTube Infrastructure Engineer', 'Full-time', 'Software Engineering', 'Junior-Mid', 'CHF 180,000 - 220,000 / yr', ['c++', 'python', 'distributed systems', 'algorithms', 'linux'], 'https://careers.google.com', 'Scale planetary video transcoding and streaming pipelines.'),
        ('Ireland', 'Dublin, Ireland', 'Stripe Dublin', 'Global Payments Reliability Engineer', 'Full-time', 'Software Engineering', 'Junior-Mid', '€80,000 - €105,000 / yr', ['python', 'ruby', 'sql', 'docker', 'system design'], 'https://stripe.com/jobs', 'Maintain 99.999% payment processing reliability across EMEA.'),
        ('Sweden', 'Stockholm, Sweden', 'Spotify', 'Audio Recommendation ML Engineer', 'Full-time', 'AI / Machine Learning', 'Junior-Mid', 'SEK 650,000 - 800,000 / yr', ['python', 'scikit-learn', 'sql', 'gcp', 'docker'], 'https://spotifyjobs.com', 'Deliver personalized playlists for 600M+ active music fans.'),
        ('Estonia', 'Tallinn, Estonia', 'Bolt', 'Real-Time Dispatch Routing Engineer', 'Full-time', 'Software Engineering', 'Junior-Mid', '€55,000 - €72,000 / yr', ['python', 'go', 'docker', 'redis', 'sql'], 'https://bolt.eu/careers', 'Optimize geospatial rider-driver matching in 500+ cities.')
    ],
    'India & South Asia': [
        ('India', 'Bengaluru, Karnataka, India', 'Flipkart', 'Software Development Engineer I (SDE-1)', 'Full-time', 'Software Engineering', 'Junior', '₹18,00,000 - ₹24,00,000 / yr', ['python', 'java', 'data structures', 'sql', 'rest api'], 'https://flipkartcareers.com', 'Engineer high-scale flash sale checkout systems (50k req/s).'),
        ('India', 'Hyderabad, Telangana, India', 'CloudNative Labs India', 'Python Backend Developer Intern', 'Internship', 'Software Engineering', 'Intern', '₹45,000 / mo', ['python', 'fastapi', 'docker', 'git', 'sql'], 'https://cloudnativelabs.in', 'Write microservices using FastAPI, Docker Compose, and pytest.'),
        ('India', 'Bengaluru, Karnataka, India', 'Zerodha', 'Low-Latency FinTech Systems Engineer', 'Full-time', 'Systems & Embedded', 'Junior-Mid', '₹22,00,000 - ₹30,00,000 / yr', ['python', 'sql', 'postgresql', 'algorithms', 'git'], 'https://zerodha.tech', 'Build zero-dependency trading APIs for 12M+ Indian investors.'),
        ('India', 'Gurgaon, Haryana, India', 'Zomato', 'Data Science & Analytics Engineer', 'Full-time', 'Data & Analytics', 'Junior', '₹16,00,000 - ₹22,00,000 / yr', ['python', 'sql', 'data analysis', 'machine learning', 'git'], 'https://zomato.com/careers', 'Forecast hyperlocal food delivery demand and driver surge pricing.'),
        ('India', 'Bengaluru, Karnataka, India', 'Razorpay', 'Core Payments Platform Developer', 'Full-time', 'Software Engineering', 'Junior-Mid', '₹20,00,000 - ₹26,00,000 / yr', ['python', 'sql', 'rest api', 'docker', 'system design'], 'https://razorpay.com', 'Power seamless payments, webhooks, and UPI rails for 8M businesses.'),
        ('India', 'Hyderabad, Telangana, India', 'Microsoft India', 'Developer Tools & TypeScript SWE', 'Full-time', 'Software Engineering', 'Junior', '₹24,00,000 - ₹32,00,000 / yr', ['typescript', 'python', 'c++', 'git', 'compilers'], 'https://careers.microsoft.com', 'Innovate on VS Code language servers and developer runtimes.'),
        ('India', 'Bengaluru, Karnataka, India', 'CRED', 'Frontend & Mobile Experience Engineer', 'Full-time', 'Software Engineering', 'Junior', '₹18,00,000 - ₹25,00,000 / yr', ['react', 'react native', 'typescript', 'tailwind css', 'ui/ux'], 'https://cred.club/careers', 'Craft delightful financial gamification UI with fluid animations.'),
        ('India', 'Bengaluru, Karnataka, India', 'Swiggy', 'Logistics AI & Route Optimization SWE', 'Full-time', 'AI / Machine Learning', 'Junior-Mid', '₹19,00,000 - ₹26,00,000 / yr', ['python', 'machine learning', 'sql', 'docker', 'fastapi'], 'https://swiggy.com/careers', 'Solve traveling-salesperson algorithms for delivery fleets.')
    ],
    'Asia-Pacific': [
        ('Singapore', 'Singapore', 'Grab', 'SuperApp Microservices Engineer', 'Full-time', 'Software Engineering', 'Junior-Mid', 'SGD ,000 - ,000 / yr', ['python', 'rest api', 'sql', 'docker', 'kafka'], 'https://grab.careers', 'Scale transport and digital banking services across Southeast Asia.'),
        ('Singapore', 'Singapore', 'Sea Group (Shopee)', 'E-Commerce Search Engine SWE', 'Full-time', 'Software Engineering', 'Junior', 'SGD ,000 - ,000 / yr', ['go', 'python', 'elasticsearch', 'redis', 'sql'], 'https://careers.shopee.sg', 'Index hundreds of millions of product catalogs with semantic search.'),
        ('Japan', 'Tokyo, Japan', 'Sony Interactive Entertainment', 'Cloud Gaming & PSN Backend Engineer', 'Full-time', 'Software Engineering', 'Junior-Mid', '¥8,000,000 - ¥11,000,000 / yr', ['python', 'c++', 'aws', 'docker', 'sql'], 'https://sie.com/careers', 'Develop PlayStation Network multiplayer and cloud streaming services.'),
        ('Japan', 'Tokyo, Japan', 'Rakuten', 'Global E-Commerce Cloud Platform Engineer', 'Full-time', 'Cloud & DevOps', 'Junior-Mid', '¥7,500,000 - ¥10,000,000 / yr', ['docker', 'kubernetes', 'python', 'ci/cd', 'linux'], 'https://rakuten.today', 'Deploy zero-downtime microservices on multi-cloud infrastructure.'),
        ('South Korea', 'Seoul, South Korea', 'Samsung Electronics', 'On-Device AI Optimization Fellow', 'Research', 'AI / Machine Learning', 'Junior', '₩65,000,000 - ₩80,000,000 / yr', ['python', 'pytorch', 'deep learning', 'c++', 'algorithms'], 'https://samsung.com/careers', 'Quantize neural networks to execute on Galaxy mobile NPUs.'),
        ('South Korea', 'Seongnam, South Korea', 'Naver', 'HyperCLOVA NLP & Search Engineer', 'Full-time', 'AI / Machine Learning', 'Junior-Mid', '₩68,000,000 - ₩85,000,000 / yr', ['python', 'transformers', 'nlp', 'pytorch', 'distributed systems'], 'https://navercorp.com', 'Train Korean & Asian language LLMs for next-gen search synthesis.'),
        ('Australia', 'Sydney, NSW, Australia', 'Canva', 'WebGL & Interactive Canvas Developer', 'Full-time', 'Product & Design', 'Junior-Mid', 'AUD ,000 - ,000 / yr', ['react', 'typescript', 'webgl', 'javascript', 'git'], 'https://canva.com/careers', 'Empower 170M creators with 60fps canvas rendering and WebGL.'),
        ('Australia', 'Sydney, NSW, Australia', 'Atlassian', 'Jira Cloud Reliability Engineer', 'Full-time', 'Cloud & DevOps', 'Junior-Mid', 'AUD ,000 - ,000 / yr', ['python', 'aws', 'docker', 'kubernetes', 'terraform'], 'https://atlassian.com/company/careers', 'Keep collaborative developer tools highly available worldwide.'),
        ('Taiwan', 'Hsinchu, Taiwan', 'TSMC', 'Advanced Semiconductor Fab Automation SWE', 'Full-time', 'Systems & Embedded', 'Junior-Mid', 'NT$ 1,800,000 - 2,400,000 / yr', ['c++', 'python', 'linux', 'real-time systems', 'sql'], 'https://tsmc.com/careers', 'Control robotic material handling and lithography tool dispatch.')
    ],
    'Latin America': [
        ('Brazil', 'São Paulo, Brazil', 'Nubank', 'Cloud Banking Microservices Engineer', 'Full-time', 'Software Engineering', 'Junior-Mid', 'R$ 140,000 - 180,000 / yr (,000 USD)', ['python', 'sql', 'kafka', 'aws', 'rest api'], 'https://nubank.com.br/carreiras', 'Build immutable financial ledger streams for 90M customers.'),
        ('Argentina', 'Buenos Aires, Argentina', 'Mercado Libre', 'Fraud Detection ML Engineer', 'Full-time', 'AI / Machine Learning', 'Junior', ',000 - ,000 USD / yr (Paid in USD)', ['python', 'scikit-learn', 'sql', 'fastapi', 'docker'], 'https://mercadolibre.com/empleos', 'Evaluate transaction anomaly risk in under 100ms on MercadoPago.'),
        ('Colombia', 'Medellín / Bogotá, Colombia', 'Rappi', 'Real-Time Dispatch Logistics SWE', 'Full-time', 'Software Engineering', 'Junior-Mid', ',000 - ,000 USD / yr', ['python', 'fastapi', 'postgresql', 'redis', 'docker'], 'https://rappi.com/careers', 'Power delivery and grocery orchestration across 9 LatAm countries.'),
        ('Mexico', 'Mexico City, Mexico', 'Kavak', 'Automotive E-Commerce Platform SWE', 'Full-time', 'Software Engineering', 'Junior', 'MXN 600,000 - 800,000 / yr', ['python', 'react', 'sql', 'docker', 'git'], 'https://kavak.com/carreras', 'Reinvent car financing and inspections with digital inspections.'),
        ('Chile', 'Santiago, Chile', 'NotCo', 'FoodTech Generative AI Algorithm Engineer', 'Full-time', 'AI / Machine Learning', 'Junior-Mid', ',000 - ,000 USD / yr', ['python', 'pytorch', 'data analysis', 'sql', 'machine learning'], 'https://notco.com/careers', 'Synthesize plant-based molecular recipes using AI Giuseppe engine.')
    ],
    'Middle East & Africa': [
        ('United Arab Emirates', 'Dubai, UAE', 'Careem / Uber Middle East', 'Autonomous Mobility & Payments SWE', 'Full-time', 'Software Engineering', 'Junior-Mid', 'AED 240,000 - 300,000 / yr ( USD Tax-Free)', ['python', 'fastapi', 'postgresql', 'redis', 'docker'], 'https://careem.com/careers', 'Develop ride-hailing and multi-currency digital wallet platforms.'),
        ('United Arab Emirates', 'Abu Dhabi, UAE', 'Hub71 / G42 Healthcare', 'Genomic & Healthcare AI Developer', 'Full-time', 'AI / Machine Learning', 'Junior-Mid', 'AED 260,000 - 320,000 / yr Tax-Free', ['python', 'pytorch', 'bioinformatics', 'sql', 'docker'], 'https://hub71.com', 'Process clinical imaging and genomic sequences on G42 supercomputers.'),
        ('Saudi Arabia', 'Riyadh / NEOM, Saudi Arabia', 'NEOM Tech & Digital', 'Cognitive Smart City IoT Systems SWE', 'Full-time', 'Systems & Embedded', 'Junior-Mid', 'SAR 280,000 - 360,000 / yr Tax-Free', ['c++', 'python', 'iot', 'linux', 'distributed systems'], 'https://neom.com/careers', 'Build digital twin architectures for zero-carbon cognitive city.'),
        ('Israel', 'Tel Aviv, Israel', 'Check Point Software', 'Cloud Security & AppSec Threat Analyst', 'Full-time', 'Cybersecurity', 'Junior', '₪260,000 - 320,000 / yr ( USD)', ['python', 'linux', 'cybersecurity', 'owasp', 'git'], 'https://checkpoint.com/careers', 'Automate vulnerability scanning and defend enterprise cloud perimeters.'),
        ('Nigeria', 'Lagos, Nigeria', 'Flutterwave', 'Pan-African Payment Rails Engineer', 'Full-time', 'Software Engineering', 'Junior-Mid', ',000 - ,000 USD / yr', ['python', 'sql', 'rest api', 'docker', 'git'], 'https://flutterwave.com/careers', 'Connect African commerce to worldwide markets via payment rails.'),
        ('Kenya', 'Nairobi, Kenya', 'Andela', 'Distributed Cloud Systems Software Fellow', 'Full-time', 'Software Engineering', 'Junior', ',000 - ,000 USD / yr', ['python', 'react', 'sql', 'docker', 'git'], 'https://andela.com/careers', 'Empower remote African engineers with global software opportunities.'),
        ('South Africa', 'Cape Town, South Africa', 'Takealot / Naspers', 'High-Volume E-Commerce Platform SWE', 'Full-time', 'Software Engineering', 'Junior-Mid', 'ZAR 600,000 - 800,000 / yr', ['python', 'sql', 'postgresql', 'docker', 'rest api'], 'https://takealot.com/careers', 'Scale South Africa biggest online retail warehouse logistics.'),
        ('Egypt', 'Cairo, Egypt', 'Instabug', 'Mobile Observability SDK Engineer', 'Full-time', 'Software Engineering', 'Junior', ',000 - ,000 USD / yr', ['python', 'c++', 'mobile', 'git', 'rest api'], 'https://instabug.com/careers', 'Monitor real-time crash reports and telemetry for 3B mobile devices.')
    ],
    'Global Remote': [
        ('Worldwide Remote', 'Remote (100% Worldwide)', 'FastAPI & Open Source Collective', 'FastAPI Core Open Source Contributor', 'Open Source', 'Software Engineering', 'Any', ',000 / mo Fellowship', ['python', 'fastapi', 'git', 'testing', 'rest api'], 'https://github.com/fastapi/fastapi', 'Maintain core async routing, OpenAPI generation, and Pydantic tests.'),
        ('Worldwide Remote', 'Remote (100% Worldwide)', 'Supabase', 'Cloud Native Storage Systems Engineer', 'Full-time', 'Software Engineering', 'Junior-Mid', ',000 - ,000 USD / yr', ['sql', 'postgresql', 'docker', 'typescript', 'git'], 'https://supabase.com/careers', 'Scale open source PostgreSQL connections, real-time WebSockets, and Edge.'),
        ('Worldwide Remote', 'Remote (100% Worldwide)', 'GitLab', 'Distributed DevOps & CI/CD Engineer', 'Full-time', 'Cloud & DevOps', 'Junior-Mid', ',000 - ,000 USD / yr', ['docker', 'kubernetes', 'ci/cd', 'linux', 'git'], 'https://about.gitlab.com/jobs', 'Optimize auto-scaling runner fleets and secure software supply chains.'),
        ('Worldwide Remote', 'Remote (100% Worldwide)', 'DuckDuckGo', 'Privacy-First Web Search Platform SWE', 'Full-time', 'Software Engineering', 'Mid', ',000 - ,000 USD / yr', ['python', 'sql', 'algorithms', 'git', 'rest api'], 'https://duckduckgo.com/hiring', 'Develop private instant answers and zero-tracking search indexing.'),
        ('Worldwide Remote', 'Remote (100% Worldwide)', 'Linux Foundation (LFX)', 'Kubernetes & CNCF Mentorship Fellow', 'Open Source', 'Cloud & DevOps', 'Junior / Student', ',600 Stipend (LFX Mentorship)', ['docker', 'kubernetes', 'linux', 'git', 'go'], 'https://lfx.linuxfoundation.org', 'Work with maintainers on Kubernetes, Prometheus, or Envoy proxy.'),
        ('Worldwide Remote', 'Remote (100% Worldwide)', 'Vercel', 'Next.js & Edge Runtime Infrastructure SWE', 'Full-time', 'Software Engineering', 'Junior-Mid', ',000 - ,000 USD / yr', ['react', 'typescript', 'rust', 'docker', 'edge computing'], 'https://vercel.com/careers', 'Build globally distributed edge servers and compiler tooling.'),
        ('Worldwide Remote', 'Remote (100% Worldwide)', 'Postman', 'API Network & Developer Tooling SWE', 'Full-time', 'Software Engineering', 'Junior-Mid', ',000 - ,000 USD / yr', ['typescript', 'node.js', 'python', 'docker', 'rest api'], 'https://postman.com/careers', 'Connect 30 million API developers with mock servers and tests.'),
        ('Worldwide Remote', 'Remote (100% Worldwide)', 'Ethereum Foundation', 'Consensus Protocol & Cryptography Fellow', 'Research', 'Web3 & Blockchain', 'Junior-Fellow', ',000 - ,000 USD / yr Grant', ['python', 'cryptography', 'distributed systems', 'p2p', 'math'], 'https://ethereum.org/careers', 'Research zero-knowledge proofs (zk-SNARKs) and data availability.')
    ]
}

all_jobs = []
job_counter = 1

for region_name, job_list in WORLD_REGIONS.items():
    for (country, loc, comp, title, jtype, cat, exp, stipend, skills, url, desc) in job_list:
        # Calculate realistic initial match score
        tags = [t.capitalize() for t in skills[:4]] + [country]
        all_jobs.append({
            'id': f'world_job_{job_counter:03d}',
            'title': title,
            'company': comp,
            'location': loc,
            'region': region_name,
            'country': country,
            'type': jtype,
            'category': cat,
            'experience_level': exp,
            'stipend': stipend,
            'match_score': 85,
            'tags': tags,
            'description': desc,
            'source': 'Global Tech Exchange' if 'Remote' in loc else 'Direct Career Portal',
            'apply_url': url,
            'skills_required': skills
        })
        job_counter += 1

dest = os.path.join('backend', 'data', 'mock_jobs.json')
with open(dest, 'w', encoding='utf-8') as f:
    json.dump(all_jobs, f, indent=2, ensure_ascii=False)

print(f'Successfully generated {len(all_jobs)} world jobs across all {len(WORLD_REGIONS)} regions to {dest}!')
