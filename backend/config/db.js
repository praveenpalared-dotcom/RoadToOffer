const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
const useMongoDB = !!MONGODB_URI;

// -------------------------------------------------------------
// MONGODB CONNECTION
// -------------------------------------------------------------

let mongoConnectionPromise = null;

async function connectDB() {
  // MongoDB is not configured
  if (!useMongoDB) {
    return;
  }

  // Already connected
  if (mongoose.connection.readyState === 1) {
    return;
  }

  // Connection is already being established
  if (mongoConnectionPromise) {
    return mongoConnectionPromise;
  }

  console.log('[DB] Connecting to MongoDB...');

  mongoConnectionPromise = mongoose
    .connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    })
    .then(() => {
      console.log('[DB] MongoDB connected successfully.');
    })
    .catch((err) => {
      mongoConnectionPromise = null;
      console.error('[DB] MongoDB connection error:', err.message);
      throw err;
    });

  return mongoConnectionPromise;
};

// Start connection immediately, but routes can also await connectDB()
if (useMongoDB) {
  connectDB().catch(() => {
    // Error is already logged inside connectDB().
    // Routes that call await connectDB() will receive the error.
  });
}

// -------------------------------------------------------------
// MONGOOSE SCHEMA DEFINITIONS
// -------------------------------------------------------------

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActiveDate: { type: String, default: '' },
  badges: { type: [String], default: [] },
  leetcodeUsername: { type: String, default: '' },
  leetcodeStats: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  codeforcesHandle: { type: String, default: '' },
  codeforcesStats: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },

  dailyGoals: {
    solveCount: { type: Number, default: 0 },
    solveTarget: { type: Number, default: 2 },
    reviseCount: { type: Number, default: 0 },
    reviseTarget: { type: Number, default: 3 },
    challengeCompleted: { type: Boolean, default: false },
  },

  // --- MASTER UPGRADE FIELDS ---
  academicStatus: {
    type: String,
    default: 'In Progress',
  },

  placementReadiness: {
    overall: { type: Number, default: 0 },
    dsa: { type: Number, default: 0 },
    csFundamentals: { type: Number, default: 0 },
    ct: { type: Number, default: 0 },
    aptitude: { type: Number, default: 0 },
    projects: { type: Number, default: 0 },
  },

  preferences: {
    targetGradYear: { type: String, default: '' },
    dailyStudyHours: { type: Number, default: 2 },
    preferredLanguage: { type: String, default: 'C++' },
    targetCompanies: { type: [String], default: [] },
    careerPath: {
      type: String,
      default: 'Software Engineer',
    },
  },

  achievements: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// -------------------------------------------------------------
// TOPIC
// -------------------------------------------------------------

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  slug: {
    type: String,
    required: true,
    unique: true,
  },

  phase: {
    type: String,
    required: true,
  },

  track: {
    type: String,
    default: 'TRACK C — DSA',
  },

  order: {
    type: Number,
    default: 0,
  },
});

// -------------------------------------------------------------
// PROBLEM
// -------------------------------------------------------------

const problemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  difficulty: {
    type: String,
    required: true,
  },

  pattern: {
    type: String,
    default: '',
  },

  platform: {
    type: String,
    default: 'LeetCode',
  },

  status: {
    type: String,
    default: 'Not Started',
  },

  notes: {
    type: String,
    default: '',
  },

  userCode: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },

  answer: {
    type: String,
    default: '',
  },

  revisionSchedule: {
    type: String,
    default: 'None',
  },

  lastSolved: {
    type: String,
    default: '',
  },

  timesRevised: {
    type: Number,
    default: 0,
  },

  companyTags: {
    type: [String],
    default: [],
  },

  solutionLink: {
    type: String,
    default: '',
  },

  topicSlug: {
    type: String,
    required: true,
  },

  isFavorite: {
    type: Boolean,
    default: false,
  },

  userEmail: {
    type: String,
    required: true,
  },

  xp: {
    type: Number,
    default: 20,
  },
});

// -------------------------------------------------------------
// ACTIVITY LOG
// -------------------------------------------------------------

const activityLogSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },

  date: {
    type: String,
    required: true,
  },

  problemName: {
    type: String,
    default: '',
  },

  xpEarned: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// -------------------------------------------------------------
// ROADMAP TRACK
// -------------------------------------------------------------

const roadmapTrackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    default: '',
  },

  order: {
    type: Number,
    default: 0,
  },
});

// -------------------------------------------------------------
// ASSESSMENT
// -------------------------------------------------------------

const assessmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    required: true,
  },

  durationMinutes: {
    type: Number,
    default: 90,
  },

  questions: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },
});

// -------------------------------------------------------------
// ASSESSMENT ATTEMPT
// -------------------------------------------------------------

const assessmentAttemptSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },

  assessmentId: {
    type: String,
    required: true,
  },

  score: {
    type: Number,
    default: 0,
  },

  status: {
    type: String,
    default: 'Completed',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// -------------------------------------------------------------
// PROJECT
// -------------------------------------------------------------

const projectSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    default: '',
  },

  github: {
    type: String,
    default: '',
  },

  liveDemo: {
    type: String,
    default: '',
  },

  skills: {
    type: [String],
    default: [],
  },

  difficulty: {
    type: String,
    default: 'Medium',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// -------------------------------------------------------------
// COMPANY
// -------------------------------------------------------------

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  tier: {
    type: String,
    default: 'Product',
  },

  description: {
    type: String,
    default: '',
  },

  logo: {
    type: String,
    default: '',
  },

  roles: {
    type: String,
    default: 'SWE',
  },

  salary: {
    type: String,
    default: '₹15-30 LPA',
  },

  rounds: {
    type: Number,
    default: 4,
  },

  color: {
    type: String,
    default:
      'text-blue-400 border-blue-400/30 bg-blue-400/10',
  },

  expectations: {
    dsa: {
      type: Number,
      default: 50,
    },

    cs: {
      type: Number,
      default: 50,
    },

    projects: {
      type: Number,
      default: 50,
    },
  },
});

// -------------------------------------------------------------
// HACKATHON
// -------------------------------------------------------------

const hackathonSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  organizer: {
    type: String,
    default: '',
  },

  status: {
    type: String,
    default: 'Upcoming',
  },

  result: {
    type: String,
    default: '',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// -------------------------------------------------------------
// CERTIFICATION
// -------------------------------------------------------------

const certificationSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  provider: {
    type: String,
    default: '',
  },

  status: {
    type: String,
    default: 'In Progress',
  },

  score: {
    type: String,
    default: '',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// -------------------------------------------------------------
// RECOMMENDATION
// -------------------------------------------------------------

const recommendationSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },

  date: {
    type: String,
    required: true,
  },

  task: {
    type: String,
    required: true,
  },

  reason: {
    type: String,
    required: true,
  },

  timeEstimate: {
    type: String,
    default: '30 min',
  },

  priority: {
    type: Number,
    default: 1,
  },

  xp: {
    type: Number,
    default: 10,
  },

  status: {
    type: String,
    default: 'Pending',
  },
});

// -------------------------------------------------------------
// MONGOOSE MODELS
// -------------------------------------------------------------

let MongooseUser;
let MongooseTopic;
let MongooseProblem;
let MongooseActivityLog;

let MongooseRoadmapTrack;
let MongooseAssessment;
let MongooseAssessmentAttempt;

let MongooseProject;
let MongooseCompany;
let MongooseHackathon;
let MongooseCertification;
let MongooseRecommendation;

if (useMongoDB) {
  MongooseUser =
    mongoose.models.User ||
    mongoose.model('User', userSchema);

  MongooseTopic =
    mongoose.models.Topic ||
    mongoose.model('Topic', topicSchema);

  MongooseProblem =
    mongoose.models.Problem ||
    mongoose.model('Problem', problemSchema);

  MongooseActivityLog =
    mongoose.models.ActivityLog ||
    mongoose.model('ActivityLog', activityLogSchema);

  MongooseRoadmapTrack =
    mongoose.models.RoadmapTrack ||
    mongoose.model('RoadmapTrack', roadmapTrackSchema);

  MongooseAssessment =
    mongoose.models.Assessment ||
    mongoose.model('Assessment', assessmentSchema);

  MongooseAssessmentAttempt =
    mongoose.models.AssessmentAttempt ||
    mongoose.model(
      'AssessmentAttempt',
      assessmentAttemptSchema
    );

  MongooseProject =
    mongoose.models.Project ||
    mongoose.model('Project', projectSchema);

  MongooseCompany =
    mongoose.models.Company ||
    mongoose.model('Company', companySchema);

  MongooseHackathon =
    mongoose.models.Hackathon ||
    mongoose.model('Hackathon', hackathonSchema);

  MongooseCertification =
    mongoose.models.Certification ||
    mongoose.model(
      'Certification',
      certificationSchema
    );

  MongooseRecommendation =
    mongoose.models.Recommendation ||
    mongoose.model(
      'Recommendation',
      recommendationSchema
    );
}

// -------------------------------------------------------------
// LOCAL JSON ENGINE
// -------------------------------------------------------------

const dataDir = path.join(__dirname, '..', 'data');

function ensureDataDirectory() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, {
      recursive: true,
    });
  }
}

function matchFilter(item, filter = {}) {
  for (const key in filter) {
    if (filter[key] === undefined) {
      continue;
    }

    if (
      filter[key] &&
      typeof filter[key] === 'object' &&
      filter[key].$in
    ) {
      if (
        !filter[key].$in
          .map(String)
          .includes(String(item[key]))
      ) {
        return false;
      }
    } else if (
      String(item[key] ?? '') !==
      String(filter[key])
    ) {
      return false;
    }
  }

  return true;
}

class LocalCollection {
  constructor(filename) {
    this.filepath = path.join(
      dataDir,
      filename
    );

    ensureDataDirectory();

    if (!fs.existsSync(this.filepath)) {
      fs.writeFileSync(
        this.filepath,
        JSON.stringify([])
      );
    }
  }

  read() {
    try {
      const data = fs.readFileSync(
        this.filepath,
        'utf8'
      );

      return JSON.parse(data || '[]');
    } catch (e) {
      return [];
    }
  }

  write(data) {
    fs.writeFileSync(
      this.filepath,
      JSON.stringify(data, null, 2)
    );
  }

  async find(filter = {}) {
    const items = this.read();

    return items.filter((item) =>
      matchFilter(item, filter)
    );
  }

  async findOne(filter = {}) {
    const items = this.read();

    const found = items.find((item) =>
      matchFilter(item, filter)
    );

    return found || null;
  }

  async create(doc) {
    const items = this.read();

    const newDoc = {
      _id: Math.random()
        .toString(36)
        .substring(2, 11),

      ...doc,

      createdAt:
        doc.createdAt ||
        new Date().toISOString(),
    };

    items.push(newDoc);

    this.write(items);

    return newDoc;
  }

  async updateOne(
    filter = {},
    update = {}
  ) {
    const items = this.read();

    let updatedCount = 0;

    const newItems = items.map((item) => {
      if (
        matchFilter(item, filter) &&
        updatedCount === 0
      ) {
        updatedCount++;

        let setObj = update.$set
          ? { ...update.$set }
          : {};

        if (
          !update.$set &&
          !update.$inc
        ) {
          setObj = { ...update };
        }

        const incObj =
          update.$inc || null;

        let merged = {
          ...item,
          ...setObj,
        };

        if (incObj) {
          for (const k in incObj) {
            merged[k] =
              (merged[k] || 0) +
              incObj[k];
          }
        }

        return merged;
      }

      return item;
    });

    this.write(newItems);

    return {
      modifiedCount: updatedCount,
    };
  }

  async updateMany(
    filter = {},
    update = {}
  ) {
    const items = this.read();

    let updatedCount = 0;

    const newItems = items.map((item) => {
      if (matchFilter(item, filter)) {
        updatedCount++;

        let setObj = update.$set
          ? { ...update.$set }
          : {};

        if (
          !update.$set &&
          !update.$inc
        ) {
          setObj = { ...update };
        }

        const incObj =
          update.$inc || null;

        let merged = {
          ...item,
          ...setObj,
        };

        if (incObj) {
          for (const k in incObj) {
            merged[k] =
              (merged[k] || 0) +
              incObj[k];
          }
        }

        return merged;
      }

      return item;
    });

    this.write(newItems);

    return {
      modifiedCount: updatedCount,
    };
  }

  async deleteOne(filter = {}) {
    const items = this.read();

    let deletedCount = 0;

    const filtered = items.filter(
      (item) => {
        if (
          matchFilter(item, filter) &&
          deletedCount === 0
        ) {
          deletedCount++;
          return false;
        }

        return true;
      }
    );

    this.write(filtered);

    return {
      deletedCount,
    };
  }

  async deleteMany(filter = {}) {
    const items = this.read();

    const filtered = items.filter(
      (item) =>
        !matchFilter(item, filter)
    );

    const deletedCount =
      items.length - filtered.length;

    this.write(filtered);

    return {
      deletedCount,
    };
  }

  async countDocuments(filter = {}) {
    const results =
      await this.find(filter);

    return results.length;
  }
}

// -------------------------------------------------------------
// LOCAL DATABASES
// -------------------------------------------------------------

const localUser =
  new LocalCollection('users.json');

const localTopic =
  new LocalCollection('topics.json');

const localProblem =
  new LocalCollection('problems.json');

const localActivityLog =
  new LocalCollection(
    'activity_logs.json'
  );

const localRoadmapTrack =
  new LocalCollection(
    'roadmap_tracks.json'
  );

const localAssessment =
  new LocalCollection(
    'assessments.json'
  );

const localAssessmentAttempt =
  new LocalCollection(
    'assessment_attempts.json'
  );

const localProject =
  new LocalCollection(
    'projects.json'
  );

const localCompany =
  new LocalCollection(
    'companies.json'
  );

const localHackathon =
  new LocalCollection(
    'hackathons.json'
  );

const localCertification =
  new LocalCollection(
    'certifications.json'
  );

const localRecommendation =
  new LocalCollection(
    'recommendations.json'
  );

console.log(
  '[DB] Local JSON database loaded successfully.'
);

// -------------------------------------------------------------
// EXPORTS
// -------------------------------------------------------------

module.exports = {
  User: useMongoDB
    ? MongooseUser
    : localUser,

  Topic: useMongoDB
    ? MongooseTopic
    : localTopic,

  Problem: useMongoDB
    ? MongooseProblem
    : localProblem,

  ActivityLog: useMongoDB
    ? MongooseActivityLog
    : localActivityLog,

  RoadmapTrack: useMongoDB
    ? MongooseRoadmapTrack
    : localRoadmapTrack,

  Assessment: useMongoDB
    ? MongooseAssessment
    : localAssessment,

  AssessmentAttempt: useMongoDB
    ? MongooseAssessmentAttempt
    : localAssessmentAttempt,

  Project: useMongoDB
    ? MongooseProject
    : localProject,

  Company: useMongoDB
    ? MongooseCompany
    : localCompany,

  Hackathon: useMongoDB
    ? MongooseHackathon
    : localHackathon,

  Certification: useMongoDB
    ? MongooseCertification
    : localCertification,

  Recommendation: useMongoDB
    ? MongooseRecommendation
    : localRecommendation,

  useMongoDB,

  // IMPORTANT:
  // Routes can await this before making
  // MongoDB queries.
  connectDB,
};