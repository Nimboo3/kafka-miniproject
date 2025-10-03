const { Kafka, logLevel } = require('kafkajs');
const { TOPIC, BOOTSTRAP_SERVERS, NUM_MESSAGES } = require('../node_config');

async function ensureTopic(admin, topic) {
  const topics = await admin.listTopics();
  if (!topics.includes(topic)) {
    await admin.createTopics({ topics: [{ topic, numPartitions: 1, replicationFactor: 1 }] });
    console.log(`Created topic '${topic}'`);
  } else {
    console.log(`Topic '${topic}' already exists`);
  }
}

async function run() {
  const kafka = new Kafka({
    clientId: 'demo-producer',
    brokers: [BOOTSTRAP_SERVERS],
    logLevel: logLevel.NOTHING,
  });

  const admin = kafka.admin();
  await admin.connect();
  await ensureTopic(admin, TOPIC);
  await admin.disconnect();

  const producer = kafka.producer({ allowAutoTopicCreation: false });
  await producer.connect();

  console.log(`Sending ${NUM_MESSAGES} messages to '${TOPIC}' ...`);
  for (let i = 0; i < NUM_MESSAGES; i++) {
    const key = String(i);
    const value = JSON.stringify({ id: i, message: `hello-${i}`, ts: Date.now() / 1000 });
    const res = await producer.send({
      topic: TOPIC,
      messages: [{ key, value }],
      acks: -1,
    });
    for (const r of res) {
      console.log(`Produced to topic=${r.topicName} partition=${r.partition} baseOffset=${r.baseOffset} key=${key} value=${value}`);
    }
  }
  await producer.disconnect();
  console.log('Done.');
}

run().catch((err) => {
  console.error('Producer error:', err);
  process.exit(1);
});
