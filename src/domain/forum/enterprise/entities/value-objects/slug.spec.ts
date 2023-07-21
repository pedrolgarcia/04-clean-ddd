import { Slug } from './slug'

it('should be able to create a new slug from text', () => {
  const slug = Slug.createFromText('Example question_títle@com.br')

  expect(slug.value).toEqual('example-question-titlecombr')
})
