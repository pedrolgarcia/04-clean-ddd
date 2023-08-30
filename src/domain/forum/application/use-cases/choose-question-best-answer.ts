import { Either, left, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'

import { AnswersRepository } from '../repositories/answers-repository'

import { QuestionsRepository } from '../repositories/questions-repository'

import { ResourceNotFoundError } from '@/core/errors/use-case-errors/resource-not-found-error'
import { NotAllowerError } from '@/core/errors/use-case-errors/not-allowed-error'

interface ChooseQuestionBestAnswerUseCaseRequest {
  authorId: string
  answerId: string
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowerError,
  {
    question: Question
  }
>

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private answersRepository: AnswersRepository,
  ) {}

  async execute({
    authorId,
    answerId,
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    )

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowerError())
    }

    question.bestAnswerId = answer.id

    await this.questionsRepository.save(question)

    return right({ question })
  }
}
