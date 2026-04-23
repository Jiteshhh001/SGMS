require('dotenv').config();
const mongoose = require('mongoose');

const Student = require('../models/Student');
const Grievance = require('../models/Grievance');

const sampleStudents = [
  {
    name: 'Aarav Mehta',
    email: 'aarav.mehta@example.com',
    password: 'password123'
  },
  {
    name: 'Diya Sharma',
    email: 'diya.sharma@example.com',
    password: 'password123'
  },
  {
    name: 'Rohan Verma',
    email: 'rohan.verma@example.com',
    password: 'password123'
  }
];

const grievanceTemplates = [
  {
    title: 'Projector not working in lecture hall',
    description: 'The projector in Hall B has not been working for two days and classes are affected.',
    category: 'Academic',
    status: 'Pending'
  },
  {
    title: 'Wi-Fi connectivity is unstable in hostel',
    description: 'Hostel block C has frequent internet drops during evening study hours.',
    category: 'Hostel',
    status: 'Pending'
  },
  {
    title: 'College bus is consistently late',
    description: 'Morning route bus reaches campus 20-25 minutes late on most weekdays.',
    category: 'Transport',
    status: 'Resolved'
  },
  {
    title: 'Need additional water dispensers',
    description: 'There are long queues near the only dispenser in the main building during breaks.',
    category: 'Other',
    status: 'Pending'
  }
];

function randomPastDate(maxDaysBack = 30) {
  const now = new Date();
  const daysBack = Math.floor(Math.random() * maxDaysBack);
  const result = new Date(now);
  result.setDate(now.getDate() - daysBack);
  return result;
}

async function seed({ reset = false } = {}) {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set in backend/.env');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  try {
    if (reset) {
      await Grievance.deleteMany({});
      await Student.deleteMany({});
      console.log('Existing students and grievances removed');
    }

    const createdStudents = [];

    for (const studentData of sampleStudents) {
      const existingStudent = await Student.findOne({ email: studentData.email.toLowerCase() });

      if (existingStudent) {
        createdStudents.push(existingStudent);
        console.log(`Student already exists: ${existingStudent.email}`);
      } else {
        const student = new Student(studentData);
        await student.save();
        createdStudents.push(student);
        console.log(`Student created: ${student.email}`);
      }
    }

    const grievancesToInsert = [];
    const seededStudentIds = createdStudents.map((student) => student._id);
    const seededTitles = grievanceTemplates.map((template) => template.title);

    // Refresh only sample grievances for seeded users so repeated runs do not duplicate data.
    await Grievance.deleteMany({
      studentId: { $in: seededStudentIds },
      title: { $in: seededTitles }
    });

    for (const student of createdStudents) {
      for (const template of grievanceTemplates) {
        grievancesToInsert.push({
          studentId: student._id,
          title: template.title,
          description: template.description,
          category: template.category,
          status: template.status,
          date: randomPastDate(45)
        });
      }
    }

    await Grievance.insertMany(grievancesToInsert);

    console.log(`Seed complete: ${createdStudents.length} students, ${grievancesToInsert.length} grievances added`);
    console.log('Sample login credentials (all password: password123):');
    for (const student of createdStudents) {
      console.log(`- ${student.email}`);
    }
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

const shouldReset = process.argv.includes('--reset');

seed({ reset: shouldReset })
  .catch((error) => {
    console.error('Seeding failed:', error.message);
    process.exitCode = 1;
  });
