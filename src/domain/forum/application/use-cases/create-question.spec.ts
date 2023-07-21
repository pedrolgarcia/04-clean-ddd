import { CreateQuestionUseCase } from './create-question'

import { Question } from '../../enterprise/entities/question'

import { QuestionsRepository } from '../repositories/questions-repository'

const fakeQuestionsRepository: QuestionsRepository = {
  create: async (question: Question) => {},
}

it('should create a question', async () => {
  const createQuestion = new CreateQuestionUseCase(fakeQuestionsRepository)

  const { question } = await createQuestion.execute({
    authorId: '1',
    title: 'Nova pergunta',
    content: 'Conteúdo da pergunta',
  })

  expect(question.id).toBeTruthy()
})
