import fetch from 'isomorphic-fetch'

export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT'
export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT'

export const selectSubreddit = (subreddit) => {
  return {
    type: SELECT_SUBREDDIT,
    subreddit
  }
}

export const invalidateSubreddit = (subreddit) => {
  return {
    type: INVALIDATE_SUBREDDIT,
    subreddit
  }
}

export const requestPosts = (subreddit) => {
  return {
    type: REQUEST_POSTS,
    subreddit
  }
}

export const receivePosts = (subreddit, json, dataNow = Date.now()) => {
  return {
    type: RECEIVE_POSTS,
    subreddit,
    posts: json.data.children.map(child => child.data), // fetchで取って来た記事データを配列に格納している
    receivedAt: dataNow
  }
}

// thunk用の実装。非同期処理を行う時は、返り値でactionが返せないため、dispatch関数を引数とする関数を返しておけば、thunkがdispatchを引数にセットしてその関数を実行してくれる
export const fetchPosts = (subreddit) => {
  return (dispatch) => {
    // storeにリクエスト開始という状態を保存する
    dispatch(requestPosts(subreddit))
    // このfetchはthunkが実行してくれる(実行タイミングはactionのdispatch中もしくはactionがreducerに渡されるタイミング)
    return fetch('https://www.reddit.com/r/' + subreddit + '.json') // fetch apiにより、完了後にpromiseがかえされるっぽい。es6のpromiseの仕様 https://developer.mozilla.org/ja/docs/Web/API/Fetch_API
    .then(response => response.json()) // .json()も同様にpromise返す
    .then(json => dispatch(receivePosts(subreddit, json)))
  }
}

const shouldFetchPosts = (state, subreddit) => {
  const posts = state.postsBySubreddit[subreddit]
  if (!posts) {
    return true
  } else if (posts.isFetching) {
    return false
  } else {
    return posts.didInvalidate
  }
}

// thunk用の実装。thunkに渡す関数にはdispatchだけでなく、第２引数としてgetStateを渡すことができる
// 非同期処理だけでなく、stateの値をつかってactionを生成したい場合にも使える
export const fetchPostsIfNeeded = (subreddit) => {
  // thunkで非同期処理を実行させるため、dispatchを引数にしたコールバック関数を返す
  return (dispatch, getState) => {
    // stateであるpostsが空な場合や、記事の無効化が完了した場合にPOSTリクエストで記事を取ってくる
    if (shouldFetchPosts(getState(), subreddit)) {
      return dispatch(fetchPosts(subreddit))
    }
  }
}
