import { applyDecorators, UseGuards } from '@nestjs/common';
import { Protected } from './keycloak.guard';

export function Secured() {
  return applyDecorators(UseGuards(Protected));
}
