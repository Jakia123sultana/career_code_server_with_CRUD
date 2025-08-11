// require('dotenv').config()
// const express = require('express')
// const cors = require('cors')
// const app = express();

// const port = process.env.PORT || 3000;

// // var admin = require("firebase-admin");

// // var serviceAccount = require("./firebase_secrect.json");

// // admin.initializeApp({
// //   credential: admin.credential.cert(serviceAccount)
// // });

// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// app.use(cors(

// ));
// app.use(express.json());

//  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ayqadbk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// // const uri = "mongodb+srv://career_db_user:<db_password>@cluster0.ayqadbk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });
// // const verifyFireBaseToken = async (req, res, next) => {
// //   const authHeader = req.headers?.authorization;

// //   if (!authHeader || !authHeader.startsWith('Bearer ')) {
// //     return res.status(401).send({ message: 'unauthorized access' })
// //   }

// //   const token = authHeader.split(' ')[1];

// //   try {
// //     const decoded = await admin.auth().verifyIdToken(token);
// //     console.log('decoded token', decoded);
// //     req.decoded = decoded;
// //     next();
// //   }
// //   catch (error) {
// //     return res.status(401).send({ message: 'unauthorized access' })
// //   }
// // }

// async function run() {
//   // try {
//     // Connect the client to the server	(optional starting in v4.7)
//     // await client.connect();
//        await client.connect();

//     const jobsCollection = client.db('careerCode').collection('jobs');
//        const applicationsCollection = client.db('careerCode').collection('applications')
//     // Send a ping to confirm a successful connection
//     // await client.db("careerCode").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     // app.post('/jwt', async (req, res) => {
//     //   const userInfo = req.body;

//     //   const token = jwt.sign(userInfo, process.env.JWT_ACCESS_SECRET, { expiresIn: '2h' });
//     //   res.cookie('token', token, {
//     //     httpOnly: true,
//     //     secure: false,
         
//     //   }) 
//     //   res.send({success:true})
//     // })
//    app.get('/jobs', async (req, res) => {

//       const email = req.query.email;
//       const query = {};
//       if (email) {
//         query.hr_email = email;
//       }

//       const cursor = jobsCollection.find(query);
//       const result = await cursor.toArray();
//       res.send(result);
//     });
//   app.get('/jobs/:id',async(req,res)=>{
//   const id = req.params.id;
//   const query = {_id:new ObjectId(id)}
//   const result = await jobsCollection.findOne(query);
//  res.send(result)
//   })

//     app.post('/applications', async (req, res) => {
//       const application = req.body;
//       // console.log(application);
//       const result = await applicationsCollection.insertOne(application);
     
//       res.send(result);
//     });
//     //  app.get('/applications', async (req, res) => {
//     //   // console.log(req.headers);
//     //   const cursor = applicationsCollection.find();
//     //   const result = await cursor.toArray();
//     //   res.send(result);
//     // });
// // logger,verifyToken,
//      app.get('/applications', async (req, res) => {
//       const email = req.query.email;

     

//       const query = {
//         applicant: email
//       }
//       const result = await applicationsCollection.find(query).toArray();

//       // bad way to aggregate data
//       for (const application of result) {
//         const jobId = application.jobId;
//         const jobQuery = { _id: new ObjectId(jobId) }
//         const job = await jobsCollection.findOne(jobQuery);
//         application.company = job.company
//         application.title = job.title
//         application.company_logo = job.company_logo
//       }

//       res.send(result);
//     });
//     app.get('/', (req, res) => {
//   res.send('Career Code is Cooking')
// })

// app.listen(port, () => {
//   console.log(`Career Code server is running on port ${port}`)
// })


// //   } finally {
// //     // Ensures that the client will close when you finish/error
// //     // await client.close();
// //   }
// }
// run();

// // app.get('/', (req, res) => {
// //   res.send('Career Code is Cooking')
// // })

// // app.listen(port, () => {
// //   console.log(`Career Code server is running on port ${port}`)
// // })

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = "mongodb+srv://career_db_user:cvs2oOG14plDweOb@cluster0.ayqadbk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  // try {
    // await client.connect();

    const jobsCollection = client.db('careerCode').collection('jobs');
    const applicationsCollection = client.db('careerCode').collection('applications');
const usersCollection = client.db('careerCode').collection('users');

    console.log("✅ Connected to MongoDB");

    app.get('/', (req, res) => {
      res.send('Career Code is Cooking');
    });
// users all code
    app.post('/users', async (req, res) => {
  const user = req.body;
  const query = { email: user.email };
  const existingUser = await usersCollection.findOne(query);
  if (existingUser) {
    return res.status(409).send({ message: 'User already exists' });
  }

  const result = await usersCollection.insertOne(user);
  res.send(result);
});

app.get('/users/:email/role', async (req, res) => {
  const email = req.params.email;
  console.log("Role check for email:", email); 

  const user = await usersCollection.findOne({
    email: { $regex: new RegExp(`^${email}$`, 'i') } 
  });

  if (!user) {
    console.log("❌ No user found for email:", email); 
    return res.status(404).send({ message: 'User not found' });
  }

  console.log("✅ User found:", user); // 🐞 DEBUG HERE
  res.send({ role: user.role || 'user' });
});


app.patch("/users/:id/role", async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const result = await usersCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { role } }
  );
  res.send(result);
});

// Search users by email (for ManageUsers search)
app.get('/users/search', async (req, res) => {
  try {
    const emailQuery = req.query.email || '';
    if (!emailQuery) {
      return res.status(400).send({ message: "Email query parameter is required" });
    }
    const users = await usersCollection
      .find({ email: { $regex: emailQuery, $options: 'i' } })
      .toArray();
    res.send(users);
  } catch (error) {
    res.status(500).send({ error: 'Failed to search users' });
  }
});

// Delete user by id
app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: "Failed to delete user" });
  }
});


    app.get('/jobs', async (req, res) => {
      try {
        const email = req.query.email;
        const query = email ? { hr_email: email } : {};
        const jobs = await jobsCollection.find(query).toArray();
        res.send(jobs);
      } catch (err) {
        res.status(500).send({ error: 'Failed to fetch jobs' });
      }
    });

// POST /jobs – create a new job
app.post('/jobs', async (req, res) => {
  try {
    const jobData = req.body;

    // Basic validation (optional)
    if (!jobData.title || !jobData.company || !jobData.hr_email) {
      return res.status(400).send({ error: 'Missing required fields' });
    }

    const result = await jobsCollection.insertOne(jobData);
    res.status(201).send({ insertedId: result.insertedId });
  } catch (error) {
    console.error("Job insert error:", error);
    res.status(500).send({ error: 'Failed to insert job' });
  }
});


    app.get('/jobs/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const job = await jobsCollection.findOne({ _id: new ObjectId(id) });
        res.send(job);
      } catch (err) {
        res.status(500).send({ error: 'Invalid job ID' });
      }
    });
    // ✅ Admin: verify a job
// PATCH: Verify job
app.patch("/jobs/verify/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await jobsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "Verified" } }
    );
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: "Failed to verify job" });
  }
});

// DELETE job by ID
app.delete('/jobs/:id', async (req, res) => {
  const jobId = req.params.id;

  try {
    const result = await jobsCollection.deleteOne({ _id: new ObjectId(jobId) });

    if (result.deletedCount > 0) {
      res.send({ deletedCount: result.deletedCount });
    } else {
      res.status(404).send({ error: 'Job not found' });
    }
  } catch (err) {
    console.error('Failed to delete job:', err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});



    app.post('/applications', async (req, res) => {
      try {
        const result = await applicationsCollection.insertOne(req.body);
        res.send(result);
      } catch (err) {
        res.status(500).send({ error: 'Failed to submit application' });
      }
    });

    app.get('/applications', async (req, res) => {
      try {
        const email = req.query.email;
        const query = { applicant: email };
        const apps = await applicationsCollection.find(query).toArray();

        for (const appItem of apps) {
          const job = await jobsCollection.findOne({ _id: new ObjectId(appItem.jobId) });
          appItem.company = job?.company || '';
          appItem.title = job?.title || '';
          appItem.company_logo = job?.company_logo || '';
        }

        res.send(apps);
      } catch (err) {
        res.status(500).send({ error: 'Failed to fetch applications' });
      }
    });

    // Start server
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  }
//   } catch (err) {
//     console.error('MongoDB connection failed:', err);
//   }
// }

run();

