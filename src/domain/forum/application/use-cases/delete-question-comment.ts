import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

import { Either, left, right } from '@/core/either'
import { NotAllowerError } from '@/core/errors/use-case-errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/use-case-errors/resource-not-found-error'

interface DeleteQuestionCommentUseCaseRequest {
  authorId: string
  questionCommentId: string
}

type DeleteQuestionCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowerError,
  {}
>

export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment = await this.questionCommentsRepository.findById(
      questionCommentId,
    )

    if (!questionComment) {
      return left(new ResourceNotFoundError())
    }

    if (questionComment.authorId.toString() !== authorId) {
      return left(new NotAllowerError())
    }

    await this.questionCommentsRepository.delete(questionComment)

    return right({})
  }
}
