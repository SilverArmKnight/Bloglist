/* eslint-disable indent */
// Loading the lodash library  
const _ = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogArr) => {
  var count = 0
  for (var blog in blogArr) {
    count += blogArr[blog].likes
  }

  return count
}

const favoriteBlog = (blogArr) => {
  if (blogArr.length === 0) {
    return {}
  } else {
    var favorite = {}
    var mostLikes = -1

    for (var blog in blogArr) {
      var currLikes = blogArr[blog].likes

      if (currLikes > mostLikes) {
        mostLikes = currLikes
        favorite = blogArr[blog]
      }
    }

    const favorBlog = {
      title: favorite.title,
      author: favorite.author,
      likes: favorite.likes
    }

    return favorBlog
  }
}

const mostBlogs = (blogArr) => {
  // Lodash's countBy works here.
  const authorBlogDict = _.countBy(blogArr, 'author')

  // Within a dictionary, find a key with the highest value.
  // We use Lodash's maxBy method.
  const mostBlogAuthor = _.maxBy(_.keys(authorBlogDict), 
                                function (o) {
                                  return authorBlogDict[o]
                                })   
  const mostBlog = {
    author: mostBlogAuthor,
    blogs: authorBlogDict[mostBlogAuthor]
  }

  return mostBlog
}

const mostLikes = (blogArr) => {
  // Group the blog list by author in the form of a dictionary.
  const sortByAuthor = _.groupBy(blogArr, 'author')
  // mapValues creates an object with the same keys as input.
  const authorLikeDict = _.mapValues(sortByAuthor, function (o) {
    // sumBy returns the likes of the blogs in each collection.
    return _.sumBy(o, function (i) {
      return i.likes
    })
  })

  // This plays out like 4.6 above.
  // Within a dictionary, find a key with the highest value.
  const mostLikeAuthor = _.maxBy(_.keys(authorLikeDict), 
                                function (o) {
                                  return authorLikeDict[o]
                                })
  const mostLike = {
    author: mostLikeAuthor,
    likes: authorLikeDict[mostLikeAuthor]
  }
  
  return mostLike
}

module.exports = {
  dummy, 
  totalLikes, 
  favoriteBlog,
  mostBlogs,
  mostLikes
}