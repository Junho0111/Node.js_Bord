const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

// 미들웨어 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// 게시글 목록 불러오기
function getPosts() {
  try {
    const data = fs.readFileSync('./data/posts.json');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// 게시글 저장하기
function savePosts(posts) {
  fs.writeFileSync('./data/posts.json', JSON.stringify(posts, null, 2));
}

// 게시판 메인
app.get('/', (req, res) => {
  const posts = getPosts();
  res.render('index', { posts });
});

// 글쓰기 페이지
app.get('/write', (req, res) => {
  res.render('write');
});

// 글 작성 처리
app.post('/write', (req, res) => {
  const posts = getPosts();
  const newPost = {
    id: Date.now(),
    title: req.body.title,
    content: req.body.content,
  };
  posts.unshift(newPost); // 최신 글이 위로
  savePosts(posts);
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`게시판 서버 실행 중: http://localhost:${port}`);
});


//글 삭제
app.post('/delete/:id', (req, res) => {
    const posts = getPosts();
    const id = parseInt(req.params.id);
    const updated = posts.filter(post => post.id !== id);
    savePosts(updated);
    res.redirect('/');
});

//글 수정 폼
app.get('/edit/:id', (req, res) => {
    const posts = getPosts();
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).send('Post not found');
    res.render('edit', { post });
});

//글 수정 처리
app.post('/edit/:id', (req, res) => {
    const posts = getPosts();
    const id = parseInt(req.params.id);
    const postIndex = posts.findIndex(p => p.id === id);
    if (postIndex === -1) return res.status(404).send('Post not found');

    posts[postIndex].title=req.body.title;
    posts[postIndex].content = req.body.content;
    savePosts(posts);
    res.redirect('/');
});

app.get('/post/:id', (req, res) => {
    const posts = getPosts();
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).send('Post not found');
    res.render('post', { post });
});




