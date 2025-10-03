const { Kafka, logLevel } = require('kafkajs');
const { TOPIC, BOOTSTRAP_SERVERS, NUM_MESSAGES, GROUP_ID } = require('../node_config');

async function run() {
  const kafka = new Kafka({
    clientId: 'demo-consumer',
    brokers: [BOOTSTRAP_SERVERS],
    logLevel: logLevel.NOTHING,
  });

  const consumer = kafka.consumer({ groupId: GROUP_ID, allowAutoTopicCreation: false });
  await consumer.connect();
  await consumer.subscribe({ topic: TOPIC, fromBeginning: true });

  let count = 0;
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const key = message.key ? message.key.toString('utf8') : null;
      const value = message.value ? message.value.toString('utf8') : null;
      console.log(`Consumed: topic=${topic} partition=${partition} offset=${message.offset} key=${key} value=${value}`);
      count += 1;
      if (count >= NUM_MESSAGES) {
        console.log(`Read ${count} messages. Exiting.`);
        await consumer.disconnect();
        process.exit(0);
      }
    },
  });
}

run().catch((err) => {
  console.error('Consumer error:', err);
  process.exit(1);
});
