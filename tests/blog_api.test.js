const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')

const api = supertest(app)


  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

describe('Blog GET method tests', () => {
test('Blogs are returned as JSON', async () => {
    await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
  
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('Every blog has id not _id', async () => {
    const response = await api.get('/api/blogs')
    const everyBlogHasId = response.body.every(b => b.id)

    assert(everyBlogHasId, true)
})
})


describe('Blog POST method tests', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  
    const passwordHash = await bcrypt.hash('test1', 10)
    const user = new User({ username: 'test', passwordHash })
  
    await user.save()
  })

  test('new blog blog cant be added if there is no token', async () => {

    const newBlog = {
        title: "Jotain Maukasta",
        author: "Maukasta",
        url: "https://www.jotainmaukasta.fi/",
        likes: 3
    }


    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)
  
    
    const blogsAtEnd = await helper.blogsInDb()
        
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })


  test('new blog can be added', async () => {
      const loggedInUser = await api
      .post('/api/login')
      .send({ username: 'test', password: 'test1' })
      .expect(200)

      const newBlog = {
          title: "Jotain Maukasta",
          author: "Maukasta",
          url: "https://www.jotainmaukasta.fi/",
          likes: 3
      }

  
      await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${loggedInUser.body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
      
      const blogsAtEnd = await helper.blogsInDb()
          
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const response = await api.get('/api/blogs')
      const titles = response.body.map(r => r.title)
    
      assert(titles.includes('Jotain Maukasta'))
    })


    test('add new blog without likes and it gets value of zero', async () => {
      const loggedInUser = await api
      .post('/api/login')
      .send({ username: 'test', password: 'test1' })
      .expect(200)

      const newBlog = {
          title: "Broidi",
          author: "Broidi",
          url: "https://broidi.com/category/urheilu/jaakiekko/"
      }
    
      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${loggedInUser.body.token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
        const blogsAtEnd = await helper.blogsInDb()
    
      assert.strictEqual(blogsAtEnd[2].likes, 0)
    })

test('blog doesnt have url so request is 400', async () => {
  const loggedInUser = await api
      .post('/api/login')
      .send({ username: 'test', password: 'test1' })
      .expect(200)

  const newBlog = {
      title: "Broidi",
      author: "Maukasta",
      likes: 3
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${loggedInUser.body.token}`)
    .expect(400)
})

test('blog doesnt have title so request is 400', async () => {
  const loggedInUser = await api
      .post('/api/login')
      .send({ username: 'test', password: 'test1' })
      .expect(200)

  const newBlog = {
      author: "Maukasta",
      url: "https://broidi.com/category/urheilu/jaakiekko/",
      likes: 2
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${loggedInUser.body.token}`)
    .expect(400)
})

test('blog doesnt have neither title or url so request is 400', async () => {
  const loggedInUser = await api
      .post('/api/login')
      .send({ username: 'test', password: 'test1' })
      .expect(200)
      
  const newBlog = {
      author: "Maukasta",
      likes: 2
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${loggedInUser.body.token}`)
    .expect(400)
})
})

describe('Blog DELETE method tests', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  
    const passwordHash = await bcrypt.hash('test1', 10)
    const user = new User({ username: 'test', passwordHash })
  
    await user.save()
  })
test('succeeds with status code 204 if method succeed and there is valid token', async () => {
  const loggedInUser = await api
      .post('/api/login')
      .send({ username: 'test', password: 'test1' })
      .expect(200)

      const blog = {
        title: "Tämä poistetaan",
        author: "poisto",
        url: "https://www.jotainmaukasta.fi/",
        likes: 3
    }

    const deleteBlog = await api
    .post('/api/blogs')
    .send(blog)
    .set('Authorization', `Bearer ${loggedInUser.body.token}`)
    .expect(201)

  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart.find(blog => blog.id === deleteBlog.body.id)

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${loggedInUser.body.token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

  const titles = blogsAtEnd.map(b => b.title)

  assert(!titles.includes(blogToDelete.title))
})

test('responds with status code 401 bad request if headers doesnt include token', async () => {
  const notInDatabseId = await helper.blogsInDb()

  await api
    .delete(`/api/blogs/${notInDatabseId}`)
    .expect(401)
})
})



describe('Blog PUT method tests', () => {
  test('blog can be changed', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const firstBlog = blogsAtStart[0]

    const changedBlog = {
        title: "TestiBlogi123",
        author: "Yep",
        url: "https://www.jotainmaukasta.fi/",
        likes: 3
    }
  
    await api
      .put(`/api/blogs/${firstBlog.id}`)
      .send(changedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    
    const blogsAtEnd = await helper.blogsInDb()
        
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)
  
    assert(titles[0] === changedBlog.title)
  })

  test('responds with status code 400 bad request if id is not valid', async () => {
    const notInDatabseId = await helper.blogsInDb()

    await api
      .put(`/api/blogs/${notInDatabseId}`)
      .expect(400)
  })

  test('blog id is not in right format so response is 400', async () => {
    const fakeId = "kfkkfn8840038"
    const newBlog = {
        author: "Maukasta",
        url: "https://broidi.com/category/urheilu/jaakiekko/",
        likes: 2
    }
  
    await api
      .put(`/api/blogs/${fakeId}`)
      .send(newBlog)
      .expect(400)
  })
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    const savedUser = await user.save()
    
  })

  test('user creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('user creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('user creation fails with proper statuscode and message if username is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ro',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('is shorter than the minimum allowed length (3)'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
  
  test('user creation fails with proper statuscode and message if password is undenified', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'test',
      name: 'Superuser'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('password is missing or password is too short'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
  
  test('user creation fails with proper statuscode and message if password is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'test',
      name: 'Superuser',
      password: "LA"
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('password is missing or password is too short'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})



after(async () => {
    await mongoose.connection.close()
})