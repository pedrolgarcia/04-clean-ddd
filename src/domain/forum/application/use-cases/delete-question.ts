import { QuestionsRepository } from '../repositories/questions-repository'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/use-case-errors/resource-not-found-error'
import { NotAllowerError } from '@/core/errors/use-case-errors/not-allowed-error'

interface DeleteQuestionUseCaseRequest {
  authorId: string
  questionId: string
}

type DeleteQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowerError,
  {}
>

export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    questionId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowerError())
    }

    await this.questionsRepository.delete(question)

    return right({})
  }
}
