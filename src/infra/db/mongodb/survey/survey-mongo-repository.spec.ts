import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { Collection } from 'mongodb'
let surveyCollection: Collection
const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}
describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  describe('add()', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSut()
      await sut.add({
        question: 'any_question',
        answers: [
          { image: 'any_image', answer: 'any_answer' },
          { answer: 'other_answer' }
        ],
        date: new Date()
      })
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })
  describe('loadAll()', () => {
    test('Should loadAll surveys on success', async () => {
      await surveyCollection.insertMany([
        {
          question: 'any_question',
          answers: [{ image: 'any_image', answer: 'any_answer' }],
          date: new Date()
        },
        {
          question: 'other_question',
          answers: [{ image: 'any_image', answer: 'any_answer' }],
          date: new Date()
        }
      ])
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[1].question).toBe('other_question')
    })
    test('Should load an empty list', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(0)
    })
  })
  describe('loadById()', () => {
    test('Should load survey by id on success', async () => {
      const { ops } = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [{ image: 'any_image', answer: 'any_answer' }],
        date: new Date()
      })
      const id = ops[0]._id
      const sut = makeSut()
      const surveys = await sut.loadById(id)
      expect(surveys).toBeTruthy()
      expect(surveys.id).toBeTruthy()
    })
  })
})
