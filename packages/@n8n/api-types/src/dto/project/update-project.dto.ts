import { z } from 'zod';
import { Z } from 'zod-class';

import {
	projectAllowedWorkersSchema,
	projectDescriptionSchema,
	projectIconSchema,
	projectNameSchema,
	projectRelationSchema,
} from '../../schemas/project.schema';

const updateProjectShape = {
	name: projectNameSchema.optional(),
	icon: projectIconSchema.optional(),
	description: projectDescriptionSchema.optional(),
	allowedWorkers: projectAllowedWorkersSchema.optional(),
};

export class UpdateProjectDto extends Z.class(updateProjectShape) {}

export class UpdateProjectWithRelationsDto extends Z.class({
	...updateProjectShape,
	relations: z.array(projectRelationSchema).optional(),
}) {}
