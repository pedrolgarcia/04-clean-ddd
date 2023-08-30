import { UseCaseError } from '@/core/errors/use-case-error'

export class NotAllowerError extends Error implements UseCaseError {
  constructor() {
    super('Not allowed')
  }
}
