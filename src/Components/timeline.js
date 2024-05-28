import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Row, Modal, Button } from 'react-bootstrap';
import { Skeleton, Pagination, Select, Input, Empty } from 'antd';
import { LikeOutlined, CommentOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Search } = Input;

const Timeline = ({ theme }) => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortOrder, setSortOrder] = useState('ascending');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postLikes, setPostLikes] = useState({});
  const [postComments, setPostComments] = useState([]);
  const [comLikes, setComLikes] = useState(Math.floor(Math.random() * 100));
  const [comLiked, setComLiked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsResponse, usersResponse, commentsResponse] = await Promise.all([
          fetch('https://jsonplaceholder.typicode.com/posts'),
          fetch('https://jsonplaceholder.typicode.com/users'),
          fetch('https://jsonplaceholder.typicode.com/comments')
        ]);
        const postsData = await postsResponse.json();
        const usersData = await usersResponse.json();
        const commentsData = await commentsResponse.json();

        setPosts(sortPosts(postsData, sortOrder));
        setUsers(usersData);
        setComments(commentsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [sortOrder]);

  const sortPosts = (posts, order) => {
    return posts.sort((a, b) => order === 'ascending' ? a.id - b.id : b.id - a.id);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
  };

  const handleSearch = (value) => {
    setSearchTerm(value.toLowerCase());
  };

  const filteredPosts = posts.filter(post => {
    const user = users.find(user => user.id === post.userId);
    return (
      post.title.toLowerCase().includes(searchTerm) ||
      (user && user.name.toLowerCase().includes(searchTerm))
    );
  });

  const indexOfLastPost = currentPage * pageSize;
  const indexOfFirstPost = indexOfLastPost - pageSize;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

useEffect(() => {
  const initialLikes = {};
  posts.forEach(post => {
    initialLikes[post.id] = { count: Math.floor(Math.random() * 100), liked: false };
  });
  setPostLikes(initialLikes);
}, [posts]);


  const handleLikeClick = (postId) => {
    setPostLikes(prevLikes => {
      const updatedLikes = { ...prevLikes };
      if (updatedLikes[postId].liked) {
        updatedLikes[postId].count -= 1;
      } else {
        updatedLikes[postId].count += 1;
      }
      updatedLikes[postId].liked = !updatedLikes[postId].liked;
      return updatedLikes;
    });
  };
  

  const handleShowModal = (post) => {
    setSelectedPost(post);
    const postRelatedComments = comments.filter(comment => comment.postId === post.id);
    setPostComments(postRelatedComments);
    setShowModal(true);
  };

  const handleCommentLikeClick = () => {
    setComLikes(comLiked ? comLikes - 1 : comLikes + 1);
    setComLiked(!comLiked);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPost(null);
    setPostComments([]);
  };

  const cardStyle = theme === 'dark' ? { backgroundColor: '#333', color: 'white' } : {};

  return (
    <Container className="mt-4" style={{ padding: '0 16px' }}>
      <Row className="mb-3 d-flex justify-content-between align-items-center">
        <Col>
          <h3 style={{ color: theme === 'dark' ? 'white' : 'black' }}>All Posts</h3>
        </Col>
        <Col className="text-end">
          <Search
            placeholder="Search by title or user"
            onSearch={handleSearch}
            style={{ width: 220 }}
            allowClear
          />
          <Select
            style={{ width: 120 }}
            onChange={handleSortChange}
            placeholder="Sort by ID"
          >
            <Option value="ascending">Ascending</Option>
            <Option value="descending">Descending</Option>
          </Select>
        </Col>
      </Row>
      <Row>
        {loading ? (
          Array.from({ length: pageSize }).map((_, index) => (
            <Col xs={12} md={6} lg={6} key={index} className="mb-4">
              <Card className="shadow-sm h-100" style={cardStyle}>
                <Card.Body>
                  <Skeleton avatar active paragraph={{ rows: 4 }} />
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          currentPosts.map(post => (
            <Col xs={12} md={6} lg={6} key={post.id} className="mb-4">
              <Card className="shadow-sm h-100" style={cardStyle}>
                <Card.Body>
                  <div className="d-flex align-items-center mb-2">
                    <img
                      src="https://via.placeholder.com/40"
                      alt={post.title}
                      className="rounded-circle me-2"
                      width="40"
                      height="40"
                    />
                    <span style={{ color: theme === 'dark' ? 'white' : 'black' }}>
                      {users.find(user => user.id === post.userId)?.name}
                    </span>
                  </div>
                  <div className="mb-2">
                    <h5 style={{ color: theme === 'dark' ? 'white' : 'black' }}>{post.title}</h5>
                  </div>
                  <div className="mb-3">
                    <Card.Text style={{ color: theme === 'dark' ? 'white' : 'black' }}>{post.body}</Card.Text>
                  </div>
                  <div className="d-flex justify-content-start align-items-center">
                    <LikeOutlined
                        className="me-2"
                        style={{ cursor: 'pointer', color: postLikes[post.id]?.liked ? 'blue' : 'inherit' }}
                        onClick={() => handleLikeClick(post.id)}
                    />
                    <span onClick={() => handleLikeClick(post.id)}>{postLikes[post.id]?.count}</span>
                    <span className="ms-4 me-2" style={{ cursor: 'pointer' }} onClick={() => handleShowModal(post)}>
                      <CommentOutlined />
                    </span>
                    <span style={{ cursor: 'pointer' }} onClick={() => handleShowModal(post)}>
                      {comments.filter(comment => comment.postId === post.id).length}
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
      <Row>
        <Col xs={12}>
          <div className="d-flex justify-content-center my-4">
            <Pagination
              style={{ textAlign: 'center' }}
              current={currentPage}
              total={filteredPosts.length}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
            />
          </div>
        </Col>
      </Row>
      <Modal 
        show={showModal} 
        onHide={handleCloseModal}
        className='modal-lg'
      >
        <Modal.Header closeButton>
          <Modal.Title className='text-uppercase'>{selectedPost?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedPost?.body}</p>
          <h4>Comments</h4>
          {postComments.length > 0 ? (
            postComments.map(comment => (
              <Card className="mb-3">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col xs="auto">
                      <img
                        src="https://via.placeholder.com/40"
                        alt={comment.name}
                        className="rounded-circle"
                        width="40"
                        height="40"
                      />
                    </Col>
                    <Col>
                      <div>
                        <div className="fw-bold">{comment.name}</div>
                        <div className="text-muted">{comment.email}</div>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col>
                      <p>{comment.body}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <LikeOutlined
                        className="me-2"
                        style={{ cursor: 'pointer', color: comLiked ? 'blue' : 'inherit' }}
                        onClick={handleCommentLikeClick}
                      />
                      <span>{comLikes}</span>
                      <CommentOutlined className="ms-4" style={{ cursor: 'pointer' }} />
                      <span className="ms-2">Reply</span>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))
          ) : (
            <Empty description="No comments found" />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Timeline;
