import json
import os
import random

REGIONS_AND_COUNTRIES = [
    {
        "region": "North America",
        "locations": [
            ("San Francisco, CA, USA", "United States", "$130,000 - $185,000 / yr"),
            ("New York, NY, USA", "United States", "$125,000 - $175,000 / yr"),
            ("Seattle, WA, USA", "United States", "$120,000 - $165,000 / yr"),
            ("Austin, TX, USA", "United States", "$110,000 - $150,000 / yr"),
            ("Boston, MA, USA", "United States", "$115,000 - $160,000 / yr"),
            ("Toronto, ON, Canada", "Canada", "CAD 100,000 - 140,000 / yr"),
            ("Vancouver, BC, Canada", "Canada", "CAD 95,000 - 135,000 / yr"),
            ("Montreal, QC, Canada", "Canada", "CAD 90,000 - 128,000 / yr"),
        ]
    },
    {
        "region": "Europe",
        "locations": [
            ("London, England, UK", "United Kingdom", "£65,000 - £95,000 / yr"),
            ("Cambridge, England, UK", "United Kingdom", "£60,000 - £88,000 / yr"),
            ("Berlin, Germany", "Germany", "€70,000 - €98,000 / yr"),
            ("Munich, Germany", "Germany", "€75,000 - €105,000 / yr"),
            ("Paris, France", "France", "€65,000 - €90,000 / yr"),
            ("Amsterdam, Netherlands", "Netherlands", "€72,000 - €100,000 / yr"),
            ("Zurich, Switzerland", "Switzerland", "CHF 125,000 - 170,000 / yr"),
            ("Dublin, Ireland", "Ireland", "€70,000 - €95,000 / yr"),
            ("Stockholm, Sweden", "Sweden", "SEK 620,000 - 850,000 / yr"),
        ]
    },
    {
        "region": "Asia-Pacific",
        "locations": [
            ("Bengaluru, Karnataka, India", "India", "₹20,00,000 - ₹38,00,000 / yr"),
            ("Hyderabad, Telangana, India", "India", "₹18,00,000 - ₹34,00,000 / yr"),
            ("Pune, Maharashtra, India", "India", "₹15,00,000 - ₹28,00,000 / yr"),
            ("Mumbai, Maharashtra, India", "India", "₹18,00,000 - ₹35,00,000 / yr"),
            ("Delhi-NCR, India", "India", "₹16,00,000 - ₹30,00,000 / yr"),
            ("Singapore City, Singapore", "Singapore", "S$100,000 - S$150,000 / yr"),
            ("Tokyo, Japan", "Japan", "¥8,500,000 - ¥13,500,000 / yr"),
            ("Seoul, South Korea", "South Korea", "₩75,000,000 - ₩120,000,000 / yr"),
            ("Sydney, NSW, Australia", "Australia", "AUD 115,000 - 160,000 / yr"),
            ("Melbourne, VIC, Australia", "Australia", "AUD 110,000 - 150,000 / yr"),
        ]
    },
    {
        "region": "Middle East & Africa",
        "locations": [
            ("Dubai, United Arab Emirates", "United Arab Emirates", "AED 240,000 - 360,000 / yr (Tax Free)"),
            ("Abu Dhabi, United Arab Emirates", "United Arab Emirates", "AED 220,000 - 320,000 / yr (Tax Free)"),
            ("Riyadh, Saudi Arabia", "Saudi Arabia", "SAR 200,000 - 300,000 / yr"),
            ("Tel Aviv, Israel", "Israel", "ILS 320,000 - 480,000 / yr"),
            ("Cape Town, South Africa", "South Africa", "ZAR 600,000 - 900,000 / yr"),
            ("Nairobi, Kenya", "Kenya", "KES 4,000,000 - 6,000,000 / yr"),
            ("Lagos, Nigeria", "Nigeria", "NGN 20,000,000 - 32,000,000 / yr"),
        ]
    },
    {
        "region": "Latin America",
        "locations": [
            ("São Paulo, Brazil", "Brazil", "BRL 150,000 - 240,000 / yr"),
            ("Buenos Aires, Argentina", "Argentina", "$40,000 - $60,000 / yr (USD)"),
            ("Mexico City, Mexico", "Mexico", "MXN 650,000 - 1,000,000 / yr"),
            ("Bogotá, Colombia", "Colombia", "COP 95,000,000 - 150,000,000 / yr"),
            ("Santiago, Chile", "Chile", "CLP 30,000,000 - 45,000,000 / yr"),
        ]
    },
    {
        "region": "Global Remote",
        "locations": [
            ("Remote - Worldwide (Any Location)", "Worldwide Remote", "$95,000 - $145,000 / yr"),
            ("Remote - Americas Timezones", "Worldwide Remote", "$100,000 - $155,000 / yr"),
            ("Remote - EMEA Timezones", "Worldwide Remote", "€70,000 - €100,000 / yr"),
            ("Remote - APAC Timezones", "Worldwide Remote", "$85,000 - $130,000 / yr"),
        ]
    }
]

DOMAINS_AND_ROLES = [
    {
        "category": "Software Engineering",
        "roles": [
            ("Junior Python Backend Engineer", ["python", "fastapi", "docker", "sql", "git"], "Scale real-time telemetry APIs and high-throughput microservices."),
            ("Full-Stack Web Developer", ["react", "node.js", "typescript", "postgresql", "tailwind css"], "Develop responsive web apps and cloud-native user interfaces."),
            ("Software Engineer Apprentice", ["python", "react", "rest api", "system design", "git"], "Build fault-tolerant global payments infrastructure and ledger tooling."),
            ("Frontend Engineer (React / Next.js)", ["react", "next.js", "typescript", "tailwind css", "vite"], "Architect responsive, accessible single-page applications and component design systems."),
            ("Distributed Systems Engineer", ["go", "kubernetes", "grpc", "redis", "docker"], "Design low-latency distributed storage engines and RPC microservices."),
            ("API & Microservices Architect", ["python", "fastapi", "docker", "kafka", "postgresql"], "Standardize RESTful and event-driven API gateway architectures across product squads."),
            ("Junior Java Enterprise Developer", ["java", "spring boot", "postgresql", "docker", "junit"], "Modernize legacy transactional cores into containerized Spring Boot microservices."),
            ("C++ High Performance Systems Engineer", ["c++", "multithreading", "linux", "algorithms", "memory management"], "Optimize core computing engine runtime latency and memory layout."),
            ("Rust Systems Developer", ["rust", "concurrency", "tokio", "networking", "linux"], "Build memory-safe network proxies and high-throughput routing servers."),
            ("GraphQL Gateway Engineer", ["typescript", "graphql", "apollo", "node.js", "docker"], "Unify distributed microservice data graphs into federated schema endpoints.")
        ]
    },
    {
        "category": "AI & Machine Learning",
        "roles": [
            ("Machine Learning Engineer", ["python", "pytorch", "scikit-learn", "pandas", "docker"], "Deploy deep learning models for predictive analytics and tabular regression."),
            ("Generative AI & LLM Systems Engineer", ["python", "langchain", "openai", "transformers", "rag"], "Build multi-agent RAG pipelines, fine-tuned embeddings, and LLM evaluation benchmarks."),
            ("Computer Vision Research Engineer", ["python", "opencv", "pytorch", "cnn", "cuda"], "Develop real-time visual inspection, object segmentation, and depth estimation models."),
            ("Natural Language Processing (NLP) Specialist", ["python", "spacy", "transformers", "bert", "nlp"], "Engineer clinical text extractors, sentiment pipelines, and semantic search models."),
            ("MLOps & Model Infrastructure Engineer", ["python", "mlflow", "kubeflow", "docker", "aws"], "Automate continuous retraining, drift monitoring, and zero-downtime model deployments."),
            ("Autonomous Vehicle Perception Engineer", ["c++", "python", "ros", "lidar", "sensor fusion"], "Train sensor fusion architectures combining LiDAR, radar, and 360-degree cameras."),
            ("Recommendation Systems Engineer", ["python", "spark", "tensorflow", "collaborative filtering", "redis"], "Power real-time recommendation carousels serving 10M+ daily active shoppers."),
            ("AI Prompt & Evaluation Engineer", ["python", "prompt engineering", "llm benchmarks", "few-shot", "evals"], "Design systematic red-teaming test suites and hallucination guardrails for enterprise agents.")
        ]
    },
    {
        "category": "Data Engineering & Analytics",
        "roles": [
            ("Data Engineer Intern", ["python", "sql", "spark", "postgresql", "airflow"], "Construct ETL pipelines transforming raw telemetry into partitioned analytics schemas."),
            ("Senior Big Data Architect", ["apache spark", "kafka", "snowflake", "sql", "python"], "Architect petabyte-scale streaming ingestion fabrics and dbt analytical models."),
            ("Analytics Engineer (dbt & SQL)", ["sql", "dbt", "bigquery", "snowflake", "data modeling"], "Transform untidy warehouse tables into dimensional Kimball star-schemas for business intelligence."),
            ("Real-Time Stream Processing Engineer", ["apache flink", "kafka", "java", "python", "redis"], "Process financial ticker ticks and fraud anomaly signals with millisecond latency."),
            ("Business Intelligence & Tableau Developer", ["sql", "tableau", "power bi", "data visualization", "python"], "Deliver executive KPI cockpits and cohort retention analyses across multi-region markets."),
            ("Data Governance & Quality Engineer", ["python", "great expectations", "data lineage", "sql", "catalogs"], "Enforce automated data freshness checks, schema drift contracts, and GDPR compliance.")
        ]
    },
    {
        "category": "Cloud & DevOps",
        "roles": [
            ("DevOps & Infrastructure Engineer", ["docker", "kubernetes", "terraform", "aws", "github actions"], "Maintain automated Infrastructure-as-Code pipelines across multi-region AWS environments."),
            ("Site Reliability Engineer (SRE)", ["linux", "prometheus", "grafana", "kubernetes", "python"], "Define Service Level Objectives (SLOs) and engineer automated incident auto-remediation runbooks."),
            ("Cloud Solutions Architect (AWS / GCP)", ["aws", "cloud architecture", "iam", "networking", "terraform"], "Design resilient multi-cloud disaster recovery architectures and cost optimization blueprints."),
            ("Kubernetes Platform Platform Engineer", ["kubernetes", "helm", "cilium", "golang", "argocd"], "Provision developer self-service clusters running GitOps continuous delivery workflows."),
            ("Database Reliability Engineer (DBRE)", ["postgresql", "mysql", "sharding", "replication", "linux"], "Execute zero-downtime database migrations, primary-replica failovers, and index profiling."),
            ("FinOps Cloud Cost Optimization Specialist", ["aws", "cost optimization", "finops", "cloudwatch", "python"], "Identify idle resources, spot instance fleets, and reserved instances to slash cloud expenditure.")
        ]
    },
    {
        "category": "Cybersecurity & Trust",
        "roles": [
            ("Cybersecurity Analyst (SOC)", ["siem", "wireshark", "threat detection", "linux", "incident response"], "Monitor 24/7 security event telemetry, triage zero-day exploits, and contain perimeter intrusions."),
            ("Application Security (AppSec) Engineer", ["sast", "dast", "owasp top 10", "python", "code review"], "Audit microservice source code for cryptographic flaws, injection vulnerabilities, and IDORs."),
            ("Cloud Security Architect", ["aws security", "iam policies", "guardduty", "terraform", "zero trust"], "Architect least-privilege Zero Trust IAM boundaries and automated compliance auditing."),
            ("Penetration Tester & Ethical Hacker", ["burp suite", "metasploit", "python", "network penetration", "reversing"], "Perform authorized black-box penetration testing and red-team physical/digital simulations."),
            ("Identity & Access Management (IAM) Specialist", ["okta", "oauth2", "saml", "active directory", "zero trust"], "Orchestrate enterprise single sign-on (SSO), privileged access, and biometric MFA policies.")
        ]
    },
    {
        "category": "Mobile Engineering",
        "roles": [
            ("iOS Mobile Engineer (Swift)", ["swift", "swiftui", "ios sdk", "combine", "git"], "Craft fluid, 120Hz native iOS user experiences utilizing SwiftUI and Combine reactive state."),
            ("Android Platform Developer (Kotlin)", ["kotlin", "jetpack compose", "android sdk", "coroutines", "room"], "Build performant native Android mobile applications with offline-first Room databases."),
            ("Cross-Platform Mobile Engineer (React Native)", ["react native", "typescript", "react", "mobile", "redux"], "Ship unified iOS and Android codebases with native bridging and push notifications."),
            ("Flutter & Dart Developer", ["flutter", "dart", "bloc", "firebase", "mobile ui"], "Develop visually stunning multi-platform applications with 60FPS animation pipelines.")
        ]
    },
    {
        "category": "Product, Design & Architecture",
        "roles": [
            ("Technical Product Manager", ["product roadmap", "agile", "sql", "user stories", "apis"], "Bridge software engineering squads with enterprise client needs to prioritize product backlogs."),
            ("UI/UX Product Designer", ["figma", "design systems", "wireframing", "prototyping", "user research"], "Conduct qualitative user testing and design pixel-perfect atomic design component kits in Figma."),
            ("Enterprise Solutions Architect", ["system design", "microservices", "enterprise integration", "cloud", "uml"], "Formulate technical proposals and architectural whitepapers for Fortune 500 digital transformations.")
        ]
    },
    {
        "category": "Robotics & Embedded IoT",
        "roles": [
            ("Embedded Firmware Engineer", ["c", "c++", "rtos", "microcontrollers", "i2c/spi"], "Write bare-metal and FreeRTOS drivers for low-power ARM Cortex-M microcontrollers."),
            ("Robotics Software Engineer (ROS 2)", ["c++", "python", "ros 2", "slam", "kinematics"], "Program autonomous mobile robots (AMRs) with SLAM navigation and obstacle avoidance."),
            ("IoT Cloud Systems Architect", ["mqtt", "aws iot core", "python", "docker", "embedded linux"], "Ingest telemetry from 500,000 smart connected edge devices into time-series data lakes.")
        ]
    },
    {
        "category": "FinTech & Quantitative Finance",
        "roles": [
            ("Quantitative Developer (Algorithmic Trading)", ["c++", "python", "market data", "low latency", "algorithms"], "Implement deterministic high-frequency algorithmic order execution engines with sub-microsecond tick latency."),
            ("Financial Risk Modeling Analyst", ["python", "r", "monte carlo", "statistics", "sql"], "Model portfolio Value-at-Risk (VaR), stress scenarios, and derivative pricing algorithms."),
            ("Blockchain Core Protocol Developer", ["solidity", "ethereum", "smart contracts", "evm", "cryptography"], "Audit decentralized smart contracts and build gas-optimized decentralized finance (DeFi) protocols.")
        ]
    },
    {
        "category": "Applied Tech (Health, CleanTech, Space)",
        "roles": [
            ("Bioinformatics Data Scientist", ["python", "genomics", "biopython", "r", "statistical modeling"], "Analyze DNA sequencing arrays and single-cell RNA datasets to discover oncological biomarkers."),
            ("CleanTech Renewable Grid Software Engineer", ["python", "smart grid", "scada", "time-series", "iot"], "Balance wind and solar battery storage distribution against utility grid peak demands."),
            ("Aerospace Flight Software Engineer", ["c", "c++", "embedded linux", "fault tolerance", "avionics"], "Validate safety-critical real-time avionics code compliant with DO-178C aeronautical standards.")
        ]
    }
]

GLOBAL_COMPANIES = [
    # Big Tech & Cloud
    "Google", "Microsoft", "Amazon Web Services", "Apple", "Meta", "Netflix", "NVIDIA", "Intel",
    # AI Pioneers
    "OpenAI", "Anthropic", "DeepMind", "Databricks", "Snowflake", "Hugging Face", "Cohere",
    # FinTech & Payments
    "Stripe", "Revolut", "PayPal", "Square", "Monzo", "Razorpay", "Nubank", "Mercado Libre",
    # Global Enterprise & SaaS
    "Spotify", "Atlassian", "Salesforce", "Canva", "ASML", "Siemens", "SAP", "Adobe", "Booking.com",
    # Indian Tech Giants & Unicorns
    "Tata Consultancy Services", "Infosys", "Wipro", "Flipkart", "Swiggy", "Zomato", "CRED", "Ola Electric",
    # APAC, Middle East & Global Leaders
    "Grab", "ByteDance", "Shopee", "Careem", "Aramco Digital", "Dubai Future Foundation", "Jio Platforms"
]

JOB_TYPES = ["Full-time", "Full-time", "Full-time", "Remote", "Remote", "Internship", "Apprenticeship", "Contract"]
EXPERIENCE_LEVELS = ["Entry-level", "Junior", "Junior", "Mid-level", "Senior"]
SOURCES = ["Direct Career Portal", "LinkedIn Global", "Indeed Worldwide", "Glassdoor", "RemoteOK", "Remotive Global"]

def generate_catalog():
    random.seed(42)
    all_jobs = []
    job_counter = 1

    for region_obj in REGIONS_AND_COUNTRIES:
        region_name = region_obj["region"]
        locations = region_obj["locations"]
        
        for loc_tuple in locations:
            loc_str, country_name, salary_str = loc_tuple
            
            for domain_obj in DOMAINS_AND_ROLES:
                category_name = domain_obj["category"]
                roles = domain_obj["roles"]
                
                # Sample 2 roles per domain per location for rich density
                sampled_roles = random.sample(roles, min(2, len(roles)))
                for role_info in sampled_roles:
                    title, skills_req, desc = role_info
                    company = random.choice(GLOBAL_COMPANIES)
                    job_type = random.choice(JOB_TYPES)
                    exp_lvl = random.choice(EXPERIENCE_LEVELS)
                    source = random.choice(SOURCES)
                    
                    tags = [t.title() for t in skills_req[:4]] + [country_name, exp_lvl]
                    clean_company = company.lower().replace(' ', '').replace('(', '').replace(')', '')
                    
                    job_entry = {
                        "id": f"world_job_{job_counter:04d}",
                        "title": title,
                        "company": company,
                        "location": loc_str,
                        "region": region_name,
                        "country": country_name,
                        "type": job_type,
                        "category": category_name,
                        "experience_level": exp_lvl,
                        "stipend": salary_str,
                        "match_score": random.randint(74, 96),
                        "tags": tags,
                        "description": desc,
                        "source": source,
                        "apply_url": f"https://{clean_company}.careers/job/{job_counter}",
                        "skills_required": skills_req
                    }
                    all_jobs.append(job_entry)
                    job_counter += 1

    print(f"Total jobs generated: {len(all_jobs)}")
    output_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'backend', 'data', 'mock_jobs.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(all_jobs, f, indent=2, ensure_ascii=False)
    print(f"Successfully saved {len(all_jobs)} jobs to {output_path}!")

if __name__ == '__main__':
    generate_catalog()
