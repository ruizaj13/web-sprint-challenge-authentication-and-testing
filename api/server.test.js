// Write your tests here
const request = require('supertest')
const db = require('../data/dbConfig')
const jokes = require('./jokes/jokes-data')
const server = require('./server')

const juan = {username: 'juan', password: '123'}

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach(async () => {
  await db('users').truncate()
})

afterAll(async () => {
  await db.destroy()
})

describe('sanity check', () => { 
  test('sanity', () => {
    expect(true).toBe(true)
  })
})

describe('server', () => {
  describe('POST /register', () => {
    it('responds with new user', async () => {
      let res = await request(server).post('/api/auth/register').send(juan)
      expect(res.body).toMatchObject({id: 1})
    })
    it('responds with "taken" if username already exists', async () => {
      await await request(server).post('/api/auth/register').send(juan)
      const {body} = await request(server).post('/api/auth/register').send(juan)
      expect(JSON.stringify(body)).toEqual(expect.stringMatching(/taken/i))
    })
  })

  describe('POST /login', () => {
    it('responds with token', async () => {
      let res = await request(server).post('/api/auth/login').send(juan)
      expect(res.body.token).toExist
    })
    it('responds with welcome message', async () => {
      await request(server).post('/api/auth/register').send(juan)
      let res = await request(server).post('/api/auth/login').send(juan)
      expect(res.body.message).toMatch(/access granted/i)
    })
    it('responds with invalid  message', async () => {
      let res = await request(server).post('/api/auth/login').send(juan)
      expect(res.body.message).toMatch(/invalid credentials/i)
    })
  })
  describe('GET /jokes', () => {
    it('responds with jokes', async () => {
      await request(server).post('/api/auth/register').send(juan)
      await request(server).post('/api/auth/login').send(juan)
      expect(jokes).toExist
    })
  })
})