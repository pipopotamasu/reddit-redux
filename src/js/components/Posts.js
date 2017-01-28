import React, { PropTypes, Component } from 'react'

// export default class Posts extends Component {
//   render() {
//     return (
//       <ul>
//         {this.props.posts.map((post, i) =>
//           <li key={i}>{post.title}</li>
//         )}
//       </ul>
//     )
//   }
// }

const Posts = ({ posts }) => {
  return (
    <ul>
      {posts.map((post, i) =>
        <li key={i}>{post.title}</li>
      )}
    </ul>
  )
}

Posts.propTypes = {
  posts: PropTypes.array.isRequired
}

export default Posts
