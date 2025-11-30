require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import models
const Message = require('./models/Message');
const Task = require('./models/Task');
const Doc = require('./models/Doc');

async function loadSampleData() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB\n');

    // Load messages
    console.log('📨 Loading sample messages...');
    const messagesData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/sample/messages.json'), 'utf8')
    );
    
    // Clear existing messages
    await Message.deleteMany({});
    
    // Insert messages
    const messages = await Message.insertMany(messagesData.messages);
    console.log(`✅ Loaded ${messages.length} messages\n`);

    // Load docs
    console.log('📄 Loading sample documents...');
    const docsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/sample/docs.json'), 'utf8')
    );
    
    // Clear existing docs
    await Doc.deleteMany({});
    
    // Insert docs
    const docs = await Doc.insertMany(docsData.docs);
    console.log(`✅ Loaded ${docs.length} documents\n`);

    // Create some sample tasks from messages
    console.log('✅ Creating sample tasks...');
    await Task.deleteMany({});
    
    const sampleTasks = [
      {
        title: 'Test the new login flow',
        description: 'Test authentication flow on staging',
        assigneeName: 'Ash Kumar',
        dueDate: new Date('2024-11-29'),
        status: 'todo',
        channelId: 'dev-frontend'
      },
      {
        title: 'Review PR #234',
        description: 'Review modal overflow fix',
        assigneeName: 'Lisa Park',
        dueDate: new Date('2024-11-28'),
        status: 'in-progress',
        channelId: 'dev-frontend'
      },
      {
        title: 'Update component documentation',
        description: 'Update docs for new components',
        assigneeName: null,
        dueDate: null,
        status: 'todo',
        channelId: 'dev-frontend'
      },
      {
        title: 'Review Q4 campaign deck',
        description: 'Review marketing campaign materials',
        assigneeName: 'Team',
        dueDate: new Date('2024-11-27'),
        status: 'done',
        channelId: 'marketing'
      },
      {
        title: 'Investigate Safari login issues',
        description: 'Debug Safari-specific login problems',
        assigneeName: 'Tech Team',
        dueDate: null,
        status: 'in-progress',
        channelId: 'support'
      },
      {
        title: 'Update Safari troubleshooting guide',
        description: 'Add Safari troubleshooting steps to KB',
        assigneeName: 'Rachel Green',
        dueDate: null,
        status: 'todo',
        channelId: 'support'
      }
    ];
    
    const tasks = await Task.insertMany(sampleTasks);
    console.log(`✅ Created ${tasks.length} tasks\n`);

    console.log('🎉 Sample data loaded successfully!\n');
    console.log('Summary:');
    console.log(`  - ${messages.length} messages`);
    console.log(`  - ${docs.length} documents`);
    console.log(`  - ${tasks.length} tasks`);
    console.log('\n✨ You can now refresh your browser to see the data!\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error loading sample data:', error);
    process.exit(1);
  }
}

loadSampleData();
