const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')


const initialBlogs = [
    {
  title: "Mimmit Koodaa",
  author: "Mimmit",
  url: "https://mimmitkoodaa.fi/blogi/",
  likes: 6
},
{
  title: "Liemessä",
  author: "Liemi",
  url: "https://liemessa.fi/",
  likes: 22
}
]

const initialUsers = [
  {
    username: 'test',
    name: 'test',
    password: 'test1'
  },
  {
    username: 'test2',
    name: 'test2',
    password: 'test2'
  }
  
]

const nonExistingId = async () => {
  const blog = new Blog(
  { title: 'jotain',
    author: 'joku',
    url: "www.example.com",
    likes: 56
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const addUser = async () => {
  const saltRounds = 10
  const passwordHash = await bcrypt.hash('test1', saltRounds)

  const user = new User(
  { username: 'test',
    name: 'testtest',
    password: passwordHash
  })
  await user.save()
}

module.exports = {
    initialBlogs, initialUsers, nonExistingId, blogsInDb, usersInDb, addUser
}