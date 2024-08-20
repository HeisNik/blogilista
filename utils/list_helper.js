

const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    if (blogs.length === 0) {
        return 0
    }

    const likes = blogs.reduce((startValue, blog) => startValue + blog.likes, 0)
    return likes
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return 0
    }
    const blogLikes = blogs.map(blog => blog.likes) 
    const mostLikes = Math.max(...blogLikes)     
    const most = blogs.find(blog => blog.likes === mostLikes)

    delete most._id
    delete most.url
    delete most.__v

    return most
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }
  blogCounts = []
  const authors = blogs.map(blog => blog.author)
  let counts = {}
  let compare = 0
  let mostFrequent

  for(let i = 0, len = authors.length; i < len; i++){
    let name = authors[i]
    
    if(counts[name] === undefined){
        counts[name] = 1
    }else{
        counts[name] = counts[name] + 1
    }
    if(counts[name] > compare){
          compare = counts[name]
          mostFrequent = authors[i]
          blogCounts.push(compare)
    }
    
 }
 highestBlogCount = Math.max(...blogCounts)
 return {
  author: mostFrequent,
  blogs: highestBlogCount
 }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }  
  const authorsAndLikes = []
  for (let index = 0; index < blogs.length; index++) {
    const blog = blogs[index]
    const doesNameExist = authorsAndLikes.find(author => author.name === blog.author)
    if (doesNameExist) {
      doesNameExist.likes += blog.likes
    } else {
      authorsAndLikes.push({ name: blog.author, likes: blog.likes })
    }
   }
   const summedLikes = authorsAndLikes.map(author => author.likes)
   const mostLikes = Math.max(...summedLikes)
   return authorsAndLikes.find(author => author.likes === mostLikes)
} 

/*tulos = mostLikes(listWithOneBlog)
console.log(tulos)*/
  
  module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
  }