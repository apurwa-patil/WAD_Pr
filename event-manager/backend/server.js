const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect('mongodb+srv://admin:1234admin@cluster0.1lqu9.mongodb.net/eventmanager?retryWrites=true&w=majority')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


const Event = mongoose.model('Event', {
  name: String,
  date: String,
  location: String,
  description: String
});


const User = mongoose.model('User', {
  name: String,
  email: String,
  password: String
});


app.get('/events', async (req, res) => {
  const events = await Event.find();
  const modifiedEvents = events.map(event => ({
    id: event._id.toString(),
    name: event.name,
    date: event.date,
    location: event.location,
    description: event.description
  }));
  res.json(modifiedEvents);
});


app.post('/events', async (req, res) => {
  const newEvent = new Event(req.body);
  await newEvent.save();
  res.status(201).json({ message: 'Event created', event: newEvent });
});


app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});


app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
