const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
  
const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

const zeroBlogs = []

const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('dummy returns one', () => {
    const blogs = []
  
    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
  })

  describe('totalLikes', () => {

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('when list has 7 blogs and 36 likes', () => {
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 36)
  })

  test('when list has zero blogs', () => {
    const result = listHelper.totalLikes(zeroBlogs)
    assert.strictEqual(result, 0)
  })
})

describe('favoriteBlog', () => {

    test('when list has only one blog equals to returned object likes', () => {
      const result = listHelper.favoriteBlog(listWithOneBlog)
      assert.strictEqual(result.likes, 5)
    })
    
    test('when list has 7 blogs and 12 likes is the most', () => {
        const result = listHelper.favoriteBlog(blogs)
        assert.strictEqual(result.likes, 12)
      })
    
      test('when list has zero blogs likes equal to returned value', () => {
        const result = listHelper.favoriteBlog(zeroBlogs)
        assert.strictEqual(result, 0)
      })
 
  })

  describe('mostBlogs', () => {
    test('when list has only one blog equals to returned author and blog count', () => {
      const result = listHelper.mostBlogs(listWithOneBlog)
      assert.strictEqual(result.author, 'Edsger W. Dijkstra')
      assert.strictEqual(result.blogs, 1)
    })
    test('when list has 7 blogs and function finds writer with most blogs and amount of blogs', () => {
      const result = listHelper.mostBlogs(blogs)
      assert.strictEqual(result.author, "Robert C. Martin")
      assert.strictEqual(result.blogs, 3)
    })
    test('when list has zero blogs likes equal to returned value', () => {
      const result = listHelper.mostBlogs(zeroBlogs)
      assert.strictEqual(result, 0)
    })
  })

  describe('mostLikes', () => {
    test('when list has only one blog equals to returned author and blog count', () => {
      const result = listHelper.mostLikes(listWithOneBlog)
      assert.strictEqual(result.name, 'Edsger W. Dijkstra')
      assert.strictEqual(result.likes, 5)
    })
    test('when list has 7 blogs and function finds writer with most likes', () => {
      const result = listHelper.mostLikes(blogs)
      assert.strictEqual(result.name, 'Edsger W. Dijkstra')
      assert.strictEqual(result.likes, 17)
    })
    test('when list has zero blogs likes equal to returned value', () => {
      const result = listHelper.mostLikes(zeroBlogs)
      assert.strictEqual(result, 0)
    })
  })

  