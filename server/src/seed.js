
import dns from 'node:dns';
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, Event } from './models/index.js';

// Fix MongoDB Atlas DNS resolution
dns.setServers(['8.8.8.8', '8.8.4.4']);

console.log('MongoDB DNS configured:', dns.getServers());

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('MongoDB connected');

    const entries = [
      ['EventFlow Admin', 'admin@eventflow.local', 'Admin123!', 'admin'],
      ['Demo Organizer', 'organizer@eventflow.local', 'Organizer123!', 'organizer'],
      ['Demo Student', 'student@eventflow.local', 'Student123!', 'student']
    ];

    const saved = {};

    for (const [name, email, password, role] of entries) {
      saved[role] = await User.findOneAndUpdate(
        { email },
        {
          name,
          email,
          password: await bcrypt.hash(password, 12),
          role
        },
        {
          upsert: true,
          new: true
        }
      );
    }

    console.log('Demo users created/updated');

    // Add sample events only when no events exist
    if (!(await Event.countDocuments())) {
      const d = days => new Date(Date.now() + days * 86400000);

      await Event.insertMany([
        {
          title: 'Web Development Bootcamp',
          description: 'Hands-on workshop on modern web development, APIs and deployment basics.',
          category: 'Workshop',
          venue: 'Computer Lab 2',
          startAt: d(10),
          endAt: new Date(+d(10) + 10800000),
          registrationDeadline: d(8),
          capacity: 80,
          status: 'published',
          organizer: saved.organizer._id
        },
        {
          title: 'Campus Innovation Showcase',
          description: 'Student teams present creative ideas and prototypes.',
          category: 'Competition',
          venue: 'Main Auditorium',
          startAt: d(18),
          endAt: new Date(+d(18) + 14400000),
          registrationDeadline: d(15),
          capacity: 150,
          status: 'published',
          organizer: saved.organizer._id
        },
        {
          title: 'Tech Talk: AI in Everyday Life',
          description: 'An introduction to AI applications and responsible innovation.',
          category: 'Seminar',
          venue: 'Seminar Hall A',
          startAt: d(25),
          endAt: new Date(+d(25) + 7200000),
          registrationDeadline: d(22),
          capacity: 100,
          status: 'published',
          organizer: saved.organizer._id
        }
      ]);

      console.log('3 sample events inserted');
    } else {
      console.log('Events already exist; skipping event insertion');
    }

    console.log('\nSeed completed successfully!');
    console.log('Admin: admin@eventflow.local / Admin123!');
    console.log('Organizer: organizer@eventflow.local / Organizer123!');
    console.log('Student: student@eventflow.local / Student123!');

  } catch (error) {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
