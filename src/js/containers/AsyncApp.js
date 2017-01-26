import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { selectSubreddit, fetchPostsIfNeeded, invalidateSubreddit } from '../actions/actions'
import Picker from '../components/Picker'
import Posts from '../components/Posts'

class AsyncApp extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
  }

  // 描画が完了した時に呼ばれる
  componentDidMount() {
    const { dispatch, selectedSubreddit } = this.props // selectedSubredditはpreloadedState?
    dispatch(fetchPostsIfNeeded(selectedSubreddit))
   }

   // Propが更新される時に呼ばれる
   componentWillReceiveProps(nextProps) {
     if (nextProps.selectedSubreddit !== this.props.selectedSubreddit) {
       const { dispatch, selectedSubreddit } = nextProps
       dispatch(fetchPostsIfNeeded(selectedSubreddit))
     }
   }

   handleChange(nextSubreddit) {
     this.props.dispatch(selectSubreddit(nextSubreddit))
     this.props.dispatch(fetchPostsIfNeeded(nextSubreddit))
   }

   handleRefreshClick(e) {
     e.preventDefault()

     const { dispatch, selectedSubreddit } = this.props
     dispatch(invalidateSubreddit(selectedSubreddit))
     dispatch(fetchPostsIfNeeded(selectedSubreddit))
   }

   render() {
     const { selectedSubreddit, posts, isFetching, lastUpdated } = this.props
     return (
       <div>
        <Picker value={selectedSubreddit}
                onChange={this.handleChange}
                options={[ 'reactjs', 'frontend' ]} />
        <p>
          {lastUpdated && {/* この書き方何？ → https://facebook.github.io/react/docs/conditional-rendering.html */}
            <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString}.
              {' '}
            </span>
          }
          {!isFetching &&
            <a href='#'
              onClick={this.handleRefreshClick}>
              Refresh
            </a>
          }
        </p>
        {isFetching && posts.length === 0 &&
          <h2>Loading...</h2>
        }
        {!isFetching && posts.length === 0 &&
          <h2>Empty.</h2>
        }
        {posts.length > 0 &&
          <div style={{ opacity: isFetching ? 0.5 : 1 }}
            <Posts posts={posts} />
          </div>
        }
       </div>
     )
   }

}

AsyncApp.propTypes = {
  selectedSubreddit: PropTypes.string.isRequired,
  posts: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  const { selectedSubreddit, postsBySubreddit } = state
  const {
    isFetching,
    lastUpdated,
    items: posts
  } = postsBySubreddit[selectedSubreddit] || { // これ何やってんだ？
    isFetching: true,
    items: []
  }

  return {
    selectedSubreddit,
    posts,
    isFetching,
    lastUpdated
  }
}

export default connect(mapStateToProps)(AsyncApp)
