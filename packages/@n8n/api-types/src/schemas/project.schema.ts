import { assignableProjectRoleSchema } from '@n8n/permissions';
import { z } from 'zod';

export const projectNameSchema = z.string().min(1).max(255);

export const projectTypeSchema = z.enum(['personal', 'team']);
export type ProjectType = z.infer<typeof projectTypeSchema>;

export const projectIconSchema = z.object({
	type: z.enum(['emoji', 'icon']),
	value: z.string().min(1),
});
export type ProjectIcon = z.infer<typeof projectIconSchema>;

export const projectDescriptionSchema = z.string().max(512);

/**
 * Schema for allowed workers - an array of worker IDs that can execute workflows in this project.
 * Empty array means no restrictions (all workers allowed).
 * Maximum of 100 workers per project to prevent excessive storage and parsing overhead.
 * In practice, most deployments have far fewer workers than this limit.
 */
export const projectAllowedWorkersSchema = z.array(z.string().min(1)).max(100);
export type ProjectAllowedWorkers = z.infer<typeof projectAllowedWorkersSchema>;

export const projectRelationSchema = z.object({
	userId: z.string().min(1),
	role: assignableProjectRoleSchema,
});
export type ProjectRelation = z.infer<typeof projectRelationSchema>;
