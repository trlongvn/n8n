import type { PubSub } from './pubsub/pubsub.types';

export const QUEUE_NAME = 'jobs';

export const JOB_TYPE_NAME = 'job';

/**
 * Delay (in milliseconds) before re-queuing a job that was rejected due to worker restrictions.
 * This delay prevents tight loops when a worker repeatedly picks up and rejects the same job.
 */
export const WORKER_RESTRICTION_REQUEUE_DELAY_MS = 1000;

/** Pubsub channel for commands sent by a main process to workers or to other main processes. */
export const COMMAND_PUBSUB_CHANNEL = 'n8n.commands';

/** Pubsub channel for messages sent by workers in response to commands from main processes. */
export const WORKER_RESPONSE_PUBSUB_CHANNEL = 'n8n.worker-response';

/**
 * Commands that should be sent to the sender as well, e.g. during workflow activation and
 * deactivation in multi-main setup. */
export const SELF_SEND_COMMANDS = new Set<PubSub.Command['command']>([
	'add-webhooks-triggers-and-pollers',
	'remove-triggers-and-pollers',
]);

/**
 * Commands that should not be debounced when received, e.g. during webhook handling in
 * multi-main setup.
 */
export const IMMEDIATE_COMMANDS = new Set<PubSub.Command['command']>([
	'add-webhooks-triggers-and-pollers',
	'remove-triggers-and-pollers',
	'relay-execution-lifecycle-event',
]);
