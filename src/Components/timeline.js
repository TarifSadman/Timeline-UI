import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { Skeleton, Pagination, Select, Input } from 'antd';

const { Option } = Select;
const { Search } = Input;

const Timeline = ({ theme }) => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortOrder, setSortOrder] = useState('ascending');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsResponse, usersResponse] = await Promise.all([
          fetch('https://jsonplaceholder.typicode.com/posts'),
          fetch('https://jsonplaceholder.typicode.com/users')
        ]);
        const postsData = await postsResponse.json();
        const usersData = await usersResponse.json();

        setPosts(sortPosts(postsData, sortOrder));
        setUsers(usersData);
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
                  <div className="d-flex align-items-center mb-3">
                    <div className="me-3">
                      <img
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAArCAYAAADhXXHAAAAAAXNSR0IArs4c6QAAA5hJREFUWEftl2tIU2Ecxp9tlsy5lsw5hzMKooLACirUisoudIEuKkHRhywqRQkvmaWp5cwumnah0qIvEWiUllAgXRTsIhZ0v/hFg5zOuZmlu2ibO3Hew46Wle5s68Z5v2zn3f+8z2/Pec57/kfQHBZL4R8ZAh7WS1eKd9ZLxoJ3lncW4GPgrRT8585K1yyCQpPIutd99gq6y66N6KYiNx7S6CVsXUdiASwPno143tACTltX8KkM+C2cTdah+m3QxqbC9qHjp8K+YVMQcikfEAhITe+NWhhyz7kEShdzghUFBiC0qhhCmT8RtDa8gC4+/8fiQiHUFUcxdupE8ru9owva6BQ4zNbfA0ur+K9egKCCXaxgZ8YJmGoeDgOQbV4NefoWdl4Xr4G14aXLoJyddSopS9IhiZpLDgeM3WhdmwyHycKCiBQBCK0+CaFETOZ6rt2BUXOeE6jbsCK5DOqqEojGSxmYihoYD19kYZSFKZAsj2Quf7sB2phUOCx9fwaWxGHFPAQdTWYAHBTaNu9D/5tmiCPCoCrNZuYpCrrtebA+ec0Z1G1n2TgUpUGyLJwc9r9tQXtcDtRXCzFmgopxvLwGxiODjnMl5rQbfC8mChgH9fUS0J8EuOk9fKdNIt9trXpoY9NA9fVzZWTP8wgsvRrtrLIo7VsgB4X2bbnoe/rObVCPxcBJoirdD3HEDBbMdKsenZmnPQLqUVgflQLqyuPsNkUvPvCplzwABro+ewTYYzFQlWVDHB42DMpc9wT65GN/D+y42GUIzN7B7FJfbDAcLEWQJgkQMr1AZ9ZpmG7Wuw3strM+qkCoK4vZy+/swuR7t0K2cSUBdPSY0UrHwdDtFrDbsENvKltLG7QbdoOy2Qk8vZ35KOUE0HL/KTqSDv85WGnMUihydjIAFIX2LTnoe97EAtF9A90/OIch5yx6q+s4A3N21idYTvoCtkm5ehvG/AvDQJQn9kCyeA4TB5MF2uhU2PVdnIA5w6rOZUEcOZOI0llsXfdtx+WkoWNAx8H5p6yPnkOXcOj3wUrXR0FxIIEV1KcWwXyv8acAsk2rIM+IG4xDXhl6K++6DOyys8Qp+i3B34+ImWsfQ59S+GthoQAhlwvgO30yEwezlbSLdp3RJWCXYYPPZMJv/qxB0XXJsHd+HFGUfq0JKT8CgUhEaq2Nr6DbqSE35miHy7CjXdgbdTysN1yl1+Sd5Z3lY+CtDPDOetHZr3KlgQVwk6ReAAAAAElFTkSuQmCC"
                        alt={post.title}
                        className="rounded-circle"
                        width="40"
                        height="40"
                      />
                    </div>
                    <div>
                      <Card.Title className="mb-0" style={{ color: theme === 'dark' ? 'white' : 'black' }}>{post.title}</Card.Title>
                      <Card.Subtitle className={`py-2`} style={{ color: theme === 'dark' ? 'lightgray' : 'gray' }}>
                        {users.find(user => user.id === post.userId)?.name}
                      </Card.Subtitle>
                    </div>
                  </div>
                  <Card.Text style={{ color: theme === 'dark' ? 'white' : 'black' }}>{post.body}</Card.Text>
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
    </Container>
  );
};

export default Timeline;
