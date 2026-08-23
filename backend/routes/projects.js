const express = require('express');
const router = express.Router();
const { User, Project } = require('../config/db');
const { authenticateToken } = require('./auth');

// Curated FAANG Blueprint Projects
const recommendedBlueprints = [
  {
    id: 'blueprint-1',
    title: 'Distributed Key-Value Cache Store',
    category: 'Systems & Infrastructure',
    difficulty: 'Hard',
    xpReward: 300,
    techStack: ['Go', 'gRPC', 'Raft Consensus', 'Redis Protocol'],
    summary: 'High-throughput, fault-tolerant distributed key-value store implementing Raft consensus for leader election and data replication.',
    resumeBullets: [
      'Engineered a distributed key-value store in Go achieving 45,000+ ops/sec throughput under simulated network partitions.',
      'Implemented Raft consensus protocol for dynamic leader election, log replication, and zero-downtime failovers.',
      'Benchmarked memory access patterns using custom slab allocation, reducing GC overhead by 38%.'
    ],
    githubUrl: 'https://github.com/topics/distributed-key-value-store',
    demoUrl: ''
  },
  {
    id: 'blueprint-fintech-1',
    title: 'Ultra-Low Latency HFT Limit Order Book & Matching Engine',
    category: 'Fintech & High-Frequency Trading',
    difficulty: 'Hard',
    xpReward: 350,
    techStack: ['C++20 / Rust', 'LMAX Disruptor', 'FIX 4.2 Protocol', 'Lock-Free Queues', 'Zero-Copy Sockets'],
    summary: 'Sub-microsecond high-frequency trading matching engine supporting price-time priority, FIX API gateways, and real-time market data broadcasting.',
    resumeBullets: [
      'Engineered an ultra-low latency C++20 matching engine processing 1.2M order operations/sec with p99 latency < 800 nanoseconds.',
      'Leveraged lock-free ring buffers (LMAX Disruptor pattern) and cache-line aligned memory structures to eliminate thread contention.',
      'Implemented Financial Information eXchange (FIX 4.2) parser and order cancel/replace state machine with zero heap allocations during hot paths.'
    ],
    githubUrl: 'https://github.com/topics/order-book-matching-engine',
    demoUrl: ''
  },
  {
    id: 'blueprint-fintech-2',
    title: 'Distributed Double-Entry Ledger & Real-Time Payment Settlement',
    category: 'Fintech & High-Frequency Trading',
    difficulty: 'Hard',
    xpReward: 300,
    techStack: ['Java', 'Spring Boot', 'Apache Kafka', 'PostgreSQL', 'Redis Locks', 'Docker'],
    summary: 'Enterprise-grade double-entry accounting ledger and instant payment gateway with strict ACID guarantees, 2PC saga orchestration, and fraud detection.',
    resumeBullets: [
      'Architected a double-entry financial balance engine executing $50M+ daily simulated transaction throughput with zero ledger drift.',
      'Orchestrated two-phase commit (2PC) saga workflows over Apache Kafka to guarantee idempotency and exact-once settlement across distributed bank microservices.',
      'Integrated real-time transaction risk engine evaluating velocity signals and anomaly scores with sub-15ms decision latency.'
    ],
    githubUrl: 'https://github.com/topics/payment-gateway-ledger',
    demoUrl: ''
  },
  {
    id: 'blueprint-2',
    title: 'Real-Time Collaborative Code Editor',
    category: 'Full Stack & WebSockets',
    difficulty: 'Medium',
    xpReward: 200,
    techStack: ['React', 'Node.js', 'WebSockets', 'OT / CRDT', 'Redis'],
    summary: 'Google-Docs style real-time multi-user code editor with conflict resolution, live execution sandbox, and room presence.',
    resumeBullets: [
      'Architected a real-time collaborative workspace supporting 50+ concurrent typers per session using Conflict-free Replicated Data Types (CRDTs).',
      'Integrated Redis Pub/Sub with WebSocket gateways to achieve sub-40ms end-to-end sync latency across distributed clients.',
      'Built a isolated Docker container sandbox to evaluate untrusted code submissions safely.'
    ],
    githubUrl: 'https://github.com/topics/collaborative-editor',
    demoUrl: ''
  },
  {
    id: 'blueprint-3',
    title: 'High-Concurrency Rate Limiter & API Gateway',
    category: 'Backend & Cloud',
    difficulty: 'Medium',
    xpReward: 200,
    techStack: ['Java', 'Spring Boot', 'Redis', 'Token Bucket', 'Docker'],
    summary: 'Enterprise API Gateway featuring sliding-window rate limiting, JWT authentication, dynamic routing, and Prometheus metrics.',
    resumeBullets: [
      'Designed a distributed rate limiter implementing Token Bucket & Sliding Window Log algorithms in Redis Lua scripts.',
      'Handled 10,000 requests/sec with 99.9th percentile latency < 5ms under load testing with Locust.',
      'Configured Grafana monitoring dashboards for real-time traffic spikes and error rate alerts.'
    ],
    githubUrl: 'https://github.com/topics/rate-limiter',
    demoUrl: ''
  },
  {
    id: 'blueprint-4',
    title: 'AI-Powered Resume Auditor & Tech Mock Interviewer',
    category: 'AI / Machine Learning',
    difficulty: 'Medium',
    xpReward: 250,
    techStack: ['Python', 'FastAPI', 'OpenAI API', 'React', 'TailwindCSS'],
    summary: 'AI career assistant that scans resumes against job descriptions, highlights missing keywords, and conducts voice mock interviews.',
    resumeBullets: [
      'Built an AI resume scanner processing PDF/Word docs using LLM embeddings to match STAR method impact scores.',
      'Implemented interactive AI interviewer generating dynamic DSA/System Design follow-up questions tailored to candidate answers.',
      'Optimized LLM streaming token responses to reduce voice feedback latency from 3.2s to 600ms.'
    ],
    githubUrl: 'https://github.com/topics/ai-resume-screener',
    demoUrl: ''
  },
  {
    id: 'blueprint-5',
    title: 'High-Performance Micro-Frontend & Accessible Component Design System',
    category: 'Frontend',
    difficulty: 'Medium',
    xpReward: 200,
    techStack: ['React 18', 'TypeScript', 'Tailwind CSS', 'Storybook', 'Module Federation', 'Vite'],
    summary: 'Enterprise micro-frontend workspace with reusable atomic UI components, WCAG 2.1 AA accessibility compliance, and dynamic runtime module loading.',
    resumeBullets: [
      'Architected a micro-frontend workspace using Webpack/Vite Module Federation, enabling independent deployment for 4 core frontend product teams.',
      'Built an accessible atomic design system with 30+ reusable components, reducing UI development cycle time by 40%.',
      'Optimized Core Web Vitals to achieve 98+ Lighthouse scores across performance, accessibility, and SEO.'
    ],
    githubUrl: 'https://github.com/topics/design-system',
    demoUrl: ''
  },
  {
    id: 'blueprint-6',
    title: 'Automated Multi-Cloud CI/CD Pipeline & Kubernetes GitOps',
    category: 'Mobile & DevOps',
    difficulty: 'Hard',
    xpReward: 250,
    techStack: ['Docker', 'Kubernetes', 'Helm', 'GitHub Actions', 'Terraform', 'Prometheus'],
    summary: 'Production-ready GitOps pipeline automating zero-downtime blue-green deployments, infrastructure provisioning, and container cluster monitoring.',
    resumeBullets: [
      'Designed a GitOps CI/CD pipeline using GitHub Actions and Helm, reducing build-to-deployment time from 25 mins to 4 mins.',
      'Provisioned multi-region Kubernetes clusters with Terraform, handling dynamic autoscaling for 100k+ peak RPS.',
      'Configured Prometheus & Grafana alerting rules to detect memory leaks and pod crashes with < 30s response time.'
    ],
    githubUrl: 'https://github.com/topics/kubernetes-devops',
    demoUrl: ''
  }
];

// GET /api/projects - Get user's projects + recommended blueprints
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userProjects = await Project.find({ userEmail: req.user.email });
    res.json({
      userProjects,
      recommendedBlueprints
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch projects', error: error.message });
  }
});

// POST /api/projects - Add custom project
router.post('/', authenticateToken, async (req, res) => {
  try {
    const email = req.user.email;
    const { title, category, techStack, description, githubUrl, demoUrl, status, resumeBullets } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Project title is required' });
    }

    const newProject = await Project.create({
      userEmail: email,
      title: title.trim(),
      category: category || 'Full Stack',
      skills: Array.isArray(techStack) ? techStack : (techStack || '').split(',').map(s => s.trim()).filter(Boolean),
      techStack: Array.isArray(techStack) ? techStack : (techStack || '').split(',').map(s => s.trim()).filter(Boolean),
      description: description || '',
      githubUrl: githubUrl || '',
      demoUrl: demoUrl || '',
      status: status || 'In Progress',
      resumeBullets: Array.isArray(resumeBullets) ? resumeBullets : (resumeBullets || '').split('\n').filter(Boolean),
      createdAt: new Date().toISOString()
    });

    const userProjects = await Project.find({ userEmail: email });

    // Award +150 XP for adding/building a project
    const user = await User.findOne({ email });
    if (user) {
      const xpBonus = 150;
      const newXp = (user.xp || 0) + xpBonus;
      const newLevel = Math.floor(newXp / 1000) + 1;
      
      // Update placement readiness for projects (mock logic: +10% per project, max 100)
      let currentProjReadiness = user.placementReadiness?.projects || 0;
      currentProjReadiness = Math.min(100, currentProjReadiness + 15);
      
      await User.updateOne(
        { email },
        {
          $set: {
            xp: newXp,
            level: newLevel,
            "placementReadiness.projects": currentProjReadiness
          }
        }
      );
    }
    const updatedUser = await User.findOne({ email });

    res.json({
      message: `Project "${newProject.title}" added successfully (+150 XP earned)!`,
      project: newProject,
      userProjects,
      xpEarned: 150,
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add project', error: error.message });
  }
});

// PUT /api/projects/:id - Update project
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const email = req.user.email;
    const projectId = req.params.id;
    const { title, category, techStack, description, githubUrl, demoUrl, status, resumeBullets } = req.body;

    const project = await Project.findOne({ _id: projectId, userEmail: email });
    if (!project) {
      // Check legacy 'id' field if it was created before migration
      const legacyProject = await Project.findOne({ id: projectId, userEmail: email });
      if (!legacyProject) return res.status(404).json({ message: 'Project not found' });
    }
    
    const targetId = project ? project._id : projectId; // Use _id for update

    const updatedData = {
      title: title ? title.trim() : undefined,
      category,
      skills: Array.isArray(techStack) ? techStack : (techStack ? techStack.split(',').map(s => s.trim()).filter(Boolean) : undefined),
      techStack: Array.isArray(techStack) ? techStack : (techStack ? techStack.split(',').map(s => s.trim()).filter(Boolean) : undefined),
      description,
      githubUrl,
      demoUrl,
      status,
      resumeBullets: Array.isArray(resumeBullets) ? resumeBullets : (resumeBullets !== undefined ? resumeBullets.split('\n').filter(Boolean) : undefined),
      updatedAt: new Date().toISOString()
    };
    
    // Remove undefined fields
    Object.keys(updatedData).forEach(key => updatedData[key] === undefined && delete updatedData[key]);

    // Can't use updateOne because we need to find it by _id OR legacy id. But since we fetch all projects, let's just update based on the fetched one.
    // Assuming local JSON DB, we need to map over it. But `Project.updateOne` should work if we use `_id: targetId`. Wait, my `LocalCollection` has no `updateOne`. I have `updateMany` or wait.
    // LocalCollection uses `read()` and `write()`. The `db.js` local fallback doesn't have `updateOne`. Oh it does have `updateMany` which returns modifiedCount.
    
    // Let's rely on standard mongoose/LocalCollection. LocalCollection has `updateOne`. Wait, let me check `db.js` for LocalCollection methods. It has `updateMany` actually.
    // It's safer to just drop `Project.updateMany` here. But wait! `db.js` doesn't implement `updateOne` for LocalCollection!
    // Ah, it has `updateMany(filter, updateObj)`.
    // Let's use it.
    await Project.updateMany({ _id: targetId }, { $set: updatedData });

    const userProjects = await Project.find({ userEmail: email });

    res.json({
      message: 'Project updated successfully!',
      userProjects
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update project', error: error.message });
  }
});

// DELETE /api/projects/:id - Remove project
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const email = req.user.email;
    const projectId = req.params.id;

    await Project.deleteMany({ _id: projectId, userEmail: email });
    await Project.deleteMany({ id: projectId, userEmail: email }); // fallback for legacy

    const userProjects = await Project.find({ userEmail: email });

    res.json({
      message: 'Project removed.',
      userProjects
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete project', error: error.message });
  }
});

module.exports = router;
