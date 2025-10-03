# Kafka Mini-Project (KafkaJS + Docker Compose)

Kafka example to showcase basics:
- Start Kafka via Docker Compose (single broker + ZooKeeper)
- Node.js producer sends JSON messages to a topic
- Node.js consumer reads and prints them
- Optional Python scripts included

## Prerequisites
- Windows with Docker Desktop installed and running
- Node.js 18+ (recommended)

## Quick start

1) Start Kafka

```cmd
cd c:\Projects\kafka-miniproject
docker compose up -d
```

2) Node.js (recommended on Windows)

Run producer first (creates the topic), then consumer:

```cmd
npm install
npm run producer
npm run consumer
```

You should see the consumer print 10 messages in order. The default topic is `demo-topic` and the broker is `localhost:9094`.

```

## Project structure
- `docker-compose.yml` – runs a single-broker Kafka with ZooKeeper
- `package.json` – Node scripts and dependency (KafkaJS)
- `src/js/producer.js` – Node producer (creates topic and sends messages)
- `src/js/consumer.js` – Node consumer (reads and prints messages)
- `src/node_config.js` – shared config for Node scripts

## Notes
- Producer ensures the topic exists. Auto-create is also enabled on the broker.
- To reset the environment:

```cmd
docker compose down -v
```

## Troubleshooting
- If `docker compose` is not recognized, update Docker Desktop and ensure the CLI integration is enabled.
- If the consumer can't connect, give Kafka a few more seconds to start.
- If port 9094 is in use, change it in `docker-compose.yml` and `src/node_config.js` (and `src/config.py` for Python).
- If using Python and you see `confluent-kafka` build errors, install Microsoft C++ Build Tools or prefer the Node.js path with KafkaJS.
